use serde::{Deserialize, Serialize};

/// Information about a Qwen model available for download
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QwenModelInfo {
    pub id: String,
    pub name: String,
    pub model_repo: String,
    pub model_file: String,
    pub tokenizer_repo: String,
    pub subfolder: String,
}

/// Status of a Qwen model (downloaded or not)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QwenAvailableModel {
    pub id: String,
    pub name: String,
    pub is_downloaded: bool,
    pub model_path: Option<String>,
    pub tokenizer_path: Option<String>,
}

/// Result of scanning for Qwen models
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QwenScanResult {
    pub base_path: String,
    pub available_models: Vec<QwenAvailableModel>,
}

/// Download progress information
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DownloadProgress {
    pub file: String, // "model" or "tokenizer"
    pub downloaded: u64,
    pub total: Option<u64>,
    pub percentage: f64,
}
