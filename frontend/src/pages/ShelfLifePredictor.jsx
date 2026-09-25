import React, { useState } from 'react';
import { Activity, Thermometer, Droplets, Shield, Play, TrendingUp, AlertTriangle } from 'lucide-react';
import { api } from '../api/client';
import { TRANSLATIONS } from '../data/i18n';

export default function ShelfLifePredictor({ lang }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const slT = t.shelfLifePage || TRANSLATIONS.en.shelfLifePage || {};

  const [commodity, setCommodity] = useState('Apples (Fresh)');
  const [material, setMaterial] = useState('Micro-Perforated BOPP');
  const [barrierGrade, setBarrierGrade] = useState('standard');
  const [temp, setTemp] = useState(4);
  const [rh, setRh] = useState(85);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const data = await api.predictShelfLife({
        commodity_type: commodity,
        material_type: material,
        storage_temp: parseFloat(temp),
        relative_humidity: parseFloat(rh),
        packaging_barrier_grade: barrierGrade
      });
      setResult(data);
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
          <Activity className="w-8 h-8 text-emerald-400" />
          {slT.title || "Shelf-Life Kinetic Predictor"}
        </h1>
        <p className="text-slate-400 mt-1">
          {slT.subtitle || "Simulate spoilage kinetics, Q10 Arrhenius temperature shifts, and moisture-barrier shelf-life curves."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Parameters */}
        <div className="lg:col-span-5 bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl space-y-6">
          <h2 className="text-lg font-bold text-amber-300 font-mono flex items-center gap-2 border-b border-white/5 pb-3">
            <Shield className="w-5 h-5 text-amber-400" /> Environmental Parameters
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Food Commodity</label>
            <select
              value={commodity}
              onChange={(e) => setCommodity(e.target.value)}
              className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-amber-400 focus:outline-none"
            >
              <option value="Apples (Fresh)">Apples & Pears (Fresh)</option>
              <option value="Strawberries & Berries">Strawberries & Berries</option>
              <option value="Vine Tomatoes">Vine Tomatoes</option>
              <option value="Crisp Potato Chips">Potato Chips & Snacks</option>
              <option value="Fresh Ground Beef">Fresh Ground Beef / Poultry</option>
              <option value="Aged Cheddar Cheese">Dairy & Hard Cheeses</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Packaging Material Matrix</label>
            <select
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-amber-400 focus:outline-none"
            >
              <option value="Micro-Perforated BOPP">Micro-Perforated BOPP (Equilibrium Breathable)</option>
              <option value="EVOH High-Barrier Laminate">EVOH High-Barrier Laminate (PA/EVOH/PE)</option>
              <option value="Polylactic Acid (PLA)">Polylactic Acid (PLA Bio-Film)</option>
              <option value="LLDPE Polymer Pouch">LLDPE Workhorse Flexible Pouch</option>
              <option value="Aluminum Foil Laminate">Aluminum Foil Hermetic Barrier</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Barrier Quality Grade</label>
            <div className="grid grid-cols-3 gap-2">
              {['standard', 'high-barrier', 'ultra-high'].map(grade => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => setBarrierGrade(grade)}
                  className={`py-2 text-xs rounded-xl capitalize font-medium transition-all ${
                    barrierGrade === grade
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                      : 'bg-slate-950/50 text-slate-400 border border-white/5 hover:text-white'
                  }`}
                >
                  {grade.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Temperature Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-red-400" /> Storage Temperature
              </label>
              <span className="font-mono text-amber-300 text-sm font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                {temp}°C
              </span>
            </div>
            <input
              type="range"
              min="-2"
              max="35"
              step="1"
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>-2°C (Frozen/Subzero)</span>
              <span>4°C (Chilled)</span>
              <span>25°C (Ambient)</span>
              <span>35°C (Tropical)</span>
            </div>
          </div>

          {/* Relative Humidity Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-blue-400" /> Relative Humidity (RH)
              </label>
              <span className="font-mono text-blue-300 text-sm font-bold bg-blue-400/10 px-2 py-0.5 rounded border border-blue-400/20">
                {rh}%
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="98"
              step="1"
              value={rh}
              onChange={(e) => setRh(e.target.value)}
              className="w-full accent-blue-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>40% (Arid)</span>
              <span>65% (Controlled)</span>
              <span>85% (Optimal produce)</span>
              <span>98% (Saturated)</span>
            </div>
          </div>

          <button
            onClick={handleSimulate}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:brightness-110 text-slate-950 font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(52,211,153,0.4)] transition-all active:scale-98"
          >
            {loading ? (
              <span className="animate-spin w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full"></span>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" /> Run Kinetic Simulation
              </>
            )}
          </button>
        </div>

        {/* Right Output Dashboard */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Primary Metric Banner */}
              <div className="bg-slate-900/80 border border-emerald-400/40 p-6 rounded-3xl relative overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 block mb-1">
                      Computed Shelf Life
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-white font-mono tracking-tight">
                        {result.predicted_shelf_life_days}
                      </span>
                      <span className="text-xl text-slate-400 font-serif">Days</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono text-slate-500 block">Decay Acceleration</span>
                    <span className="text-sm font-mono text-amber-300 font-bold">
                      Q₁₀ = {result.q10_factor}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 text-xs text-slate-300 leading-relaxed">
                  {result.recommendation_note}
                </div>
              </div>

              {/* Sensitivity Curve Table */}
              <div className="bg-slate-900/60 border border-white/10 p-6 rounded-3xl">
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-amber-400" /> Temperature Sensitivity Curve
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 font-mono">
                        <th className="pb-2">Storage Temp</th>
                        <th className="pb-2">Predicted Duration</th>
                        <th className="pb-2">Degradation Speed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono">
                      {result.sensitivity_curve?.map((pt, i) => (
                        <tr key={i} className={pt.temperature_c === parseInt(temp) ? 'bg-amber-400/10 text-amber-300 font-bold' : 'text-slate-300'}>
                          <td className="py-2.5">{pt.temperature_c}°C</td>
                          <td className="py-2.5 font-bold">{pt.shelf_life_days} Days</td>
                          <td className="py-2.5 text-slate-400">{pt.quality_loss_rate || '1.0x'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[380px] bg-slate-900/30 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center p-8 text-center">
              <Activity className="w-16 h-16 text-slate-600 mb-4 animate-pulse" />
              <h3 className="text-lg font-bold text-slate-300">Awaiting Simulation Execution</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-2">
                Adjust storage temperature, humidity, and barrier grade on the left panel and click &quot;Run Kinetic Simulation&quot;.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
