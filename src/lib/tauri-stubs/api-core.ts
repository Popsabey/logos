/**
 * Stub for @tauri-apps/api/core (and /tauri) — used when running in
 * a plain browser / Vite dev server without the Tauri desktop shell.
 */

function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI__' in window;
}

export async function invoke<T>(command: string, args?: Record<string, unknown>): Promise<T> {
  if (isTauri()) {
    const mod = await import('@tauri-apps/api/core');
    return mod.invoke<T>(command, args);
  }
  console.warn(`[tauri-stub] invoke("${command}") called outside Tauri — returning empty result.`);
  return {} as T;
}

// Stub classes that other plugins expect
export class Resource {
  rid: number;
  constructor(rid: number) { this.rid = rid; }
  async close() {}
}

export class Channel<T = any> {
  id: number = 0;
  onmessage?: (message: T) => void;
  constructor() {}
}

// Re-export anything else from core that callers might need
export const convertFileSrc = (path: string) => path;
