//! Settings module for NDI configuration.

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

/// Configuration for NDI.
#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct NdiConfig {
    pub source_name: String,
    pub resolution: crate::ndi::NdiResolution,
    pub frame_rate: crate::ndi::NdiFrameRate,
    pub alpha_mode: crate::ndi::NdiAlphaMode,
}

impl Default for NdiConfig {
    fn default() -> Self {
        Self {
            source_name: "Logos".to_string(),
            resolution: crate::ndi::NdiResolution::R720p,
            frame_rate: crate::ndi::NdiFrameRate::Fps30,
            alpha_mode: crate::ndi::NdiAlphaMode::NoneOpaque,
        }
    }
}

/// Returns the path to the config file (in the crate directory).
fn config_path() -> PathBuf {
    // Store in the same directory as the Cargo.toml for simplicity.
    let mut path = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    path.push("ndi_config.json");
    path
}

/// Load the NDI configuration from disk, or return defaults.
pub fn load_config() -> Result<NdiConfig, String> {
    let path = config_path();
    if path.exists() {
        let data = fs::read_to_string(&path).map_err(|e| e.to_string())?;
        serde_json::from_str(&data).map_err(|e| e.to_string())
    } else {
        // Write default config for next runs.
        let default = NdiConfig::default();
        save_config(&default)?;
        Ok(default)
    }
}

/// Save the NDI configuration to disk.
pub fn save_config(cfg: &NdiConfig) -> Result<(), String> {
    let path = config_path();
    let data = serde_json::to_string_pretty(cfg).map_err(|e| e.to_string())?;
    fs::write(path, data).map_err(|e| e.to_string())
}
