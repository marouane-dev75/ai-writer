use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppConfig {
    pub theme: ThemeConfig,
    #[serde(default)]
    pub locale: LocaleConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ThemeConfig {
    pub dark_mode: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LocaleConfig {
    pub language: String,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            theme: ThemeConfig::default(),
            locale: LocaleConfig::default(),
        }
    }
}

impl Default for ThemeConfig {
    fn default() -> Self {
        Self { dark_mode: false }
    }
}

impl Default for LocaleConfig {
    fn default() -> Self {
        Self {
            language: "en".to_string(),
        }
    }
}
