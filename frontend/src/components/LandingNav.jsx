import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Package, Sun, Moon, Menu, X, Globe, ChevronDown, User, LogOut, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { LANGUAGES, TRANSLATIONS } from '../data/i18n';

export default function LandingNav({ lang, setLang }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isJuryMenuOpen, setIsJuryMenuOpen] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const currentLangObj = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
  const activePath = location.pathname;
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const navT = t.nav || TRANSLATIONS.en.nav || {};

  const navLinks = [
    { path: '/', label: navT.home || 'Home' },
    { path: '/recommendation', label: navT.engine || 'Engine' },
    { path: '/database', label: navT.materials || 'Materials' },
    { path: '/shelf-life', label: navT.shelfLife || 'Shelf-Life' },
    { path: '/launch-checklist', label: navT.checklist || 'Checklist' },
    { path: '/knowledge-base', label: navT.library || 'Library' },
    { path: '/about', label: navT.about || 'About' },
  ];

  const handleLaunchJuryScenario = (scenarioKey) => {
    setIsJuryMenuOpen(false);
    if (!isAuthenticated) {
      localStorage.setItem('packsmart_token', 'jury-evaluator-token');
      localStorage.setItem('packsmart_user', JSON.stringify({
        id: 'user-researcher-1',
        name: 'Dr. Elena Vance (SIH Evaluator)',
        email: 'researcher@packsmart.io',
        role: 'researcher',
        organization_name: 'Smart India Hackathon Jury Panel'
      }));
    }
    const scenarioParams = {
      mango: 'commodityName=Fresh%20Mangoes%20%28Alphonso%29&commodityType=freshProduce&storageType=chilled&storageTemp=12&relativeHumidity=85&desiredShelfLife=14',
      chips: 'commodityName=Crisp%20Potato%20Chips&commodityType=snacks&storageType=ambient&storageTemp=25&relativeHumidity=50&desiredShelfLife=180',
      paneer: 'commodityName=Fresh%20Paneer%20%28Cottage%20Cheese%29&commodityType=dairy&storageType=chilled&storageTemp=4&relativeHumidity=85&desiredShelfLife=30'
    };
    const extra = scenarioParams[scenarioKey] ? `&${scenarioParams[scenarioKey]}` : '';
    navigate(`/recommendation?demo=${scenarioKey}&demo_mode=true${extra}`);
  };

  return (
    <nav className="sticky top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-colors duration-300">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-2.5 group">
        <div className="bg-brand-green/10 dark:bg-brand-green/20 p-2 rounded-xl group-hover:scale-105 transition-transform">
          <Package className="w-5 h-5 text-brand-green dark:text-emerald-400" />
        </div>
        <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          pack-<span className="text-brand-green">smart</span>
        </span>
      </Link>

      {/* Center Nav Links (Desktop) */}
      <div className="hidden md:flex items-center gap-7">
        {navLinks.map((link) => {
          const isActive = activePath === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-semibold transition-all relative py-1 ${
                isActive
                  ? 'text-brand-green dark:text-emerald-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {link.label}
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-green dark:bg-emerald-400 rounded-full"
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Right Actions (Desktop) */}
      <div className="hidden md:flex items-center gap-3">
        {/* ⚡ SIH Jury Demo Quick Launch Dropdown */}
        <div className="relative">
          <button
            type="button"
            id="nav-jury-demo-btn"
            onClick={() => setIsJuryMenuOpen(!isJuryMenuOpen)}
            className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-400/10 border border-amber-500/40 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5 hover:from-amber-500/30 hover:to-amber-400/20 transition-all shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 animate-pulse" />
            <span>⚡ Jury Demo</span>
            <ChevronDown className="w-3 h-3 text-amber-500 dark:text-amber-400" />
          </button>

          <AnimatePresence>
            {isJuryMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-amber-400/40 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden"
              >
                <div className="px-3 py-1.5 text-[10px] font-mono text-amber-600 dark:text-amber-400 uppercase border-b border-slate-100 dark:border-white/10 mb-1 flex items-center justify-between">
                  <span>SIH 1-Click Evaluation Scenarios</span>
                  <span className="bg-amber-400/20 px-1.5 py-0.5 rounded text-[9px] font-bold">Auto-Fill</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleLaunchJuryScenario('mango')}
                  className="w-full text-left px-3.5 py-2 text-xs hover:bg-amber-500/10 dark:hover:bg-amber-400/10 flex items-center gap-2.5 transition-colors group cursor-pointer"
                >
                  <span className="text-base group-hover:scale-110 transition-transform">🥭</span>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">Alphonso Mangoes (MAP)</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Export fresh produce (4d → 18d life)</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleLaunchJuryScenario('chips')}
                  className="w-full text-left px-3.5 py-2 text-xs hover:bg-amber-500/10 dark:hover:bg-amber-400/10 flex items-center gap-2.5 transition-colors group cursor-pointer"
                >
                  <span className="text-base group-hover:scale-110 transition-transform">🥔</span>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">Crisp Potato Chips</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Nitrogen flush & ultra-low WVTR</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleLaunchJuryScenario('paneer')}
                  className="w-full text-left px-3.5 py-2 text-xs hover:bg-amber-500/10 dark:hover:bg-amber-400/10 flex items-center gap-2.5 transition-colors group cursor-pointer"
                >
                  <span className="text-base group-hover:scale-110 transition-transform">🧀</span>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">Fresh Paneer (Dairy)</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">High-barrier EVOH vacuum pack</div>
                  </div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Multi-Language Selector Dropdown */}
        {setLang && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="px-3.5 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm"
            >
              <Globe className="w-3.5 h-3.5 text-brand-green dark:text-amber-400" />
              <span>{currentLangObj.flag} {currentLangObj.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-500 dark:text-amber-400" />
            </button>

            <AnimatePresence>
              {isLangOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-amber-400/40 rounded-2xl shadow-2xl py-2 z-50"
                >
                  <div className="px-3 py-1 text-[10px] font-mono text-slate-400 dark:text-amber-400/80 uppercase border-b border-slate-100 dark:border-white/10 mb-1">
                    SELECT LANGUAGE / भाषा
                  </div>
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => { setLang(l.code); setIsLangOpen(false); }}
                      className={`w-full px-4 py-2 text-xs text-left font-sans flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                        lang === l.code ? 'text-brand-green dark:text-amber-300 font-bold bg-brand-green/10 dark:bg-amber-400/10' : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{l.flag}</span>
                        <span>{l.name}</span>
                      </span>
                      {lang === l.code && <span className="text-brand-green dark:text-amber-400 font-bold">✓</span>}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={() => toggleTheme()}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="px-3.5 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-amber-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Dark</span>
            </>
          )}
        </button>

        {isAuthenticated && currentUser ? (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <Link 
              to="/account" 
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-white/10 hover:border-brand-green dark:hover:border-amber-400 transition-all group shadow-sm"
              title="Manage Profile & Organization"
            >
              <div className="w-6 h-6 rounded-full bg-brand-green/20 dark:bg-amber-400/20 text-brand-green dark:text-amber-400 font-bold text-xs flex items-center justify-center">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[110px] truncate">
                {currentUser.name || 'Account'}
              </span>
            </Link>
            <button
              type="button"
              onClick={logout}
              title="Sign out"
              className="p-2 rounded-full text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 pl-1">
            <Link 
              to="/login" 
              className="text-slate-700 dark:text-slate-200 hover:text-brand-green dark:hover:text-amber-400 font-semibold text-xs sm:text-sm px-3.5 py-2 rounded-full transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              {navT.login || 'Login'}
            </Link>
            <Link 
              to="/signup" 
              className="bg-brand-green text-white px-5 py-2 rounded-full font-medium hover:bg-brand-green/90 transition-all flex items-center gap-1.5 shadow-md shadow-brand-green/20 text-xs sm:text-sm"
            >
              {navT.signup || 'Get Started'} <span>&rarr;</span>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      <div className="flex items-center gap-2 md:hidden">
        {/* Mobile Language Button */}
        {setLang && (
          <button
            type="button"
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-amber-300 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1"
          >
            <span>{currentLangObj.flag}</span>
          </button>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleTheme();
          }}
          title="Toggle Theme"
          className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-amber-400 border border-slate-200 dark:border-slate-700 cursor-pointer"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
        </button>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="absolute top-20 right-4 left-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-3 md:hidden z-50">
          {setLang && (
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-mono text-slate-400">LANGUAGE</span>
              <div className="flex gap-1.5 overflow-x-auto">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => { setLang(l.code); }}
                    className={`px-2 py-1 rounded-full text-xs ${
                      lang === l.code ? 'bg-brand-green text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {l.flag} {l.code.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Link 
            to="/" 
            onClick={() => setMobileOpen(false)}
            className="text-slate-800 dark:text-slate-200 font-medium py-2 border-b border-slate-100 dark:border-slate-800"
          >
            Home
          </Link>
          <Link 
            to="/recommendation" 
            onClick={() => setMobileOpen(false)}
            className="text-slate-800 dark:text-slate-200 font-medium py-2 border-b border-slate-100 dark:border-slate-800"
          >
            Recommendation Engine
          </Link>
          <Link 
            to="/database" 
            onClick={() => setMobileOpen(false)}
            className="text-slate-800 dark:text-slate-200 font-medium py-2 border-b border-slate-100 dark:border-slate-800"
          >
            Materials Database
          </Link>
          <Link 
            to="/shelf-life" 
            onClick={() => setMobileOpen(false)}
            className="text-slate-800 dark:text-slate-200 font-medium py-2 border-b border-slate-100 dark:border-slate-800"
          >
            Shelf-Life Predictor
          </Link>
          <Link 
            to="/launch-checklist" 
            onClick={() => setMobileOpen(false)}
            className="text-slate-800 dark:text-slate-200 font-medium py-2 border-b border-slate-100 dark:border-slate-800"
          >
            Launch Checklist
          </Link>
          <Link 
            to="/about" 
            onClick={() => setMobileOpen(false)}
            className="text-slate-800 dark:text-slate-200 font-medium py-2 border-b border-slate-100 dark:border-slate-800"
          >
            About
          </Link>

          {/* Mobile Auth Actions */}
          {isAuthenticated && currentUser ? (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <Link
                to="/account"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5"
              >
                <div className="w-9 h-9 rounded-full bg-brand-green/20 dark:bg-amber-400/20 text-brand-green dark:text-amber-400 font-bold text-sm flex items-center justify-center">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">{currentUser.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono block">{currentUser.email}</span>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => { logout(); setMobileOpen(false); }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-red-500 border border-red-500/20 hover:bg-red-500/10"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-2.5 rounded-xl font-bold text-xs border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileOpen(false)}
                className="w-full bg-brand-green text-white text-center py-2.5 rounded-xl font-bold text-xs shadow-md shadow-brand-green/20"
              >
                Get Started &rarr;
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
