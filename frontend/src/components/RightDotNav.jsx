import React from 'react';
import { FRAME_METADATA } from '../data/framesData';

export default function RightDotNav({ currentFrameIndex }) {
  const scrollToFrame = (index) => {
    const totalScroll = document.body.scrollHeight - window.innerHeight;
    const targetY = (index / (FRAME_METADATA.length - 1)) * totalScroll;
    window.scrollTo({
      top: targetY,
      behavior: 'smooth'
    });
  };

  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-30 flex flex-col items-center gap-3 pointer-events-auto">
      {FRAME_METADATA.map((frame, idx) => {
        const isActive = currentFrameIndex === idx;
        return (
          <button
            key={idx}
            onClick={() => scrollToFrame(idx)}
            title={`Frame ${idx + 1}: ${frame.title}`}
            className="group relative flex items-center justify-center p-1 focus:outline-none"
          >
            {/* Tooltip on hover */}
            <span className="absolute right-7 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-900/90 text-amber-300 border border-white/10 text-[10px] font-mono px-2 py-1 rounded shadow-lg pointer-events-none">
              0{idx + 1} • {frame.title.split(' ')[0]}
            </span>

            {/* Circle dot indicator */}
            <span
              className={`rounded-full transition-all duration-300 ${
                isActive
                  ? 'w-3 h-3 bg-amber-400 ring-4 ring-amber-400/30 shadow-lg shadow-amber-400/50'
                  : 'w-2 h-2 bg-slate-600 group-hover:bg-slate-300'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
