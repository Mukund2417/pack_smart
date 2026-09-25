import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Compass, Play, Sparkles, Sliders, Globe, ChevronDown, Sun, Moon, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { LANGUAGES, TRANSLATIONS } from '../data/i18n';
import { useTheme } from '../context/ThemeContext';

export default function TopNav({ 
  isAutoFlight, 
  setIsAutoFlight,
  lang, 
  setLang 
}) {
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();
  const location = useLocation();
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const audioCtxRef = useRef(null);
  const osc1Ref = useRef(null);
  const osc2Ref = useRef(null);
  const gainRef = useRef(null);

  // Web Audio API Ambient Synthesizer
  const toggleSound = () => {
    if (!isSoundOn) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(220, ctx.currentTime);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(330, ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 2);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();

        osc1Ref.current = osc1;
        osc2Ref.current = osc2;
        gainRef.current = gain;

        setIsSoundOn(true);
      } catch (e) {
        console.error("Audio Context initialization failed:", e);
      }
    } else {
      if (gainRef.current && audioCtxRef.current) {
        gainRef.current.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 1);
        setTimeout(() => {
          if (osc1Ref.current) osc1Ref.current.stop();
          if (osc2Ref.current) osc2Ref.current.stop();
          if (audioCtxRef.current) audioCtxRef.current.close();
          setIsSoundOn(false);
        }, 1000);
      } else {
        setIsSoundOn(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const currentLangObj = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between pointer-events-none"
    >
      {/* Left Creator Branding */}
      <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto bg-slate-900/80 dark:bg-slate-900/60 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-slate-700/50 dark:border-white/10 text-xs text-slate-300 shadow-xl">
        <span className="font-serif font-semibold text-white tracking-wide text-[11px] sm:text-xs">
          {t.title} <span className="hidden xs:inline">· The Ascent</span>
        </span>
        <span className="text-slate-500 hidden sm:inline">by</span>
        <Link to="/" className="flex items-center gap-1.5 sm:gap-2 group">
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 text-slate-950 font-bold text-[10px] flex items-center justify-center">
            FP
          </div>
          <span className="font-medium text-amber-300 underline decoration-amber-400/40 group-hover:text-white transition-colors cursor-pointer text-[11px] sm:text-xs hidden xs:inline">
            Packaging AI
          </span>
        </Link>
      </div>

      {/* Desktop Navigation & Actions */}
      <div className="hidden md:flex items-center gap-2.5 pointer-events-auto">
        {/* Vernacular Multi-Language Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-slate-900/80 dark:bg-slate-900/70 backdrop-blur-md border border-amber-400/40 text-amber-300 font-sans text-xs font-bold flex items-center gap-1.5 hover:bg-slate-800 transition-all shadow-lg"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{currentLangObj.flag} {currentLangObj.name}</span>
            <ChevronDown className="w-3 h-3 text-amber-400" />
          </button>

          <AnimatePresence>
          {isLangOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-44 bg-slate-900/95 backdrop-blur-xl border border-amber-400/40 rounded-2xl shadow-2xl py-2 z-50"
            >
              <div className="px-3 py-1 text-[10px] font-mono text-amber-400/80 uppercase border-b border-white/10 mb-1">
                SELECT LANGUAGE / भाषा
              </div>
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setIsLangOpen(false); }}
                  className={`w-full px-4 py-2 text-xs text-left font-sans flex items-center justify-between hover:bg-slate-800 transition-colors ${
                    lang === l.code ? 'text-amber-300 font-bold bg-amber-400/10' : 'text-slate-200'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{l.flag}</span>
                    <span>{l.name}</span>
                  </span>
                  {lang === l.code && <span className="text-amber-400 font-bold">✓</span>}
                </button>
              ))}
            </motion.div>
          )}
          </AnimatePresence>
        </div>

        {/* Theme Toggle Button (Light/Dark Mode) */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleTheme();
          }}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="p-2 sm:px-3 sm:py-2 rounded-full bg-slate-200 dark:bg-slate-900/60 backdrop-blur-md border border-slate-300 dark:border-white/15 text-slate-800 dark:text-amber-400 hover:bg-slate-300 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5 shadow-lg cursor-pointer"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
          <span className="text-xs font-mono hidden lg:inline text-slate-800 dark:text-slate-200">{isDark ? "Light" : "Dark"}</span>
        </button>

        {/* FREE FLIGHT Mode Pill (Only on Home Page) */}
        {location.pathname === '/' && (
          <button
            onClick={() => setIsAutoFlight(!isAutoFlight)}
            className={`px-3.5 py-2 rounded-full text-xs font-mono tracking-wider flex items-center gap-2 transition-all ${
              isAutoFlight
                ? 'bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-400/30 ring-2 ring-amber-300'
                : 'bg-slate-900/80 dark:bg-slate-900/60 backdrop-blur-md border border-slate-700/50 dark:border-white/15 text-slate-200 hover:border-amber-400/50'
            }`}
          >
            <Compass className={`w-3.5 h-3.5 ${isAutoFlight ? 'animate-spin' : ''}`} />
            <span>{t.freeFlight}</span>
          </button>
        )}

        {/* SOUND Mode Pill */}
        <button
          onClick={toggleSound}
          className={`px-3.5 py-2 rounded-full text-xs font-mono tracking-wider flex items-center gap-2 transition-all ${
            isSoundOn
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/30'
              : 'bg-slate-900/80 dark:bg-slate-900/60 backdrop-blur-md border border-slate-700/50 dark:border-white/15 text-slate-200 hover:border-emerald-400/50'
          }`}
        >
          {isSoundOn ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-slate-950" />
              <span>{t.sound}</span>
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 bg-slate-950 animate-equalizer" style={{ animationDelay: '0s' }}></span>
                <span className="w-0.5 bg-slate-950 animate-equalizer" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-0.5 bg-slate-950 animate-equalizer" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5" />
              <span>{t.sound}</span>
            </>
          )}
        </button>

        {/* EXPERIENCE Action Button */}
        <Link
          to="/recommendation"
          className="px-4 py-2 rounded-full text-xs font-mono font-bold tracking-wider text-white bg-slate-800/90 hover:bg-slate-700 backdrop-blur-md border border-white/20 flex items-center gap-2 transition-all shadow-lg group"
        >
          <Play className="w-3 h-3 text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform" />
          <span>{t.experience}</span>
          <div className="w-4 h-4 rounded-full bg-amber-400/20 flex items-center justify-center">
            <Sparkles className="w-2.5 h-2.5 text-amber-300" />
          </div>
        </Link>

        {/* Admin Panel Button */}
        <Link
          to="/admin"
          title="Admin Panel"
          className="p-2 rounded-full bg-slate-900/80 dark:bg-slate-900/60 backdrop-blur-md border border-slate-700/50 dark:border-white/15 text-amber-400 hover:bg-amber-400 hover:text-slate-950 transition-all"
        >
          <Sliders className="w-4 h-4" />
        </Link>
      </div>

      {/* Mobile Right Controls Toggle */}
      <div className="flex md:hidden items-center gap-2 pointer-events-auto">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleTheme();
          }}
          title="Toggle Theme"
          className="p-2 rounded-full bg-slate-200 dark:bg-slate-900/90 border border-slate-300 dark:border-amber-400/40 text-slate-800 dark:text-amber-400 shadow-md cursor-pointer"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
        </button>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-full bg-slate-900/90 border border-amber-400/40 text-amber-300 shadow-md"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 right-3 left-3 bg-slate-900/95 dark:bg-[#071124]/95 backdrop-blur-2xl border border-amber-400/40 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 pointer-events-auto md:hidden z-50"
          >
            {/* Language Selector */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-mono text-slate-400">LANGUAGE</span>
              <div className="flex gap-2 overflow-x-auto">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); }}
                    className={`px-2.5 py-1 rounded-full text-xs ${
                      lang === l.code ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {l.flag} {l.code.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Sound Toggle */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-mono text-slate-400">AMBIENT SOUND</span>
              <button
                onClick={toggleSound}
                className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                  isSoundOn ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {isSoundOn ? 'Sound ON 🔊' : 'Sound OFF 🔇'}
              </button>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <Link
                to="/recommendation"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-amber-400 text-slate-950 font-bold text-center py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>{t.experience}</span>
              </Link>
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-slate-800 border border-white/15 text-slate-200 font-semibold text-center py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Panel</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
