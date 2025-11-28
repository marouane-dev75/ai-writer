use serde::{Deserialize, Serialize};
use std::fmt;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ConfigError {
    IoError(String),
    SerializationError(String),
    DeserializationError(String),
    InvalidPath(String),
}

impl fmt::Display for ConfigError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            ConfigError::IoError(msg) => write!(f, "IO Error: {}", msg),
            ConfigError::SerializationError(msg) => write!(f, "Serialization Error: {}", msg),
            ConfigError::DeserializationError(msg) => write!(f, "Deserialization Error: {}", msg),
            ConfigError::InvalidPath(msg) => write!(f, "Invalid Path: {}", msg),
        }
    }
}

impl std::error::Error for ConfigError {}

impl From<std::io::Error> for ConfigError {
    fn from(err: std::io::Error) -> Self {
        ConfigError::IoError(err.to_string())
    }
}

impl From<serde_json::Error> for ConfigError {
    fn from(err: serde_json::Error) -> Self {
        ConfigError::DeserializationError(err.to_string())
    }
}
