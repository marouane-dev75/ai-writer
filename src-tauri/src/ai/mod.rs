//! AI module - provides AI provider management and streaming capabilities.

pub mod executor;
pub mod manager;
pub mod providers;
pub mod state;
pub mod types;

pub use manager::AIManager;
pub use types::{AIError, ModelStatus};
