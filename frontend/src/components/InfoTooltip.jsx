import React, { useState } from 'react';
import { Info } from 'lucide-react';

export default function InfoTooltip({ text }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!text) return null;

  return (
    <div className="relative flex items-center pointer-events-auto">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="ml-1.5 p-0.5 rounded-full bg-amber-400/20 text-amber-300 hover:bg-amber-400 hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1 focus:ring-offset-slate-900"
        title="More Info"
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 rounded-xl bg-slate-900/95 backdrop-blur-xl border border-amber-400/40 text-slate-200 text-xs shadow-2xl z-50 text-center font-sans font-normal pointer-events-none animate-in fade-in zoom-in duration-150 break-words whitespace-normal leading-relaxed">
          {text}
          {/* Downward Caret */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-solid border-t-slate-900/95 border-t-4 border-x-transparent border-x-4 border-b-0"></div>
        </div>
      )}
    </div>
  );
}
