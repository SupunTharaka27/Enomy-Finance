/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeftRight, 
  Coins, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles,
  Calculator,
  AlertTriangle,
  CheckCircle2,
  Info,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { SUPPORTED_CURRENCIES, CurrencyCode, useCurrency } from '../CurrencyContext';

export default function CurrencyCalculator() {
  const { formatCurrency, convertCurrency, getExchangeRate } = useCurrency();

  const [tradeType, setTradeType] = useState<'buy' | 'sell' | 'convert'>('buy');
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>('GBP');
  const [toCurrency, setToCurrency] = useState<CurrencyCode>('EUR');
  const [amount, setAmount] = useState<number>(1000);

  // Preset amounts conforming to the 300 - 5000 limits
  const presetAmounts = [300, 500, 1000, 2500, 5000];

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // Base spot rate (mid-market)
  const spotRate = getExchangeRate(fromCurrency, toCurrency);

  // Appendix 1 Tiered Fee Calculation Rules
  // Initial currency amount -> Fee %
  // Up to 500 -> 3.5%
  // Over 500 (501 to 1500) -> 2.7%
  // Over 1500 (1501 to 2500) -> 2.0%
  // Over 2500 (2501 to 5000) -> 1.5%
  const getTieredFeePercentage = (amt: number): { percent: number; tierLabel: string } => {
    if (amt <= 500) return { percent: 3.5, tierLabel: 'Up to 500 (3.5%)' };
    if (amt <= 1500) return { percent: 2.7, tierLabel: 'Over 500 up to 1,500 (2.7%)' };
    if (amt <= 2500) return { percent: 2.0, tierLabel: 'Over 1,500 up to 2,500 (2.0%)' };
    return { percent: 1.5, tierLabel: 'Over 2,500 up to 5,000 (1.5%)' };
  };

  // Validation according to Appendix 1 requirements
  const MIN_TRANSACTION = 300;
  const MAX_TRANSACTION = 5000;
  const isBelowMin = amount < MIN_TRANSACTION;
  const isAboveMax = amount > MAX_TRANSACTION;
  const isValidAmount = !isBelowMin && !isAboveMax;

  const feeInfo = getTieredFeePercentage(amount);
  const feePercent = feeInfo.percent;

  // Fee in source currency
  const feeInSource = (amount * feePercent) / 100;
  const amountAfterFeeInSource = amount - feeInSource;

  // Converted target amount
  const rawSpotTargetAmount = amount * spotRate;
  const netAmountReceived = amountAfterFeeInSource * spotRate;

  const fromInfo = SUPPORTED_CURRENCIES[fromCurrency];
  const toInfo = SUPPORTED_CURRENCIES[toCurrency];

  // Specific target currencies required by prompt: GBP, USD, EUR, BRL, JPY, TRY
  const focusCurrencies: CurrencyCode[] = ['GBP', 'USD', 'EUR', 'BRL', 'JPY', 'TRY'];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0f172a] to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
              <ArrowLeftRight className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight">Official Currency Conversion Module</h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold px-2 py-0.5 rounded uppercase tracking-wider">
                  Enomy-Finances Standard
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Calculate live currency conversion costs with official tiered transaction fee schedules across GBP, USD, EUR, BRL, JPY, and TRY.
              </p>
            </div>
          </div>

          {/* Trade Type Selector */}
          <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 self-start md:self-auto">
            {[
              { id: 'buy', label: 'Buy Foreign Currency', icon: ArrowUpRight },
              { id: 'sell', label: 'Sell Foreign Currency', icon: ArrowDownRight },
              { id: 'convert', label: 'Mid-Market Spot', icon: Coins },
            ].map((mode) => {
              const Icon = mode.icon;
              const isActive = tradeType === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setTradeType(mode.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {mode.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Interactive FX Trading Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Panel (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-600" />
              Currency Trade & Transaction Parameters
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Mode: <strong className="text-slate-800 uppercase">{tradeType}</strong>
            </span>
          </div>

          {/* Currency Selection Pair */}
          <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center">
            {/* From Currency Selector */}
            <div className="sm:col-span-5 space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 block">
                Source Currency (Initial)
              </label>
              <div className="relative">
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value as CurrencyCode)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer appearance-none pr-8"
                >
                  {Object.values(SUPPORTED_CURRENCIES).map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} - {c.name} ({c.symbol})
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <div className="sm:col-span-1 flex justify-center sm:pt-5">
              <button
                onClick={handleSwap}
                title="Swap Currencies"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 border border-slate-200 hover:border-emerald-300 flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>

            {/* To Currency Selector */}
            <div className="sm:col-span-5 space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 block">
                Target Currency (Converted)
              </label>
              <div className="relative">
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value as CurrencyCode)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer appearance-none pr-8"
                >
                  {Object.values(SUPPORTED_CURRENCIES).map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} - {c.name} ({c.symbol})
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>
            </div>
          </div>

          {/* Amount Input with Strict Appendix 1 Transaction Limit Validation */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-700">
                Initial Currency Amount ({fromCurrency}):
              </label>
              <span className="text-xs font-semibold text-slate-500 font-mono">
                Allowed: 300 to 5,000 {fromCurrency}
              </span>
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                {fromInfo?.symbol}
              </span>
              <input
                type="number"
                min="0"
                step="50"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className={`w-full bg-slate-50 border rounded-xl pl-9 pr-16 py-2.5 text-sm font-bold transition-all focus:outline-none ${
                  !isValidAmount
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-500 text-rose-900 bg-rose-50/30'
                    : 'border-slate-200 focus:ring-2 focus:ring-emerald-500 text-slate-900'
                }`}
                placeholder="Enter amount between 300 and 5000"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                {fromCurrency}
              </span>
            </div>

            {/* Limit Warning / Error Box */}
            <AnimatePresence>
              {!isValidAmount && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center gap-2.5 text-xs text-rose-800"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <div>
                    <strong>Transaction Limit Violation:</strong> Enomy-Finances mandates a 
                    {isBelowMin ? ` minimum transaction of 300 ${fromCurrency}.` : ` maximum transaction of 5,000 ${fromCurrency}.`}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Amount Presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-xxs font-medium text-slate-400 self-center mr-1">Valid Presets:</span>
              {presetAmounts.map((p) => (
                <button
                  key={p}
                  onClick={() => setAmount(p)}
                  className={`px-2.5 py-1 text-xxs font-semibold rounded-lg border transition-all cursor-pointer ${
                    amount === p
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-700 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {fromInfo?.symbol}{p.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Official Tiered Transaction Fee Table Display */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                Enomy-Finances Tiered Fee Schedule
              </span>
              <span className="text-xxs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded font-mono">
                Applied Fee: {feePercent}%
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xxs font-sans">
              <div className={`p-2 rounded-lg border ${amount <= 500 ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-900' : 'bg-white border-slate-200 text-slate-600'}`}>
                <div className="text-slate-400">Up to 500</div>
                <div className="text-xs font-bold mt-0.5">3.5% Fee</div>
              </div>
              <div className={`p-2 rounded-lg border ${amount > 500 && amount <= 1500 ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-900' : 'bg-white border-slate-200 text-slate-600'}`}>
                <div className="text-slate-400">Over 500 - 1,500</div>
                <div className="text-xs font-bold mt-0.5">2.7% Fee</div>
              </div>
              <div className={`p-2 rounded-lg border ${amount > 1500 && amount <= 2500 ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-900' : 'bg-white border-slate-200 text-slate-600'}`}>
                <div className="text-slate-400">Over 1,500 - 2,500</div>
                <div className="text-xs font-bold mt-0.5">2.0% Fee</div>
              </div>
              <div className={`p-2 rounded-lg border ${amount > 2500 ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-900' : 'bg-white border-slate-200 text-slate-600'}`}>
                <div className="text-slate-400">Over 2,500 - 5,000</div>
                <div className="text-xs font-bold mt-0.5">1.5% Fee</div>
              </div>
            </div>
          </div>

          {/* Live Exchange Rate Indicator */}
          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-3.5 flex items-center justify-between text-xs text-emerald-950">
            <div className="flex items-center gap-2">
              <span className="text-base">{fromInfo?.flag}</span>
              <span className="font-semibold">1 {fromCurrency}</span>
              <span className="text-emerald-600">→</span>
              <span className="text-base">{toInfo?.flag}</span>
              <span className="font-bold text-slate-900 font-mono">{spotRate.toFixed(4)} {toCurrency}</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-medium bg-emerald-100/80 px-2 py-0.5 rounded-md">
              Live Exchange Rate
            </span>
          </div>
        </div>

        {/* Right Output Calculation Summary (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 text-slate-100 rounded-2xl p-6 border border-slate-800 shadow-lg flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Transaction Breakdown
              </span>
              <span className="text-[10px] bg-slate-800 text-emerald-400 border border-emerald-500/20 font-mono px-2 py-0.5 rounded">
                Official Quote
              </span>
            </div>

            {/* Total Converted Target Output Box */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-xxs text-slate-400 uppercase tracking-wider font-semibold block">
                Net Converted Amount Received ({toCurrency})
              </span>
              <div className="text-2xl font-black text-emerald-400 font-sans tracking-tight">
                {isValidAmount ? (
                  `${toInfo?.flag} ${formatCurrency(netAmountReceived, { code: toCurrency })}`
                ) : (
                  <span className="text-rose-400 text-lg">Invalid Amount Range</span>
                )}
              </div>
              <span className="text-xxs text-slate-400 block font-mono">
                Amount net of Enomy-Finances tiered transaction fee
              </span>
            </div>

            {/* Detailed Itemized Costs */}
            <div className="space-y-2.5 text-xs font-sans">
              <div className="flex justify-between items-center text-slate-300">
                <span>Initial Amount Entered:</span>
                <span className="font-mono text-slate-200">{formatCurrency(amount, { code: fromCurrency })}</span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span>Tiered Transaction Fee ({feePercent}%):</span>
                <span className="font-mono font-bold text-amber-400">
                  -{formatCurrency(feeInSource, { code: fromCurrency })}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span>Net Amount Converted:</span>
                <span className="font-mono text-slate-100 font-semibold">
                  {formatCurrency(amountAfterFeeInSource, { code: fromCurrency })}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-400 pt-2 border-t border-slate-800">
                <span>Spot Market Exchange Rate:</span>
                <span className="font-mono text-emerald-400">
                  1 {fromCurrency} = {spotRate.toFixed(4)} {toCurrency}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-400">
                <span>Equivalent Gross Value:</span>
                <span className="font-mono text-slate-300">
                  {formatCurrency(rawSpotTargetAmount, { code: toCurrency })}
                </span>
              </div>
            </div>
          </div>

          {/* Value Proposition Badge */}
          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 text-xxs text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Fully Compliant & Verified FX Execution
            </div>
            <p className="text-slate-400 leading-relaxed">
              Adheres strictly to Enomy-Finances Appendix 1 specifications. Rates are locked upon submission.
            </p>
          </div>
        </div>
      </div>

      {/* Multi-Currency Conversion Matrix Table (GBP, USD, EUR, BRL, JPY, TRY) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-600" />
              Live Cross-Currency Conversion Matrix
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live conversions across all six supported currencies: GBP, USD, EUR, BRL, JPY, and TRY.
            </p>
          </div>

          <div className="text-xs font-medium text-slate-500">
            Selected Amount: <strong className="text-slate-800">{formatCurrency(amount, { code: fromCurrency })}</strong>
          </div>
        </div>

        {/* Currency Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {focusCurrencies.map((cCode) => {
            const info = SUPPORTED_CURRENCIES[cCode];
            const rateFromSource = getExchangeRate(fromCurrency, cCode);
            const netInTarget = amountAfterFeeInSource * rateFromSource;
            const isSelected = cCode === toCurrency;

            return (
              <div
                key={cCode}
                onClick={() => setToCurrency(cCode)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50/80 border-emerald-400 shadow-sm'
                    : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-base">{info.flag}</span>
                  <span className="text-xxs font-bold text-slate-400 uppercase font-mono">{cCode}</span>
                </div>
                <div className="text-xs font-bold text-slate-900">
                  {info.name}
                </div>
                <div className="text-xxs font-semibold text-emerald-700 font-mono mt-1">
                  1 {fromCurrency} = {rateFromSource.toFixed(cCode === 'JPY' ? 2 : 4)} {cCode}
                </div>
                <div className="text-[10px] text-slate-500 mt-1 pt-1 border-t border-slate-200/60 font-mono">
                  Net: {isValidAmount ? formatCurrency(netInTarget, { code: cCode }) : '---'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
