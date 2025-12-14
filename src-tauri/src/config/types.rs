use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppConfig {
    #[serde(default)]
    pub theme: ThemeConfig,
    #[serde(default)]
    pub locale: LocaleConfig,
    #[serde(default)]
    pub ai_providers: AIProvidersConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ThemeConfig {
    pub dark_mode: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LocaleConfig {
    pub language: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AIProvidersConfig {
    pub active_provider: AIProvider,
    pub openai: OpenAIConfig,
    pub anthropic: AnthropicConfig,
    pub local_qwen: LocalQwenConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum AIProvider {
    Openai,
    Anthropic,
    LocalQwen,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OpenAIConfig {
    pub api_key: String,
    pub model: String,
    pub temperature: f32,
    pub max_tokens: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AnthropicConfig {
    pub api_key: String,
    pub model: String,
    pub temperature: f32,
    pub max_tokens: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LocalQwenConfig {
    pub model_path: String,
    pub selected_model_id: String,
    pub context_size: u32,
    pub temperature: f32,
    pub seed: i32,
    pub repeat_penalty: f32,
    pub repeat_last_n: u32,
    pub use_thinking_mode: bool,
    pub use_gpu: bool,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            theme: ThemeConfig::default(),
            locale: LocaleConfig::default(),
            ai_providers: AIProvidersConfig::default(),
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

impl Default for AIProvidersConfig {
    fn default() -> Self {
        Self {
            active_provider: AIProvider::LocalQwen,
            openai: OpenAIConfig::default(),
            anthropic: AnthropicConfig::default(),
            local_qwen: LocalQwenConfig::default(),
        }
    }
}

impl Default for OpenAIConfig {
    fn default() -> Self {
        Self {
            api_key: String::new(),
            model: "gpt-4.1-nano".to_string(),
            temperature: 0.7,
            max_tokens: 2048,
        }
    }
}

impl Default for AnthropicConfig {
    fn default() -> Self {
        Self {
            api_key: String::new(),
            model: "claude-sonnet-4-5".to_string(),
            temperature: 0.7,
            max_tokens: 2048,
        }
    }
}

impl Default for LocalQwenConfig {
    fn default() -> Self {
        Self {
            model_path: String::new(),
            selected_model_id: String::new(),
            context_size: 4096,
            temperature: 0.7,
            seed: -1,
            repeat_penalty: 1.1,
            repeat_last_n: 64,
            use_thinking_mode: false,
            use_gpu: true,
        }
    }
}
