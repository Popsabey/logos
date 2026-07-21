use std::env;
use std::path::PathBuf;

fn main() {
    // Ensure NDI SDK DLL is present before building
    let manifest_dir = env::var("CARGO_MANIFEST_DIR").unwrap();
    let sdk_dir = PathBuf::from(&manifest_dir).join("sdk/ndi/windows");
    std::fs::create_dir_all(&sdk_dir).expect("create NDI sdk dir");
    let dll_path = sdk_dir.join("Processing.NDI.Lib.x64.dll");
    if !dll_path.exists() {
        // Replace URL with the exact version you need
        let url = "https://download.ndi.tv/SDK/Processing.NDI.Lib.x64.dll";
        println!("cargo:warning=Downloading NDI DLL from {url}");
        let resp = reqwest::blocking::get(url).expect("NDI download failed");
        let bytes = resp.bytes().expect("read NDI bytes");
        std::fs::write(&dll_path, &bytes).expect("write NDI dll");
    }
    // Re-run if the DLL changes
    println!("cargo:rerun-if-changed={}", dll_path.display());
    tauri_build::build();
}
