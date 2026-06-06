import * as React from "react"
import { cn } from "@/lib/utils"
// We'll dynamically import the opener only when needed
// This avoids crashes if the plugin isn't available in the web dev environment


export function FormattedVerseText({ 
  text, 
  className 
}: { 
  text: string;
  className?: string;
}) {
  if (!text) return null;
  
  // The DB contains [H1234] or <G1234>.
  const parts = text.split(/(\[[HG]\d+\]|<[HG]\d+>)/g);
  
  return (
    <span className={className || ''}>
      {parts.map((part, i) => {
        const match = part.match(/^[\[<]([HG])(\d+)[\]>]$/);
        if (match) {
          const type = match[1].toUpperCase(); // H or G
          const num = match[2];
          const full = type + num;
          const url = type === 'H' 
            ? `https://www.blueletterbible.org/lexicon/${full.toLowerCase()}/kjv/wlc/1/`
            : `https://www.blueletterbible.org/lexicon/${full.toLowerCase()}/kjv/tr/1/`;
            
          return (
            <span 
              key={i} 
              className="text-[0.65em] font-sans text-sky-400 hover:text-sky-300 hover:underline mx-0.5 align-super cursor-pointer select-auto"
              title={`Strong's ${full} (Click for meaning)`}
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                try {
                  const { open } = await import('@tauri-apps/plugin-opener');
                  await open(url);
                } catch (err) {
                  console.error('Failed to open link', err);
                }
              }}
            >
              {full}
            </span>
          );
        }
        
        return <span key={i} dangerouslySetInnerHTML={{ __html: part }} />;
      })}
    </span>
  );
}
