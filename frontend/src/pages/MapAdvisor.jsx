import React, { useState } from 'react';
import { Wind, Gauge, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../api/client';

export default function MapAdvisor({ lang }) {
  const [commodity, setCommodity] = useState('Strawberries & Berries');
  const [weight, setWeight] = useState(500);
  const [volume, setVolume] = useState(1200);
  const [respiration, setRespiration] = useState(45);
  const [temp, setTemp] = useState(4);
  const [loading, setLoading] = useState(false);
  const [advisory, setAdvisory] = useState(null);

  const handleCompute = async () => {
    setLoading(true);
    try {
      const data = await api.adviseMap({
        commodity_name: commodity,
        weight_grams: parseFloat(weight),
        packaging_volume_ml: parseFloat(volume),
        respiration_rate_ml_co2_kg_hr: parseFloat(respiration),
        storage_temp_c: parseFloat(temp)
      });
      setAdvisory(data);
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
          <Wind className="w-8 h-8 text-blue-400" />
          MAP (Modified Atmosphere Packaging) Advisor
        </h1>
        <p className="text-slate-400 mt-1">
          Calculate equilibrium gas compositions (O₂ / CO₂ / N₂) and micro-laser perforation specifications to halt post-harvest senescence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Inputs */}
        <div className="lg:col-span-5 bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl space-y-6">
          <h2 className="text-lg font-bold text-blue-300 font-mono flex items-center gap-2 border-b border-white/5 pb-3">
            <Gauge className="w-5 h-5 text-blue-400" /> Respiration Inputs
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Produce Selection</label>
            <select
              value={commodity}
              onChange={(e) => {
                const val = e.target.value;
                setCommodity(val);
                if (val.includes('Strawberr')) setRespiration(45);
                else if (val.includes('Apple')) setRespiration(8.5);
                else if (val.includes('Beef')) setRespiration(0);
                else setRespiration(25);
              }}
              className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-400 focus:outline-none"
            >
              <option value="Strawberries & Berries">Strawberries & Berries (High Respiration)</option>
              <option value="Fresh Apples & Pears">Fresh Apples & Pears (Low Respiration)</option>
              <option value="Baby Spinach & Salad Greens">Baby Spinach & Salad Greens (Extreme Respiration)</option>
              <option value="Fresh Cut Broccoli Florets">Broccoli Florets (High Respiration)</option>
              <option value="Fresh Beef Ribeye">Fresh Beef Ribeye (Myoglobin Red Retention)</option>
              <option value="Fried Savory Snacks">Fried Savory Snacks (N₂ Purge Required)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pack Weight (g)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-400 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Package Vol (mL)</label>
              <input
                type="number"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-400 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">CO₂ Rate (mL/kg·h)</label>
              <input
                type="number"
                value={respiration}
                onChange={(e) => setRespiration(e.target.value)}
                className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-400 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target Temp (°C)</label>
              <input
                type="number"
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
                className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-400 focus:outline-none font-mono"
              />
            </div>
          </div>

          <button
            onClick={handleCompute}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:brightness-110 text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all active:scale-98"
          >
            {loading ? (
              <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Compute Equilibrium MAP Gas
              </>
            )}
          </button>
        </div>

        {/* Advisory Output */}
        <div className="lg:col-span-7 space-y-6">
          {advisory ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Gas Ratio Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-900/80 border border-blue-500/30 p-5 rounded-2xl text-center shadow-lg">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono block">Oxygen (O₂)</span>
                  <span className="text-3xl font-black text-blue-400 font-mono">{advisory.target_o2_percent}%</span>
                  <span className="text-[10px] text-slate-500 block mt-1">Aerobic Threshold</span>
                </div>
                <div className="bg-slate-900/80 border border-amber-500/30 p-5 rounded-2xl text-center shadow-lg">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono block">Carbon Dioxide (CO₂)</span>
                  <span className="text-3xl font-black text-amber-400 font-mono">{advisory.target_co2_percent}%</span>
                  <span className="text-[10px] text-slate-500 block mt-1">Antimicrobial Barrier</span>
                </div>
                <div className="bg-slate-900/80 border border-indigo-500/30 p-5 rounded-2xl text-center shadow-lg">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono block">Nitrogen (N₂)</span>
                  <span className="text-3xl font-black text-indigo-400 font-mono">{advisory.target_n2_percent}%</span>
                  <span className="text-[10px] text-slate-500 block mt-1">Inert Inerting Filler</span>
                </div>
              </div>

              {/* Perforation Specs */}
              <div className="bg-slate-900/60 border border-white/10 p-6 rounded-3xl space-y-4">
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Micro-Perforation Density Specification
                </h3>
                <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/5 font-mono text-emerald-300 font-bold text-sm">
                  {advisory.micro_perforation_density}
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-950/40 p-3 rounded-xl">
                    <span className="text-slate-500 block">Required Gas Flush Volume</span>
                    <span className="font-mono text-white font-bold">{advisory.gas_flush_volume_liters} Liters / pouch</span>
                  </div>
                  <div className="bg-slate-950/40 p-3 rounded-xl">
                    <span className="text-slate-500 block">Condensation Hazard</span>
                    <span className="font-mono text-amber-300 font-bold">{advisory.condensation_risk}</span>
                  </div>
                </div>
              </div>

              {/* Scientific Advisory Box */}
              <div className="bg-indigo-950/30 border border-indigo-500/20 p-5 rounded-2xl text-xs text-slate-300 leading-relaxed">
                <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Biochemical Senescence Guidance
                </h4>
                {advisory.advisory_notes}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[380px] bg-slate-900/30 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center p-8 text-center">
              <Wind className="w-16 h-16 text-slate-600 mb-4 animate-pulse" />
              <h3 className="text-lg font-bold text-slate-300">Ready for Equilibrium Gas Modeling</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-2">
                Enter your produce weight and package volume to determine the exact equilibrium atmosphere and micro-vent density.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
