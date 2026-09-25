import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, ShieldCheck, Info, Wind, Droplets, ArrowDown } from 'lucide-react';

export default function PackagingCrossSection({ layers: backendLayers, materialName, materialType, formatName, thicknessStr }) {
  const [activeLayerIndex, setActiveLayerIndex] = useState(null);

  // Use actual structure data from backend if provided, otherwise derive fallback based on material
  const getLayers = () => {
    if (backendLayers && Array.isArray(backendLayers) && backendLayers.length > 0) {
      return backendLayers;
    }

    const nameLower = (materialName || '').toLowerCase();
    const typeLower = (materialType || '').toLowerCase();

    if (nameLower.includes('foil') || nameLower.includes('alu')) {
      return [
        {
          layer_name: 'Outer Substrate & Print Layer',
          material: 'Biaxially Oriented PET (BOPET)',
          thickness: '12 µm',
          thickness_um: 12,
          role: 'Printability, mechanical rigidity & thermal stability during sealing.',
          barrier_function: 'Mechanical scuff resistance & dimensional stability.',
          source: 'ASTM D882 / Industry Converter Datasheet',
          test_information: 'ASTM D882 (Tensile Modulus > 210 MPa)',
          is_barrier: false
        },
        {
          layer_name: 'Hermetic Barrier Core',
          material: 'Aluminum Foil (Alu 99.5%)',
          thickness: '9 µm',
          thickness_um: 9,
          role: 'Absolute zero-transmission gas and light barrier.',
          barrier_function: 'Zero OTR and zero WVTR (<0.01) hermetic barrier.',
          source: 'ASTM D3985 / ASTM F1249',
          test_information: 'Coulometric & IR Sensor (<0.01 cc/m²/day)',
          is_barrier: true
        },
        {
          layer_name: 'Food-Contact Sealant Layer',
          material: 'Linear Low-Density Polyethylene (LLDPE)',
          thickness: '50 µm',
          thickness_um: 50,
          role: 'Hermetic heat seal & certified food contact safe.',
          barrier_function: 'Moisture seal integrity & grease resistance.',
          source: 'IS 9845 / ASTM F88',
          test_information: 'ASTM F88 Seal Strength (> 15 N/15mm)',
          is_barrier: false
        }
      ];
    }

    if (nameLower.includes('evoh') || nameLower.includes('meat') || nameLower.includes('vacuum') || nameLower.includes('vsp')) {
      return [
        {
          layer_name: 'Outer Puncture Shield',
          material: 'Oriented Polyamide (Nylon-6)',
          thickness: '15 µm',
          thickness_um: 15,
          role: 'Deep-draw vacuum stability & puncture defense.',
          barrier_function: 'Abrasion & pinhole resistance during logistics.',
          source: 'ASTM D1709 / Converter Datasheet',
          test_information: 'ASTM D1709 Dart Impact (> 650g)',
          is_barrier: false
        },
        {
          layer_name: 'Ultra-High Gas Barrier Core',
          material: 'Ethylene Vinyl Alcohol (EVOH 32 mol%)',
          thickness: '5 µm',
          thickness_um: 5,
          role: 'Blocks oxygen permeation to retard oxidation & discoloration.',
          barrier_function: 'Oxygen transmission rate OTR < 1.5 cc/m²/day.',
          source: 'ASTM D3985 / Kuraray EVAL Technical Spec',
          test_information: 'ASTM D3985 (23°C, 65% RH)',
          is_barrier: true
        },
        {
          layer_name: 'Metallocene Heat Sealant',
          material: 'm-LLDPE + Anti-Fog Co-ex',
          thickness: '50 µm',
          thickness_um: 50,
          role: 'Low seal initiation temperature (SIT) & direct food contact.',
          barrier_function: 'Hermetic seal through grease; FSSAI compliant.',
          source: 'IS 9845 / ASTM F88',
          test_information: 'ASTM F88 Seal Strength / IS 9845 Migration',
          is_barrier: false
        }
      ];
    }

    if (nameLower.includes('metal') || nameLower.includes('bopp') || nameLower.includes('snack') || nameLower.includes('chip')) {
      return [
        {
          layer_name: 'Gloss Print & Moisture Barrier Substrate',
          material: 'Metallized BOPP (Met-BOPP)',
          thickness: '20 µm',
          thickness_um: 20,
          role: 'UV light reflection, moisture barrier & high line machinability.',
          barrier_function: 'WVTR < 0.8 g/m²/day & optical density > 2.2.',
          source: 'ASTM F1249 / ISO 15106',
          test_information: 'ASTM F1249 (38°C, 90% RH)',
          is_barrier: true
        },
        {
          layer_name: 'Hermetic Heat-Seal Layer',
          material: 'Linear Low-Density Polyethylene (LLDPE)',
          thickness: '40 µm',
          thickness_um: 40,
          role: 'Cushion fin-seal & modified atmosphere gas retention.',
          barrier_function: 'Traps nitrogen headspace gas to prevent crisp texture loss.',
          source: 'ASTM F88 / IS 10146',
          test_information: 'ASTM F88 Seal Integrity (> 12 N/15mm)',
          is_barrier: false
        }
      ];
    }

    if (nameLower.includes('breathable') || nameLower.includes('produce') || nameLower.includes('micro-perf') || typeLower.includes('breathable')) {
      return [
        {
          layer_name: 'Laser-Microperforated Breathable Film',
          material: 'Micro-Perforated BOPP',
          thickness: '25 µm',
          thickness_um: 25,
          role: 'Equilibrium respiration gas flux for live produce.',
          barrier_function: 'Micro-apertures (50–80 µm) preventing anaerobic fermentation.',
          source: 'ISO 2556 / Postharvest Packaging Standards',
          test_information: 'Laser Densitometry (ASTM F3136)',
          is_barrier: false
        },
        {
          layer_name: 'Anti-Fog Food Contact Layer',
          material: 'Corona-Treated LLDPE with Surfactant',
          thickness: '15 µm',
          thickness_um: 15,
          role: 'Disperses moisture droplets into a continuous invisible sheet.',
          barrier_function: 'Prevents fungal condensation and mold proliferation.',
          source: 'ASTM D1746 / FSSAI Food Contact',
          test_information: 'ASTM D1746 Hot Box Anti-Fog Test',
          is_barrier: false
        }
      ];
    }

    if (nameLower.includes('pla') || nameLower.includes('bio') || typeLower.includes('biodegradable')) {
      return [
        {
          layer_name: 'Bio-Based Structural Substrate',
          material: 'Polylactic Acid (Corn-Derived PLA)',
          thickness: '20 µm',
          thickness_um: 20,
          role: 'Renewable plant-derived structural film with high aroma barrier.',
          barrier_function: 'Moderate oxygen barrier; industrially compostable.',
          source: 'ISO 17088 / EN 13432',
          test_information: 'Industrial Compostability (ISO 17088)',
          is_barrier: false
        },
        {
          layer_name: 'Compostable Heat-Seal Layer',
          material: 'PBAT + Starch Biocomposite',
          thickness: '30 µm',
          thickness_um: 30,
          role: 'Low-temperature compostable seal breakdown.',
          barrier_function: 'Hermetic seal that biodegrades in soil/compost in 180 days.',
          source: 'ASTM D6400',
          test_information: 'ASTM D6400 Biodegradation (> 90% in 180 days)',
          is_barrier: false
        }
      ];
    }

    // Monolayer fallback
    return [
      {
        layer_name: 'Monolayer Structural Film',
        material: materialName || 'Polyethylene Structural Film',
        thickness: thicknessStr || '25 µm',
        thickness_um: 25,
        role: 'Single-substrate containment and basic moisture resistance.',
        barrier_function: 'Baseline barrier derived from resin density.',
        source: 'Converter Technical Datasheet',
        test_information: 'ASTM D3985 / ASTM F1249',
        is_barrier: true
      }
    ];
  };

  const layers = getLayers();
  const hasLayers = layers && layers.length > 0;
  const activeLayer = activeLayerIndex !== null ? layers[activeLayerIndex] : null;

  // Layer visual gradients based on position and barrier role
  const getLayerColor = (layer, index, total) => {
    if (layer.is_barrier) {
      return 'from-amber-500/80 via-amber-400/80 to-yellow-600/80 border-amber-300 text-slate-950';
    }
    if (index === 0) {
      return 'from-sky-700/80 to-blue-800/80 border-sky-400 text-white';
    }
    if (index === total - 1) {
      return 'from-emerald-700/80 to-teal-800/80 border-emerald-400 text-white';
    }
    return 'from-slate-700/80 to-slate-800/80 border-slate-400 text-white';
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4 text-amber-400" />
            Packaging Film Morphology
          </div>
          <h3 className="text-lg font-bold text-white font-serif flex items-center gap-2">
            Multi-Layer Cross-Section Architecture
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Dynamic structural laminate profile for <strong className="text-slate-200">{materialName}</strong>
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-slate-400 block">Total Caliper</span>
          <span className="text-sm font-mono font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
            {thicknessStr || '50 - 75'} µm
          </span>
        </div>
      </div>

      {!hasLayers ? (
        <div className="p-8 text-center bg-slate-950/40 rounded-2xl border border-dashed border-white/10 text-slate-400 text-sm">
          Layer specification unavailable.
        </div>
      ) : (
        <>
          {/* A2. Illustrative Barrier Molecule Animation Bar */}
          <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-300 font-bold flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                Atmospheric Flux (O₂ & H₂O Barrier Mechanics)
              </span>
              <span className="text-[10px] text-amber-400/90 italic bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                Illustrative barrier visualization
              </span>
            </div>

            {/* Molecule Particle Track */}
            <div className="relative h-10 bg-slate-900/90 rounded-xl overflow-hidden border border-white/5 flex items-center px-4">
              {/* Outer Atmosphere side */}
              <div className="text-[10px] font-mono text-slate-400 shrink-0 mr-3 flex items-center gap-1">
                <span>Exterior</span>
                <ArrowDown className="w-3 h-3 text-sky-400 rotate-[-90deg]" />
              </div>

              {/* Animated Molecules Container (Respects reduced-motion) */}
              <div className="flex-1 relative h-full flex items-center overflow-hidden">
                {/* O2 Molecules (Blue) */}
                <div className="flex items-center gap-3 animate-[marquee_4s_linear_infinite] motion-reduce:animate-none">
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-mono bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded-full border border-sky-400/30 shadow-[0_0_8px_rgba(56,189,248,0.3)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span> O₂
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-mono bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded-full border border-blue-400/30">
                    <Droplets className="w-2.5 h-2.5 text-blue-400" /> H₂O
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-mono bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded-full border border-sky-400/30 shadow-[0_0_8px_rgba(56,189,248,0.3)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span> O₂
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-mono bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded-full border border-blue-400/30">
                    <Droplets className="w-2.5 h-2.5 text-blue-400" /> H₂O
                  </span>
                </div>

                {/* Barrier Wall Representation */}
                <div className="absolute right-12 top-0 bottom-0 w-3 bg-amber-400/80 border-x border-amber-300 flex items-center justify-center">
                  <span className="text-[7px] font-mono font-bold text-slate-950 uppercase rotate-90 tracking-tighter">
                    BARRIER
                  </span>
                </div>

                {/* Food Chamber side */}
                <div className="absolute right-0 pr-2 text-[9px] font-mono text-emerald-400 flex items-center gap-1 bg-slate-900/90 pl-2">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Protected Headspace
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Gas molecules are intercepted and blocked at the barrier core layer. Conceptual representation of permeation resistance, not a molecular dynamics simulation.
            </p>
          </div>

          {/* Cross-Section Stack */}
          <div className="space-y-2.5">
            <div className="flex justify-between text-[10px] font-mono text-slate-400 uppercase tracking-wider px-1">
              <span>Exterior Surface (Atmosphere Contact)</span>
              <span>Click or hover layer to inspect specifications</span>
            </div>

            {layers.map((layer, index) => {
              const isHovered = activeLayerIndex === index;
              const colorClass = getLayerColor(layer, index, layers.length);

              return (
                <motion.div
                  key={index}
                  onMouseEnter={() => setActiveLayerIndex(index)}
                  onMouseLeave={() => setActiveLayerIndex(null)}
                  onClick={() => setActiveLayerIndex(activeLayerIndex === index ? null : index)}
                  whileHover={{ scale: 1.01, x: 3 }}
                  transition={{ duration: 0.15 }}
                  className={`relative rounded-xl p-3.5 bg-gradient-to-r ${colorClass} border cursor-pointer shadow-md transition-all ${
                    isHovered ? 'ring-2 ring-amber-400 shadow-amber-400/30' : 'opacity-90 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-black/40 text-white text-[10px] font-mono flex items-center justify-center font-bold">
                        L{index + 1}
                      </span>
                      <span className="tracking-tight">{layer.layer_name || `Layer ${index + 1}`}</span>
                      {layer.is_barrier && (
                        <span className="text-[9px] font-mono bg-amber-400 text-slate-950 font-bold px-1.5 py-0.2 rounded uppercase">
                          Barrier Core
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono bg-black/30 px-2 py-0.5 rounded text-white font-normal">
                        {layer.material}
                      </span>
                      <span className="text-xs font-mono font-bold bg-white/20 px-2 py-0.5 rounded">
                        {layer.thickness || (layer.thickness_um ? `${layer.thickness_um} µm` : 'N/A')}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] mt-1 text-white/90 font-normal truncate">
                    {layer.role}
                  </p>
                </motion.div>
              );
            })}

            <div className="pt-2 border-t border-dashed border-white/20 flex items-center justify-between text-[11px] font-mono text-emerald-300">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Direct Food Contact Surface & Headspace ({formatName || 'Hermetic Pouch'})
              </span>
              <span className="text-slate-400">IS 9845 / FSSAI (Packaging) 2018</span>
            </div>
          </div>

          {/* Active Layer Inspector Card */}
          <AnimatePresence mode="wait">
            {activeLayer ? (
              <motion.div
                key={activeLayerIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="p-4 bg-slate-950/80 border border-amber-400/40 rounded-2xl text-xs space-y-2 shadow-lg"
              >
                <div className="flex items-center justify-between font-bold text-amber-300 border-b border-white/10 pb-2">
                  <span className="text-sm">{activeLayer.layer_name} — {activeLayer.material}</span>
                  <span className="font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                    {activeLayer.thickness || `${activeLayer.thickness_um} µm`}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-300">
                  <div>
                    <strong className="text-slate-400 block text-[10px] uppercase">Primary Role</strong>
                    <p className="text-slate-200">{activeLayer.role}</p>
                  </div>
                  <div>
                    <strong className="text-slate-400 block text-[10px] uppercase">Barrier Functionality</strong>
                    <p className="text-slate-200">{activeLayer.barrier_function || 'Structural layer support'}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between text-[10px] font-mono text-slate-400 gap-2">
                  <div className="flex items-center gap-1">
                    <Info className="w-3 h-3 text-amber-400" />
                    Source: <span className="text-amber-300">{activeLayer.source || 'Converter Specification'}</span>
                  </div>
                  {activeLayer.test_information && (
                    <div className="bg-slate-900 px-2 py-0.5 rounded border border-white/10 text-slate-300">
                      Standard: {activeLayer.test_information}
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="p-3 bg-slate-950/40 border border-white/5 rounded-2xl text-[11px] text-slate-400 text-center font-mono">
                Hover or tap any laminate layer above to inspect thickness, polymer chemistry, barrier function, and test standards.
              </div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
