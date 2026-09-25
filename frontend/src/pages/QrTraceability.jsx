import React, { useState } from 'react';
import { QrCode, Scan, ShieldCheck, MapPin, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { api } from '../api/client';

export default function QrTraceability({ lang }) {
  const [batch, setBatch] = useState('BATCH-2026-APPLES-01');
  const [commodity, setCommodity] = useState('Royal Gala Apples');
  const [material, setMaterial] = useState('Micro-Perforated BOPP');
  const [loading, setLoading] = useState(false);
  const [qrResult, setQrResult] = useState(null);
  const [scanSimulated, setScanSimulated] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setScanSimulated(false);
    try {
      const data = await api.generateQr({
        batch_label: batch,
        commodity: commodity,
        packaging_material: material
      });
      setQrResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateScan = () => {
    setScanSimulated(true);
  };

  return (
    <div className="pt-24 pb-32 min-h-screen px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-bold text-white font-serif flex items-center gap-3">
          <QrCode className="w-8 h-8 text-amber-400" />
          Smart Packaging QR Traceability Module
        </h1>
        <p className="text-slate-400 mt-1">
          Generate batch-authenticated cryptographic QR codes linking shelf-life expiration dates, barrier material specs, and supply chain origin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form */}
        <div className="lg:col-span-5 bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl space-y-6">
          <h2 className="text-lg font-bold text-amber-300 font-mono flex items-center gap-2 border-b border-white/5 pb-3">
            <Scan className="w-5 h-5 text-amber-400" /> Batch Specifications
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Batch Label ID</label>
            <input
              type="text"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-amber-400 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Food Commodity</label>
            <input
              type="text"
              value={commodity}
              onChange={(e) => setCommodity(e.target.value)}
              className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Assigned Packaging Barrier</label>
            <input
              type="text"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-yellow-300 text-slate-950 font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all active:scale-98"
          >
            {loading ? (
              <span className="animate-spin w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full"></span>
            ) : (
              <>
                <QrCode className="w-4 h-4" /> Generate Traceability QR Code
              </>
            )}
          </button>
        </div>

        {/* QR Code Presentation */}
        <div className="lg:col-span-7 space-y-6">
          {qrResult ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-slate-900/80 border border-amber-400/30 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 shadow-2xl">
                {/* Visual SVG QR */}
                <div className="p-3 bg-slate-950 rounded-2xl border border-white/10 shadow-inner flex flex-col items-center">
                  <img
                    src={qrResult.qr_data_url}
                    alt="Traceability QR Code"
                    className="w-48 h-48 rounded-xl object-contain"
                  />
                  <span className="text-[10px] text-amber-400 font-mono mt-2 font-bold">{qrResult.batch_label}</span>
                </div>

                <div className="flex-1 space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold">
                    <ShieldCheck className="w-4 h-4" /> Authenticated Batch Record
                  </div>
                  <h3 className="text-xl font-bold text-white">{commodity}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Packaging: <span className="text-slate-200 font-medium">{material}</span>
                  </p>
                  
                  <div className="pt-2 text-xs text-slate-400 space-y-1 font-mono">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" /> Pack Date: {new Date().toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-500" /> Expiry: {new Date(Date.now() + 14 * 86400000).toLocaleDateString()}
                    </div>
                  </div>

                  <button
                    onClick={handleSimulateScan}
                    className="mt-3 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold font-mono flex items-center gap-2 border border-white/10 transition-colors"
                  >
                    <Scan className="w-3.5 h-3.5" /> Simulate Consumer Scan
                  </button>
                </div>
              </div>

              {/* Simulated Scan Log */}
              {scanSimulated && (
                <div className="bg-slate-900/60 border border-emerald-500/30 p-6 rounded-3xl animate-in slide-in-from-top-4 duration-300">
                  <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Consumer Traceability Verification Success
                  </h4>
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Status:</span>
                      <span className="text-emerald-400 font-bold">SAFE (Cold-Chain Verified)</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Recorded Scan Location:</span>
                      <span className="text-slate-200">Terminal 4 Distribution Depot (GPS Verified)</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Recyclability Protocol:</span>
                      <span className="text-blue-300">Clean film & place in Category 5 PP Bin</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[380px] bg-slate-900/30 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center p-8 text-center">
              <QrCode className="w-16 h-16 text-slate-600 mb-4 animate-pulse" />
              <h3 className="text-lg font-bold text-slate-300">No Traceability QR Active</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-2">
                Enter your batch ID and product details on the left to synthesize an authenticated food traceability QR matrix.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
