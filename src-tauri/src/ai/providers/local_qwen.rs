//! Real Local Qwen provider implementation with streaming support.

use super::AIProvider;
use crate::ai::types::StreamEvent;
use crate::config::types::LocalQwenConfig;
use anyhow::{Context, Result};
use async_trait::async_trait;
use candle_core::quantized::gguf_file;
use candle_core::{Device, Tensor};
use candle_transformers::generation::{LogitsProcessor, Sampling};
use candle_transformers::models::quantized_qwen3::ModelWeights as Qwen3;
use std::fs::File;
use std::path::Path;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use tauri::Emitter;
use tokio::sync::mpsc;
use tokenizers::Tokenizer;

const EOS_TOKEN: &str = "<|im_end|>";

/// Helper struct for streaming token output
/// This ensures tokens can be returned in a streaming way rather than waiting for full decoding
struct TokenOutputStream {
    tokenizer: Tokenizer,
    tokens: Vec<u32>,
    prev_index: usize,
    current_index: usize,
}

impl TokenOutputStream {
    fn new(tokenizer: Tokenizer) -> Self {
        Self {
            tokenizer,
            tokens: Vec::new(),
            prev_index: 0,
            current_index: 0,
        }
    }

    fn decode(&self, tokens: &[u32]) -> Result<String> {
        self.tokenizer
            .decode(tokens, true)
            .map_err(|e| anyhow::anyhow!("Cannot decode: {}", e))
    }

    /// Process next token and return any decodable text
    fn next_token(&mut self, token: u32) -> Result<Option<String>> {
        let prev_text = if self.tokens.is_empty() {
            String::new()
        } else {
            let tokens = &self.tokens[self.prev_index..self.current_index];
            self.decode(tokens)?
        };
        
        self.tokens.push(token);
        let text = self.decode(&self.tokens[self.prev_index..])?;
        
        if text.len() > prev_text.len() && text.chars().last().unwrap().is_alphanumeric() {
            let text = text.split_at(prev_text.len());
            self.prev_index = self.current_index;
            self.current_index = self.tokens.len();
            Ok(Some(text.1.to_string()))
        } else {
            Ok(None)
        }
    }

    /// Decode any remaining tokens
    fn decode_rest(&self) -> Result<Option<String>> {
        let prev_text = if self.tokens.is_empty() {
            String::new()
        } else {
            let tokens = &self.tokens[self.prev_index..self.current_index];
            self.decode(tokens)?
        };
        
        let text = self.decode(&self.tokens[self.prev_index..])?;
        if text.len() > prev_text.len() {
            let text = text.split_at(prev_text.len());
            Ok(Some(text.1.to_string()))
        } else {
            Ok(None)
        }
    }

    /// Get reference to the tokenizer
    fn tokenizer(&self) -> &Tokenizer {
        &self.tokenizer
    }
}

pub struct LocalQwen {
    config: LocalQwenConfig,
    model: Arc<Mutex<Option<Qwen3>>>,
    tokenizer: Arc<Mutex<Option<Tokenizer>>>,
    device: Device,
    initialized: Arc<Mutex<bool>>,
}

impl LocalQwen {
    pub fn new(config: LocalQwenConfig) -> Result<Self> {
        if config.model_path.is_empty() {
            anyhow::bail!("Model path cannot be empty");
        }

        if config.selected_model_id.is_empty() {
            anyhow::bail!("Selected model ID cannot be empty");
        }

        log::info!(
            "Initializing LocalQwen provider (lazy loading): base_path={}, model_id={}",
            config.model_path,
            config.selected_model_id
        );

        // Validate paths exist but don't load yet
        let model_dir = Path::new(&config.model_path).join(&config.selected_model_id);
        
        if !model_dir.exists() {
            anyhow::bail!(
                "Model directory not found: {:?}. Expected structure: {}/{}",
                model_dir,
                config.model_path,
                config.selected_model_id
            );
        }

        // Verify .gguf file exists
        let _model_file_exists = std::fs::read_dir(&model_dir)
            .context("Failed to read model directory")?
            .filter_map(|entry| entry.ok())
            .any(|entry| {
                entry.path().extension()
                    .and_then(|ext| ext.to_str())
                    .map(|ext| ext.eq_ignore_ascii_case("gguf"))
                    .unwrap_or(false)
            });

        if !_model_file_exists {
            anyhow::bail!("No .gguf file found in model directory: {:?}", model_dir);
        }

        // Verify tokenizer exists
        let tokenizer_path = model_dir.join("tokenizer.json");
        if !tokenizer_path.exists() {
            anyhow::bail!(
                "Tokenizer not found at {:?}. Please ensure tokenizer.json is in the same directory as the model.",
                tokenizer_path
            );
        }

        // Determine device
        let device = Self::device(config.use_gpu)?;
        log::info!("✓ Using device: {:?}", device);

        log::info!("✓ LocalQwen provider initialized (model will load on first use)");

        Ok(Self {
            config,
            model: Arc::new(Mutex::new(None)),
            tokenizer: Arc::new(Mutex::new(None)),
            device,
            initialized: Arc::new(Mutex::new(false)),
        })
    }

    /// Select device based on configuration
    fn device(use_gpu: bool) -> Result<Device> {
        if !use_gpu {
            log::info!("Using CPU device");
            return Ok(Device::Cpu);
        }

        #[cfg(feature = "cuda")]
        {
            match Device::new_cuda(0) {
                Ok(cuda_device) => {
                    log::info!("Using CUDA device");
                    Ok(cuda_device)
                }
                Err(e) => {
                    log::warn!("CUDA not available ({}), falling back to CPU", e);
                    Ok(Device::Cpu)
                }
            }
        }

        #[cfg(not(feature = "cuda"))]
        {
            log::warn!("CUDA not enabled in build, using CPU. To enable GPU support, build with --features cuda");
            Ok(Device::Cpu)
        }
    }


    /// Strip thinking content from the output
    fn strip_thinking_content(text: &str) -> String {
        let mut result = String::new();
        let mut in_think_block = false;
        let mut chars = text.chars().peekable();
        let mut buffer = String::new();

        while let Some(ch) = chars.next() {
            buffer.push(ch);

            // Check for <think> tag
            if buffer.ends_with("<think>") {
                in_think_block = true;
                // Remove the <think> tag from result
                let len = result.len();
                if len >= 7 {
                    result.truncate(len - 7);
                }
                buffer.clear();
                continue;
            }

            // Check for </think> tag
            if buffer.ends_with("</think>") {
                in_think_block = false;
                buffer.clear();
                continue;
            }

            // If not in think block and buffer doesn't match partial tags, add to result
            if !in_think_block {
                // Check if buffer might be a partial tag
                let is_partial_tag = buffer.starts_with('<') && 
                    ("<think>".starts_with(&buffer) || "</think>".starts_with(&buffer));
                
                if !is_partial_tag {
                    result.push_str(&buffer);
                    buffer.clear();
                }
            } else {
                // In think block, just clear buffer periodically to avoid memory issues
                if buffer.len() > 100 {
                    buffer.clear();
                }
            }
        }

        result.trim().to_string()
    }

    async fn emit_event(app_handle: &tauri::AppHandle, event: StreamEvent) -> Result<()> {
        app_handle
            .emit("ai_stream_event", &event)
            .context("Failed to emit stream event")?;
        Ok(())
    }

    fn get_model_name(&self) -> String {
        Path::new(&self.config.model_path)
            .file_name()
            .and_then(|n| n.to_str())
            .unwrap_or("Qwen-Local")
            .to_string()
    }

    /// Lazy load the model and tokenizer if not already loaded
    async fn ensure_loaded(&self) -> Result<()> {
        // Clone what we need for the blocking task
        let config = self.config.clone();
        let model_arc = Arc::clone(&self.model);
        let tokenizer_arc = Arc::clone(&self.tokenizer);
        let initialized_arc = Arc::clone(&self.initialized);
        let device = self.device.clone();

        tokio::task::spawn_blocking(move || -> Result<()> {
            let mut initialized = initialized_arc.lock()
                .map_err(|e| anyhow::anyhow!("Failed to lock initialized flag: {}", e))?;

            if *initialized {
                log::debug!("Model already loaded, skipping initialization");
                return Ok(());
            }

            log::info!("Loading model and tokenizer (first use)...");

            // Construct paths
            let model_dir = Path::new(&config.model_path).join(&config.selected_model_id);
            
            // Find the .gguf file
            let model_file_path = std::fs::read_dir(&model_dir)
                .context("Failed to read model directory")?
                .filter_map(|entry| entry.ok())
                .find(|entry| {
                    entry.path().extension()
                        .and_then(|ext| ext.to_str())
                        .map(|ext| ext.eq_ignore_ascii_case("gguf"))
                        .unwrap_or(false)
                })
                .map(|entry| entry.path())
                .context(format!("No .gguf file found in model directory: {:?}", model_dir))?;

            log::info!("Loading model from: {:?}", model_file_path);

            // Load model
            let mut file = File::open(&model_file_path)
                .context("Failed to open model file")?;
            
            let model_content = gguf_file::Content::read(&mut file)
                .map_err(|e| anyhow::anyhow!("Failed to read GGUF file: {}", e))?;

            let model = Qwen3::from_gguf(model_content, &mut file, &device)
                .context("Failed to load Qwen3 model from GGUF")?;
            
            log::info!("✓ Model loaded successfully");

            // Load tokenizer
            let tokenizer_path = model_dir.join("tokenizer.json");
            log::info!("Loading tokenizer from: {:?}", tokenizer_path);
            
            let tokenizer = Tokenizer::from_file(&tokenizer_path)
                .map_err(|e| anyhow::anyhow!("Failed to load tokenizer: {}", e))?;
            
            log::info!("✓ Tokenizer loaded");

            // Store loaded model and tokenizer
            {
                let mut model_guard = model_arc.lock()
                    .map_err(|e| anyhow::anyhow!("Failed to lock model: {}", e))?;
                *model_guard = Some(model);
            }

            {
                let mut tokenizer_guard = tokenizer_arc.lock()
                    .map_err(|e| anyhow::anyhow!("Failed to lock tokenizer: {}", e))?;
                *tokenizer_guard = Some(tokenizer);
            }

            *initialized = true;
            log::info!("✓ Model and tokenizer loaded and ready");

            Ok(())
        })
        .await
        .context("Failed to join loading task")?
    }
}

#[async_trait]
impl AIProvider for LocalQwen {
    async fn generate_stream(
        &self,
        system_prompt: String,
        user_prompt: String,
        mut cancel_rx: mpsc::Receiver<()>,
        app_handle: tauri::AppHandle,
        request_id: u64,
    ) -> Result<()> {
        let model_name = self.get_model_name();
        log::info!(
            "Starting LocalQwen stream: request_id={}, model={}",
            request_id,
            model_name
        );

        // Emit start event
        Self::emit_event(
            &app_handle,
            StreamEvent::Started {
                request_id,
                provider: "LocalQwen".to_string(),
                model: model_name.clone(),
            },
        )
        .await
        .context("Failed to emit start event")?;

        // Lazy load model and tokenizer if not already loaded
        self.ensure_loaded().await
            .context("Failed to load model and tokenizer")?;

        // Create cancellation flag shared between async and blocking contexts
        let cancelled = Arc::new(AtomicBool::new(false));
        let cancelled_clone = Arc::clone(&cancelled);

        // Spawn task to monitor cancellation channel
        tokio::spawn(async move {
            if cancel_rx.recv().await.is_some() {
                log::info!("Cancellation requested: request_id={}", request_id);
                cancelled_clone.store(true, Ordering::Relaxed);
            }
        });

        // Clone app_handle for the blocking task
        let app_handle_clone = app_handle.clone();
        
        // Clone configuration for the blocking task
        let temperature = self.config.temperature;
        let seed = self.config.seed;
        let repeat_penalty = self.config.repeat_penalty;
        let repeat_last_n = self.config.repeat_last_n;
        let use_thinking_mode = self.config.use_thinking_mode;
        let context_size = self.config.context_size;

        // Clone Arc references to pre-loaded model and tokenizer
        let model = Arc::clone(&self.model);
        let tokenizer = Arc::clone(&self.tokenizer);
        let device = self.device.clone();

        let generation_result = tokio::task::spawn_blocking(move || -> Result<bool> {
            // Get tokenizer from Option and clone it
            let tokenizer_guard = tokenizer.lock()
                .map_err(|e| anyhow::anyhow!("Failed to lock tokenizer: {}", e))?;
            
            let tokenizer_ref = tokenizer_guard.as_ref()
                .context("Tokenizer not loaded")?;
            
            // Get EOS token from loaded tokenizer
            let eos_token = tokenizer_ref
                .get_vocab(true)
                .get(EOS_TOKEN)
                .copied()
                .unwrap_or(151668);

            // Clone tokenizer for TokenOutputStream
            let tokenizer_for_stream = tokenizer_ref.clone();
            drop(tokenizer_guard); // Release lock

            let mut tos = TokenOutputStream::new(tokenizer_for_stream);

            // Add thinking mode toggle to user prompt
            let thinking_toggle = if use_thinking_mode { " /think" } else { " /no_think" };
            let user_prompt_with_toggle = format!("{}{}", user_prompt, thinking_toggle);

            // Format prompt with Qwen3 chat template
            let prompt_str = format!(
                "<|im_start|>system\n{}<|im_end|>\n<|im_start|>user\n{}<|im_end|>\n<|im_start|>assistant\n",
                system_prompt,
                user_prompt_with_toggle
            );

            log::debug!("Prompt: {}", prompt_str);

            // Tokenize
            let tokens = tos
                .tokenizer()
                .encode(prompt_str, true)
                .map_err(|e| anyhow::anyhow!("Tokenization error: {}", e))?;
            let tokens = tokens.get_ids();
            let prompt_tokens_len = tokens.len();

            log::info!("Prompt tokens: {}", prompt_tokens_len);

            // Setup logits processor
            let sampling = if temperature <= 0.0 {
                Sampling::ArgMax
            } else {
                Sampling::All {
                    temperature: temperature as f64,
                }
            };
            
            let actual_seed = if seed < 0 {
                rand::random::<u64>()
            } else {
                seed as u64
            };
            
            let mut logits_processor = LogitsProcessor::from_sampling(actual_seed, sampling);

            // Lock the model for inference
            let mut model_guard = model
                .lock()
                .map_err(|e| anyhow::anyhow!("Failed to lock model: {}", e))?;

            let model_ref = model_guard.as_mut()
                .context("Model not loaded")?;

            // Generate first token
            let input = Tensor::new(tokens, &device)?.unsqueeze(0)?;
            let logits = model_ref.forward(&input, 0)?;
            let logits = logits.squeeze(0)?;
            let mut next_token = logits_processor.sample(&logits)?;

            let mut all_tokens = vec![next_token];
            let mut accumulated_text = String::new();
            let mut sent_text_len = 0;

            // Process first token
            if let Some(t) = tos.next_token(next_token)? {
                accumulated_text.push_str(&t);
            }

            // Generate remaining tokens
            let max_tokens = (context_size as usize).saturating_sub(prompt_tokens_len);
            log::info!("Generating up to {} tokens", max_tokens);

            for index in 0..max_tokens {
                // Check for cancellation
                if cancelled.load(Ordering::Relaxed) {
                    log::info!("Generation cancelled: request_id={}", request_id);
                    drop(model_guard);
                    return Ok(false); // Return false to indicate cancellation
                }

                let input = Tensor::new(&[next_token], &device)?.unsqueeze(0)?;
                let logits = model_ref.forward(&input, tokens.len() + index)?;
                let logits = logits.squeeze(0)?;

                // Apply repeat penalty
                let logits = if repeat_penalty == 1.0 {
                    logits
                } else {
                    let start_at = all_tokens.len().saturating_sub(repeat_last_n as usize);
                    candle_transformers::utils::apply_repeat_penalty(
                        &logits,
                        repeat_penalty,
                        &all_tokens[start_at..],
                    )?
                };

                next_token = logits_processor.sample(&logits)?;
                all_tokens.push(next_token);

                if let Some(t) = tos.next_token(next_token)? {
                    accumulated_text.push_str(&t);
                    
                    // Strip thinking content from accumulated text
                    let filtered_text = Self::strip_thinking_content(&accumulated_text);
                    
                    // Only emit new content that hasn't been sent yet
                    if filtered_text.len() > sent_text_len {
                        let new_content = &filtered_text[sent_text_len..];
                        if !new_content.is_empty() {
                            
                            // Emit the chunk
                            let _ = app_handle_clone.emit(
                                "ai_stream_event",
                                &StreamEvent::Chunk {
                                    request_id,
                                    content: new_content.to_string(),
                                },
                            );
                            
                            sent_text_len = filtered_text.len();
                        }
                    }
                }

                if next_token == eos_token {
                    log::info!("EOS token reached");
                    break;
                }
            }

            // Decode any remaining tokens
            if let Some(rest) = tos.decode_rest()? {
                accumulated_text.push_str(&rest);
            }

            // Final filtering and emission of any remaining content
            let final_text = Self::strip_thinking_content(&accumulated_text);
            if final_text.len() > sent_text_len {
                let remaining_content = &final_text[sent_text_len..];
                if !remaining_content.is_empty() {
                    let _ = app_handle_clone.emit(
                        "ai_stream_event",
                        &StreamEvent::Chunk {
                            request_id,
                            content: remaining_content.to_string(),
                        },
                    );
                }
            }
            
            // Release the model lock explicitly
            drop(model_guard);
            
            log::info!("Generation complete. Total tokens: {}", all_tokens.len());
            log::debug!("Final output: {}", final_text);

            Ok(true) // Return true to indicate normal completion
        })
        .await
        .context("Task join error")??;

        // Check if generation completed normally (true = completed, false = cancelled)
        if generation_result {
            // Emit completion event
            log::info!("Stream completed: request_id={}", request_id);
            Self::emit_event(
                &app_handle,
                StreamEvent::Completed { request_id },
            )
            .await
            .context("Failed to emit completion event")?;
        } else {
            log::info!("Stream cancelled: request_id={}", request_id);
            Self::emit_event(
                &app_handle,
                StreamEvent::Cancelled { request_id },
            )
            .await
            .context("Failed to emit cancellation event")?;
        }

        Ok(())
    }

    fn provider_name(&self) -> &str {
        "LocalQwen"
    }
}
