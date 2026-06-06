import { create } from 'zustand';

interface StrongHoverState {
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
}

export const useStrongHoverStore = create<StrongHoverState>((set) => ({
  hoveredId: null,
  setHoveredId: (id) => set({ hoveredId: id }),
}));
