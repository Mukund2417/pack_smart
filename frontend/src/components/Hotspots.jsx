import React, { useState } from 'react';
import { FRAME_METADATA } from '../data/framesData';
import { Info, X, Zap, Shield, CheckCircle2 } from 'lucide-react';

export default function Hotspots({ currentFrameIndex }) {
  const [activeHotspot, setActiveHotspot] = useState(null);
  const currentData = FRAME_METADATA[currentFrameIndex] || FRAME_METADATA[0];

  return (
    <div className="fixed inset-0 z-20 pointer-events-none">
      {/* Render Hotspot Markers for Active Frame */}
      {currentData.hotspots && currentData.hotspots.map((spot, idx) => (
        <div
          key={`${currentFrameIndex}-${idx}`}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto group"
          style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
        >
          {/* Radar Pulsing Dot */}
          <button
            onClick={() => setActiveHotspot(spot)}
            className="relative flex items-center justify-center focus:outline-none"
          >
            <span className="absolute w-8 h-8 rounded-full bg-amber-400/30 animate-ping"></span>
            <span className="w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-slate-950 shadow-lg shadow-amber-400/50 group-hover:scale-125 transition-transform"></span>

            {/* Label Badge (Everest Style) */}
            <div className="absolute top-5 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-md border border-white/15 text-[10px] font-mono tracking-widest text-slate-200 shadow-xl group-hover:border-amber-400/60 group-hover:text-amber-300 transition-all flex flex-col items-center">
              <span className="font-serif text-amber-400 uppercase font-bold text-[11px]">{spot.label}</span>
              <span className="text-[9px] text-slate-300">{spot.value}</span>
            </div>
          </button>
        </div>
      ))}

      {/* Hotspot Detailed Drawer Modal */}
      {activeHotspot && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 pointer-events-auto">
          <div className="bg-slate-900/90 border border-amber-400/40 rounded-2xl p-6 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setActiveHotspot(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">PACKAGING PHYSICS HOTSPOT</span>
                <h3 className="text-lg font-serif font-bold text-white">{activeHotspot.label}</h3>
              </div>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-white/10 mb-4">
              <div className="text-xs font-mono text-slate-400 mb-1">MEASURED METRIC VALUE</div>
              <div className="text-2xl font-mono font-bold text-amber-300">{activeHotspot.value}</div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              {activeHotspot.detail}
            </p>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-white/10 pt-4">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> FSSAI & FDA VERIFIED
              </span>
              <span>FRAME {currentFrameIndex + 1} OF 9</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
