//! NDI video broadcasting for the Logos application.
//!
//! Provides runtime-loaded NDI SDK integration for sending video frames over the network.
//! Supports multiple concurrent sessions with configurable resolution, frame rate, and alpha mode.
//!
//! # Key types
//! - [`ndi::NdiRuntime`] — manages NDI send sessions
//! - [`ndi::NdiStartRequest`] — session configuration
//! - [`ndi::NdiError`] — error type for NDI operations
//!
//! NDI broadcasting for the Logos application. This crate now starts NDI automatically when the app launches.
//! It provides a settings API and a reload command.

mod settings;
pub mod ndi;

use once_cell::sync::Lazy;
use std::sync::Mutex;

/// Global NDI runtime, created at app start.
static NDI_RUNTIME: Lazy<Mutex<Option<ndi::NdiRuntime>>> = Lazy::new(|| Mutex::new(None));

/// Initialize NDI with default or persisted config. Called from the Tauri entry point.
pub fn initialize_ndi() -> Result<(), String> {
    let mut guard = NDI_RUNTIME.lock().map_err(|e| e.to_string())?;
    if guard.is_some() {
        // Already initialized – treat as reload.
        return reload_ndi();
    }
    let config = settings::load_config()?;
    let mut runtime = ndi::NdiRuntime::default();
    // Start a default session using the config values.
    let _ = runtime.start(
        "default".to_string(),
        ndi::NdiStartRequest {
            source_name: config.source_name,
            resolution: config.resolution,
            frame_rate: config.frame_rate,
            alpha_mode: config.alpha_mode,
        },
    ).map_err(|e| e.to_string())?;
    *guard = Some(runtime);
    Ok(())
}

/// Reload NDI – stops current session and starts a new one with current config.
pub fn reload_ndi() -> Result<(), String> {
    let mut guard = NDI_RUNTIME.lock().map_err(|e| e.to_string())?;
    if let Some(mut runtime) = guard.take() {
        // Stop all sessions.
        runtime.stop_all();
    }
    // Re‑initialize.
    initialize_ndi()
}


