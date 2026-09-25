import React, { useState } from 'react';
import { Leaf, DollarSign, Award, BarChart3, Recycle, ShieldCheck } from 'lucide-react';
import { api } from '../api/client';

export default function SustainabilityAnalyzer({ lang }) {
  const [material, setMaterial] = useState('Polylactic Acid (PLA)');
  const [volume, setVolume] = useState(10000);
  const [weight, setWeight] = useState(14);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const data = await api.analyzeSustainability({
        material_name: material,
        production_volume_units: parseInt(volume),
        pack_weight_grams: parseFloat(weight)
      });
      setAnalysis(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-32 min-h-screen px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-bold text-white font-serif flex items-center gap-3">
          <Leaf className="w-8 h-8 text-emerald-400" />
          Sustainability & Life-Cycle Cost Analyzer
        </h1>
        <p className="text-slate-400 mt-1">
          Evaluate carbon emission profiles (LCA), circular economy recyclability classes, and unit material economics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Parameters */}
        <div className="lg:col-span-5 bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl space-y-6">
          <h2 className="text-lg font-bold text-emerald-300 font-mono flex items-center gap-2 border-b border-white/5 pb-3">
            <Recycle className="w-5 h-5 text-emerald-400" /> Life-Cycle Parameters
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target Packaging Matrix</label>
            <select
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-400 focus:outline-none"
            >
              <option value="Polylactic Acid (PLA)">PLA Bio-Film (Industrial Compostable)</option>
              <option value="Micro-Perforated BOPP">Mono-Material Polypropylene (BOPP)</option>
              <option value="Linear Low-Density Polyethylene (LDPE)">LDPE Flexible Film (Standard Poly)</option>
              <option value="EVOH High-Barrier Laminate">EVOH Multilayer Composite (High Barrier)</option>
              <option value="Aluminum Foil Co-Laminate">Aluminum Foil Composite (Ultra-High Barrier)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Production Run (Pcs)</label>
              <input
                type="number"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-400 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Weight per Pouch (g)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-400 focus:outline-none font-mono"
              />
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 hover:brightness-110 text-slate-950 font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(52,211,153,0.4)] transition-all active:scale-98"
          >
            {loading ? (
              <span className="animate-spin w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full"></span>
            ) : (
              <>
                <BarChart3 className="w-4 h-4" /> Analyze LCA Carbon & Cost
              </>
            )}
          </button>
        </div>

        {/* Results Dashboard */}
        <div className="lg:col-span-7 space-y-6">
          {analysis ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Score & Cost Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/80 border border-emerald-500/30 p-6 rounded-3xl text-center shadow-xl">
                  <span className="text-xs uppercase tracking-wider text-emerald-400 font-mono block">Circularity Score</span>
                  <span className="text-5xl font-black text-white font-mono mt-1 block">
                    {analysis.sustainability_score}
                    <span className="text-xl text-slate-500 font-sans">/100</span>
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-2">{analysis.recyclability_rating}</span>
                </div>

                <div className="bg-slate-900/80 border border-amber-500/30 p-6 rounded-3xl text-center shadow-xl">
                  <span className="text-xs uppercase tracking-wider text-amber-400 font-mono block">Batch Material Cost</span>
                  <span className="text-4xl font-black text-white font-mono mt-1 block">
                    ${analysis.cost_estimate_usd}
                  </span>
                  <span className="text-[11px] text-amber-300 font-mono block mt-2">
                    ${analysis.cost_per_unit_usd} per pouch
                  </span>
                </div>
              </div>

              {/* Carbon Emission Details */}
              <div className="bg-slate-900/60 border border-white/10 p-6 rounded-3xl space-y-4">
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" /> Greenhouse Gas (GHG) Footprint
                </h3>
                
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5">
                    <span className="text-slate-500 block uppercase text-[10px]">Total Embodied Carbon</span>
                    <span className="text-xl font-bold text-emerald-300">{analysis.carbon_footprint_total_kg_co2} kg CO₂e</span>
                    <span className="text-[10px] text-slate-500 mt-1 block">For {volume.toLocaleString()} units</span>
                  </div>
                  <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5">
                    <span className="text-slate-500 block uppercase text-[10px]">Unit Carbon Intensity</span>
                    <span className="text-xl font-bold text-blue-300">{analysis.carbon_per_unit_g_co2} g CO₂e</span>
                    <span className="text-[10px] text-slate-500 mt-1 block">Per consumer pouch</span>
                  </div>
                </div>

                <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl text-xs text-slate-300 leading-relaxed">
                  {analysis.eco_recommendation}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[380px] bg-slate-900/30 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center p-8 text-center">
              <Leaf className="w-16 h-16 text-slate-600 mb-4 animate-pulse" />
              <h3 className="text-lg font-bold text-slate-300">Ready for Environmental Impact Modeling</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-2">
                Configure your packaging material formulation and unit volume on the left to review embodied carbon and unit economics.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
