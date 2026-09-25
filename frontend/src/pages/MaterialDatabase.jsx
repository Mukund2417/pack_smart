import React, { useState, useEffect } from 'react';
import { Layers, Search, Filter, ShieldCheck, Leaf, DollarSign, Award, ExternalLink } from 'lucide-react';
import { api } from '../api/client';
import { TRANSLATIONS } from '../data/i18n';

export default function MaterialDatabase({ lang }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const dbT = t.databasePage || TRANSLATIONS.en.databasePage || {};

  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  useEffect(() => {
    async function loadMaterials() {
      setLoading(true);
      try {
        const data = await api.getMaterials();
        setMaterials(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadMaterials();
  }, []);

  const filteredMaterials = materials.filter(m => {
    const matchesQuery = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (m.gas_permeability_notes && m.gas_permeability_notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'all' || m.material_type.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesQuery && matchesCat;
  });

  return (
    <div className="pt-24 pb-32 min-h-screen px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-serif flex items-center gap-3">
            <Layers className="w-8 h-8 text-amber-400" />
            {dbT.title || "Packaging Material Database"}
          </h1>
          <p className="text-slate-400 mt-1">{dbT.subtitle || "Comprehensive scientific polymer registry, barrier specs, and transmission rates."}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono">
            {filteredMaterials.length} Formulations Active
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700/60 p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search polymers (e.g. EVOH, BOPP, PLA, LDPE)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Materials' },
            { id: 'breathable', label: 'Breathable Films' },
            { id: 'laminate', label: 'Barrier Laminates' },
            { id: 'biodegradable', label: 'Bio & Compostable' },
            { id: 'foil', label: 'Foil Composites' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Material Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-12 h-12 border-4 border-amber-400/20 border-t-amber-400 rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-400 font-mono text-sm">Querying database records...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map(mat => (
            <div
              key={mat.material_id}
              onClick={() => setSelectedMaterial(mat)}
              className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/60 rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between cursor-pointer group shadow-sm hover:shadow-md text-slate-900 dark:text-white"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {mat.material_type}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" /> Eco: {mat.sustainability_score || 70}/100
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                  {mat.name}
                </h3>
                
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {mat.gas_permeability_notes || 'High efficiency barrier suitable for food shelf-life extension.'}
                </p>

                {mat.commonly_used_for && mat.commonly_used_for.length > 0 && (
                  <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Top Food Matrix:</span>
                    {mat.commonly_used_for.map((com, idx) => (
                      <span key={idx} className="text-[10px] bg-amber-400/10 text-amber-300 px-2 py-0.5 rounded border border-amber-400/20 font-medium">
                        {com}
                      </span>
                    ))}
                  </div>
                )}

                {/* Specs Box */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/5 text-xs">
                  <div className="bg-slate-950/40 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-500 block uppercase">OTR Barrier</span>
                    <span className="font-mono text-blue-300 font-medium">{mat.otr_range}</span>
                  </div>
                  <div className="bg-slate-950/40 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-500 block uppercase">WVTR Barrier</span>
                    <span className="font-mono text-blue-300 font-medium">{mat.wvtr_range}</span>
                  </div>
                  <div className="bg-slate-950/40 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-500 block uppercase">Thickness</span>
                    <span className="font-mono text-amber-300 font-medium">{mat.thickness_range_microns}</span>
                  </div>
                  <div className="bg-slate-950/40 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-500 block uppercase">Sealability</span>
                    <span className="capitalize text-slate-200">{mat.sealability_rating}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between pt-3 border-t border-white/5 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-amber-400" /> Cost Index: {mat.cost_index}/10
                </span>
                <span className="text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                  Inspect <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Detail View */}
      {selectedMaterial && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-400/40 max-w-xl w-full rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedMaterial(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white text-lg font-bold w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center"
            >
              ✕
            </button>

            <span className="text-xs uppercase font-mono px-2.5 py-1 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
              {selectedMaterial.material_type}
            </span>

            <h2 className="text-2xl font-bold text-white mt-3">{selectedMaterial.name}</h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">{selectedMaterial.gas_permeability_notes}</p>

            <div className="grid grid-cols-2 gap-3 my-6 text-sm">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                <span className="text-slate-500 text-xs block">Oxygen Transmission (OTR)</span>
                <span className="text-blue-300 font-mono font-bold">{selectedMaterial.otr_range}</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                <span className="text-slate-500 text-xs block">Water Vapor (WVTR)</span>
                <span className="text-blue-300 font-mono font-bold">{selectedMaterial.wvtr_range}</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                <span className="text-slate-500 text-xs block">Standard Thickness</span>
                <span className="text-amber-300 font-mono font-bold">{selectedMaterial.thickness_range_microns}</span>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                <span className="text-slate-500 text-xs block">Mechanical Strength</span>
                <span className="text-emerald-400 font-mono font-bold">{selectedMaterial.mechanical_strength_index}/10 Index</span>
              </div>
            </div>

            <div className="bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-xl mb-6 flex items-center gap-3">
              <Leaf className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-emerald-400 uppercase">Sustainability & Circularity Profile</h4>
                <p className="text-xs text-slate-300 mt-0.5">{selectedMaterial.recyclability_notes || 'Compatible with standard post-consumer recovery streams.'}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedMaterial(null)}
              className="w-full py-3 rounded-xl bg-amber-400 text-slate-950 font-bold hover:bg-yellow-300 transition-colors shadow-lg"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
