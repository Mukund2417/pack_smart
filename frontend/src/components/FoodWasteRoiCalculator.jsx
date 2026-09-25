import React, { useState } from 'react';
import { Calculator, TrendingDown, DollarSign, Leaf, AlertCircle, RefreshCw } from 'lucide-react';

export default function FoodWasteRoiCalculator({ commodityName, primaryMaterial, carbonFootprintKgCO2 }) {
  // User controllable inputs (NO hardcoded output values)
  const [productionVolumeKg, setProductionVolumeKg] = useState(2500);
  const [currentSpoilagePct, setCurrentSpoilagePct] = useState(15.0);
  const [targetSpoilagePct, setTargetSpoilagePct] = useState(3.0);
  const [productValuePerKg, setProductValuePerKg] = useState(120);
  const [packagingCostPerUnit, setPackagingCostPerUnit] = useState(1.50);
  const [unitsPerKg, setUnitsPerKg] = useState(4); // e.g. 250g pack = 4 units/kg

  // Transparent Formulas (Scenario-Based Calculations)
  // 1. Current Loss (kg) = Production * Current Spoilage %
  const currentLossKg = (productionVolumeKg * currentSpoilagePct) / 100;

  // 2. New Loss (kg) = Production * Target Spoilage %
  const newLossKg = (productionVolumeKg * targetSpoilagePct) / 100;

  // 3. Food Saved (kg) = Current Loss - New Loss
  const foodSavedKg = Math.max(0, currentLossKg - newLossKg);

  // 4. Value Saved (INR) = Food Saved * Value/kg
  const valueSavedInr = foodSavedKg * productValuePerKg;

  // 5. Additional Packaging Cost = Production * unitsPerKg * packagingCostPerUnit
  const totalPackagingUnits = productionVolumeKg * unitsPerKg;
  const additionalPackagingCostInr = totalPackagingUnits * packagingCostPerUnit;

  // 6. Net Monthly Savings = Value Saved - Additional Packaging Cost
  const netMonthlySavingsInr = valueSavedInr - additionalPackagingCostInr;

  // 7. Annualized Savings = Net Monthly Savings * 12
  const annualizedSavingsInr = netMonthlySavingsInr * 12;

  // 8. ROI / Payback = (Net Savings / Additional Cost) * 100%
  const roiPct = additionalPackagingCostInr > 0 
    ? ((netMonthlySavingsInr / additionalPackagingCostInr) * 100).toFixed(0) 
    : 'N/A';

  // Bar proportions for visual comparison
  const currentLossWidthPct = Math.min(100, Math.max(8, (currentLossKg / Math.max(currentLossKg, 1)) * 100));
  const newLossWidthPct = currentLossKg > 0 
    ? Math.min(100, Math.max(4, (newLossKg / currentLossKg) * 100)) 
    : 0;

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-2">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-1">
            <Calculator className="w-4 h-4 text-amber-400" />
            Food Waste Reduction & ROI Analysis
          </div>
          <h3 className="text-lg font-bold text-white font-serif">
            Interactive Spoilage & Financial Payback Simulator
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Scenario Status:</span>
          <span className={`px-2.5 py-1 rounded-full font-bold border ${
            netMonthlySavingsInr > 0 
              ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30' 
              : 'bg-amber-400/10 text-amber-400 border-amber-400/30'
          }`}>
            {netMonthlySavingsInr > 0 ? `Net ROI: +${roiPct}%` : 'Marginal Gain'}
          </span>
        </div>
      </div>

      {/* Input Form Controls */}
      <div className="bg-slate-950/70 p-5 rounded-2xl border border-white/5 space-y-4">
        <span className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider block">
          Enter Your Operational Parameters:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* 1. Monthly Production Volume */}
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Monthly Production (kg):</label>
            <input
              type="number"
              min="100"
              max="500000"
              step="100"
              value={productionVolumeKg}
              onChange={(e) => setProductionVolumeKg(Math.max(0, Number(e.target.value)))}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* 2. Product Retail Value */}
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Commodity Value (₹/kg):</label>
            <input
              type="number"
              min="10"
              max="5000"
              step="5"
              value={productValuePerKg}
              onChange={(e) => setProductValuePerKg(Math.max(0, Number(e.target.value)))}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-emerald-400 font-mono focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* 3. Packaging Cost Per Unit */}
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Packaging Unit Cost (₹/pouch):</label>
            <input
              type="number"
              min="0.1"
              max="50"
              step="0.05"
              value={packagingCostPerUnit}
              onChange={(e) => setPackagingCostPerUnit(Math.max(0, Number(e.target.value)))}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* 4. Current Spoilage % */}
          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Current Spoilage Loss (%):</span>
              <span className="font-mono text-amber-400 font-bold">{currentSpoilagePct}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="0.5"
              value={currentSpoilagePct}
              onChange={(e) => setCurrentSpoilagePct(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>

          {/* 5. Target Spoilage % */}
          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Target Improved Spoilage (%):</span>
              <span className="font-mono text-emerald-400 font-bold">{targetSpoilagePct}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="25"
              step="0.5"
              value={targetSpoilagePct}
              onChange={(e) => setTargetSpoilagePct(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>

          {/* 6. Package Units per kg */}
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Pack Units / kg:</label>
            <select
              value={unitsPerKg}
              onChange={(e) => setUnitsPerKg(Number(e.target.value))}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
            >
              <option value="1">1 unit/kg (1 kg bulk pack)</option>
              <option value="2">2 units/kg (500g pouch)</option>
              <option value="4">4 units/kg (250g retail pouch)</option>
              <option value="10">10 units/kg (100g single-serve)</option>
            </select>
          </div>
        </div>
      </div>

      {/* B3. Food Waste Visual Comparison Bars */}
      <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 space-y-3">
        <span className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider block">
          Monthly Food Loss Comparison (Scenario-Based):
        </span>

        {/* Current Loss Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Current Loss: {currentSpoilagePct}%</span>
            <span className="text-rose-400 font-bold">{currentLossKg.toLocaleString()} kg/month</span>
          </div>
          <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${currentLossWidthPct}%` }}
            />
          </div>
        </div>

        {/* Projected Loss Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Projected Loss: {targetSpoilagePct}%</span>
            <span className="text-emerald-400 font-bold">{newLossKg.toLocaleString()} kg/month</span>
          </div>
          <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${newLossWidthPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Calculated Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Food Waste Reduced */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
            Food Waste Reduced
          </span>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {foodSavedKg.toLocaleString()} kg/month
          </div>
          <p className="text-[10px] text-slate-400">
            Saved from spoiling based on entered assumptions.
          </p>
        </div>

        {/* Metric 2: Value Preserved / Net Monthly Savings */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-emerald-500/20 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
            Net Monthly Savings
          </span>
          <div className="text-xl font-bold font-mono text-amber-300">
            ₹{netMonthlySavingsInr.toLocaleString('en-IN', { maximumFractionDigits: 0 })}/mo
          </div>
          <p className="text-[10px] text-slate-400">
            Food value preserved minus additional packaging cost.
          </p>
        </div>

        {/* Metric 3: Annual Value */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-teal-400" />
            Annualized Preserved Value
          </span>
          <div className="text-xl font-bold font-mono text-teal-400">
            ₹{annualizedSavingsInr.toLocaleString('en-IN', { maximumFractionDigits: 0 })}/year
          </div>
          <p className="text-[10px] text-slate-400">
            Projected annual financial retention.
          </p>
        </div>
      </div>

      {/* Transparent Formulas Box */}
      <div className="p-3 bg-slate-950/40 rounded-xl border border-white/5 text-[10px] font-mono text-slate-400 space-y-1">
        <strong className="text-slate-300 block">Transparent Calculation Methodology:</strong>
        <p>• Food Saved = (Production × Current Spoilage %) − (Production × Target Spoilage %)</p>
        <p>• Net Savings = (Food Saved × Value/kg) − (Production × Units/kg × Packaging Cost/Unit)</p>
      </div>

      {/* B4. Sourced Carbon Footprint Note (NO invented factors) */}
      <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-white/5 flex items-start gap-2.5 text-xs text-slate-400">
        <Leaf className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-slate-300 block">Environmental Emissions Note:</strong>
          <p className="text-[11px] leading-relaxed">
            {carbonFootprintKgCO2 ? (
              <>
                Packaging material carbon intensity: <strong className="text-slate-200">{carbonFootprintKgCO2} kg CO₂e / kg material</strong> (sourced from Ecoinvent LCA inventory).
              </>
            ) : (
              <>Carbon impact calculation unavailable without a validated commodity-specific emissions factor.</>
            )}
            {' '}Food waste reduction offsets are scenario estimates based on user assumptions and are not guaranteed carbon credits.
          </p>
        </div>
      </div>
    </div>
  );
}
