import React from 'react';
import { Play, ChevronDown, ArrowRight } from 'lucide-react';
import { TRANSLATIONS } from '../data/i18n';

export default function HeroOverlay({ currentFrameIndex, onOpenSim, onOpenEngine, onOpenLaminate, lang }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const frameInfo = t.frames[currentFrameIndex] || t.frames[0];

  return (
    <div className="fixed inset-0 z-10 pointer-events-none flex flex-col justify-between px-4 sm:px-8 md:px-16 lg:px-20 pt-20 sm:pt-24 pb-20 sm:pb-28 overflow-hidden overflow-y-auto no-scrollbar">
      {/* Center-Left Hero Typography Container */}
      <div className="w-full max-w-[95vw] md:max-w-2xl lg:max-w-3xl transition-all duration-700 mt-auto mb-auto">
        {/* Top Tagline Line with safe bottom separation */}
        <div className="flex items-center gap-2 mb-3">
          <span className="h-0.5 w-4 sm:w-6 bg-amber-400 shrink-0"></span>
          <span className="text-[10px] sm:text-xs font-mono tracking-[0.1em] sm:tracking-[0.15em] text-amber-300 uppercase font-semibold drop-shadow-md break-words">
            {t.tagline}
          </span>
        </div>

        {/* Main Title with generous vertical line-height for Indian language matras */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-extrabold text-white tracking-tight leading-[1.35] sm:leading-[1.25] pt-1 pb-2 title-glow drop-shadow-2xl break-words hyphens-auto">
          {currentFrameIndex === 0 ? t.title : frameInfo.title}
        </h1>

        {/* Subtitle in elegant italic script */}
        <div className="text-base sm:text-xl md:text-2xl lg:text-3xl font-serif text-amber-300/95 italic tracking-wide mt-1 mb-4 sm:mb-5 drop-shadow-lg break-words leading-[1.4] sm:leading-snug">
          {currentFrameIndex === 0 ? t.subTitle : frameInfo.subtitle}
        </div>

        {/* Description summary */}
        <p className="text-xs sm:text-sm text-slate-200/95 font-sans leading-relaxed mb-6 sm:mb-8 drop-shadow-md bg-slate-950/70 backdrop-blur-md p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10 w-full max-w-lg">
          {currentFrameIndex === 0 ? t.desc : frameInfo.desc}
        </p>

        {/* Primary Call to Action Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 pointer-events-auto">
          <button
            onClick={onOpenEngine}
            className="w-full sm:w-auto px-5 sm:px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-sans font-bold text-[11px] sm:text-xs tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-xl shadow-amber-400/25 hover:scale-105 active:scale-95 transition-all group"
          >
            <div className="w-5 h-5 rounded-full bg-slate-950 text-amber-400 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
              <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
            </div>
            <span>{t.ctaExperience}</span>
          </button>

          <button
            onClick={onOpenLaminate}
            className="w-full sm:w-auto px-5 py-3 rounded-full bg-slate-900/70 backdrop-blur-md hover:bg-slate-800/90 border border-white/20 text-slate-200 font-sans font-semibold text-[11px] sm:text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all hover:border-amber-400/60 shadow-lg"
          >
            <span>{t.ctaInspect}</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Bottom Status Bar - Safely elevated above BottomDock */}
      <div className="flex items-center justify-between pointer-events-none mt-8 sm:mb-1">
        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono text-slate-300 uppercase tracking-widest bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-md">
          <ChevronDown className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
          <span>SCROLL FRAME ({currentFrameIndex + 1} / 9)</span>
        </div>

        <div className="hidden md:flex items-center gap-3 text-[10px] font-mono text-slate-300/90 bg-slate-950/60 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/10 shadow-md">
          <span>LAT: 27.9881° N</span>
          <span>•</span>
          <span>OTR &lt; 0.5</span>
          <span>•</span>
          <span>FSSAI & FDA VERIFIED</span>
        </div>
      </div>
    </div>
  );
}
