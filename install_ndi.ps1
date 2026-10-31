$ErrorActionPreference = 'Stop'
$installer = "$env:TEMP\NDI_Runtime_6.3.2.exe"
Write-Host "Downloading NDI Runtime..."
Invoke-WebRequest -Uri 'https://downloads.ndi.tv/SDK/NDI_SDK/NDI%206%20Runtime.exe' -OutFile $installer

Write-Host "Installing NDI Runtime (Silent)..."
$process = Start-Process -FilePath $installer -ArgumentList '/VERYSILENT', '/SUPPRESSMSGBOXES', '/NORESTART' -Wait -PassThru -NoNewWindow
Write-Host "Installer exit code: $($process.ExitCode)"

Write-Host "Locating DLL..."
$dll = Get-ChildItem -Path 'C:\Program Files\NDI' -Recurse -Filter 'Processing.NDI.Lib.x64.dll' -File | Select-Object -First 1

if ($dll) {
    $dest = 'C:\Users\Abiodun\.gemini\antigravity\scratch\logos\src-tauri\sdk\ndi\windows'
    New-Item -ItemType Directory -Force -Path $dest | Out-Null
    Copy-Item -Path $dll.FullName -Destination $dest -Force
    Write-Host "✅ DLL copied to $dest successfully!"
} else {
    Write-Error "❌ DLL not found in C:\Program Files\NDI"
}
