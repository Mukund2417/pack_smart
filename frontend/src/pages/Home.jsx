import React, { useState } from 'react';
import LandingNav from '../components/LandingNav';
import { 
  Leaf, 
  Zap, 
  ShieldCheck, 
  Box, 
  Truck, 
  TrendingUp, 
  Play, 
  X, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  ShieldAlert, 
  FileCheck, 
  Apple, 
  Wheat 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { TRANSLATIONS } from '../data/i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Home({ lang, setLang }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  const launchDemoScenario = (scenarioKey) => {
    setDemoModalOpen(false);
    const scenarioParams = {
      mango: 'commodityName=Fresh%20Mangoes%20%28Alphonso%29&commodityType=freshProduce&storageType=chilled&storageTemp=12&relativeHumidity=85&desiredShelfLife=14',
      chips: 'commodityName=Crisp%20Potato%20Chips&commodityType=snacks&storageType=ambient&storageTemp=25&relativeHumidity=50&desiredShelfLife=180',
      paneer: 'commodityName=Fresh%20Paneer%20%28Cottage%20Cheese%29&commodityType=dairy&storageType=chilled&storageTemp=4&relativeHumidity=85&desiredShelfLife=30',
      bread: 'commodityName=Sliced%20Wheat%20Bread&commodityType=bakery&storageType=ambient&storageTemp=22&relativeHumidity=65&desiredShelfLife=7',
      pickle: 'commodityName=Mango%20Pickle%20%28Aam%20Ka%20Achar%29&commodityType=dryGoods&storageType=ambient&storageTemp=28&relativeHumidity=55&desiredShelfLife=365'
    };
    const extraParams = scenarioParams[scenarioKey] ? `&${scenarioParams[scenarioKey]}` : '';
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/recommendation', search: `?demo=${scenarioKey}&demo_mode=true${extraParams}` } } });
    } else {
      navigate(`/recommendation?demo=${scenarioKey}&demo_mode=true${extraParams}`);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-x-hidden font-sans pt-6 pb-12 transition-colors duration-300">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16 sm:mb-24 pt-6">
        {/* Text Content */}
        <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-brand-green/10 dark:bg-brand-green/20 text-brand-green dark:text-emerald-400 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-6">
            <Leaf className="w-4 h-4" />
            {t.homeTag || "Smarter Packing. Smoother Logistics."}
          </div>
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6 text-slate-900 dark:text-white">
            <span className="text-brand-green">{t.homeTitle1 || "PackSmart"}</span><br />
            {t.homeTitle2 || "AI Food Packaging Recommendation System"}
          </h1>
          
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-8 sm:mb-10 leading-relaxed">
            {t.homeDesc || "Intelligently recommends food packaging materials, barrier specifications, and MAP gas formulations based on commodity chemistry, moisture, pH, respiration rate, and desired shelf life — for farmers, MSMEs, and food exporters."}
          </p>
          
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10 sm:mb-14">
            <Link 
              to={isAuthenticated ? "/recommendation?source=homepage_cta" : "/signup"} 
              className="bg-brand-green text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-bold hover:bg-brand-green/90 transition-all flex items-center gap-2 shadow-lg shadow-brand-green/30 hover:-translate-y-0.5 text-sm sm:text-base"
            >
              {isAuthenticated ? (t.homeGoEngine || "Open Engine") : (t.homeStartTrial || "Start Free Trial")} <span>&rarr;</span>
            </Link>
            <button 
              type="button" 
              onClick={() => setDemoModalOpen(true)}
              className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center gap-2 border border-slate-200 dark:border-slate-700 shadow-sm hover:-translate-y-0.5 text-sm sm:text-base cursor-pointer"
            >
              <Play className="w-4 h-4 text-brand-green fill-brand-green" />
              {t.homeWatchDemo || "Watch Demo"}
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-sm font-medium border-t border-slate-200 dark:border-slate-800 pt-6 sm:pt-8 text-left">
            <div className="flex items-start gap-3">
              <Leaf className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
              <div>
                <span className="block text-slate-900 dark:text-white font-bold">{t.homeWasteTitle || "Reduce Food Waste"}</span>
                <span className="text-slate-500 dark:text-slate-400 font-normal text-xs sm:text-sm">{t.homeWasteSub || "Right packaging, longer shelf life"}</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
              <div>
                <span className="block text-slate-900 dark:text-white font-bold">{t.homeSpeedTitle || "Instant AI Recommendations"}</span>
                <span className="text-slate-500 dark:text-slate-400 font-normal text-xs sm:text-sm">{t.homeSpeedSub || "OTR, WVTR, MAP specs in seconds"}</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
              <div>
                <span className="block text-slate-900 dark:text-white font-bold">{t.homeTrackTitle || "FSSAI Compliant Guidance"}</span>
                <span className="text-slate-500 dark:text-slate-400 font-normal text-xs sm:text-sm">{t.homeTrackSub || "ASTM / IS 9845 standards"}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Image Content */}
        <div className="relative w-full h-[320px] sm:h-[450px] lg:h-[550px] flex justify-center items-center">
          <div className="absolute inset-0 bg-brand-green/10 dark:bg-brand-green/5 rounded-full blur-3xl scale-90 -z-10"></div>
          <img 
            src="/hero_robot_isometric.jpg" 
            alt="Robotic arm packing box on conveyor belt" 
            className="w-full max-w-sm sm:max-w-lg object-contain drop-shadow-2xl rounded-3xl dark:opacity-90"
            style={{ mixBlendMode: 'multiply' }}
          />
        </div>
      </section>

      {/* New Modules Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-400/10 text-amber-500 border border-amber-400/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> New Modules for Food Entrepreneurs
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            From Lab Formulation to Supermarket Shelf
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm sm:text-base">
            Professional tools to select packaging formats, understand food additives safely, and audit legal readiness before your commercial retail launch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Packaging Library */}
          <Link
            to="/knowledge-base?tab=library"
            className="group bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all shadow-sm hover:shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Layers className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                8 Vector Formats
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 mb-3">
                Graphical Packaging Library
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Vector schematics for Stand-up Doypacks, 121°C Retort Pouches, Flow Wrap, Vacuum Skin, and Micro-perforated bags with pros, cons, and barrier compatibility.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>Explore Packaging Schematics</span> &rarr;
            </div>
          </Link>

          {/* Card 2: Preservatives & Additives Guide */}
          <Link
            to="/knowledge-base?tab=preservatives"
            className="group bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 transition-all shadow-sm hover:shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-400/10 text-amber-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Statutory Reference
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 mb-3">
                Preservatives & Additives Guide
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Educational classifications of antimicrobials, antioxidants, and humectants with direct live links to FSSAI, Codex GSFA, and US FDA gazetted portals.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-bold text-amber-500 group-hover:translate-x-1 transition-transform">
              <span>View Regulatory Guide</span> &rarr;
            </div>
          </Link>

          {/* Card 3: Legal & Launch Checklist */}
          <Link
            to="/launch-checklist"
            className="group bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-teal-400 transition-all shadow-sm hover:shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileCheck className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Pre-Launch Audit
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 mb-3">
                Legal Launch Checklist
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Interactive audit checklist covering FSSAI registration, 14-digit license placement, veg/non-veg logos, nutrition facts panels, and food-contact migration test reports.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-bold text-teal-500 group-hover:translate-x-1 transition-transform">
              <span>Start Pre-Launch Audit</span> &rarr;
            </div>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-slate-100 dark:bg-slate-900/60 py-16 sm:py-24 border-t border-slate-200 dark:border-slate-800/80 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            
            {/* Header Column */}
            <div className="lg:col-span-1 pt-4 text-center lg:text-left">
              <h3 className="text-brand-orange font-bold text-xs uppercase tracking-widest mb-4">{t.homeFeaturesTag || "Key Features"}</h3>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {t.homeFeaturesTitle || "Everything you need to pack and ship smarter."}
              </h2>
            </div>
            
            {/* Cards Grid */}
            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              
              {/* Card 1 */}
              <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-700/60 hover:shadow-md transition-all">
                <div className="bg-brand-green/10 dark:bg-brand-green/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                  <Box className="w-6 h-6 text-brand-green dark:text-emerald-400" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">{t.homeF1Title || "Smart Packing Rules"}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t.homeF1Desc || "Automate box selection, reduce void space."}
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-700/60 hover:shadow-md transition-all">
                <div className="bg-brand-orange/10 dark:bg-brand-orange/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                  <Truck className="w-6 h-6 text-brand-orange" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">{t.homeF2Title || "Real-Time Shipment Tracking"}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t.homeF2Desc || "Know where every order is, all the time."}
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-700/60 hover:shadow-md transition-all">
                <div className="bg-brand-green/10 dark:bg-brand-green/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                  <Leaf className="w-6 h-6 text-brand-green dark:text-emerald-400" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">{t.homeF3Title || "Inventory & Stock Alerts"}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t.homeF3Desc || "Never run out, never overstock."}
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-700/60 hover:shadow-md transition-all">
                <div className="bg-slate-100 dark:bg-slate-700/50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">{t.homeF4Title || "Powerful Analytics"}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t.homeF4Desc || "Make data-driven decisions and scale faster."}
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Guided Sample Flow Modal ("Watch Demo") */}
      <AnimatePresence>
        {demoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setDemoModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-500 text-xs font-bold px-3 py-1 rounded-full mb-3">
                  <Sparkles className="w-3.5 h-3.5" /> Interactive Guided Demo
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  Experience the Packaging Engine
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Choose a real-world entrepreneur case study to test barrier calculation, gas equilibrium, and mold prevention logic:
                </p>
              </div>

              {/* Presets */}
              <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                {/* Preset 1: Mango Export */}
                <div 
                  onClick={() => launchDemoScenario('mango')}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50/60 dark:bg-slate-850/50 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 transition-all cursor-pointer group flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Apple className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                        Fresh Alphonso Mangoes — 14-Day Export
                      </h4>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Run &rarr;
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      High respiration produce. Demonstrates how Equilibrium MAP with Micro-Perforated BOPP prevents anaerobic fermentation and moisture rot.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2.5 text-[10px] font-mono text-slate-500">
                      <span className="bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">Moisture: 85%</span>
                      <span className="bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">Respiration: High</span>
                      <span className="bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">Storage: 12°C Chilled</span>
                    </div>
                  </div>
                </div>

                {/* Preset 2: Bakery Bread Mold Prevention */}
                <div 
                  onClick={() => launchDemoScenario('bread')}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-400 bg-slate-50/60 dark:bg-slate-850/50 hover:bg-amber-50/20 dark:hover:bg-amber-950/20 transition-all cursor-pointer group flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Wheat className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                        Artisan Sourdough Bread — Mold & Moisture Control
                      </h4>
                      <span className="text-xs font-bold text-amber-500 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Run &rarr;
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      Bakery intelligence. Shows why breathable micro-perforated bags stop internal condensation from pooling and causing rapid mold growth.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2.5 text-[10px] font-mono text-slate-500">
                      <span className="bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">Moisture: High</span>
                      <span className="bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">Format: Micro-perf Bag</span>
                      <span className="bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">Storage: 22°C Ambient</span>
                    </div>
                  </div>
                </div>

                {/* Preset 3: Paneer */}
                <div 
                  onClick={() => launchDemoScenario('paneer')}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-400 bg-slate-50/60 dark:bg-slate-850/50 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 transition-all cursor-pointer group flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Box className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                        Fresh Paneer — Spoilage Prevention
                      </h4>
                      <span className="text-xs font-bold text-blue-500 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Run &rarr;
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      High spoilage risk. Demonstrates how EVOH high-barrier structure combined with CO2-enriched MAP extends shelf life.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2.5 text-[10px] font-mono text-slate-500">
                      <span className="bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">Category: Dairy</span>
                      <span className="bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">Barrier: EVOH</span>
                      <span className="bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">Shelf Life: 30 Days</span>
                    </div>
                  </div>
                </div>

                {/* Preset 4: Chips */}
                <div 
                  onClick={() => launchDemoScenario('chips')}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-orange-400 dark:hover:border-orange-400 bg-slate-50/60 dark:bg-slate-850/50 hover:bg-orange-50/20 dark:hover:bg-orange-950/20 transition-all cursor-pointer group flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                        Potato Chips — Oxidation & Rancidity Control
                      </h4>
                      <span className="text-xs font-bold text-orange-500 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Run &rarr;
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      High fat content. Shows how metallized film and 99.5% nitrogen flush protects against lipid oxidation and staling.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2.5 text-[10px] font-mono text-slate-500">
                      <span className="bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">Fat Content: High</span>
                      <span className="bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">Format: Flow Wrap</span>
                      <span className="bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">MAP: N2 Flush</span>
                    </div>
                  </div>
                </div>

                {/* Preset 5: Pickle */}
                <div 
                  onClick={() => launchDemoScenario('pickle')}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-red-400 dark:hover:border-red-400 bg-slate-50/60 dark:bg-slate-850/50 hover:bg-red-50/20 dark:hover:bg-red-950/20 transition-all cursor-pointer group flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                        Mango Pickle — Acidity & Corrosion Defense
                      </h4>
                      <span className="text-xs font-bold text-red-500 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Run &rarr;
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      Highly acidic (pH &lt; 4). Explores the necessity of Alu-Foil laminate to secure a leak-proof, 1-year ambient shelf life.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2.5 text-[10px] font-mono text-slate-500">
                      <span className="bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">pH: Acidic</span>
                      <span className="bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">Format: Stand-up Pouch</span>
                      <span className="bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">Shelf Life: 365 Days</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
