use tauri::api::path::app_dir;
use tauri::command;

#[command]
pub async fn ensure_whisper_model() -> Result<(), String> {
    let app_dir = app_dir(&tauri::Config::default()).ok_or("cannot locate app dir")?;
    let model_path = app_dir.join("whisper_model.bin");
    if model_path.exists() {
        return Ok(());
    }
    // URL to a pre‑built Whisper model (adjust as needed)
    let url = "https://example.com/whisper_model.bin";
    let resp = reqwest::get(url).await.map_err(|e| e.to_string())?;
    let bytes = resp.bytes().await.map_err(|e| e.to_string())?;
    std::fs::write(&model_path, &bytes).map_err(|e| e.to_string())
}
