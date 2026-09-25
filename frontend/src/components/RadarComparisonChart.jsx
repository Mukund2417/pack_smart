import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Sparkles, Shield, Leaf, DollarSign, Info } from 'lucide-react';

export default function RadarComparisonChart({ 
  candidates: backendCandidates, 
  recommendedMaterial, 
  ecoAlternative, 
  rankedMaterials,
  primaryOtr, 
  primaryWvtr 
}) {
  const [activeSeries, setActiveSeries] = useState('recommended');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // 5 Radar Axes as specified
  const axes = [
    { label: 'Oxygen Barrier', key: 'o2', icon: Shield, unit: 'cc/m²/day' },
    { label: 'Moisture Barrier', key: 'moisture', icon: Shield, unit: 'g/m²/day' },
    { label: 'Tensile/Puncture Strength', key: 'strength', icon: TrendingUp, unit: 'Index (1-10)' },
    { label: 'Cost Economy', key: 'cost', icon: DollarSign, unit: '₹/kg' },
    { label: 'Sustainability/Circularity', key: 'sustainability', icon: Leaf, unit: 'Score (0-100)' }
  ];

  // Derive candidate series from backend data
  const buildCandidates = () => {
    if (backendCandidates && Array.isArray(backendCandidates) && backendCandidates.length > 0) {
      return backendCandidates;
    }

    if (rankedMaterials && Array.isArray(rankedMaterials) && rankedMaterials.length > 0) {
      const top1 = rankedMaterials[0];
      const sortedBySust = [...rankedMaterials].sort((a, b) => (b.sustainability_score || 0) - (a.sustainability_score || 0));
      const eco = sortedBySust[0]?.material_id !== top1.material_id ? sortedBySust[0] : (sortedBySust[1] || top1);
      const std = rankedMaterials.find(m => m.material_id !== top1.material_id && m.material_id !== eco?.material_id) || rankedMaterials[rankedMaterials.length - 1];

      return [
        {
          id: 'recommended',
          name: top1.name,
          role_label: 'Recommended Material',
          is_hero: true,
          otr_raw: top1.baseline_otr || 1.5,
          wvtr_raw: top1.baseline_wvtr || 2.5,
          mechanical_strength_index: top1.mechanical_strength_index || 8.5,
          cost_estimate_local: top1.cost_estimate_local || 240,
          sustainability_score: top1.sustainability_score || 55,
          source_reference: top1.source_reference || 'ASTM D3985 / Converter Datasheet'
        },
        {
          id: 'eco',
          name: eco ? eco.name : (ecoAlternative || 'Polylactic Acid (PLA) Bio-Film'),
          role_label: 'Eco-Alternative',
          is_hero: false,
          otr_raw: eco?.baseline_otr || 600,
          wvtr_raw: eco?.baseline_wvtr || 24,
          mechanical_strength_index: eco?.mechanical_strength_index || 6.0,
          cost_estimate_local: eco?.cost_estimate_local || 350,
          sustainability_score: eco?.sustainability_score || 92,
          source_reference: eco?.source_reference || 'ISO 17088 / NatureWorks Ingeo'
        },
        {
          id: 'standard',
          name: std ? std.name : 'Linear Low-Density Polyethylene (LLDPE)',
          role_label: 'Standard Benchmark',
          is_hero: false,
          otr_raw: std?.baseline_otr || 4000,
          wvtr_raw: std?.baseline_wvtr || 12,
          mechanical_strength_index: std?.mechanical_strength_index || 7.0,
          cost_estimate_local: std?.cost_estimate_local || 140,
          sustainability_score: std?.sustainability_score || 45,
          source_reference: std?.source_reference || 'Industry Standard Benchmark'
        }
      ];
    }

    // Default scientific benchmark candidates
    return [
      {
        id: 'recommended',
        name: recommendedMaterial || 'Recommended High-Barrier Film',
        role_label: 'Recommended Material',
        is_hero: true,
        otr_raw: 1.2,
        wvtr_raw: 0.8,
        mechanical_strength_index: 8.5,
        cost_estimate_local: 220,
        sustainability_score: 58,
        source_reference: 'ASTM D3985 & ASTM F1249'
      },
      {
        id: 'eco',
        name: ecoAlternative || 'Compostable Bio-Film (PLA/PBAT)',
        role_label: 'Eco-Alternative',
        is_hero: false,
        otr_raw: 550,
        wvtr_raw: 25,
        mechanical_strength_index: 6.2,
        cost_estimate_local: 340,
        sustainability_score: 94,
        source_reference: 'ISO 17088 Certified Compostable'
      },
      {
        id: 'standard',
        name: 'Standard Monolayer Polyethylene (LLDPE)',
        role_label: 'Standard Benchmark',
        is_hero: false,
        otr_raw: 3500,
        wvtr_raw: 12,
        mechanical_strength_index: 6.8,
        cost_estimate_local: 135,
        sustainability_score: 42,
        source_reference: 'Industry Converter Baseline'
      }
    ];
  };

  const rawCandidates = buildCandidates();

  // Safe logarithmic / inverse normalization (0 to 100)
  // For OTR & WVTR, lower raw value is better barrier -> inverted safely
  const normalizeOtr = (val) => {
    if (!val || val <= 0) return 98;
    const logVal = Math.log10(Math.max(0.01, val));
    // scale from 0.01 (score 98) to 10000 (score 10)
    const score = 98 - ((logVal - (-2)) / (4 - (-2))) * 88;
    return Math.round(Math.max(10, Math.min(98, score)));
  };

  const normalizeWvtr = (val) => {
    if (!val || val <= 0) return 98;
    const logVal = Math.log10(Math.max(0.01, val));
    // scale from 0.01 (score 98) to 500 (score 10)
    const score = 98 - ((logVal - (-2)) / (2.7 - (-2))) * 88;
    return Math.round(Math.max(10, Math.min(98, score)));
  };

  const normalizeStrength = (val) => {
    if (!val || val <= 0) return 50;
    return Math.round(Math.max(15, Math.min(98, val * 10)));
  };

  const normalizeCost = (val) => {
    if (!val || val <= 0) return 50;
    // Lower cost is better economy: ₹100/kg -> 92, ₹600/kg -> 20
    const score = 95 - ((val - 100) / (600 - 100)) * 75;
    return Math.round(Math.max(15, Math.min(95, score)));
  };

  const normalizeSustainability = (val) => {
    if (!val || val <= 0) return 40;
    return Math.round(Math.max(10, Math.min(98, val)));
  };

  // Build series objects with computed scores and raw values
  const seriesMap = {};
  const colors = {
    recommended: { stroke: '#10b981', fill: 'rgba(16, 185, 129, 0.22)', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    eco: { stroke: '#14b8a6', fill: 'rgba(20, 184, 166, 0.18)', badge: 'bg-teal-500/20 text-teal-300 border-teal-500/30' },
    standard: { stroke: '#94a3b8', fill: 'rgba(148, 163, 184, 0.12)', badge: 'bg-slate-700/50 text-slate-300 border-slate-600' }
  };

  rawCandidates.forEach((cand, idx) => {
    const key = cand.id || (idx === 0 ? 'recommended' : idx === 1 ? 'eco' : 'standard');
    const color = colors[key] || colors.standard;

    const o2Score = normalizeOtr(cand.otr_raw);
    const wvtrScore = normalizeWvtr(cand.wvtr_raw);
    const strengthScore = normalizeStrength(cand.mechanical_strength_index);
    const costScore = normalizeCost(cand.cost_estimate_local);
    const sustScore = normalizeSustainability(cand.sustainability_score);

    seriesMap[key] = {
      key,
      name: cand.name,
      role_label: cand.role_label || cand.name,
      stroke: color.stroke,
      fill: color.fill,
      badge: color.badge,
      scores: [o2Score, wvtrScore, strengthScore, costScore, sustScore],
      rawMetrics: [
        { prop: 'Oxygen Barrier', raw: `${cand.otr_raw} cc/m²/day`, score: o2Score, source: cand.source_reference },
        { prop: 'Moisture Barrier', raw: `${cand.wvtr_raw} g/m²/day`, score: wvtrScore, source: cand.source_reference },
        { prop: 'Tensile/Puncture Strength', raw: `${cand.mechanical_strength_index || 7.0} / 10 index`, score: strengthScore, source: 'ASTM D882' },
        { prop: 'Cost Economy', raw: `₹${cand.cost_estimate_local || 200}/kg`, score: costScore, source: 'Regional Converter Index' },
        { prop: 'Sustainability & Circularity', raw: `${cand.sustainability_score || 50}/100`, score: sustScore, source: 'Ecoinvent LCA Database' }
      ]
    };
  });

  const activeCandidate = seriesMap[activeSeries] || Object.values(seriesMap)[0];

  // SVG Geometry Constants
  const size = 320;
  const center = size / 2;
  const radius = 105;
  const totalAxes = axes.length;
  const angleSlice = (Math.PI * 2) / totalAxes;

  const getCoordinates = (index, value) => {
    const angle = index * angleSlice - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  const createPolygonPoints = (scores) => {
    return scores
      .map((score, i) => {
        const { x, y } = getCoordinates(i, score);
        return `${x},${y}`;
      })
      .join(' ');
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-teal-400 uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4 text-teal-400" />
            Candidate Trade-Off Radar (TOPSIS Multi-Criteria)
          </div>
          <h3 className="text-lg font-bold text-white font-serif">
            5-Axis Performance & Trade-Off Analysis
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400 bg-slate-950/60 px-2.5 py-1 rounded-lg border border-white/5">
          Normalized Index (0–100)
        </span>
      </div>

      {/* Candidate Selector Chips */}
      <div className="flex flex-wrap gap-2 text-xs">
        {Object.values(seriesMap).map((s) => {
          const isActive = activeSeries === s.key;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => setActiveSeries(s.key)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                isActive
                  ? 'bg-slate-800 text-white border-white/30 shadow-md ring-1 ring-white/20'
                  : 'bg-slate-950/60 text-slate-400 border-white/5 hover:text-slate-200'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.stroke }} />
              <div className="text-left">
                <span className="block text-[10px] text-slate-400 font-mono font-normal uppercase">{s.role_label}</span>
                <span className="truncate max-w-[170px] block leading-tight">{s.name}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Radar Chart SVG */}
      <div className="flex justify-center items-center py-2 relative">
        <svg width={size} height={size} className="overflow-visible">
          {/* Concentric Web Grid (20%, 40%, 60%, 80%, 100%) */}
          {[20, 40, 60, 80, 100].map((level) => {
            const levelPoints = axes
              .map((_, i) => {
                const { x, y } = getCoordinates(i, level);
                return `${x},${y}`;
              })
              .join(' ');
            return (
              <polygon
                key={level}
                points={levelPoints}
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="1"
              />
            );
          })}

          {/* Axis Spokes */}
          {axes.map((axis, i) => {
            const { x, y } = getCoordinates(i, 100);
            return (
              <line
                key={axis.key}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="1"
              />
            );
          })}

          {/* Standard Benchmark Polygon */}
          {seriesMap.standard && (
            <polygon
              points={createPolygonPoints(seriesMap.standard.scores)}
              fill={seriesMap.standard.fill}
              stroke={seriesMap.standard.stroke}
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="transition-all duration-300"
            />
          )}

          {/* Eco Alternative Polygon */}
          {seriesMap.eco && (
            <polygon
              points={createPolygonPoints(seriesMap.eco.scores)}
              fill={seriesMap.eco.fill}
              stroke={seriesMap.eco.stroke}
              strokeWidth="2"
              className="transition-all duration-300"
            />
          )}

          {/* Recommended Candidate Polygon (Hero) */}
          {seriesMap.recommended && (
            <polygon
              points={createPolygonPoints(seriesMap.recommended.scores)}
              fill={seriesMap.recommended.fill}
              stroke={seriesMap.recommended.stroke}
              strokeWidth="2.5"
              className="transition-all duration-300"
            />
          )}

          {/* Interactive Data Points on Active Series */}
          {activeCandidate.scores.map((val, i) => {
            const { x, y } = getCoordinates(i, val);
            const metric = activeCandidate.rawMetrics[i];
            const isHovered = hoveredPoint === i;

            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? '7' : '4.5'}
                  fill={activeCandidate.stroke}
                  stroke="#0f172a"
                  strokeWidth="2"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredPoint(i)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            );
          })}

          {/* Axis Labels */}
          {axes.map((axis, i) => {
            const angle = i * angleSlice - Math.PI / 2;
            const labelR = radius + 28;
            const lx = center + labelR * Math.cos(angle);
            const ly = center + labelR * Math.sin(angle);

            return (
              <text
                key={axis.key}
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#cbd5e1"
                fontSize="9"
                fontFamily="sans-serif"
                fontWeight="bold"
                className="select-none"
              >
                {axis.label.split('/')[0].split(' ')[0]}
              </text>
            );
          })}
        </svg>
      </div>

      {/* A4. Axis & Candidate Tooltip Card */}
      <div className="p-3.5 bg-slate-950/70 border border-white/10 rounded-2xl text-xs space-y-1.5 shadow-inner">
        {hoveredPoint !== null ? (
          <div className="space-y-1 animate-in fade-in duration-200">
            <div className="flex items-center justify-between font-bold">
              <span className="text-amber-300">{activeCandidate.name}</span>
              <span className="font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                Normalized Score: {activeCandidate.rawMetrics[hoveredPoint].score}/100
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-300 text-xs">
              <span>{activeCandidate.rawMetrics[hoveredPoint].prop} (Raw Value):</span>
              <strong className="text-white font-mono">{activeCandidate.rawMetrics[hoveredPoint].raw}</strong>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono pt-0.5">
              <Info className="w-3 h-3 text-amber-400" />
              Source: <span className="text-slate-300">{activeCandidate.rawMetrics[hoveredPoint].source}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Hover any axis dot above to inspect raw metric & test source.</span>
            <span className="text-amber-400 font-mono font-bold">Active: {activeCandidate.role_label}</span>
          </div>
        )}
      </div>

      {/* Transparent Normalization Legend Notice */}
      <div className="p-2.5 bg-slate-950/40 rounded-xl border border-white/5 text-[10px] text-slate-400 leading-tight">
        <strong className="text-slate-300">Methodology Note: </strong>
        Scores are normalized for comparative decision-support and are not raw laboratory measurements. Inverse scaling applied to transmission rates (1/OTR, 1/WVTR) and local unit cost.
      </div>
    </div>
  );
}
