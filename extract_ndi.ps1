$ErrorActionPreference = 'Stop'
$whl = "$env:TEMP\ndi_python-6.3.2.3-cp313-cp313-win_amd64.whl"
$tempDir = "$env:TEMP\ndi_wheel_extract"

Write-Host "Extracting wheel..."
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null
$zipWhl = $whl -replace '\.whl$', '.zip'
Rename-Item -Path $whl -NewName $zipWhl -Force
Expand-Archive -Path $zipWhl -DestinationPath $tempDir -Force

Write-Host "Locating DLL..."
$dll = Get-ChildItem -Path $tempDir -Recurse -Filter "Processing.NDI.Lib.x64.dll" -File | Select-Object -First 1

if ($dll) {
    $dest = "C:\Users\Abiodun\.gemini\antigravity\scratch\logos\src-tauri\sdk\ndi\windows"
    New-Item -ItemType Directory -Force -Path $dest | Out-Null
    Copy-Item -Path $dll.FullName -Destination $dest -Force
    Write-Host "✅ Processing.NDI.Lib.x64.dll copied successfully!"
} else {
    Write-Error "❌ Processing.NDI.Lib.x64.dll not found in the extracted wheel."
}

# Cleanup
Remove-Item -Recurse -Force $tempDir
Remove-Item -Force $whl
