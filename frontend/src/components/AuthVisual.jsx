import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Cpu, 
  ShieldCheck, 
  Leaf, 
  Sparkles, 
  Layers, 
  Activity, 
  Wind,
  Droplets,
  Database
} from 'lucide-react';

export default function AuthVisual() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const floatingBadges = [
    { label: "SMART PACKAGING", icon: Package, color: "text-amber-400 border-amber-400/30 bg-amber-400/10", x: -80, y: -140, delay: 0 },
    { label: "FOOD DATA", icon: Database, color: "text-blue-400 border-blue-400/30 bg-blue-400/10", x: 90, y: -110, delay: 0.2 },
    { label: "AI ENGINE", icon: Cpu, color: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10", x: -100, y: 30, delay: 0.4 },
    { label: "OTR / WVTR", icon: Wind, color: "text-purple-400 border-purple-400/30 bg-purple-400/10", x: 100, y: 50, delay: 0.6 },
    { label: "SHELF LIFE", icon: Activity, color: "text-teal-400 border-teal-400/30 bg-teal-400/10", x: -20, y: 150, delay: 0.8 },
  ];

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="relative w-full h-full min-h-[420px] lg:min-h-[640px] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 rounded-3xl p-8 overflow-hidden flex flex-col justify-between border border-white/10 shadow-2xl select-none"
    >
      {/* Background Ambient Glow & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.15),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Top Header info */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-brand-green/20 border border-brand-green/40 flex items-center justify-center">
            <Package className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="font-extrabold tracking-wider text-sm text-white font-mono">
            PACK<span className="text-amber-400">SMART</span>
          </span>
        </div>
        <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase bg-slate-900/80 px-2.5 py-1 rounded-full border border-white/5">
          v2.4 &bull; SCIENTIFIC CORE
        </span>
      </div>

      {/* Center Interactive Visual Node */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto py-12">
        <motion.div 
          animate={{
            x: mousePos.x * 24,
            y: mousePos.y * 24
          }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
          className="relative flex items-center justify-center"
        >
          {/* Outer Pulsing Rings */}
          <div className="absolute w-56 h-56 rounded-full border border-amber-400/20 animate-ping opacity-30 pointer-events-none" />
          <div className="absolute w-72 h-72 rounded-full border border-emerald-500/10 animate-pulse pointer-events-none" />

          {/* Central Shield / Tech Box */}
          <div className="relative w-36 h-36 rounded-3xl bg-slate-900/90 border border-amber-400/40 shadow-[0_0_50px_rgba(245,158,11,0.25)] backdrop-blur-xl flex flex-col items-center justify-center p-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-400 flex items-center justify-center shadow-lg mb-2">
              <Layers className="w-7 h-7 text-slate-950" />
            </div>
            <span className="text-[11px] font-mono font-bold tracking-wider text-amber-300">
              BIO-BARRIER
            </span>
            <span className="text-[9px] font-mono text-slate-400">
              OPTIMIZED
            </span>
          </div>

          {/* Floating Decorative Badges with Parallax */}
          {floatingBadges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.label}
                animate={{
                  x: badge.x + mousePos.x * (15 + idx * 5),
                  y: badge.y + mousePos.y * (15 + idx * 5),
                }}
                transition={{ type: "spring", damping: 25, stiffness: 90 }}
                className={`absolute px-3 py-1.5 rounded-xl border text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-xl backdrop-blur-md whitespace-nowrap ${badge.color}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{badge.label}</span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Real-time Simulated Telemetry Bar */}
        <div className="mt-14 w-full max-w-xs bg-slate-950/70 border border-white/10 rounded-2xl p-3 backdrop-blur-md">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1.5">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Multi-Criteria Barrier Top-Score
            </span>
            <span className="text-emerald-400 font-bold">98.4% MATCH</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="w-[98.4%] h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full" />
          </div>
        </div>
      </div>

      {/* Bottom Footer Quote */}
      <div className="relative z-10 border-t border-white/5 pt-4 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <Leaf className="w-3.5 h-3.5 text-emerald-400" />
          Sustainable Packaging Science
        </span>
        <span className="font-mono text-[10px] text-slate-500">
          ISO 15105 &bull; ASTM F1249
        </span>
      </div>
    </div>
  );
}
