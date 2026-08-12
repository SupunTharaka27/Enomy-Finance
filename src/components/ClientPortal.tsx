/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, PiggyBank, TrendingUp, Shield, AlertCircle, Info, CheckCircle, HelpCircle, RefreshCw, ArrowLeftRight, FileText 
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Legend 
} from 'recharts';
import { useCurrency } from '../CurrencyContext';
import CurrencyCalculator from './CurrencyCalculator';
import SavingsInvestmentQuoteCalculator from './SavingsInvestmentQuoteCalculator';

export default function ClientPortal() {
  const { currencySymbol } = useCurrency();
  const [activePortalTab, setActivePortalTab] = useState<'mortgages' | 'savings' | 'investments' | 'forex' | 'quotes' | 'unified'>('forex');

  // --- MORTGAGES STATE & CALC ---
  const [propertyValue, setPropertyValue] = useState<number>(300000);
  const [depositAmount, setDepositAmount] = useState<number>(60000);
  const [termYears, setTermYears] = useState<number>(25);
  const [mortgageRate, setMortgageRate] = useState<number>(3.89);
  const [mortgageType, setMortgageType] = useState<'Fixed-Rate' | 'Variable-Tracker' | 'Help-to-Buy' | 'Buy-to-Let'>('Fixed-Rate');
  const [mortgageError, setMortgageError] = useState<string | null>(null);

  const ltvRatio = propertyValue > 0 ? ((propertyValue - depositAmount) / propertyValue) * 100 : 0;
  const principal = Math.max(0, propertyValue - depositAmount);

  // Mortgage rates helper depending on selection
  const handleTypeChange = (type: any) => {
    setMortgageType(type);
    setMortgageError(null);
    if (type === 'Fixed-Rate') setMortgageRate(3.89);
    else if (type === 'Variable-Tracker') setMortgageRate(4.75);
    else if (type === 'Help-to-Buy') {
      setMortgageRate(3.29);
      if (depositAmount < propertyValue * 0.05) {
        setMortgageError('Help-to-Buy requires a minimum deposit of 5% of property value.');
      }
    } else if (type === 'Buy-to-Let') {
      setMortgageRate(4.99);
      if (depositAmount < propertyValue * 0.25) {
        setMortgageError('Buy-to-Let requires a minimum deposit of 25% of property value.');
      }
    }
  };

  const handleDepositChange = (val: number) => {
    setDepositAmount(val);
    setMortgageError(null);
    if (mortgageType === 'Help-to-Buy' && val < propertyValue * 0.05) {
      setMortgageError('Help-to-Buy requires a minimum deposit of 5% of property value.');
    } else if (mortgageType === 'Buy-to-Let' && val < propertyValue * 0.25) {
      setMortgageError('Buy-to-Let requires a minimum deposit of 25% of property value.');
    }
  };

  // Perform mortgage math
  const calculateMortgage = () => {
    const r = mortgageRate / 100 / 12;
    const n = termYears * 12;
    let monthly = 0;
    if (r === 0) {
      monthly = principal / n;
    } else {
      monthly = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
    const totalPaid = monthly * n;
    const totalInterest = totalPaid - principal;

    // Generate chart data for 5-year intervals
    const chartData: any[] = [];
    let currentBalance = principal;
    const interval = 5;
    for (let yr = 0; yr <= termYears; yr += interval) {
      const yrMonths = yr * 12;
      let balanceAtYear = principal;
      if (r > 0 && yrMonths > 0) {
        balanceAtYear = principal * Math.pow(1 + r, yrMonths) - (monthly * (Math.pow(1 + r, yrMonths) - 1)) / r;
      } else if (yrMonths > 0) {
        balanceAtYear = principal - (monthly * yrMonths);
      }
      balanceAtYear = Math.max(0, balanceAtYear);
      chartData.push({
        year: `Yr ${yr}`,
        'Remaining Balance': Math.round(balanceAtYear),
        'Interest Paid': Math.round(monthly * yrMonths - (principal - balanceAtYear)),
      });
    }

    return {
      monthly: Math.round(monthly * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalPaid: Math.round(totalPaid * 100) / 100,
      chartData
    };
  };

  const mortgageResult = calculateMortgage();

  // --- SAVINGS STATE & CALC ---
  const [initialSavings, setInitialSavings] = useState<number>(5000);
  const [monthlySavings, setMonthlySavings] = useState<number>(250);
  const [savingsYears, setSavingsYears] = useState<number>(10);
  const [savingsRate, setSavingsRate] = useState<number>(3.50);
  const [savingsType, setSavingsType] = useState<'Regular' | 'ISA' | 'Fixed-Bond'>('Regular');

  const handleSavingsTypeChange = (type: any) => {
    setSavingsType(type);
    if (type === 'Regular') setSavingsRate(3.00);
    else if (type === 'ISA') setSavingsRate(3.50);
    else if (type === 'Fixed-Bond') setSavingsRate(4.25);
  };

  const calculateSavings = () => {
    const r = savingsRate / 100 / 12;
    const months = savingsYears * 12;
    let balance = initialSavings;
    let contributed = initialSavings;
    const chartData: any[] = [];

    chartData.push({
      year: 'Start',
      'Total Contributions': Math.round(contributed),
      'Accumulated Balance': Math.round(balance),
    });

    for (let m = 1; m <= months; m++) {
      balance += balance * r;
      balance += monthlySavings;
      contributed += monthlySavings;

      if (m % 12 === 0) {
        chartData.push({
          year: `Yr ${m / 12}`,
          'Total Contributions': Math.round(contributed),
          'Accumulated Balance': Math.round(balance),
        });
      }
    }

    return {
      finalValue: Math.round(balance * 100) / 100,
      totalContributed: Math.round(contributed * 100) / 100,
      totalInterest: Math.round((balance - contributed) * 100) / 100,
      chartData
    };
  };

  const savingsResult = calculateSavings();

  // --- INVESTMENTS SURVEY & CALC ---
  const [surveyStep, setSurveyStep] = useState<number>(0);
  const [surveyAnswers, setSurveyAnswers] = useState<number[]>([]);
  const [riskAssessment, setRiskAssessment] = useState<{
    riskCategory: 'Low' | 'Medium' | 'High';
    allocatedStocks: number;
    allocatedBonds: number;
    allocatedCash: number;
    allocatedAlternative: number;
    description: string;
    returnRate: number;
  } | null>(null);

  const SURVEY_QUESTIONS = [
    {
      q: 'What is your primary financial objective?',
      options: [
        { text: 'Preserve my capital with minimal fluctuation', score: 1 },
        { text: 'Achieve stable growth with moderate inflation guard', col: 2, score: 3 },
        { text: 'Maximize long-term return indices aggressively', score: 5 },
      ]
    },
    {
      q: 'What is your expected investment duration (time horizon)?',
      options: [
        { text: 'Under 3 years (Short-term)', score: 1 },
        { text: '3 to 7 years (Medium-term)', score: 3 },
        { text: '8 years or more (Long-term)', score: 5 },
      ]
    },
    {
      q: 'How would you react if your portfolio value dropped by 15% due to market volatility?',
      options: [
        { text: 'Liquidate all holdings immediately to save remaining funds', score: 1 },
        { text: 'Maintain my allocation, waiting for stabilization', score: 3 },
        { text: 'Inject additional capital to buy undervalued assets', score: 5 },
      ]
    },
    {
      q: 'Which investment basket do you feel most comfortable holding?',
      options: [
        { text: 'Bank Treasury Bills and Government Debt Securities', score: 1 },
        { text: 'A mixed portfolio of Dividend Stocks and Corporate Bonds', score: 3 },
        { text: 'High-growth Tech Stocks, Cryptocurrencies, and Private Equity', score: 5 },
      ]
    },
  ];

  const handleSurveyAnswer = (score: number) => {
    const nextAnswers = [...surveyAnswers, score];
    setSurveyAnswers(nextAnswers);

    if (surveyStep < SURVEY_QUESTIONS.length - 1) {
      setSurveyStep(prev => prev + 1);
    } else {
      // Calculate complete score
      const totalScore = nextAnswers.reduce((a, b) => a + b, 0);
      let category: 'Low' | 'Medium' | 'High' = 'Medium';
      let allocation = { stocks: 50, bonds: 40, cash: 10, alternative: 0, desc: '', returnRate: 5.5 };

      if (totalScore <= 8) {
        category = 'Low';
        allocation = {
          stocks: 20, bonds: 50, cash: 25, alternative: 5,
          desc: 'Conservative Capital Preservation. Your profile prioritizes liquidity and insulation from market drawdowns, focusing on Government Bills and AAA-rated corporate debt.',
          returnRate: 3.25
        };
      } else if (totalScore <= 15) {
        category = 'Medium';
        allocation = {
          stocks: 55, bonds: 35, cash: 5, alternative: 5,
          desc: 'Balanced Growth. Your profile targets capital appreciation while retaining a bonds buffer to offset stock market cycles. Ideal for standard wealth-building timelines.',
          returnRate: 6.50
        };
      } else {
        category = 'High';
        allocation = {
          stocks: 80, bonds: 10, cash: 5, alternative: 5,
          desc: 'Aggressive Capital Appreciation. You are comfortable tolerating severe short-term market adjustments in search of top historical index tracking and exponential equity growth.',
          returnRate: 9.75
        };
      }

      setRiskAssessment({
        riskCategory: category,
        allocatedStocks: allocation.stocks,
        allocatedBonds: allocation.bonds,
        allocatedCash: allocation.cash,
        allocatedAlternative: allocation.alternative,
        description: allocation.desc,
        returnRate: allocation.returnRate
      });
      setSurveyStep(SURVEY_QUESTIONS.length);
    }
  };

  const resetSurvey = () => {
    setSurveyStep(0);
    setSurveyAnswers([]);
    setRiskAssessment(null);
  };

  // Generate investment growth projection
  const getInvestmentProjection = () => {
    const rate = riskAssessment ? riskAssessment.returnRate / 100 : 0.055;
    const initialAmount = 10000;
    const data: any[] = [];
    for (let yr = 0; yr <= 10; yr++) {
      data.push({
        year: `Yr ${yr}`,
        'Projected Portfolio Value': Math.round(initialAmount * Math.pow(1 + rate, yr)),
      });
    }
    return data;
  };

  const investmentProjData = getInvestmentProjection();

  return (
    <div className="bg-slate-50 min-h-screen p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Enomy Client Financial Portal</h1>
            <p className="text-sm text-slate-500 mt-1">
              Bespoke advisors and mathematical calculators to simulate mortgage repayments, savings projections, and investment allocations.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            {[
              { id: 'forex', label: 'FX & Currency Calculator', icon: ArrowLeftRight },
              { id: 'quotes', label: 'Savings & Investment Quotes', icon: FileText },
              { id: 'mortgages', label: 'Mortgages Advisor', icon: Calculator },
              { id: 'savings', label: 'Savings Compounder', icon: PiggyBank },
              { id: 'investments', label: 'Investments Assessor', icon: TrendingUp },
              { id: 'unified', label: 'Unified Dashboard', icon: Shield },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activePortalTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActivePortalTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-xl border transition-all duration-200 ${
                    isActive 
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20' 
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="wait">
            {/* FX & CURRENCY CALCULATOR TAB */}
            {activePortalTab === 'forex' && (
              <motion.div
                key="forex"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
              >
                <CurrencyCalculator />
              </motion.div>
            )}

            {/* SAVINGS & INVESTMENT QUOTE TAB */}
            {activePortalTab === 'quotes' && (
              <motion.div
                key="quotes"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
              >
                <SavingsInvestmentQuoteCalculator />
              </motion.div>
            )}

            {/* MORTGAGES TAB */}
            {activePortalTab === 'mortgages' && (
              <motion.div
                key="mortgages"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* Inputs card */}
                <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-900">Mortgage Parameters</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 flex justify-between">
                        Property Value: 
                        <span className="text-emerald-600 font-bold">{currencySymbol}{propertyValue.toLocaleString()}</span>
                      </label>
                      <input 
                        type="range" 
                        min="50000" 
                        max="1500000" 
                        step="10000"
                        value={propertyValue} 
                        onChange={(e) => setPropertyValue(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-2"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-500 flex justify-between">
                        Deposit Amount: 
                        <span className="text-emerald-600 font-bold">{currencySymbol}{depositAmount.toLocaleString()}</span>
                      </label>
                      <input 
                        type="range" 
                        min="5000" 
                        max={propertyValue * 0.9} 
                        step="5000"
                        value={depositAmount} 
                        onChange={(e) => handleDepositChange(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-2"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                        <span>LTV: {ltvRatio.toFixed(1)}%</span>
                        <span>Min Deposit: 10% (Std)</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-500">Term (Years)</label>
                        <select 
                          value={termYears} 
                          onChange={(e) => setTermYears(Number(e.target.value))}
                          className="w-full border border-slate-200 rounded-lg p-2 text-xs mt-1 bg-white font-medium"
                        >
                          {[5, 10, 15, 20, 25, 30, 35].map(y => (
                            <option key={y} value={y}>{y} Years</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-500">Interest Rate (%)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          value={mortgageRate}
                          onChange={(e) => setMortgageRate(Number(e.target.value))}
                          className="w-full border border-slate-200 rounded-lg p-2 text-xs mt-1 bg-white font-mono font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-500">Product Portfolio Class</label>
                      <div className="grid grid-cols-2 gap-2 mt-1.5">
                        {[
                          { id: 'Fixed-Rate', label: 'Fixed Rate (3.89%)' },
                          { id: 'Variable-Tracker', label: 'Tracker (4.75%)' },
                          { id: 'Help-to-Buy', label: 'Help-to-Buy (3.29%)' },
                          { id: 'Buy-to-Let', label: 'Buy-to-Let (4.99%)' },
                        ].map(type => (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => handleTypeChange(type.id)}
                            className={`px-3 py-2 text-[10px] font-semibold border rounded-lg transition-all text-left ${
                              mortgageType === type.id 
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' 
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {mortgageError && (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-rose-700 leading-relaxed font-semibold">{mortgageError}</p>
                    </div>
                  )}
                </div>

                {/* Outputs & Chart card */}
                <div className="lg:col-span-2 space-y-6">
                  {/* High level results bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                      <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider block">Monthly Repayment</span>
                      <span className="text-2xl font-bold text-slate-900 block mt-1">{currencySymbol}{mortgageResult.monthly.toLocaleString()}</span>
                      <span className="text-xxs text-slate-400 block mt-0.5 font-mono">Principal & Interest Amortization</span>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                      <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider block">Total Interest Accrued</span>
                      <span className="text-2xl font-bold text-slate-900 block mt-1">{currencySymbol}{mortgageResult.totalInterest.toLocaleString()}</span>
                      <span className="text-xxs text-slate-400 block mt-0.5 font-mono">Nominal Compound Yield</span>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                      <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider block">Total Capital Repayment</span>
                      <span className="text-2xl font-bold text-emerald-600 block mt-1">{currencySymbol}{mortgageResult.totalPaid.toLocaleString()}</span>
                      <span className="text-xxs text-emerald-400 block mt-0.5 font-mono">Over {termYears} Years</span>
                    </div>
                  </div>

                  {/* Amortization schedule chart */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                    <h3 className="text-sm font-semibold text-slate-900 flex justify-between items-center">
                      Amortization Schedule Projection 
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-mono font-medium">Standard Formula Sweeps</span>
                    </h3>

                    <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mortgageResult.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="year" stroke="#94a3b8" fontSize={10} tickLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(val) => `${currencySymbol}${(val/1000)}k`} tickLine={false} />
                          <Tooltip formatter={(value: any) => `${currencySymbol}${value.toLocaleString()}`} />
                          <Legend wrapperStyle={{ fontSize: '10px', marginTop: '10px' }} />
                          <Area type="monotone" dataKey="Remaining Balance" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorBalance)" />
                          <Area type="monotone" dataKey="Interest Paid" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorInterest)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SAVINGS TAB */}
            {activePortalTab === 'savings' && (
              <motion.div
                key="savings"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* Inputs */}
                <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-900">Savings Configuration</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 flex justify-between">
                        Initial Lump Sum: 
                        <span className="text-emerald-600 font-bold">{currencySymbol}{initialSavings.toLocaleString()}</span>
                      </label>
                      <input 
                        type="range" 
                        min="0" 
                        max="200000" 
                        step="1000"
                        value={initialSavings} 
                        onChange={(e) => setInitialSavings(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600 mt-2"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-500 flex justify-between">
                        Regular Monthly Deposit: 
                        <span className="text-emerald-600 font-bold">{currencySymbol}{monthlySavings.toLocaleString()}</span>
                      </label>
                      <input 
                        type="range" 
                        min="0" 
                        max="5000" 
                        step="50"
                        value={monthlySavings} 
                        onChange={(e) => setMonthlySavings(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600 mt-2"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-500">Term (Years)</label>
                        <select 
                          value={savingsYears} 
                          onChange={(e) => setSavingsYears(Number(e.target.value))}
                          className="w-full border border-slate-200 rounded-lg p-2 text-xs mt-1 bg-white font-medium"
                        >
                          {[1, 2, 3, 5, 10, 15, 20].map(y => (
                            <option key={y} value={y}>{y} Years</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-500">Annual Yield (%)</label>
                        <input 
                          type="number" 
                          step="0.05"
                          value={savingsRate}
                          onChange={(e) => setSavingsRate(Number(e.target.value))}
                          className="w-full border border-slate-200 rounded-lg p-2 text-xs mt-1 bg-white font-mono font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-500">Account Yield Tier</label>
                      <div className="grid grid-cols-1 gap-2 mt-1.5">
                        {[
                          { id: 'Regular', label: 'Easy Access Savings (3.00% Aer)' },
                          { id: 'ISA', label: 'Individual Cash ISA (3.50% Aer, Tax-Free)' },
                          { id: 'Fixed-Bond', label: 'Premium Fixed Term Bond (4.25% Aer)' },
                        ].map(type => (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => handleSavingsTypeChange(type.id)}
                            className={`px-3 py-2 text-[10px] font-semibold border rounded-lg transition-all text-left ${
                              savingsType === type.id 
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' 
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Outputs & Chart */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Results bars */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                      <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider block">Total Principal Deposited</span>
                      <span className="text-2xl font-bold text-slate-900 block mt-1">{currencySymbol}{savingsResult.totalContributed.toLocaleString()}</span>
                      <span className="text-xxs text-slate-400 block mt-0.5 font-mono">Sum of deposits</span>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                      <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider block">Cumulative Interest Earned</span>
                      <span className="text-2xl font-bold text-emerald-600 block mt-1">{currencySymbol}{savingsResult.totalInterest.toLocaleString()}</span>
                      <span className="text-xxs text-emerald-400 block mt-0.5 font-mono">Monthly compounded interest</span>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                      <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider block">Final Savings Value</span>
                      <span className="text-2xl font-bold text-slate-900 block mt-1">{currencySymbol}{savingsResult.finalValue.toLocaleString()}</span>
                      <span className="text-xxs text-slate-400 block mt-0.5 font-mono">Target value</span>
                    </div>
                  </div>

                  {/* Growth chart */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                    <h3 className="text-sm font-semibold text-slate-900">Compound Interest Growth Over Term</h3>
                    <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={savingsResult.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorContributed" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#059669" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorBalanceS" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="year" stroke="#94a3b8" fontSize={10} tickLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(val) => `${currencySymbol}${(val/1000)}k`} tickLine={false} />
                          <Tooltip formatter={(value: any) => `${currencySymbol}${value.toLocaleString()}`} />
                          <Legend wrapperStyle={{ fontSize: '10px', marginTop: '10px' }} />
                          <Area type="monotone" dataKey="Accumulated Balance" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorBalanceS)" />
                          <Area type="monotone" dataKey="Total Contributions" stroke="#059669" strokeWidth={1} fillOpacity={1} fill="url(#colorContributed)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* INVESTMENTS TAB */}
            {activePortalTab === 'investments' && (
              <motion.div
                key="investments"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* Survey Questionnaire */}
                <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 h-fit">
                  <h3 className="text-sm font-semibold text-slate-900">Advisory Risk Assessment</h3>

                  {surveyStep < SURVEY_QUESTIONS.length ? (
                    <div className="space-y-4">
                      <div className="flex justify-between text-xxs font-bold text-slate-400 uppercase tracking-wider">
                        <span>Question {surveyStep + 1} of {SURVEY_QUESTIONS.length}</span>
                        <span>{Math.round(((surveyStep) / SURVEY_QUESTIONS.length) * 100)}% Complete</span>
                      </div>
                      
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-600 h-full transition-all duration-300"
                          style={{ width: `${((surveyStep + 1) / SURVEY_QUESTIONS.length) * 100}%` }}
                        />
                      </div>

                      <h4 className="text-xs font-semibold text-slate-800 leading-relaxed pt-2">
                        {SURVEY_QUESTIONS[surveyStep].q}
                      </h4>

                      <div className="space-y-2 pt-1">
                        {SURVEY_QUESTIONS[surveyStep].options.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => handleSurveyAnswer(opt.score)}
                            className="w-full text-left text-xxs border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/20 p-3 rounded-xl transition-all font-medium text-slate-700 hover:text-emerald-900 flex items-start gap-2.5 leading-relaxed"
                          >
                            <span className="w-4 h-4 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-[10px] text-slate-500 shrink-0 font-bold mt-0.5">
                              {String.fromCharCode(65 + i)}
                            </span>
                            {opt.text}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 text-center py-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-900">Assessment Complete</h4>
                        <p className="text-xxs text-slate-500 leading-relaxed">Risk parameters score calculated and recommended portfolios generated.</p>
                      </div>
                      <button 
                        onClick={resetSurvey}
                        className="text-xxs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 mx-auto"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Retake Profiler
                      </button>
                    </div>
                  )}
                </div>

                {/* Recommendations and Growth Projection */}
                <div className="lg:col-span-2 space-y-6">
                  {riskAssessment ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Asset split card */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">CLASSIFIED RISK CATEGORY</span>
                          <h4 className={`text-xl font-bold block mt-0.5 ${
                            riskAssessment.riskCategory === 'Low' ? 'text-emerald-600' :
                            riskAssessment.riskCategory === 'Medium' ? 'text-emerald-600' : 'text-rose-600'
                          }`}>
                            {riskAssessment.riskCategory} Risk Profile
                          </h4>
                        </div>
                        <p className="text-xxs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                          {riskAssessment.description}
                        </p>

                        <div className="space-y-2.5 pt-2">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">ASSET ALLOCATION SPLIT</span>
                          
                          {[
                            { name: 'Stocks (Equities)', val: riskAssessment.allocatedStocks, color: 'bg-emerald-600' },
                            { name: 'Bonds (Fixed Income)', val: riskAssessment.allocatedBonds, color: 'bg-emerald-500' },
                            { name: 'Cash Reserves', val: riskAssessment.allocatedCash, color: 'bg-amber-500' },
                            { name: 'Alternative Assets', val: riskAssessment.allocatedAlternative, color: 'bg-purple-500' },
                          ].map((asset, idx) => (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between text-xxs font-semibold text-slate-700">
                                <span>{asset.name}</span>
                                <span>{asset.val}%</span>
                              </div>
                              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className={`${asset.color} h-full rounded-full`} style={{ width: `${asset.val}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 10-Year simulation projection */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900">Bespoke 10-Year Portfolio Simulation</h3>
                          <p className="text-xxs text-slate-500 leading-relaxed mt-1">Projected growth trend of {currencySymbol}10,000 initial capital assuming historical compound yields ({riskAssessment.returnRate}% per annum).</p>
                        </div>

                        <div className="h-[180px] w-full my-4">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={investmentProjData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                              <XAxis dataKey="year" stroke="#94a3b8" fontSize={9} tickLine={false} />
                              <YAxis stroke="#94a3b8" fontSize={9} tickFormatter={(val) => `${currencySymbol}${(val/1000)}k`} tickLine={false} />
                              <Tooltip formatter={(value: any) => `${currencySymbol}${value.toLocaleString()}`} />
                              <Line type="monotone" dataKey="Projected Portfolio Value" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 3 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        <span className="text-[9px] text-slate-400 leading-relaxed italic block text-center">Simulations represent non-guaranteed estimates and past yields do not secure future indices.</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm flex flex-col items-center justify-center min-h-[300px]">
                      <HelpCircle className="w-12 h-12 text-slate-300 mb-3" />
                      <h4 className="text-sm font-bold text-slate-900">Risk Assessment Needed</h4>
                      <p className="text-xs text-slate-500 max-w-sm leading-relaxed mt-1">Please complete the multiple choice advisory questionnaire on the left to unlock customized portfolio asset strategies and 10-year growth trajectories.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* UNIFIED DASHBOARD TAB */}
            {activePortalTab === 'unified' && (
              <motion.div
                key="unified"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Mortgage card summary */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                      <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider">SAVED MORTGAGE CONFIG</span>
                      <Calculator className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <span className="text-xxs text-slate-500 font-medium block">Total Property Mortgage Sourced</span>
                      <span className="text-xl font-bold text-slate-900 block mt-0.5">{currencySymbol}{principal.toLocaleString()}</span>
                      <span className="text-xxs text-slate-400 block mt-0.5 font-mono">Value: {currencySymbol}{propertyValue.toLocaleString()} | Deposit: {currencySymbol}{depositAmount.toLocaleString()}</span>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-between text-xxs text-slate-600 font-semibold">
                      <span>Monthly Payment:</span>
                      <span className="text-emerald-600 font-bold">{currencySymbol}{mortgageResult.monthly.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Savings card summary */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                      <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider">SAVINGS GOAL COMPILER</span>
                      <PiggyBank className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <span className="text-xxs text-slate-500 font-medium block">Projected Accumulation over {savingsYears} Years</span>
                      <span className="text-xl font-bold text-slate-900 block mt-0.5">{currencySymbol}{savingsResult.finalValue.toLocaleString()}</span>
                      <span className="text-xxs text-slate-400 block mt-0.5 font-mono">Monthly: {currencySymbol}{monthlySavings.toLocaleString()} at {savingsRate}% Aer</span>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-between text-xxs text-slate-600 font-semibold">
                      <span>Interest Earned:</span>
                      <span className="text-emerald-600 font-bold">+{currencySymbol}{savingsResult.totalInterest.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Portfolio summary */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                      <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider">INVESTMENT PORTFOLIO</span>
                      <TrendingUp className="w-5 h-5 text-amber-500" />
                    </div>
                    {riskAssessment ? (
                      <div className="space-y-3.5">
                        <div>
                          <span className="text-xxs text-slate-500 font-medium block">Profile Recommended Classification</span>
                          <span className={`text-base font-bold block mt-0.5 ${
                            riskAssessment.riskCategory === 'Low' ? 'text-emerald-600' :
                            riskAssessment.riskCategory === 'Medium' ? 'text-emerald-600' : 'text-rose-600'
                          }`}>
                            {riskAssessment.riskCategory} Risk
                          </span>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex justify-between text-xxs text-slate-600 font-semibold">
                          <span>Target Annual Return:</span>
                          <span className="text-emerald-600 font-bold">{riskAssessment.returnRate}%</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <span className="text-xxs text-slate-300 italic block">No active profile mapped yet.</span>
                        <button 
                          onClick={() => setActivePortalTab('investments')}
                          className="text-xxs font-bold text-emerald-600 hover:underline block pt-2"
                        >
                          Complete Risk Survey &gt;
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Net wealth projection summary card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                  <h3 className="text-sm font-semibold text-slate-900">Unified Asset Growth Projection Overview</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    A visual projection comparing your savings compounding path against your investment capital projection over a shared 10-year period.
                  </p>

                  <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={
                          Array.from({ length: 11 }).map((_, index) => {
                            const initialS = initialSavings;
                            const monthlyS = monthlySavings;
                            const sRate = savingsRate / 100 / 12;
                            let sBal = initialS;
                            for (let m = 1; m <= index * 12; m++) {
                              sBal += sBal * sRate;
                              sBal += monthlyS;
                            }

                            const iRate = riskAssessment ? riskAssessment.returnRate / 100 : 0.055;
                            const iBal = 10000 * Math.pow(1 + iRate, index);

                            return {
                              year: `Yr ${index}`,
                              'Savings Cumulative Balance': Math.round(sBal),
                              'Investment Portfolio Value': Math.round(iBal),
                            };
                          })
                        }
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="year" stroke="#94a3b8" fontSize={9} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={9} tickFormatter={(val) => `${currencySymbol}${(val/1000)}k`} tickLine={false} />
                        <Tooltip formatter={(value: any) => `${currencySymbol}${value.toLocaleString()}`} />
                        <Legend wrapperStyle={{ fontSize: '9px', marginTop: '10px' }} />
                        <Line type="monotone" dataKey="Savings Cumulative Balance" stroke="#10b981" strokeWidth={2} dot={{ r: 2 }} />
                        <Line type="monotone" dataKey="Investment Portfolio Value" stroke="#4f46e5" strokeWidth={2} dot={{ r: 2 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
