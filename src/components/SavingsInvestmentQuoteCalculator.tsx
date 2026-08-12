/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PiggyBank, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Calculator, 
  FileText, 
  Sparkles,
  Database,
  RefreshCw,
  Percent,
  Layers
} from 'lucide-react';
import { useCurrency } from '../CurrencyContext';

export interface InvestmentOption {
  id: 'option1' | 'option2' | 'option3';
  name: string;
  badge: string;
  maxPerYear: number | null; // null means unlimited
  minMonthly: number;
  minLumpSum: number;
  minReturnRate: number; // e.g., 1.2
  maxReturnRate: number; // e.g., 2.4
  taxDescription: string;
  rbsxFeePerMonth: number; // percentage per month, e.g., 0.25
  description: string;
}

export const INVESTMENT_OPTIONS: Record<string, InvestmentOption> = {
  option1: {
    id: 'option1',
    name: 'Option 1 – Basic Savings Plan',
    badge: 'Capital Preservation',
    maxPerYear: 20000,
    minMonthly: 50,
    minLumpSum: 0,
    minReturnRate: 1.2,
    maxReturnRate: 2.4,
    taxDescription: '0% Estimated Tax',
    rbsxFeePerMonth: 0.25,
    description: 'Designed for short-term low-risk liquidity with zero capital tax drag.',
  },
  option2: {
    id: 'option2',
    name: 'Option 2 – Savings Plan Plus',
    badge: 'Balanced Growth',
    maxPerYear: 30000,
    minMonthly: 50,
    minLumpSum: 300,
    minReturnRate: 3.0,
    maxReturnRate: 5.5,
    taxDescription: '10% on profit above £12,000',
    rbsxFeePerMonth: 0.30,
    description: 'Higher yield potential for medium-term wealth accumulation.',
  },
  option3: {
    id: 'option3',
    name: 'Option 3 – Managed Stock Investments',
    badge: 'High Yield Capital Growth',
    maxPerYear: null, // Unlimited
    minMonthly: 150,
    minLumpSum: 1000,
    minReturnRate: 4.0,
    maxReturnRate: 23.0,
    taxDescription: '10% above £12k, 20% above £40k',
    rbsxFeePerMonth: 1.30,
    description: 'Diversified global stock portfolio managed by RBSX group specialists.',
  },
};

export default function SavingsInvestmentQuoteCalculator() {
  const { currencySymbol, formatCurrency } = useCurrency();

  const [selectedOptionId, setSelectedOptionId] = useState<'option1' | 'option2' | 'option3'>('option1');
  const [initialLumpSum, setInitialLumpSum] = useState<number>(1000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(100);

  // Diagnostic log / caching state for failure simulation & error handling
  const [cachedQuoteTime, setCachedQuoteTime] = useState<string | null>(null);
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([]);
  const [isSimulatingNetwork, setIsSimulatingNetwork] = useState<boolean>(false);

  const selectedOption = INVESTMENT_OPTIONS[selectedOptionId];

  // Validation according to Appendix 1 rules
  const validationErrors: string[] = [];

  if (initialLumpSum < selectedOption.minLumpSum) {
    validationErrors.push(`Initial lump sum must be at least ${currencySymbol}${selectedOption.minLumpSum.toLocaleString()} for ${selectedOption.name}.`);
  }

  if (monthlyContribution < selectedOption.minMonthly) {
    validationErrors.push(`Monthly contribution must be at least ${currencySymbol}${selectedOption.minMonthly.toLocaleString()} for ${selectedOption.name}.`);
  }

  // Calculate annual contribution
  const totalAnnualContributionYear1 = initialLumpSum + (monthlyContribution * 12);
  const standardAnnualContribution = monthlyContribution * 12;

  if (selectedOption.maxPerYear !== null && totalAnnualContributionYear1 > selectedOption.maxPerYear) {
    validationErrors.push(`Total annual investment (${currencySymbol}${totalAnnualContributionYear1.toLocaleString()}) exceeds the limit of ${currencySymbol}${selectedOption.maxPerYear.toLocaleString()} per year for ${selectedOption.name}.`);
  }

  const isValid = validationErrors.length === 0;

  // Calculation function for a specific annual return rate over years (1, 5, 10)
  const calculateProjection = (years: number, annualReturnRate: number) => {
    const monthlyRate = annualReturnRate / 100 / 12;
    const monthlyFeeRate = selectedOption.rbsxFeePerMonth / 100;
    
    let grossBalance = initialLumpSum;
    let totalContributed = initialLumpSum;
    let totalFeesPaid = 0;

    for (let month = 1; month <= years * 12; month++) {
      // 1. Add monthly contribution
      grossBalance += monthlyContribution;
      totalContributed += monthlyContribution;

      // 2. Add monthly return
      const monthlyReturn = grossBalance * monthlyRate;
      grossBalance += monthlyReturn;

      // 3. Deduct RBSX monthly fee
      const monthlyFee = grossBalance * monthlyFeeRate;
      grossBalance -= monthlyFee;
      totalFeesPaid += monthlyFee;
    }

    // Profit before tax
    const rawProfit = Math.max(0, grossBalance - totalContributed);

    // Calculate tax according to plan rules
    let estimatedTax = 0;
    if (selectedOptionId === 'option2') {
      // 10% on profit above 12,000
      if (rawProfit > 12000) {
        estimatedTax = (rawProfit - 12000) * 0.10;
      }
    } else if (selectedOptionId === 'option3') {
      // 10% on profit above 12,000 up to 40,000, 20% on profit above 40,000
      if (rawProfit > 40000) {
        estimatedTax = (28000 * 0.10) + ((rawProfit - 40000) * 0.20);
      } else if (rawProfit > 12000) {
        estimatedTax = (rawProfit - 12000) * 0.10;
      }
    }

    const netBalance = grossBalance - estimatedTax;
    const netProfit = netBalance - totalContributed;

    return {
      grossWorth: Math.round(grossBalance * 100) / 100,
      netWorth: Math.round(netBalance * 100) / 100,
      totalContributed: Math.round(totalContributed * 100) / 100,
      grossProfit: Math.round(rawProfit * 100) / 100,
      netProfit: Math.round(netProfit * 100) / 100,
      totalFeesPaid: Math.round(totalFeesPaid * 100) / 100,
      estimatedTax: Math.round(estimatedTax * 100) / 100,
    };
  };

  // Compute projections for 1, 5, 10 years at Min and Max rates
  const timeframeResults = [1, 5, 10].map((yrs) => {
    const minProj = calculateProjection(yrs, selectedOption.minReturnRate);
    const maxProj = calculateProjection(yrs, selectedOption.maxReturnRate);
    return {
      years: yrs,
      minProj,
      maxProj,
    };
  });

  // Local caching & fault tolerance simulation as mandated by spec
  useEffect(() => {
    if (isValid) {
      const quoteData = {
        option: selectedOptionId,
        initialLumpSum,
        monthlyContribution,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('enomy_investment_quote_cache', JSON.stringify(quoteData));
      setCachedQuoteTime(new Date().toLocaleTimeString());
    }
  }, [selectedOptionId, initialLumpSum, monthlyContribution, isValid]);

  const handleSimulateDiagnostics = () => {
    setIsSimulatingNetwork(true);
    const timeStr = new Date().toLocaleTimeString();
    const newLog = `[${timeStr}] DIAG_LOG: System state cached to browser storage. Memory pool OK. Database heartbeat verified.`;
    setDiagnosticLogs(prev => [newLog, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setIsSimulatingNetwork(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Title Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0f172a] to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
              <PiggyBank className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight">Savings & Investments Quote Generator</h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold px-2 py-0.5 rounded uppercase tracking-wider">
                  Appendix 1 Standard
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Personalized investment quotes showing min/max returns, profit, fees, and tax estimates over 1, 5, and 10-year horizons.
              </p>
            </div>
          </div>

          <button
            onClick={handleSimulateDiagnostics}
            disabled={isSimulatingNetwork}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer self-start md:self-auto"
          >
            <Database className={`w-3.5 h-3.5 text-emerald-400 ${isSimulatingNetwork ? 'animate-spin' : ''}`} />
            <span>Simulate Diagnostics Log</span>
          </button>
        </div>
      </div>

      {/* Main Form & Quote Output Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs & Plan Selector (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-600" />
              Investment Plan & Inputs
            </h3>
            {cachedQuoteTime && (
              <span className="text-[10px] text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Cached {cachedQuoteTime}
              </span>
            )}
          </div>

          {/* Plan Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 block">
              Select Investment Type:
            </label>
            <div className="space-y-2">
              {Object.values(INVESTMENT_OPTIONS).map((option) => {
                const isSelected = option.id === selectedOptionId;
                return (
                  <div
                    key={option.id}
                    onClick={() => setSelectedOptionId(option.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/90 border-emerald-400 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{option.name}</span>
                      <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        {option.badge}
                      </span>
                    </div>
                    <p className="text-xxs text-slate-500 mt-1 leading-relaxed">
                      {option.description}
                    </p>
                    <div className="mt-2 pt-2 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-xxs font-mono text-slate-600">
                      <div>Returns: <strong>{option.minReturnRate}% - {option.maxReturnRate}%</strong></div>
                      <div>RBSX Fee: <strong>{option.rbsxFeePerMonth}% / mo</strong></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Initial Lump Sum Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-700">Initial Lump Sum ({currencySymbol}):</label>
              <span className="text-slate-400 font-mono text-xxs">
                Min: {selectedOption.minLumpSum === 0 ? 'N/A' : `${currencySymbol}${selectedOption.minLumpSum}`}
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">
                {currencySymbol}
              </span>
              <input
                type="number"
                min="0"
                step="100"
                value={initialLumpSum}
                onChange={(e) => setInitialLumpSum(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Monthly Contribution Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-700">Monthly Investment ({currencySymbol}):</label>
              <span className="text-slate-400 font-mono text-xxs">
                Min: {currencySymbol}{selectedOption.minMonthly} / mo
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">
                {currencySymbol}
              </span>
              <input
                type="number"
                min="0"
                step="50"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Validation Errors Box */}
          <AnimatePresence>
            {!isValid && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-rose-50 border border-rose-200 rounded-xl p-3 space-y-1 text-xs text-rose-800"
              >
                <div className="flex items-center gap-1.5 font-bold text-rose-900">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  Plan Validation Limits Exceeded
                </div>
                {validationErrors.map((err, idx) => (
                  <p key={idx} className="text-xxs text-rose-700 pl-5">• {err}</p>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Diagnostic Log Console */}
          {diagnosticLogs.length > 0 && (
            <div className="bg-slate-900 rounded-xl p-3 text-emerald-400 text-xxs font-mono space-y-1 border border-slate-800">
              <div className="text-slate-400 font-bold uppercase tracking-wider text-[9px] pb-1 border-b border-slate-800">
                Diagnostic Logger Output
              </div>
              {diagnosticLogs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
          )}
        </div>

        {/* Right Personalised Quote Outputs Table (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                Personalised Investment Quote
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Formatted currency values to two decimal places.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
              {selectedOption.name.split('–')[1] || selectedOption.name}
            </span>
          </div>

          {!isValid ? (
            <div className="p-12 text-center text-slate-400 space-y-2 border border-dashed border-slate-200 rounded-xl">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto opacity-70" />
              <div className="text-xs font-semibold text-slate-600">Please adjust inputs to meet plan requirements</div>
              <p className="text-xxs text-slate-400 max-w-sm mx-auto">
                Quotes will generate automatically once initial lump sum, monthly investment, and annual limits comply with plan rules.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Quote Breakdown Cards per Timeframe (1, 5, 10 Years) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {timeframeResults.map(({ years, minProj, maxProj }) => (
                  <div key={years} className="bg-slate-50 rounded-xl border border-slate-200/80 p-4 space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-900">{years} Year Horizon</span>
                      <span className="text-xxs font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-bold">
                        {selectedOption.minReturnRate}% - {selectedOption.maxReturnRate}%
                      </span>
                    </div>

                    <div className="space-y-1.5 font-sans">
                      <div>
                        <span className="text-xxs text-slate-500 block">Min Expected Worth:</span>
                        <span className="text-sm font-bold text-slate-900 font-mono">
                          {formatCurrency(minProj.netWorth, { decimals: 2 })}
                        </span>
                      </div>

                      <div>
                        <span className="text-xxs text-slate-500 block">Max Expected Worth:</span>
                        <span className="text-sm font-bold text-emerald-600 font-mono">
                          {formatCurrency(maxProj.netWorth, { decimals: 2 })}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 text-xxs space-y-1 font-mono text-slate-600">
                        <div className="flex justify-between">
                          <span>Contributed:</span>
                          <strong>{formatCurrency(minProj.totalContributed, { decimals: 2 })}</strong>
                        </div>
                        <div className="flex justify-between text-emerald-700">
                          <span>Max Profit:</span>
                          <strong>+{formatCurrency(maxProj.netProfit, { decimals: 2 })}</strong>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Total RBSX Fees:</span>
                          <span>{formatCurrency(maxProj.totalFeesPaid, { decimals: 2 })}</span>
                        </div>
                        <div className="flex justify-between text-amber-700">
                          <span>Est. Taxes Paid:</span>
                          <span>{formatCurrency(maxProj.estimatedTax, { decimals: 2 })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comprehensive Quote Summary Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-[10px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                      <th className="p-2.5">Timeframe</th>
                      <th className="p-2.5">Min Return Worth</th>
                      <th className="p-2.5">Max Return Worth</th>
                      <th className="p-2.5">Max Net Profit</th>
                      <th className="p-2.5">RBSX Fees</th>
                      <th className="p-2.5">Taxes Paid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs font-sans">
                    {timeframeResults.map(({ years, minProj, maxProj }) => (
                      <tr key={years} className="hover:bg-slate-50/80 transition-colors font-mono">
                        <td className="p-2.5 font-bold text-slate-900">{years} Year{years > 1 ? 's' : ''}</td>
                        <td className="p-2.5 text-slate-800">{formatCurrency(minProj.netWorth, { decimals: 2 })}</td>
                        <td className="p-2.5 font-bold text-emerald-600">{formatCurrency(maxProj.netWorth, { decimals: 2 })}</td>
                        <td className="p-2.5 text-emerald-700 font-bold">+{formatCurrency(maxProj.netProfit, { decimals: 2 })}</td>
                        <td className="p-2.5 text-slate-500">{formatCurrency(maxProj.totalFeesPaid, { decimals: 2 })}</td>
                        <td className="p-2.5 text-amber-700">{formatCurrency(maxProj.estimatedTax, { decimals: 2 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Regulatory Disclosure */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xxs text-slate-500 flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  Quote prepared for Enomy-Finances Client Services under RBSX Group Investment Terms. Forecast returns are calculated compounded monthly.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
