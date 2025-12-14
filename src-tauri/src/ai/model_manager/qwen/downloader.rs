use super::catalog::get_model_by_id;
use super::types::DownloadProgress;
use anyhow::{Context, Result};
use std::fs::{self, File};
use std::io::Write;
use std::path::PathBuf;
use tauri::{AppHandle, Emitter};

const TOKENIZER_FILE: &str = "tokenizer.json";

/// Downloads a Qwen model and its tokenizer to the specified base path
pub async fn download_qwen_model(
    base_path: &str,
    model_id: &str,
    app_handle: &AppHandle,
) -> Result<()> {
    log::info!("Starting download for model: {}", model_id);

    // Get model info from catalog
    let model_info = get_model_by_id(model_id)
        .context(format!("Model not found in catalog: {}", model_id))?;

    // Create model directory
    let model_dir = PathBuf::from(base_path).join(&model_info.subfolder);
    fs::create_dir_all(&model_dir)
        .context(format!("Failed to create model directory: {:?}", model_dir))?;

    log::info!("Model directory created: {:?}", model_dir);

    // Download model file
    let model_url = format!(
        "https://huggingface.co/{}/resolve/main/{}",
        model_info.model_repo, model_info.model_file
    );
    let model_dest = model_dir.join(&model_info.model_file);

    log::info!("Downloading model from: {}", model_url);
    download_file(&model_url, &model_dest, "model", app_handle).await?;
    log::info!("Model file downloaded successfully");

    // Download tokenizer file
    let tokenizer_url = format!(
        "https://huggingface.co/{}/resolve/main/{}",
        model_info.tokenizer_repo, TOKENIZER_FILE
    );
    let tokenizer_dest = model_dir.join(TOKENIZER_FILE);

    log::info!("Downloading tokenizer from: {}", tokenizer_url);
    download_file(&tokenizer_url, &tokenizer_dest, "tokenizer", app_handle).await?;
    log::info!("Tokenizer file downloaded successfully");

    log::info!("Download complete for model: {}", model_id);
    Ok(())
}

/// Downloads a file from a URL with progress tracking
async fn download_file(
    url: &str,
    dest: &PathBuf,
    file_type: &str,
    app_handle: &AppHandle,
) -> Result<()> {
    // Check if file already exists
    if dest.exists() {
        log::info!("File already exists: {:?}", dest);
        return Ok(());
    }

    log::debug!("Downloading from: {}", url);
    log::debug!("Saving to: {:?}", dest);

    // Create HTTP client
    let client = reqwest::Client::new();
    let mut response = client
        .get(url)
        .send()
        .await
        .context("Failed to send HTTP request")?;

    if !response.status().is_success() {
        anyhow::bail!("Failed to download: HTTP {}", response.status());
    }

    // Get content length if available
    let total_size = response.content_length();
    if let Some(size) = total_size {
        log::info!("File size: {:.2} MB", size as f64 / 1_048_576.0);
    }

    // Create file
    let mut file = File::create(dest).context("Failed to create file")?;
    let mut downloaded: u64 = 0;

    // Download in chunks and emit progress
    loop {
        let chunk = response
            .chunk()
            .await
            .context("Failed to read chunk")?;

        match chunk {
            Some(bytes) => {
                file.write_all(&bytes).context("Failed to write to file")?;
                downloaded += bytes.len() as u64;

                // Calculate progress
                let percentage = if let Some(total) = total_size {
                    (downloaded as f64 / total as f64) * 100.0
                } else {
                    0.0
                };

                // Emit progress event
                let progress = DownloadProgress {
                    file: file_type.to_string(),
                    downloaded,
                    total: total_size,
                    percentage,
                };

                if let Err(e) = app_handle.emit("model-download-progress", &progress) {
                    log::warn!("Failed to emit progress event: {}", e);
                }

                log::debug!(
                    "Progress: {:.2}% ({:.2} MB / {:.2} MB)",
                    percentage,
                    downloaded as f64 / 1_048_576.0,
                    total_size.unwrap_or(0) as f64 / 1_048_576.0
                );
            }
            None => break,
        }
    }

    log::info!("Download complete: {:?}", dest);
    Ok(())
}
