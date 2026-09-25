import React from 'react';
import { Layers, Activity, Award, User, BookOpen, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { TRANSLATIONS } from '../data/i18n';
import InfoTooltip from './InfoTooltip';

export default function BottomDock({ lang }) {
  const location = useLocation();
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const currentPath = location.pathname;

  return (
    <div className="fixed bottom-3 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-40 pointer-events-auto max-w-[95vw] sm:max-w-max">
      {/* Translucent Futuristic Glassmorphic Container */}
      <div className="flex items-center gap-1 sm:gap-1.5 p-1.5 sm:p-2 rounded-2xl bg-slate-900/90 dark:bg-[#091124]/75 backdrop-blur-2xl border border-slate-700/60 dark:border-amber-400/30 shadow-[0_0_35px_rgba(0,0,0,0.7)] hover:border-amber-400/60 transition-all max-w-full overflow-x-auto no-scrollbar ring-1 ring-white/10">
        
        {/* FP. Brand Logo Icon -> Home */}
        <Link 
          to="/"
          title="Home"
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-900/80 border border-white/20 flex items-center justify-center text-white font-serif font-bold text-xs sm:text-sm cursor-pointer hover:bg-slate-800 hover:border-amber-400 transition-all shadow-md shrink-0"
        >
          FP.
        </Link>

        <div className="h-5 sm:h-6 w-px bg-white/15 mx-0.5 sm:mx-1 shrink-0"></div>

        {/* User Account */}
        <Link
          to="/account"
          className={`px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-sans font-semibold transition-all flex items-center gap-1.5 sm:gap-2 ${
            currentPath === '/account'
              ? 'bg-slate-800 dark:bg-slate-900/90 border border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
              : 'text-slate-300 hover:text-amber-300 hover:bg-slate-800/60 dark:hover:bg-slate-900/60 border border-transparent'
          }`}
        >
          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
          <span className="whitespace-nowrap">Account</span>
        </Link>

        {/* Database Tab */}
        <Link
          to="/database"
          className={`px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-sans font-semibold transition-all flex items-center gap-1.5 sm:gap-2 ${
            currentPath === '/database'
              ? 'bg-slate-800 dark:bg-slate-900/90 border border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
              : 'text-slate-300 hover:text-amber-300 hover:bg-slate-800/60 dark:hover:bg-slate-900/60 border border-transparent'
          }`}
        >
          <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
          <span className="whitespace-nowrap">Materials</span>
        </Link>

        {/* Shelf-Life Predictor Tab */}
        <Link
          to="/shelf-life"
          className={`px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-sans font-semibold transition-all flex items-center gap-1.5 sm:gap-2 ${
            currentPath === '/shelf-life'
              ? 'bg-slate-800 dark:bg-slate-900/90 border border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
              : 'text-slate-300 hover:text-amber-300 hover:bg-slate-800/60 dark:hover:bg-slate-900/60 border border-transparent'
          }`}
        >
          <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
          <span className="whitespace-nowrap">Shelf-Life</span>
        </Link>

        {/* Knowledge Base Tab */}
        <Link
          to="/knowledge-base"
          className={`px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-sans font-semibold transition-all flex items-center gap-1.5 sm:gap-2 ${
            currentPath === '/knowledge-base'
              ? 'bg-slate-800 dark:bg-slate-900/90 border border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
              : 'text-slate-300 hover:text-amber-300 hover:bg-slate-800/60 dark:hover:bg-slate-900/60 border border-transparent'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
          <span className="whitespace-nowrap">Learn</span>
        </Link>

        {/* Sustainability Tab */}
        <Link
          to="/sustainability"
          className={`px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-sans font-semibold transition-all flex items-center gap-1.5 sm:gap-2 ${
            currentPath === '/sustainability'
              ? 'bg-slate-800 dark:bg-slate-900/90 border border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
              : 'text-slate-300 hover:text-amber-300 hover:bg-slate-800/60 dark:hover:bg-slate-900/60 border border-transparent'
          }`}
        >
          <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
          <span className="whitespace-nowrap">Eco Cost</span>
        </Link>

        {/* Launch Engine Yellow Glowing Pill */}
        <Link
          to="/recommendation"
          className={`ml-1 sm:ml-2 px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-sans font-bold text-[11px] sm:text-xs tracking-wide flex items-center gap-1.5 sm:gap-2 transition-all shrink-0 ${
            currentPath === '/recommendation'
              ? 'bg-yellow-300 text-slate-950 shadow-[0_0_35px_rgba(250,204,21,0.6)] scale-105'
              : 'bg-amber-400 hover:bg-yellow-300 text-slate-950 shadow-[0_0_25px_rgba(250,204,21,0.4)] active:scale-95 hover:scale-105'
          }`}
        >
          <span className="whitespace-nowrap">{t.launchEngine}</span>
          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950" />
        </Link>
      </div>
    </div>
  );
}
