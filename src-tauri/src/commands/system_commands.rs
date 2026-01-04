use anyhow::Result;
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

/// Attempt to detect GPU information
/// This is a basic implementation - for production, consider platform-specific crates
fn detect_gpu_info() -> Vec<String> {
    // On Linux, we could read from /proc or use vulkan/opencl
    // On Windows, we could use DXGI
    // On macOS, we could use Metal
    // For now, we'll return a placeholder
    
    #[cfg(target_os = "linux")]
    {
        // Try to detect GPU on Linux
        if let Ok(output) = std::process::Command::new("lspci")
            .output()
        {
            if let Ok(stdout) = String::from_utf8(output.stdout) {
                let gpus: Vec<String> = stdout
                    .lines()
                    .filter(|line| {
                        line.to_lowercase().contains("vga") 
                        || line.to_lowercase().contains("3d") 
                        || line.to_lowercase().contains("display")
                    })
                    .map(|line| {
                        // Extract GPU name from lspci output
                        line.split(':')
                            .nth(2)
                            .unwrap_or(line)
                            .trim()
                            .to_string()
                    })
                    .collect();
                
                if !gpus.is_empty() {
                    return gpus;
                }
            }
        }
    }

    #[cfg(target_os = "windows")]
    {
        // On Windows, we could use wmic or DirectX
        if let Ok(output) = std::process::Command::new("wmic")
            .args(&["path", "win32_VideoController", "get", "name"])
            .output()
        {
            if let Ok(stdout) = String::from_utf8(output.stdout) {
                let gpus: Vec<String> = stdout
                    .lines()
                    .skip(1) // Skip header
                    .filter(|line| !line.trim().is_empty())
                    .map(|line| line.trim().to_string())
                    .collect();
                
                if !gpus.is_empty() {
                    return gpus;
                }
            }
        }
    }

    #[cfg(target_os = "macos")]
    {
        // On macOS, we could use system_profiler
        if let Ok(output) = std::process::Command::new("system_profiler")
            .args(&["SPDisplaysDataType"])
            .output()
        {
            if let Ok(stdout) = String::from_utf8(output.stdout) {
                let gpus: Vec<String> = stdout
                    .lines()
                    .filter(|line| line.trim().starts_with("Chipset Model:"))
                    .map(|line| {
                        line.split(':')
                            .nth(1)
                            .unwrap_or("")
                            .trim()
                            .to_string()
                    })
                    .collect();
                
                if !gpus.is_empty() {
                    return gpus;
                }
            }
        }
    }

    // Fallback if detection fails
    vec!["GPU detection not available".to_string()]
}

/// Restart the application
#[tauri::command]
pub async fn restart_app(app: AppHandle) -> Result<(), String> {
    restart_app_impl(app).map_err(|e| e.to_string())
}

fn restart_app_impl(app: AppHandle) -> Result<()> {
    log::info!("Application restart requested");
    
    // app.restart() never returns - it terminates and restarts the process
    app.restart();
}
