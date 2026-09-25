import React from 'react';
import { Package, ShieldCheck, Leaf, Users, Award, Target } from 'lucide-react';
import { TRANSLATIONS } from '../data/i18n';

export default function About({ lang }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const a = t.aboutPage || TRANSLATIONS.en.aboutPage || {};

  return (
    <div className="pt-24 pb-16 min-h-screen px-4 sm:px-6 max-w-7xl mx-auto space-y-16">
      {/* Hero Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 bg-brand-green/10 dark:bg-brand-green/20 text-brand-green dark:text-emerald-400 px-4 py-1.5 rounded-full text-xs font-semibold">
          <Leaf className="w-4 h-4" />
          {a.badge || "About PackSmart AI"}
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
          {a.title || "Revolutionizing Food Preservation & Supply Chain Logistics"}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          {a.desc || "PackSmart combines material physics, artificial intelligence, and logistics analytics to reduce food spoilage and optimize packaging selection worldwide."}
        </p>
      </div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all space-y-4">
          <div className="bg-brand-green/10 dark:bg-brand-green/20 w-12 h-12 rounded-2xl flex items-center justify-center">
            <Target className="w-6 h-6 text-brand-green dark:text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{a.missionTitle || "Our Mission"}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {a.missionDesc || "Eliminate crop waste by giving farmers, suppliers, and entrepreneurs data-backed packaging recommendations."}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all space-y-4">
          <div className="bg-brand-orange/10 dark:bg-brand-orange/20 w-12 h-12 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-brand-orange" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{a.physicsTitle || "Physics-Driven AI"}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {a.physicsDesc || "Engineered with thermodynamic respiration equations, oxygen transmission rates (OTR), and moisture kinetics."}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all space-y-4">
          <div className="bg-emerald-500/10 dark:bg-emerald-500/20 w-12 h-12 rounded-2xl flex items-center justify-center">
            <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{a.ecoTitle || "Eco & Recyclable"}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {a.ecoDesc || "Promoting eco-friendly polymer films and sustainable multi-layer laminates to reduce environmental footprint."}
          </p>
        </div>
      </div>
    </div>
  );
}

