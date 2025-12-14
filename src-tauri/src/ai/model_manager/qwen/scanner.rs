use super::catalog::get_qwen_models;
use super::types::{QwenAvailableModel, QwenScanResult};
use anyhow::Result;
use std::path::PathBuf;

/// Scans the base path for downloaded Qwen models
pub async fn scan_qwen_models(base_path: &str) -> Result<QwenScanResult> {
    log::info!("Scanning for Qwen models in: {}", base_path);

    let base_path_buf = PathBuf::from(base_path);
    
    // Check if base path exists
    if !base_path_buf.exists() {
        log::warn!("Base path does not exist: {}", base_path);
        return Ok(QwenScanResult {
            base_path: base_path.to_string(),
            available_models: vec![],
        });
    }

    let catalog = get_qwen_models();
    let mut available_models = Vec::new();

    for model_info in catalog {
        let model_dir = base_path_buf.join(&model_info.subfolder);
        
        let (is_downloaded, model_path, tokenizer_path) = if model_dir.exists() {
            // Check for model file (.gguf)
            let model_file_path = model_dir.join(&model_info.model_file);
            let has_model = model_file_path.exists();
            
            // Check for tokenizer file
            let tokenizer_file_path = model_dir.join("tokenizer.json");
            let has_tokenizer = tokenizer_file_path.exists();
            
            let is_complete = has_model && has_tokenizer;
            
            log::debug!(
                "Model {} - Downloaded: {}, Model: {}, Tokenizer: {}",
                model_info.id,
                is_complete,
                has_model,
                has_tokenizer
            );
            
            (
                is_complete,
                if has_model {
                    Some(model_file_path.to_string_lossy().to_string())
                } else {
                    None
                },
                if has_tokenizer {
                    Some(tokenizer_file_path.to_string_lossy().to_string())
                } else {
                    None
                },
            )
        } else {
            log::debug!("Model {} - Directory does not exist", model_info.id);
            (false, None, None)
        };

        available_models.push(QwenAvailableModel {
            id: model_info.id,
            name: model_info.name,
            is_downloaded,
            model_path,
            tokenizer_path,
        });
    }

    log::info!(
        "Scan complete. Found {} models, {} downloaded",
        available_models.len(),
        available_models.iter().filter(|m| m.is_downloaded).count()
    );

    Ok(QwenScanResult {
        base_path: base_path.to_string(),
        available_models,
    })
}
