import * as React from "react";
import { useStrongStore } from "@/stores/strongs-store";
import { cn } from "@/lib/utils";

interface StrongsEntry {
  number: string;
  lemma: string;
  xlit: string;
  pronounce: string;
  description: string;
}

function StrongsWord({ id }: { id: string }) {
  const fetchDefinition = useStrongStore((s) => s.fetchDefinition);
  const setOpen = useStrongStore((s) => s.setOpen);
  const open = useStrongStore((s) => s.open && s.selectedId === id);

  const handleClick = async () => {
    await fetchDefinition(id);
    setOpen(true);
  };

  return (
    <span
      className="text-[0.65em] font-sans text-sky-400 hover:text-sky-300 hover:underline mx-0.5 align-super cursor-pointer select-auto"
      title={`Strong's ${id}`}
      onClick={handleClick}
    >
      {id}
    </span>
  );
}

export function FormattedVerseText({
  text,
  className,
}: { text: string; className?: string }) {
  if (!text) return null;

  const parts = text.split(/(\[[HG]\d+\]|<[HG]\d+>)/g);

  return (
    <span className={className || ''}>
      {parts.map((part, i) => {
        const match = part.match(/^[\[<]([HG])(\d+)[\]>]$/);
        if (match) {
          const type = match[1].toUpperCase();
          const num = match[2];
          const full = type + num;
          return <StrongsWord key={i} id={full} />;
        }
        return <span key={i} dangerouslySetInnerHTML={{ __html: part }} />;
      })}
    </span>
  );
}
