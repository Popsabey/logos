import React from 'react';
import { useStrongStore } from '@/stores/strongs-store';

/**
 * StrongsOverlay — floats over the Program Preview window.
 * Shows lemma, transliteration, pronunciation, and full definition
 * when a Strong's word is clicked. Dismiss by clicking ✕.
 */
export function StrongsOverlay() {
  const definition = useStrongStore((s) => s.definition);
  const open = useStrongStore((s) => s.open);
  const clear = useStrongStore((s) => s.clear);

  if (!open || !definition) return null;

  return (
    <div
      className="absolute top-3 right-3 z-50 w-72 max-h-[85%] overflow-auto rounded-xl border border-white/20 bg-black/80 backdrop-blur-md p-4 shadow-2xl text-white"
      style={{ fontSize: '0.78rem' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-bold text-sky-400 text-base">{definition.number}</span>
          <span className="font-serif text-lg leading-none">{definition.lemma}</span>
        </div>
        <button
          onClick={clear}
          className="text-white/50 hover:text-white transition-colors shrink-0 text-base leading-none"
          title="Close"
        >
          ✕
        </button>
      </div>

      {/* Transliteration / pronunciation */}
      <div className="text-white/60 mb-2">
        <span className="font-medium text-white/80">{definition.xlit}</span>
        {' · '}
        <span className="italic">/{definition.pronounce}/</span>
      </div>

      {/* Definition */}
      <div className="text-white/90 leading-relaxed border-t border-white/10 pt-2">
        {definition.description}
      </div>
    </div>
  );
}
