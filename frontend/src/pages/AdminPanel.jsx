import React, { useState, useEffect } from 'react';
import { ShieldAlert, BarChart3, Database, Users, BrainCircuit, RefreshCw, CheckCircle2 } from 'lucide-react';
import { api } from '../api/client';

export default function AdminPanel({ lang }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingModel, setUpdatingModel] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await api.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const handleUpdateModel = async () => {
    setUpdatingModel(true);
    setUpdateMessage(null);
    try {
      const res = await api.updateModel();
      setUpdateMessage(res.message || "Recommendation engine weights successfully re-calibrated.");
    } catch (err) {
      setUpdateMessage(err.message || "Model calibration failed.");
    } finally {
      setUpdatingModel(false);
    }
  };

  return (
    <div className="pt-24 pb-32 min-h-screen px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-serif flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-amber-400" />
            Admin & System Telemetry Panel
          </h1>
          <p className="text-slate-400 mt-1">
            Global inference metrics, database record counts, and recommendation engine calibration status.
          </p>
        </div>
        <button
          onClick={handleUpdateModel}
          disabled={updatingModel}
          className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-yellow-300 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(251,191,36,0.3)] disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${updatingModel ? 'animate-spin' : ''}`} />
          {updatingModel ? 'Calibrating...' : 'Trigger Model Calibration'}
        </button>
      </div>

      {updateMessage && (
        <div className="mb-8 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> {updateMessage}
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/60 border border-white/10 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-mono">Total Recommendations</span>
            <BrainCircuit className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-3xl font-black text-white font-mono">
            {loading ? '...' : (analytics?.total_recommendations ?? 0)}
          </span>
        </div>

        <div className="bg-slate-900/60 border border-white/10 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-mono">Curated Commodities</span>
            <Database className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-3xl font-black text-white font-mono">
            {loading ? '...' : (analytics?.total_commodities ?? 0)}
          </span>
        </div>

        <div className="bg-slate-900/60 border border-white/10 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-mono">Active Materials</span>
            <BarChart3 className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-3xl font-black text-white font-mono">
            {loading ? '...' : (analytics?.total_materials ?? 0)}
          </span>
        </div>

        <div className="bg-slate-900/60 border border-white/10 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-mono">Registered Accounts</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-3xl font-black text-white font-mono">
            {loading ? '...' : (analytics?.total_users ?? 0)}
          </span>
        </div>
      </div>

      {/* Model Status & Popular Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ML Status Card */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-white/10 p-6 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-amber-400" /> Engine & Evaluation Status
          </h3>

          <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 space-y-3 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500">Architecture:</span>
              <span className="text-amber-300 font-bold">{analytics?.model_status?.version || 'Rule-Based Engine + TOPSIS Ranking v2.0'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Engine State:</span>
              <span className="text-white font-bold">{analytics?.model_status?.status || 'Active & Calibrated'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Evaluation Mode:</span>
              <span className="text-emerald-400 font-bold">{analytics?.model_status?.accuracy || 'Rule-based scientific evaluation (no trained ML model active)'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Calibration Cadence:</span>
              <span className="text-slate-300">{analytics?.model_status?.last_trained || 'Continuous Deterministic'}</span>
            </div>
          </div>
        </div>

        {/* Popular Distributions */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-white/10 p-6 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400" /> Most Queried Commodities & Polymer Share
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Top Commodities</span>
              {analytics?.popular_commodities && analytics.popular_commodities.length > 0 ? (
                analytics.popular_commodities.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs font-mono bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
                    <span className="text-slate-300 truncate">{item.name}</span>
                    <span className="text-amber-400 font-bold">{item.count} queries</span>
                  </div>
                ))
              ) : (
                <div className="text-xs font-mono text-slate-500 italic p-3 bg-slate-950/30 rounded-xl border border-white/5">
                  No query logs recorded yet
                </div>
              )}
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Recommended Material Share</span>
              {analytics?.popular_materials && analytics.popular_materials.length > 0 ? (
                analytics.popular_materials.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs font-mono bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
                    <span className="text-slate-300 truncate">{item.name}</span>
                    <span className="text-emerald-400 font-bold">{item.share}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs font-mono text-slate-500 italic p-3 bg-slate-950/30 rounded-xl border border-white/5">
                  No material recommendations logged yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
