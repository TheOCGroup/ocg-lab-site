import React, { useState } from 'react';
import { calculateUnderwriting, formatCurrency, formatPercent } from '../utils/financial';
import { UnderwritingInputs } from '../types';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Building, 
  Copy, 
  CheckCircle2, 
  BarChart3, 
  ShieldCheck, 
  Info,
  Sliders,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export const InteractiveDealAnalyzerDemo: React.FC = () => {
  const [inputs, setInputs] = useState<UnderwritingInputs>({
    purchasePrice: 320000,
    rehabCost: 45000,
    monthlyRent: 3100,
    downPaymentPercent: 25,
    interestRate: 6.5,
    opExPercent: 35,
  });

  const [copied, setCopied] = useState(false);

  const outputs = calculateUnderwriting(inputs);

  const handleInputChange = (key: keyof UnderwritingInputs, value: number) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const handleCopyDealSummary = () => {
    const summaryText = `OCG LAB DEAL UNDERWRITING BRIEF
----------------------------------------
Purchase Price: ${formatCurrency(inputs.purchasePrice)}
Estimated Rehab: ${formatCurrency(inputs.rehabCost)}
Total Initial Investment: ${formatCurrency(outputs.totalInvestment)}
Expected Monthly Rent: ${formatCurrency(inputs.monthlyRent)}/mo
Net Operating Income (NOI): ${formatCurrency(outputs.netOperatingIncome)}/yr
Monthly Debt Service: ${formatCurrency(outputs.monthlyDebtService)}/mo
Annual Pre-Tax Cash Flow: ${formatCurrency(outputs.annualPreTaxCashFlow)}/yr
----------------------------------------
Cap Rate: ${outputs.capRate.toFixed(2)}%
Cash-on-Cash Return: ${outputs.cashOnCashReturn.toFixed(2)}%
DSCR: ${outputs.dscr.toFixed(2)}x
10-Year Cumulative Cash Flow: ${formatCurrency(outputs.multiYearProjections[9].cumulativeCashFlow)}
----------------------------------------
Generated via The OCG Lab Deal Analyzer Engine`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    toast.success('Underwriting summary copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const loadPresetScenario = (type: 'sfr' | 'multifamily' | 'commercial') => {
    if (type === 'sfr') {
      setInputs({
        purchasePrice: 245000,
        rehabCost: 28000,
        monthlyRent: 2400,
        downPaymentPercent: 20,
        interestRate: 6.75,
        opExPercent: 35
      });
      toast.info('Loaded Preset: Single Family Turnkey');
    } else if (type === 'multifamily') {
      setInputs({
        purchasePrice: 650000,
        rehabCost: 85000,
        monthlyRent: 7200,
        downPaymentPercent: 25,
        interestRate: 6.25,
        opExPercent: 40
      });
      toast.info('Loaded Preset: 6-Unit Multifamily Value-Add');
    } else {
      setInputs({
        purchasePrice: 1200000,
        rehabCost: 120000,
        monthlyRent: 13500,
        downPaymentPercent: 30,
        interestRate: 6.0,
        opExPercent: 30
      });
      toast.info('Loaded Preset: Commercial Retail Center');
    }
  };

  const chartData = outputs.multiYearProjections.map(proj => ({
    year: `Year ${proj.year}`,
    NOI: proj.noi,
    'Cumulative Cash Flow': proj.cumulativeCashFlow,
  }));

  return (
    <div className="w-full glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-8">
      
      {/* Header & Presets */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
              <Calculator className="w-5 h-5" />
            </span>
            <h2 className="font-heading font-bold text-2xl text-white">Interactive Deal Analyzer Engine</h2>
          </div>
          <p className="text-slate-400 text-sm">
            Adjust inputs below for instant 100% math-deterministic commercial & residential underwriting.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5" />
            Presets:
          </span>
          <button
            onClick={() => loadPresetScenario('sfr')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-all"
          >
            SFR Turnkey
          </button>
          <button
            onClick={() => loadPresetScenario('multifamily')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-all"
          >
            Multifamily
          </button>
          <button
            onClick={() => loadPresetScenario('commercial')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-all"
          >
            Commercial
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs vs Summary KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Input Sliders (7 Cols) */}
        <div className="lg:col-span-7 space-y-5 bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80">
          <h3 className="font-heading font-bold text-slate-200 text-base flex items-center justify-between">
            <span>Underwriting Inputs</span>
            <span className="text-xs font-mono text-cyan-400">TypeScript Engine v2.4</span>
          </h3>

          {/* Slider 1: Purchase Price */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">Purchase Price</span>
              <span className="font-mono text-cyan-400 font-bold text-sm">{formatCurrency(inputs.purchasePrice)}</span>
            </div>
            <input
              type="range"
              min="50000"
              max="2000000"
              step="5000"
              value={inputs.purchasePrice}
              onChange={(e) => handleInputChange('purchasePrice', Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Slider 2: Rehab Cost */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">Estimated Rehab Scope</span>
              <span className="font-mono text-emerald-400 font-bold text-sm">{formatCurrency(inputs.rehabCost)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="250000"
              step="2500"
              value={inputs.rehabCost}
              onChange={(e) => handleInputChange('rehabCost', Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
          </div>

          {/* Slider 3: Monthly Rent */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">Gross Monthly Rent</span>
              <span className="font-mono text-amber-400 font-bold text-sm">{formatCurrency(inputs.monthlyRent)}/mo</span>
            </div>
            <input
              type="range"
              min="800"
              max="15000"
              step="100"
              value={inputs.monthlyRent}
              onChange={(e) => handleInputChange('monthlyRent', Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          {/* Dual Sliders: Down Payment & Interest Rate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Down Payment %</span>
                <span className="font-mono text-white font-bold">{inputs.downPaymentPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={inputs.downPaymentPercent}
                onChange={(e) => handleInputChange('downPaymentPercent', Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-300"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">Interest Rate %</span>
                <span className="font-mono text-white font-bold">{inputs.interestRate}%</span>
              </div>
              <input
                type="range"
                min="3.0"
                max="12.0"
                step="0.25"
                value={inputs.interestRate}
                onChange={(e) => handleInputChange('interestRate', Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-300"
              />
            </div>
          </div>

          {/* OpEx Slider */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">Operating Expense Reserve</span>
              <span className="font-mono text-slate-400 font-bold">{inputs.opExPercent}% of Rent</span>
            </div>
            <input
              type="range"
              min="15"
              max="50"
              step="1"
              value={inputs.opExPercent}
              onChange={(e) => handleInputChange('opExPercent', Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-400"
            />
          </div>

        </div>

        {/* Right KPI Summary & Outputs (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <div className="grid grid-cols-2 gap-3">
            
            {/* Cap Rate */}
            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-col">
              <span className="text-xs text-slate-400 font-medium">Cap Rate</span>
              <span className="font-mono text-2xl font-extrabold text-cyan-400 mt-1">
                {outputs.capRate.toFixed(2)}%
              </span>
              <span className="text-[11px] text-slate-500 mt-auto">Unleveraged Return</span>
            </div>

            {/* Cash on Cash */}
            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-col">
              <span className="text-xs text-slate-400 font-medium">Cash-on-Cash</span>
              <span className="font-mono text-2xl font-extrabold text-emerald-400 mt-1">
                {outputs.cashOnCashReturn.toFixed(2)}%
              </span>
              <span className="text-[11px] text-slate-500 mt-auto">Year 1 Invested Return</span>
            </div>

            {/* DSCR */}
            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-col">
              <span className="text-xs text-slate-400 font-medium">DSCR Ratio</span>
              <span className="font-mono text-2xl font-extrabold text-amber-400 mt-1">
                {outputs.dscr.toFixed(2)}x
              </span>
              <span className="text-[11px] text-slate-500 mt-auto">Debt Coverage Ratio</span>
            </div>

            {/* Total Invested */}
            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-col">
              <span className="text-xs text-slate-400 font-medium">Initial Investment</span>
              <span className="font-mono text-lg font-bold text-white mt-1">
                {formatCurrency(outputs.totalInvestment)}
              </span>
              <span className="text-[11px] text-slate-500 mt-auto">Down + Rehab</span>
            </div>

          </div>

          {/* Breakdown Table */}
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Net Operating Income (NOI):</span>
              <span className="font-mono font-bold text-white">{formatCurrency(outputs.netOperatingIncome)}/yr</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Monthly Debt Service:</span>
              <span className="font-mono font-bold text-slate-300">{formatCurrency(outputs.monthlyDebtService)}/mo</span>
            </div>
            <div className="flex justify-between py-1 font-semibold pt-1">
              <span className="text-cyan-400">Pre-Tax Monthly Cash Flow:</span>
              <span className="font-mono font-extrabold text-cyan-400 text-sm">
                {formatCurrency(outputs.annualPreTaxCashFlow / 12)}/mo
              </span>
            </div>
          </div>

          {/* Copy Summary Button */}
          <button
            onClick={handleCopyDealSummary}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-cyan-950 hover:to-emerald-950 border border-slate-700 hover:border-cyan-500/50 text-xs font-bold text-slate-200 hover:text-white transition-all shadow-md"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
            <span>{copied ? 'Summary Copied to Clipboard!' : 'Copy Underwriting Brief Link'}</span>
          </button>
        </div>

      </div>

      {/* Dynamic Multi-Year Recharts Bar Chart Section */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h3 className="font-heading font-bold text-lg text-white">10-Year Financial Projection Matrix</h3>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Assumes 3% Rent Growth & 3.5% Annual Property Appreciation
          </p>
        </div>

        <div className="h-72 w-full bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis 
                stroke="#64748b" 
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#090d16', 
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px'
                }}
                formatter={(value: number) => [formatCurrency(value), '']}
              />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
              <Bar dataKey="NOI" fill="#06b6d4" name="Net Operating Income (NOI)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Cumulative Cash Flow" fill="#10b981" name="Cumulative Cash Flow" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
