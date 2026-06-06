// src/stores/strongs-store.ts
import { create } from 'zustand';

export interface StrongEntry {
  number: string;
  lemma: string;
  xlit: string;
  pronounce: string;
  description: string;
}

interface StrongsState {
  selectedId: string | null;
  definition: StrongEntry | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  fetchDefinition: (id: string) => Promise<void>;
  clear: () => void;
}

// Lazy-loaded local dictionary (loaded once from public/strongs_dictionary.json)
let localDict: Map<string, StrongEntry> | null = null;
let loadPromise: Promise<Map<string, StrongEntry>> | null = null;

async function getLocalDict(): Promise<Map<string, StrongEntry>> {
  if (localDict) return localDict;
  if (loadPromise) return loadPromise;
  loadPromise = fetch('/strongs_dictionary.json')
    .then((r) => r.json())
    .then((arr: StrongEntry[]) => {
      const map = new Map<string, StrongEntry>();
      for (const entry of arr) map.set(entry.number, entry);
      localDict = map;
      return map;
    });
  return loadPromise;
}

async function lookupDefinition(id: string): Promise<StrongEntry | null> {
  // Try Tauri backend first (desktop app)
  if (typeof window !== 'undefined' && '__TAURI__' in window) {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      return await invoke<StrongEntry>('get_strongs_definition', { id });
    } catch {
      // Fall through to local dict
    }
  }

  // Browser / dev mode — use local JSON
  const dict = await getLocalDict();
  return dict.get(id) ?? null;
}

export const useStrongStore = create<StrongsState>((set) => ({
  selectedId: null,
  definition: null,
  open: false,

  setOpen: (open) => set({ open }),

  fetchDefinition: async (id) => {
    try {
      const def = await lookupDefinition(id);
      if (def) {
        set({ selectedId: id, definition: def, open: true });
      } else {
        console.warn(`[strongs] No entry found for ${id}`);
        set({ selectedId: id, definition: null, open: false });
      }
    } catch (e) {
      console.error('[strongs] Failed to fetch definition', e);
      set({ selectedId: null, definition: null, open: false });
    }
  },

  clear: () => set({ selectedId: null, definition: null, open: false }),
}));
