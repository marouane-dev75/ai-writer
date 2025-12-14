//! AI Manager - coordinates providers, state, and execution.

use crate::ai::executor::Executor;
use crate::ai::providers::{AIProvider, Anthropic, LocalQwen, OpenAI};
use crate::ai::state::StateManager;
use crate::ai::types::{AIError, ModelStatus};
use crate::config::types::{AIProvider as ConfigProvider, AIProvidersConfig};
use anyhow::Result;
use std::sync::Arc;
use tokio::sync::RwLock;

/// Main AI manager that coordinates all AI operations
pub struct AIManager {
    active_provider: Arc<RwLock<Option<Arc<dyn AIProvider>>>>,
    model_status: Arc<RwLock<ModelStatus>>,
    executor: Arc<Executor>,
}

impl AIManager {
    /// Create a new AI manager
    pub fn new() -> Self {
        log::info!("Initializing AIManager");
        let state_manager = Arc::new(StateManager::new());
        let executor = Arc::new(Executor::new(Arc::clone(&state_manager)));

        Self {
            active_provider: Arc::new(RwLock::new(None)),
            model_status: Arc::new(RwLock::new(ModelStatus::Unloaded)),
            executor,
        }
    }

    /// Initialize the AI manager with configuration
    pub async fn initialize(&self, config: &AIProvidersConfig) -> Result<()> {
        log::info!("Initializing AI manager with config: {:?}", config.active_provider);
        
        // Set loading status
        let provider_name = match config.active_provider {
            ConfigProvider::Openai => "OpenAI",
            ConfigProvider::Anthropic => "Anthropic",
            ConfigProvider::LocalQwen => "LocalQwen",
        };

        {
            let mut status = self.model_status.write().await;
            *status = ModelStatus::Loading {
                provider: provider_name.to_string(),
            };
        }

        // Load the provider
        let result = self.load_provider(config).await;

        match result {
            Ok(_) => {
                log::info!("AI manager initialized successfully");
                Ok(())
            }
            Err(e) => {
                log::error!("Failed to initialize AI manager: {:#}", e);
                let mut status = self.model_status.write().await;
                *status = ModelStatus::Error {
                    provider: provider_name.to_string(),
                    error: e.to_string(),
                };
                Err(e)
            }
        }
    }

    /// Load a provider based on configuration
    async fn load_provider(&self, config: &AIProvidersConfig) -> Result<()> {
        let (provider, provider_name, model_name): (Arc<dyn AIProvider>, String, String) = 
            match config.active_provider {
                ConfigProvider::Openai => {
                    let model = config.openai.model.clone();
                    let api_key = config.openai.api_key.clone();
                    let temperature = config.openai.temperature;
                    let max_tokens = config.openai.max_tokens;
                    
                    let provider = Arc::new(
                        OpenAI::new(api_key, model.clone(), temperature, max_tokens)?
                    );
                    (provider, "OpenAI".to_string(), model)
                }
                ConfigProvider::Anthropic => {
                    let model = config.anthropic.model.clone();
                    let api_key = config.anthropic.api_key.clone();
                    let temperature = config.anthropic.temperature;
                    let max_tokens = config.anthropic.max_tokens;
                    
                    let provider = Arc::new(
                        Anthropic::new(api_key, model.clone(), temperature, max_tokens)?
                    );
                    (provider, "Anthropic".to_string(), model)
                }
                ConfigProvider::LocalQwen => {
                    let local_qwen_config = config.local_qwen.clone();
                    let model_name = local_qwen_config.selected_model_id.clone();
                    
                    let provider = Arc::new(
                        LocalQwen::new(local_qwen_config)?
                    );

                    (provider, "LocalQwen".to_string(), model_name)
                }
            };

        log::info!("Loading provider: {} with model: {}", provider_name, model_name);

        // Set the active provider
        {
            let mut active = self.active_provider.write().await;
            *active = Some(provider);
        }

        // Update status to loaded
        {
            let mut status = self.model_status.write().await;
            *status = ModelStatus::Loaded {
                provider: provider_name,
                model: model_name,
            };
        }

        Ok(())
    }

    /// Get the current model status
    pub async fn get_status(&self) -> ModelStatus {
        let status = self.model_status.read().await;
        status.clone()
    }

    /// Generate a streaming response
    pub async fn generate_stream(
        &self,
        system_prompt: String,
        user_prompt: String,
        app_handle: tauri::AppHandle,
    ) -> Result<u64, AIError> {
        log::info!("Generating stream with prompts");

        // Get active provider
        let provider = {
            let active = self.active_provider.read().await;
            active.clone().ok_or(AIError::NoActiveProvider)?
        };

        // Execute stream
        self.executor
            .execute_stream(provider, system_prompt, user_prompt, app_handle)
            .await
    }

    /// Cancel the current streaming operation
    pub async fn cancel_stream(&self) -> Result<(), AIError> {
        log::info!("Cancelling stream");
        self.executor.cancel_stream().await
    }
}

impl Default for AIManager {
    fn default() -> Self {
        Self::new()
    }
}
