import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// Detect whether we're running inside Tauri (the env var is set by `tauri dev`)
const isTauri = !!process.env.TAURI_ENV_TARGET_TRIPLE;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    strictPort: true,
  },
  build: {
    outDir: "build",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        broadcast: path.resolve(__dirname, "broadcast-output.html"),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // When NOT running inside Tauri, redirect all @tauri-apps/* imports to local stubs
      // so the Vite browser dev server can resolve them without errors.
      ...(isTauri
        ? {}
        : {
            "@tauri-apps/api/core": path.resolve(__dirname, "./src/lib/tauri-stubs/api-core.ts"),
            "@tauri-apps/api/tauri": path.resolve(__dirname, "./src/lib/tauri-stubs/api-core.ts"),
            "@tauri-apps/plugin-store": path.resolve(__dirname, "./src/lib/tauri-stubs/plugin-store.ts"),
          }),
    },
  },
})

