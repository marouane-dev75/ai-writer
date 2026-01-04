use anyhow::{Context, Result};
use serde::{Deserialize, Serialize};
use sysinfo::{Disks, System};
use tauri::AppHandle;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SystemInfo {
    pub cpu_cores: usize,
    pub cpu_name: String,
    pub total_memory_gb: f64,
    pub available_memory_gb: f64,
    pub os_name: String,
    pub os_version: String,
    pub architecture: String,
    pub total_disk_gb: f64,
    pub available_disk_gb: f64,
    pub gpu_info: Vec<String>,
}

/// Get comprehensive system information
#[tauri::command]
pub async fn get_system_info() -> Result<SystemInfo, String> {
    get_system_info_impl().map_err(|e| e.to_string())
}

fn get_system_info_impl() -> Result<SystemInfo> {
    let mut sys = System::new_all();
    sys.refresh_all();

    // CPU information
    let cpu_cores = sys.cpus().len();
    let cpu_name = sys
        .cpus()
        .first()
        .map(|cpu| cpu.brand().to_string())
        .unwrap_or_else(|| "Unknown CPU".to_string());

    // Memory information (convert from bytes to GB)
    let total_memory_gb = sys.total_memory() as f64 / 1_073_741_824.0; // 1024^3
    let available_memory_gb = sys.available_memory() as f64 / 1_073_741_824.0;

    // OS information
    let os_name = System::name().unwrap_or("Unknown OS".to_string());
    let os_version = System::os_version().unwrap_or("Unknown Version".to_string());
    let architecture = System::cpu_arch();

    // Disk information (get primary disk)
    let disks = Disks::new_with_refreshed_list();
    let (total_disk_gb, available_disk_gb) = if let Some(disk) = disks.iter().next() {
        let total = disk.total_space() as f64 / 1_073_741_824.0;
        let available = disk.available_space() as f64 / 1_073_741_824.0;
        (total, available)
    } else {
        (0.0, 0.0)
    };

    // GPU information - basic detection
    // Note: sysinfo doesn't provide GPU info directly, so we'll provide a placeholder
    // For more detailed GPU info, we'd need platform-specific crates
    let gpu_info = detect_gpu_info();

    Ok(SystemInfo {
        cpu_cores,
        cpu_name,
        total_memory_gb,
        available_memory_gb,
        os_name,
        os_version,
        architecture,
        total_disk_gb,
        available_disk_gb,
        gpu_info,
    })
}

/// Helper function to run a command and get its output
fn run_command_with_error_handling(
    command: &str,
    args: &[&str],
) -> Result<String> {
    log::debug!("Running command: {} {:?}", command, args);
    
    let output = std::process::Command::new(command)
        .args(args)
        .output()
        .with_context(|| format!("Failed to execute '{}'", command))?;
    
    if !output.status.success() {
        anyhow::bail!(
            "Command '{}' failed with status: {}",
            command,
            output.status
        );
    }
    
    String::from_utf8(output.stdout)
        .with_context(|| format!("Failed to parse output from '{}'", command))
}

/// Detect GPU on Linux using lspci
#[cfg(target_os = "linux")]
fn detect_gpu_linux() -> Result<Vec<String>> {
    let output = run_command_with_error_handling("lspci", &[])?;
    
    let gpus: Vec<String> = output
        .lines()
        .filter(|line| {
            let lower = line.to_lowercase();
            lower.contains("vga") || lower.contains("3d") || lower.contains("display")
        })
        .filter_map(|line| {
            line.split(':').nth(2).map(|s| s.trim().to_string())
        })
        .collect();
    
    if gpus.is_empty() {
        anyhow::bail!("No GPU devices found in lspci output");
    }
    
    log::debug!("Found {} GPU(s) via lspci: {:?}", gpus.len(), gpus);
    Ok(gpus)
}

/// Detect GPU on Windows using wmic
#[cfg(target_os = "windows")]
fn detect_gpu_windows() -> Result<Vec<String>> {
    let output = run_command_with_error_handling(
        "wmic",
        &["path", "win32_VideoController", "get", "name"],
    )?;
    
    let gpus: Vec<String> = output
        .lines()
        .skip(1) // Skip header
        .filter(|line| !line.trim().is_empty())
        .map(|line| line.trim().to_string())
        .collect();
    
    if gpus.is_empty() {
        anyhow::bail!("No GPU devices found in wmic output");
    }
    
    log::debug!("Found {} GPU(s) via wmic: {:?}", gpus.len(), gpus);
    Ok(gpus)
}

/// Detect GPU on macOS using system_profiler
#[cfg(target_os = "macos")]
fn detect_gpu_macos() -> Result<Vec<String>> {
    let output = run_command_with_error_handling(
        "system_profiler",
        &["SPDisplaysDataType"],
    )?;
    
    let gpus: Vec<String> = output
        .lines()
        .filter(|line| line.trim().starts_with("Chipset Model:"))
        .filter_map(|line| {
            line.split(':').nth(1).map(|s| s.trim().to_string())
        })
        .collect();
    
    if gpus.is_empty() {
        anyhow::bail!("No GPU devices found in system_profiler output");
    }
    
    log::debug!("Found {} GPU(s) via system_profiler: {:?}", gpus.len(), gpus);
    Ok(gpus)
}

/// Get fallback GPU info with helpful hints
fn get_fallback_gpu_info() -> Vec<String> {
    #[cfg(target_os = "linux")]
    let hint = "Install 'pciutils' package for GPU detection (e.g., apt install pciutils)";
    
    #[cfg(target_os = "windows")]
    let hint = "GPU detection requires 'wmic' command (usually available by default)";
    
    #[cfg(target_os = "macos")]
    let hint = "GPU detection requires 'system_profiler' command (usually available by default)";
    
    #[cfg(not(any(target_os = "linux", target_os = "windows", target_os = "macos")))]
    let hint = "GPU detection not supported on this platform";
    
    vec![format!("GPU detection unavailable ({})", hint)]
}

/// Attempt to detect GPU information with proper error handling and logging
/// This is a basic implementation using platform-specific command-line tools
fn detect_gpu_info() -> Vec<String> {
    log::debug!("Starting GPU detection...");
    
    #[cfg(target_os = "linux")]
    {
        match detect_gpu_linux() {
            Ok(gpus) => {
                log::info!("Successfully detected {} GPU(s) on Linux", gpus.len());
                return gpus;
            }
            Err(e) => {
                log::warn!("Linux GPU detection failed: {}", e);
            }
        }
    }
    
    #[cfg(target_os = "windows")]
    {
        match detect_gpu_windows() {
            Ok(gpus) => {
                log::info!("Successfully detected {} GPU(s) on Windows", gpus.len());
                return gpus;
            }
            Err(e) => {
                log::warn!("Windows GPU detection failed: {}", e);
            }
        }
    }
    
    #[cfg(target_os = "macos")]
    {
        match detect_gpu_macos() {
            Ok(gpus) => {
                log::info!("Successfully detected {} GPU(s) on macOS", gpus.len());
                return gpus;
            }
            Err(e) => {
                log::warn!("macOS GPU detection failed: {}", e);
            }
        }
    }
    
    log::warn!("All GPU detection methods failed, using fallback");
    get_fallback_gpu_info()
}

/// Restart the application
#[tauri::command]
pub async fn restart_app(app: AppHandle) -> Result<(), String> {
    restart_app_impl(app).map_err(|e| e.to_string())
}

fn restart_app_impl(app: AppHandle) -> Result<()> {
    log::info!("Application restart requested");
    
    // Spawn a task to restart after a short delay
    // This allows the frontend to receive the response before the app terminates
    tauri::async_runtime::spawn(async move {
        tokio::time::sleep(tokio::time::Duration::from_millis(500)).await;
        log::info!("Restarting application now...");
        app.restart();
    });
    
    Ok(())
}

/// Check if running in development mode
#[tauri::command]
pub async fn is_dev_mode() -> Result<bool, String> {
    Ok(is_dev_mode_impl())
}

fn is_dev_mode_impl() -> bool {
    // In debug builds (dev mode), this will be true
    // In release builds (production), this will be false
    cfg!(debug_assertions)
}

/// Close the application gracefully
#[tauri::command]
pub async fn close_app(app: AppHandle) -> Result<(), String> {
    close_app_impl(app).map_err(|e| e.to_string())
}

fn close_app_impl(app: AppHandle) -> Result<()> {
    log::info!("Application close requested");
    
    // Spawn a task to close after a short delay
    // This allows the frontend to receive the response before the app terminates
    tauri::async_runtime::spawn(async move {
        tokio::time::sleep(tokio::time::Duration::from_millis(300)).await;
        log::info!("Closing application now...");
        app.exit(0);
    });
    
    Ok(())
}
