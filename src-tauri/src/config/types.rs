use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppConfig {
    pub theme: ThemeConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ThemeConfig {
    pub dark_mode: bool,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            theme: ThemeConfig::default(),
        }
    }
}

impl Default for ThemeConfig {
    fn default() -> Self {
        Self { dark_mode: false }
    }
}
