import React from 'react';
import { useStrongStore } from '@/stores/strongs-store';

/**
 * StrongSidePanel — displayed as a sidebar inside the VerseCard
 * when a Strong's word is clicked in the scripture widget.
 */
export function StrongSidePanel() {
  const definition = useStrongStore((s) => s.definition);
  const open = useStrongStore((s) => s.open);
  const clear = useStrongStore((s) => s.clear);

  if (!open || !definition) return null;

  return (
    <div className="w-56 shrink-0 border-l border-white/10 bg-black/40 backdrop-blur-sm overflow-auto flex flex-col p-3 gap-2 text-white flex-shrink-0">
      {/* Header */}
      <div className="flex items-start justify-between gap-1">
        <div className="flex items-baseline gap-1 flex-wrap">
          <span className="font-bold text-sky-400 text-xs">{definition.number}</span>
          <span className="font-serif text-base leading-none">{definition.lemma}</span>
        </div>
        <button
          onClick={clear}
          className="text-white/40 hover:text-white transition-colors shrink-0 text-sm leading-none"
          title="Close"
        >
          ✕
        </button>
      </div>

      {/* Transliteration / pronunciation */}
      <div className="text-[0.65rem] text-white/60 leading-snug">
        <span className="font-medium text-white/80">{definition.xlit}</span>
        {' · '}
        <span className="italic">/{definition.pronounce}/</span>
      </div>

      {/* Definition */}
      <div className="text-[0.65rem] text-white/85 leading-relaxed border-t border-white/10 pt-2 flex-1 overflow-auto">
        {definition.description}
      </div>
    </div>
  );
}
