import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink, 
  Sparkles, 
  Filter, 
  FileCheck, 
  Lock, 
  Save, 
  RefreshCw, 
  Building2, 
  HelpCircle 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api/client';
import { TRANSLATIONS } from '../data/i18n';

export default function LaunchChecklist({ lang }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const chkT = t.checklistPage || TRANSLATIONS.en.checklistPage || {};

  const [jurisdiction, setJurisdiction] = useState("India — FSSAI");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [checklists, setChecklists] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);
  const [progressData, setProgressData] = useState({
    total_items: 0,
    mandatory_total: 0,
    mandatory_completed: 0,
    progress_percentage: 0,
    mandatory_progress_percentage: 0
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Check if user is logged in
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('packsmart_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Load checklist and progress on mount / jurisdiction change
  useEffect(() => {
    loadChecklistAndProgress();
  }, [jurisdiction]);

  const loadChecklistAndProgress = async () => {
    setLoading(true);
    try {
      const [listRes, progRes] = await Promise.all([
        api.getComplianceChecklist(jurisdiction),
        api.getChecklistProgress(user?.id, jurisdiction)
      ]);

      setChecklists(listRes || []);
      if (progRes) {
        setCompletedIds(progRes.completed_item_ids || []);
        setProgressData(progRes);
        if (progRes.updated_at) {
          setLastSaved(new Date(progRes.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      }
    } catch (err) {
      console.error("Error loading checklist", err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle checklist item completion
  const handleToggle = async (itemId) => {
    const nextCompleted = completedIds.includes(itemId)
      ? completedIds.filter(id => id !== itemId)
      : [...completedIds, itemId];

    setCompletedIds(nextCompleted);

    // Calculate updated metrics locally for instant UI update
    const allItems = checklists.flatMap(c => c.checklist_items || []);
    const total = allItems.length;
    const mandatoryItems = allItems.filter(i => i.is_mandatory);
    const mandatoryTotal = mandatoryItems.length;
    const mandatoryCompleted = mandatoryItems.filter(i => nextCompleted.includes(i.item_id)).length;

    const newProgress = {
      jurisdiction,
      completed_item_ids: nextCompleted,
      total_items: total,
      mandatory_total: mandatoryTotal,
      mandatory_completed: mandatoryCompleted,
      progress_percentage: total > 0 ? Math.round((nextCompleted.length / total) * 100) : 0,
      mandatory_progress_percentage: mandatoryTotal > 0 ? Math.round((mandatoryCompleted / mandatoryTotal) * 100) : 0
    };
    setProgressData(newProgress);

    // Persist to server (and local cache fallback)
    setIsSaving(true);
    try {
      const res = await api.saveChecklistProgress(
        {
          jurisdiction,
          completed_item_ids: nextCompleted
        },
        user?.id
      );
      if (res && res.updated_at) {
        setLastSaved(new Date(res.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } else {
        setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (err) {
      console.warn("Checklist progress saved locally", err);
      setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } finally {
      setIsSaving(false);
    }
  };

  // Filter items by category
  const categories = ["All", ...new Set(checklists.map(c => c.product_category))];
  const filteredChecklists = selectedCategory === "All" 
    ? checklists 
    : checklists.filter(c => c.product_category === selectedCategory);

  const isLaunchReady = progressData.mandatory_total > 0 && progressData.mandatory_completed === progressData.mandatory_total;

  return (
    <div className="pt-20 pb-32 min-h-screen px-4 md:px-8 max-w-5xl mx-auto font-sans">
      {/* Page Header */}
      <div className="mb-8 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <FileCheck className="w-3.5 h-3.5" /> Pre-Launch Regulatory Audit
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-serif tracking-tight">
          Food Packaging Legal & Launch Checklist
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2.5 text-sm sm:text-base leading-relaxed">
          Statutory compliance requirements covering FSSAI registration, mandatory 14-digit labeling, allergen warnings, veg/non-veg symbols, and food-contact migration certifications.
        </p>
      </div>

      {/* Top Banner: Statutory Regulatory Disclaimer */}
      <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-950 dark:text-amber-200 flex flex-col sm:flex-row items-start gap-4 shadow-sm">
        <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-500 shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-amber-950 dark:text-amber-300">
            Mandatory Statutory Compliance Notice
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-amber-100/90 leading-relaxed">
            This launch audit checklist is designed for operational guidance based on published FSSAI Food Safety and Standards Regulations (Packaging & Labeling). Requirements, statutory licensing categories, and mandatory declarations are subject to gazetted updates.
          </p>
          <p className="text-xs font-bold text-amber-800 dark:text-amber-300 pt-1">
            Always perform final verification on the official FoSCoS portal (foscos.fssai.gov.in) before printing packaging cylinders or commencing commercial retail distribution.
          </p>
        </div>
      </div>

      {/* Progress & Sync Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Launch Readiness Score
              </h2>
              {isLaunchReady ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30">
                  <ShieldCheck className="w-4 h-4" /> Ready for Retail Launch
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-amber-500/20 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full border border-amber-500/30">
                  <AlertTriangle className="w-3.5 h-3.5" /> Mandatory Items Incomplete
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {progressData.mandatory_completed} of {progressData.mandatory_total} statutory mandatory items completed
            </p>
          </div>

          {/* Sync Status Badge */}
          <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-850 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800">
            {isSaving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>Saving to cloud...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-emerald-500" />
                <span>
                  {user ? `Cloud Synced (${user.email})` : 'Saved Locally (Guest)'}
                  {lastSaved && ` • ${lastSaved}`}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-700 dark:text-slate-300">Mandatory Regulatory Items</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                {progressData.mandatory_progress_percentage}%
              </span>
            </div>
            <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700/60">
              <motion.div
                className={`h-full rounded-full transition-all duration-500 ${
                  isLaunchReady
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                    : 'bg-gradient-to-r from-amber-400 to-emerald-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${progressData.mandatory_progress_percentage}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
              <span>Overall Packaging Readiness (Mandatory + Best Practices)</span>
              <span className="font-mono">{progressData.progress_percentage}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-400 dark:bg-slate-600 rounded-full transition-all duration-500"
                style={{ width: `${progressData.progress_percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Guest prompt to log in for cross-device sync */}
        {!user && (
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              💡 Working on multiple devices? Log in to save your checklist progress across your phone and laptop.
            </span>
            <Link
              to="/account"
              className="text-amber-500 font-bold hover:underline shrink-0"
            >
              Sign In / Free Account &rarr;
            </Link>
          </div>
        )}
      </div>

      {/* Filter and Jurisdiction Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
        {/* Jurisdiction Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Jurisdiction:
          </span>
          <select
            value={jurisdiction}
            onChange={(e) => setJurisdiction(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 transition-colors shadow-sm"
          >
            <option value="India — FSSAI">India — FSSAI (Active)</option>
            <option value="United States — US FDA" disabled>United States — US FDA (Coming Soon)</option>
            <option value="European Union — EFSA" disabled>European Union — EFSA (Coming Soon)</option>
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Checklist Items Accordion / Groups */}
      <div className="space-y-8">
        {filteredChecklists.map((categoryGroup) => (
          <div
            key={categoryGroup.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold text-sm">
                  {categoryGroup.product_category.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {categoryGroup.product_category}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {categoryGroup.checklist_items?.length || 0} audit check items
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                {categoryGroup.jurisdiction}
              </span>
            </div>

            <div className="space-y-4">
              {categoryGroup.checklist_items?.map((item) => {
                const isChecked = completedIds.includes(item.item_id);
                return (
                  <div
                    key={item.item_id}
                    onClick={() => handleToggle(item.item_id)}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                      isChecked
                        ? 'bg-emerald-500/5 border-emerald-500/40 dark:bg-emerald-950/20'
                        : 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {/* Checkbox Icon */}
                    <div className="mt-0.5 shrink-0 text-emerald-500">
                      {isChecked ? (
                        <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-white dark:text-slate-900" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className={`text-sm font-bold ${isChecked ? 'line-through text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                          {item.item_title}
                        </span>

                        {item.is_mandatory ? (
                          <span className="text-[10px] uppercase font-black tracking-wider bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded">
                            Mandatory
                          </span>
                        ) : (
                          <span className="text-[10px] uppercase font-bold tracking-wider bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded">
                            Recommended
                          </span>
                        )}

                        <span className="text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                          {item.stage}
                        </span>
                      </div>

                      <p className={`text-xs leading-relaxed ${isChecked ? 'text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-300'}`}>
                        {item.description}
                      </p>

                      {/* Official Reference Link */}
                      {item.official_reference_link && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-850">
                          <a
                            href={item.official_reference_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                          >
                            <span>Verify on official statutory portal ({item.official_reference_link.replace('https://', '')})</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Summary / Call to Action */}
      <div className="mt-12 p-8 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center max-w-2xl mx-auto space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Need Custom Barrier Calculations?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Input your food product's target moisture, respiration, and storage conditions into the Packaging Engine to generate tailored OTR/WVTR barrier specs and compatible packaging formats.
        </p>
        <Link
          to="/recommendation"
          className="inline-flex items-center gap-2 bg-brand-green text-white px-6 py-3 rounded-full font-bold text-xs sm:text-sm hover:bg-brand-green/90 transition-all shadow-md"
        >
          Run Packaging Engine &rarr;
        </Link>
      </div>
    </div>
  );
}
