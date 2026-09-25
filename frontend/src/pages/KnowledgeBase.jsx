import React, { useState, useEffect } from 'react';
import { BookOpen, ArrowRight, Layers, ShieldAlert, ExternalLink, Search, CheckCircle2, XCircle, Sparkles, Filter, Info } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api/client';

import { TRANSLATIONS } from '../data/i18n';

const FLASHCARDS = [
  { term: "Moisture Content & WVTR", category: "Moisture & Water", meaning: "Water Vapor Transmission Rate (WVTR) is critical for preventing dehydration in fresh produce and sogginess in dry goods. A high WVTR lets moisture escape.", range: "15-30 g/m²/day for breathable films", param: "?commodityType=freshProduce" },
  { term: "Respiration Rate & OTR", category: "Gas & Respiration", meaning: "Oxygen Transmission Rate (OTR) balances the respiration of living tissues (like apples) to prevent anaerobic fermentation. High respiration requires high OTR.", range: "10,000+ cc/m²/day for fresh produce", param: "?commodityType=freshProduce" },
  { term: "pH Level", category: "Chemical Properties", meaning: "Acidity (low pH) slows bacterial growth but can corrode certain packaging (like metal). Neutral pH foods need higher barrier protection.", range: "Acidic (pH < 4.5) vs Neutral", param: "?commodityType=meatPoultry" },
  { term: "Oil/Fat Content", category: "Chemical Properties", meaning: "High oil content requires packaging that resists fat migration to prevent structural weakening or greasiness.", range: "High (>20%) vs Low", param: "?commodityType=snacks" },
  { term: "Shelf Life & Temperature", category: "Storage & Shelf Life", meaning: "The Q10 temperature coefficient dictates that every 10°C increase roughly halves shelf life. Chilled storage extends shelf life but requires anti-fog films.", range: "Chilled (4°C) vs Ambient (20°C)", param: "?commodityType=dairy" }
];

export default function KnowledgeBase({ lang }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const kbT = t.knowledgePage || TRANSLATIONS.en.knowledgePage || {};

  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'flashcards'; // 'flashcards' | 'library' | 'preservatives'
  const initialFormat = searchParams.get('format') || '';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [formats, setFormats] = useState([]);
  const [preservatives, setPreservatives] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState(initialFormat);
  const [isLoading, setIsLoading] = useState(false);

  // Flashcards state
  const [flashcardCategory, setFlashcardCategory] = useState("All");

  // Preservative search
  const [preservativeQuery, setPreservativeQuery] = useState("");

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
    const formatFromUrl = searchParams.get('format');
    if (formatFromUrl) {
      setSelectedFormat(formatFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [formatsData, presData] = await Promise.all([
          api.getPackagingFormats(),
          api.getPreservatives()
        ]);
        setFormats(formatsData || []);
        setPreservatives(presData || []);
        if (initialFormat && !selectedFormat) {
          setSelectedFormat(initialFormat);
        }
      } catch (err) {
        console.error("Failed loading knowledge base resources", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('tab', tab);
      if (tab !== 'library') next.delete('format');
      return next;
    });
  };

  return (
    <div className="pt-20 pb-32 min-h-screen px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-amber-400/10 text-amber-400 border border-amber-400/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Technical Knowledge Hub
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-serif tracking-tight">
          Packaging Science & Regulatory Library
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm sm:text-base leading-relaxed">
          Interactive learning modules, vector packaging format schematics, and statutory preservative guidelines for food founders and packaging engineers.
        </p>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 p-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl mx-auto mb-10 shadow-sm">
        <button
          type="button"
          onClick={() => switchTab('flashcards')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'flashcards'
              ? 'bg-white dark:bg-amber-400 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Flashcards</span>
        </button>

        <button
          type="button"
          onClick={() => switchTab('library')}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'library'
              ? 'bg-white dark:bg-amber-400 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Packaging Library</span>
        </button>

        <button
          type="button"
          onClick={() => switchTab('preservatives')}
          className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'preservatives'
              ? 'bg-white dark:bg-amber-400 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Preservatives & Shelf-Life</span>
        </button>
      </div>

      {/* Tab 1: Flashcards */}
      {activeTab === 'flashcards' && (
        <div>
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 custom-scrollbar justify-center">
            {["All", ...new Set(FLASHCARDS.map(c => c.category))].map(cat => (
              <button 
                key={cat} 
                type="button"
                onClick={() => setFlashcardCategory(cat)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-xs font-bold transition-all ${
                  flashcardCategory === cat ? 'bg-brand-green text-white shadow-md' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {(flashcardCategory === "All" ? FLASHCARDS : FLASHCARDS.filter(c => c.category === flashcardCategory)).map((card, i) => (
              <Flashcard key={i} card={card} />
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Graphical Packaging Library */}
      {activeTab === 'library' && (
        <div>
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-500" /> 8 Primary Packaging Formats
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Vector schematics, technical cross-sections, barrier advantages, and recommended product categories.
              </p>
            </div>
            <Link
              to="/recommendation"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Get format recommendation in Engine &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {formats.map((fmt) => {
              const isSelected = selectedFormat === fmt.format_id;
              return (
                <div
                  key={fmt.format_id}
                  id={`format-${fmt.format_id}`}
                  className={`bg-white dark:bg-slate-900 border rounded-3xl p-6 sm:p-8 transition-all shadow-sm hover:shadow-lg flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-400 ring-2 ring-amber-400/40 dark:bg-slate-850'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-md border border-emerald-500/20">
                          {fmt.format_id}
                        </span>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-2">
                          {fmt.name}
                        </h3>
                      </div>
                      {isSelected && (
                        <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full animate-pulse">
                          Engine Match
                        </span>
                      )}
                    </div>

                    {/* SVG Diagram Canvas */}
                    <div className="w-full h-56 sm:h-64 bg-slate-950 rounded-2xl p-4 flex items-center justify-center border border-slate-800 shadow-inner overflow-hidden mb-6 group relative">
                      <div 
                        className="w-full h-full max-w-[220px] mx-auto flex items-center justify-center transition-transform group-hover:scale-105 duration-300"
                        dangerouslySetInnerHTML={{ __html: fmt.diagram_svg }}
                      />
                      <span className="absolute bottom-2 right-3 text-[9px] font-mono text-slate-500 uppercase tracking-widest pointer-events-none">
                        Vector Schematic
                      </span>
                    </div>

                    {/* Typical Use Cases */}
                    <div className="mb-5">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Typical Commercial Use Cases
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {fmt.typical_use_cases?.map((uc, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60"
                          >
                            {uc}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pros and Cons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs">
                      <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20 p-3.5 rounded-xl">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Advantages
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                          {fmt.pros}
                        </p>
                      </div>
                      <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-500/20 p-3.5 rounded-xl">
                        <div className="flex items-center gap-1.5 font-bold text-rose-700 dark:text-rose-400 mb-1">
                          <XCircle className="w-3.5 h-3.5 shrink-0" /> Engineering Tradeoffs
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                          {fmt.cons}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">
                      Compatible with multi-barrier laminates
                    </span>
                    <Link
                      to={`/recommendation?format=${fmt.format_id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 text-slate-800 dark:text-slate-200 px-4 py-2 rounded-xl transition-all"
                    >
                      Calculate for My Food <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Preservatives & Additives Guide */}
      {activeTab === 'preservatives' && (
        <div className="max-w-5xl mx-auto">
          {/* Statutory Legal Disclaimer Banner */}
          <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start gap-4 shadow-sm">
            <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-500 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-extrabold text-sm sm:text-base uppercase tracking-wider text-amber-950 dark:text-amber-300">
                Statutory Regulatory Compliance Notice
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-amber-100/90 leading-relaxed">
                Permitted maximum limits (in mg/kg or ppm) for food additives and preservatives are legally governed by national regulations (such as FSSAI Food Safety and Standards Regulations in India, US FDA 21 CFR, and Codex Alimentarius GSFA). These limits vary strictly by food category and are updated periodically by statutory authorities.
              </p>
              <p className="text-xs font-bold text-amber-800 dark:text-amber-300 pt-1">
                PackSmart provides educational scientific classifications only. Always consult the official gazetted regulations or a qualified food technologist before formulating commercial batches.
              </p>
            </div>
          </div>

          {/* Search Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search preservatives (e.g. Sorbate, Rosemary, Tocopherol)..."
                value={preservativeQuery}
                onChange={(e) => setPreservativeQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            {/* Official Portals Quick Links */}
            <div className="flex flex-wrap gap-2 text-xs">
              <a
                href="https://www.fssai.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
              >
                FSSAI Portal <ExternalLink className="w-3 h-3 text-amber-400" />
              </a>
              <a
                href="https://www.fao.org/gsfaonline/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
              >
                Codex GSFA <ExternalLink className="w-3 h-3 text-emerald-400" />
              </a>
              <a
                href="https://www.fda.gov/food/food-additives-petitions/substances-added-food-formerly-eafus"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
              >
                US FDA EAFUS <ExternalLink className="w-3 h-3 text-blue-400" />
              </a>
            </div>
          </div>

          {/* Preservative Categories Accordion / Cards */}
          <div className="space-y-6">
            {preservatives
              .filter((p) => {
                if (!preservativeQuery) return true;
                const q = preservativeQuery.toLowerCase();
                return (
                  p.category.toLowerCase().includes(q) ||
                  p.common_examples.some((ex) => ex.toLowerCase().includes(q)) ||
                  p.typical_food_use_cases.some((uc) => uc.toLowerCase().includes(q))
                );
              })
              .map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm hover:border-amber-400/50 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-md">
                        Functional Class {item.id}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1.5">
                        {item.category}
                      </h3>
                    </div>
                    <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 self-start sm:self-auto">
                      <Info className="w-3.5 h-3.5 text-amber-400" />
                      <span>{item.natural_vs_synthetic}</span>
                    </div>
                  </div>

                  {/* Common Examples */}
                  <div className="mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Permitted / Common Examples
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {item.common_examples?.map((ex, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-lg border border-amber-500/20"
                        >
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Typical Food Applications */}
                  <div className="mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Typical Target Food Matrix
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {item.typical_food_use_cases?.map((uc, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg"
                        >
                          {uc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Specific Disclaimer & Official Portal */}
                  <div className="mt-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                      <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <p>{item.regulatory_disclaimer}</p>
                    </div>
                    {item.official_source_link && (
                      <a
                        href={item.official_source_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline shrink-0"
                      >
                        Official Portal <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Flashcard({ card }) {
  const [flipped, setFlipped] = useState(false);
  
  return (
    <div className="h-64 w-full" style={{ perspective: '1000px' }}>
      <motion.div
        className="w-full h-full relative cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
        onClick={() => setFlipped(!flipped)}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
      >
        {/* Front */}
        <div className="absolute w-full h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col justify-center items-center text-center shadow-md" style={{ backfaceVisibility: 'hidden' }}>
          <span className="text-[11px] text-amber-500 uppercase tracking-widest mb-2 font-bold">{card.category}</span>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{card.term}</h3>
          <p className="text-xs text-slate-400 mt-4 font-medium">(Tap to flip)</p>
        </div>
        
        {/* Back */}
        <div className="absolute w-full h-full bg-slate-50 dark:bg-slate-900 border border-amber-400/50 rounded-3xl p-6 flex flex-col shadow-xl overflow-y-auto custom-scrollbar" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 mb-4 leading-relaxed">{card.meaning}</p>
          <div className="bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-white/5 mb-4">
            <span className="block text-[10px] uppercase text-slate-400 font-bold mb-1">Typical Range</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold">{card.range}</span>
          </div>
          
          <div className="mt-auto">
            <Link 
              to={`/recommendation${card.param}`} 
              onClick={(e) => e.stopPropagation()}
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 py-2 rounded-xl text-xs font-bold transition-colors"
            >
              Where you'll see this in Engine <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
