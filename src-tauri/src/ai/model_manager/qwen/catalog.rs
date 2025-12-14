use super::types::QwenModelInfo;

/// Returns the catalog of available Qwen models
pub fn get_qwen_models() -> Vec<QwenModelInfo> {
    vec![
        QwenModelInfo {
            id: "qwen3-4b-q6".to_string(),
            name: "Qwen3 4B Q6".to_string(),
            model_repo: "unsloth/Qwen3-4B-GGUF".to_string(),
            model_file: "Qwen3-4B-Q6_K.gguf".to_string(),
            tokenizer_repo: "Qwen/Qwen3-0.6B".to_string(),
            subfolder: "qwen3-4b-q6".to_string(),
        },
        // Future models can be added here
    ]
}

/// Get a specific model by ID
pub fn get_model_by_id(id: &str) -> Option<QwenModelInfo> {
    get_qwen_models().into_iter().find(|m| m.id == id)
}
