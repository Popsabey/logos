/**
 * Stub for @tauri-apps/plugin-store — used when running in a plain browser.
 * In a real Tauri app, the actual plugin will be used instead via the vite alias.
 */

export interface Store {
  get<T>(key: string): Promise<T | undefined>;
  set(key: string, value: unknown): Promise<void>;
  save(): Promise<void>;
  delete(key: string): Promise<void>;
}

class MemoryStore implements Store {
  private data: Record<string, unknown> = {};

  async get<T>(key: string): Promise<T | undefined> {
    return this.data[key] as T | undefined;
  }

  async set(key: string, value: unknown): Promise<void> {
    this.data[key] = value;
  }

  async save(): Promise<void> {
    // no-op in browser
  }

  async delete(key: string): Promise<void> {
    delete this.data[key];
  }
}

export async function load(
  _path: string,
  _options?: { autoSave?: boolean; defaults?: Record<string, unknown> }
): Promise<Store> {
  console.warn('[tauri-stub] plugin-store: using in-memory store (Tauri not available).');
  return new MemoryStore();
}
