import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, AlertCircle, Calendar, Clock, Database, Layers, ArrowLeft, ExternalLink } from 'lucide-react';

export default function VerifyDossier() {
  const { dossierId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVerification() {
      setLoading(true);
      setError(null);
      try {
        const BASE_URL = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${BASE_URL}/api/dossier/${encodeURIComponent(dossierId)}/verify`);
        if (!res.ok) {
          throw new Error(res.status === 404 ? 'Dossier record not found or expired.' : `Verification failed (HTTP ${res.status})`);
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message || 'Unable to verify dossier');
      } finally {
        setLoading(false);
      }
    }

    if (dossierId) {
      fetchVerification();
    }
  }, [dossierId]);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to PackSmart
        </Link>
      </div>

      {loading ? (
        <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-12 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 border-4 border-amber-400/20 border-t-amber-400 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-300 font-mono text-sm">Verifying cryptographic dossier hash against active database...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-950/30 border border-rose-500/40 rounded-3xl p-8 text-center space-y-4 shadow-xl">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Dossier Verification Failed</h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto">{error}</p>
          <p className="text-xs font-mono text-slate-500">Target Identifier: {dossierId}</p>
          <div className="pt-2">
            <Link
              to="/recommendation"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-xs"
            >
              Generate New Analysis
            </Link>
          </div>
        </div>
      ) : data ? (
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-8 md:p-10 space-y-8 shadow-2xl backdrop-blur-xl">
          
          {/* Authenticated Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-6 gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                VERIFIED AUTHENTIC RECORD
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white mt-2">
                {data.commodity_name}
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                Dossier Identifier: <strong className="text-amber-400">{data.dossier_id}</strong>
              </p>
            </div>

            <div className="text-right sm:border-l border-white/10 sm:pl-6 text-xs font-mono space-y-1">
              <div className="text-slate-400">Verified Timestamp</div>
              <div className="text-emerald-400 font-bold">
                {new Date(data.verification_timestamp).toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500 truncate max-w-[200px]">
                {data.cryptographic_hash}
              </div>
            </div>
          </div>

          {/* Core Specification Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-white/5 space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Primary Packaging Material
              </span>
              <strong className="text-white text-base block">{data.primary_material}</strong>
              <div className="flex gap-4 pt-1 font-mono text-slate-300">
                <span>Caliper: <strong className="text-amber-300">{data.recommended_thickness}</strong></span>
                <span>Shelf Life: <strong className="text-emerald-300">{data.desired_shelf_life_days} Days</strong></span>
              </div>
            </div>

            <div className="bg-slate-950/70 p-4 rounded-2xl border border-white/5 space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Barrier Requirements
              </span>
              <div className="grid grid-cols-2 gap-2 font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block">OTR Target:</span>
                  <strong className="text-blue-300 text-sm">{data.recommended_otr}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">WVTR Target:</span>
                  <strong className="text-blue-300 text-sm">{data.recommended_wvtr}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Environmental & Logistics Profile */}
          <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5 grid grid-cols-3 gap-3 text-center text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block">Storage Environment</span>
              <strong className="text-slate-200 capitalize">{data.storage_type} ({data.storage_temperature_c}°C)</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Relative Humidity</span>
              <strong className="text-slate-200">{data.relative_humidity_pct}% RH</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Logistics Severity</span>
              <strong className="text-slate-200 capitalize">{data.transport_mode} transit</strong>
            </div>
          </div>

          {/* Regulatory Reference Notice */}
          <div className="p-4 bg-slate-950/70 rounded-2xl border border-white/5 space-y-1.5 text-xs text-slate-300">
            <strong className="text-slate-200 block font-mono text-[11px] uppercase text-amber-400">
              Regulatory Verification & Reference Note
            </strong>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              This record was synthesized by the <strong className="text-slate-300">{data.issuing_authority}</strong>. Reference standards: {data.regulatory_reference}. This online verification confirms that the parameters on the printed dossier match the live database state.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
            <span className="text-[11px] text-slate-500 font-mono">
              Live Database Verification Record # {data.recommendation_id}
            </span>
            <Link
              to="/recommendation"
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
            >
              <span>Explore Packaging Engine</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
