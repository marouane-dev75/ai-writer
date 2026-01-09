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
    #[serde(default)]
    pub transform_presets: TransformPresetsConfig,
    #[serde(default)]
    pub editor_layout: EditorLayoutConfig,
    #[serde(default)]
    pub ai_generator: AiGeneratorConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TransformPreset {
    pub id: String,
    pub title: String,
    pub description: String,
    pub created_at: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TransformPresetsConfig {
    pub presets: Vec<TransformPreset>,
    #[serde(default)]
    pub selected_preset_id: Option<String>,
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

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EditorLayoutConfig {
    pub show_transformer: bool,
    pub show_generator: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AiGeneratorConfig {
    pub use_system_prompt: bool,
    pub system_prompt_text: String,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            theme: ThemeConfig::default(),
            locale: LocaleConfig::default(),
            ai_providers: AIProvidersConfig::default(),
            transform_presets: TransformPresetsConfig::default(),
            editor_layout: EditorLayoutConfig::default(),
            ai_generator: AiGeneratorConfig::default(),
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

impl Default for TransformPresetsConfig {
    fn default() -> Self {
        Self {
            presets: Vec::new(),
            selected_preset_id: None,
        }
    }
}

impl Default for EditorLayoutConfig {
    fn default() -> Self {
        Self {
            show_transformer: true,
            show_generator: true,
        }
    }
}

impl Default for AiGeneratorConfig {
    fn default() -> Self {
        Self {
            use_system_prompt: false,
            system_prompt_text: String::new(),
        }
    }
}
