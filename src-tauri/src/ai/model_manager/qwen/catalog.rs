use super::types::QwenModelInfo;

/// Returns the catalog of available Qwen models
pub fn get_qwen_models() -> Vec<QwenModelInfo> {
    vec![
        // Qwen3 0.6B models - Smallest, fastest
        QwenModelInfo {
            id: "qwen3-0.6b-q8".to_string(),
            name: "Qwen3 0.6B Q8".to_string(),
            model_repo: "unsloth/Qwen3-0.6B-GGUF".to_string(),
            model_file: "Qwen3-0.6B-Q8_0.gguf".to_string(),
            tokenizer_repo: "Qwen/Qwen3-0.6B".to_string(),
            subfolder: "qwen3-0.6b-q8".to_string(),
        },
        QwenModelInfo {
            id: "qwen3-0.6b-q6".to_string(),
            name: "Qwen3 0.6B Q6".to_string(),
            model_repo: "unsloth/Qwen3-0.6B-GGUF".to_string(),
            model_file: "Qwen3-0.6B-Q6_K.gguf".to_string(),
            tokenizer_repo: "Qwen/Qwen3-0.6B".to_string(),
            subfolder: "qwen3-0.6b-q6".to_string(),
        },
        QwenModelInfo {
            id: "qwen3-0.6b-q4".to_string(),
            name: "Qwen3 0.6B Q4".to_string(),
            model_repo: "unsloth/Qwen3-0.6B-GGUF".to_string(),
            model_file: "Qwen3-0.6B-Q4_K_M.gguf".to_string(),
            tokenizer_repo: "Qwen/Qwen3-0.6B".to_string(),
            subfolder: "qwen3-0.6b-q4".to_string(),
        },
        // Qwen3 1.7B models - Balanced size and performance
        QwenModelInfo {
            id: "qwen3-1.7b-q8".to_string(),
            name: "Qwen3 1.7B Q8".to_string(),
            model_repo: "unsloth/Qwen3-1.7B-GGUF".to_string(),
            model_file: "Qwen3-1.7B-Q8_0.gguf".to_string(),
            tokenizer_repo: "Qwen/Qwen3-1.7B".to_string(),
            subfolder: "qwen3-1.7b-q8".to_string(),
        },
        QwenModelInfo {
            id: "qwen3-1.7b-q6".to_string(),
            name: "Qwen3 1.7B Q6".to_string(),
            model_repo: "unsloth/Qwen3-1.7B-GGUF".to_string(),
            model_file: "Qwen3-1.7B-Q6_K.gguf".to_string(),
            tokenizer_repo: "Qwen/Qwen3-1.7B".to_string(),
            subfolder: "qwen3-1.7b-q6".to_string(),
        },
        QwenModelInfo {
            id: "qwen3-1.7b-q4".to_string(),
            name: "Qwen3 1.7B Q4".to_string(),
            model_repo: "unsloth/Qwen3-1.7B-GGUF".to_string(),
            model_file: "Qwen3-1.7B-Q4_K_M.gguf".to_string(),
            tokenizer_repo: "Qwen/Qwen3-1.7B".to_string(),
            subfolder: "qwen3-1.7b-q4".to_string(),
        },
        // Qwen3 4B models - Good balance
        QwenModelInfo {
            id: "qwen3-4b-q8".to_string(),
            name: "Qwen3 4B Q8".to_string(),
            model_repo: "unsloth/Qwen3-4B-GGUF".to_string(),
            model_file: "Qwen3-4B-Q8_0.gguf".to_string(),
            tokenizer_repo: "Qwen/Qwen3-4B".to_string(),
            subfolder: "qwen3-4b-q8".to_string(),
        },
        QwenModelInfo {
            id: "qwen3-4b-q6".to_string(),
            name: "Qwen3 4B Q6".to_string(),
            model_repo: "unsloth/Qwen3-4B-GGUF".to_string(),
            model_file: "Qwen3-4B-Q6_K.gguf".to_string(),
            tokenizer_repo: "Qwen/Qwen3-4B".to_string(),
            subfolder: "qwen3-4b-q6".to_string(),
        },
        QwenModelInfo {
            id: "qwen3-4b-q4".to_string(),
            name: "Qwen3 4B Q4".to_string(),
            model_repo: "unsloth/Qwen3-4B-GGUF".to_string(),
            model_file: "Qwen3-4B-Q4_K_M.gguf".to_string(),
            tokenizer_repo: "Qwen/Qwen3-4B".to_string(),
            subfolder: "qwen3-4b-q4".to_string(),
        },
        // Qwen3 8B models - Higher quality
        QwenModelInfo {
            id: "qwen3-8b-q8".to_string(),
            name: "Qwen3 8B Q8".to_string(),
            model_repo: "unsloth/Qwen3-8B-GGUF".to_string(),
            model_file: "Qwen3-8B-Q8_0.gguf".to_string(),
            tokenizer_repo: "Qwen/Qwen3-8B".to_string(),
            subfolder: "qwen3-8b-q8".to_string(),
        },
        QwenModelInfo {
            id: "qwen3-8b-q6".to_string(),
            name: "Qwen3 8B Q6".to_string(),
            model_repo: "unsloth/Qwen3-8B-GGUF".to_string(),
            model_file: "Qwen3-8B-Q6_K.gguf".to_string(),
            tokenizer_repo: "Qwen/Qwen3-8B".to_string(),
            subfolder: "qwen3-8b-q6".to_string(),
        },
        QwenModelInfo {
            id: "qwen3-8b-q4".to_string(),
            name: "Qwen3 8B Q4".to_string(),
            model_repo: "unsloth/Qwen3-8B-GGUF".to_string(),
            model_file: "Qwen3-8B-Q4_K_M.gguf".to_string(),
            tokenizer_repo: "Qwen/Qwen3-8B".to_string(),
            subfolder: "qwen3-8b-q4".to_string(),
        },
    ]
}

/// Get a specific model by ID
pub fn get_model_by_id(id: &str) -> Option<QwenModelInfo> {
    get_qwen_models().into_iter().find(|m| m.id == id)
}
