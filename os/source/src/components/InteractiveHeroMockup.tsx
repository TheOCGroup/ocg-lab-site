import React, { useState } from 'react';
import { calculateUnderwriting, formatCurrency, formatPercent } from '../utils/financial';
import { UnderwritingInputs } from '../types';
import { Calculator, ArrowUpRight, ShieldCheck, RefreshCw, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export const InteractiveHeroMockup: React.FC = () => {
  const [inputs, setInputs] = useState<UnderwritingInputs>({
    purchasePrice: 285000,
    rehabCost: 35000,
    monthlyRent: 2850,
    downPaymentPercent: 20,
    interestRate: 6.75,
    opExPercent: 35,
  });

  const results = calculateUnderwriting(inputs);

  const handleSliderChange = (key: keyof UnderwritingInputs, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full max-w-xl mx-auto glass-panel rounded-3xl p-6 shadow-2xl shadow-cyan-950/40 border border-slate-700/60 relative overflow-hidden group">
      
      {/* Top Ambient Glow */}
      <div className="absolute -top-20 -right-20 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-800/80 text-cyan-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-white text-base">Live Underwriting Engine</h3>
            <p className="text-xs text-slate-400">Deterministic Math • Sub-millisecond Execution</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-xs font-mono">
          <Zap className="w-3.5 h-3.5" />
          <span>REAL-TIME</span>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="space-y-4 mb-6">
        
        {/* Purchase Price Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">Purchase Price</span>
            <span className="font-mono text-cyan-400 font-bold">{formatCurrency(inputs.purchasePrice)}</span>
          </div>
          <input
            type="range"
            min="100000"
            max="1000000"
            step="5000"
            value={inputs.purchasePrice}
            onChange={(e) => handleSliderChange('purchasePrice', Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Estimated Rehab Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">Estimated Rehab Scope</span>
            <span className="font-mono text-emerald-400 font-bold">{formatCurrency(inputs.rehabCost)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="150000"
            step="2500"
            value={inputs.rehabCost}
            onChange={(e) => handleSliderChange('rehabCost', Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
        </div>

        {/* Monthly Gross Rent Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">Expected Monthly Rent</span>
            <span className="font-mono text-amber-400 font-bold">{formatCurrency(inputs.monthlyRent)}/mo</span>
          </div>
          <input
            type="range"
            min="1000"
            max="8000"
            step="100"
            value={inputs.monthlyRent}
            onChange={(e) => handleSliderChange('monthlyRent', Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
        </div>

      </div>

      {/* Real-time KPI Card Metrics */}
      <div className="grid grid-cols-3 gap-3 p-4 bg-slate-900/90 rounded-2xl border border-slate-800">
        
        {/* Cap Rate */}
        <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400 mb-1">Cap Rate</span>
          <motion.span 
            key={results.capRate}
            initial={{ scale: 1.1, color: '#06b6d4' }}
            animate={{ scale: 1, color: '#ffffff' }}
            className="font-mono text-lg font-bold"
          >
            {results.capRate.toFixed(2)}%
          </motion.span>
          <span className="text-[10px] text-cyan-400 mt-0.5">NOI Basis</span>
        </div>

        {/* Cash-on-Cash Return */}
        <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400 mb-1">Cash-on-Cash</span>
          <motion.span 
            key={results.cashOnCashReturn}
            initial={{ scale: 1.1, color: '#10b981' }}
            animate={{ scale: 1, color: '#ffffff' }}
            className="font-mono text-lg font-bold"
          >
            {results.cashOnCashReturn.toFixed(2)}%
          </motion.span>
          <span className="text-[10px] text-emerald-400 mt-0.5">Year 1 CoC</span>
        </div>

        {/* DSCR */}
        <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-[11px] font-medium text-slate-400 mb-1">DSCR Ratio</span>
          <motion.span 
            key={results.dscr}
            initial={{ scale: 1.1, color: '#f59e0b' }}
            animate={{ scale: 1, color: '#ffffff' }}
            className="font-mono text-lg font-bold"
          >
            {results.dscr.toFixed(2)}x
          </motion.span>
          <span className={`text-[10px] mt-0.5 ${results.dscr >= 1.25 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {results.dscr >= 1.25 ? 'Lender Ready' : 'Tight Coverage'}
          </span>
        </div>

      </div>

      {/* Detailed Net Cash Flow Banner */}
      <div className="mt-4 flex items-center justify-between p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800/60">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-slate-300 font-medium">Monthly Pre-Tax Cash Flow:</span>
        </div>
        <span className="font-mono font-extrabold text-sm text-cyan-300">
          {formatCurrency(results.annualPreTaxCashFlow / 12)}/mo
        </span>
      </div>

    </div>
  );
};
