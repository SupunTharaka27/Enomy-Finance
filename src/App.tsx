/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Landmark, ShieldAlert, Sparkles, Database, HelpCircle, Info, Sun, Moon, ChevronDown, Check, Coins } from 'lucide-react';
import ClientPortal from './components/ClientPortal';
import StaffDashboard from './components/StaffDashboard';
import DesignHub from './components/DesignHub';
import { CurrencyProvider, useCurrency, SUPPORTED_CURRENCIES, CurrencyCode } from './CurrencyContext';

function MainAppContent() {
  const [activeTab, setActiveTab] = useState<'client' | 'staff' | 'design'>('client');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const { currency, setCurrency, currencySymbol } = useCurrency();

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      return next;
    });
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans select-none antialiased transition-colors duration-300 ${
      theme === 'dark' ? 'dark bg-[#0b111e] text-slate-100' : 'bg-[#f8fafc] text-slate-800'
    }`}>
      {/* Institutional Top Navigation Bar */}
      <header className="bg-[#0f172a] border-b border-slate-800 sticky top-0 z-50 shadow-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-4">
          {/* Logo & Corporate Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Landmark className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white tracking-tight text-base font-display">Enomy-Finances</span>
                <span className="text-[9px] bg-slate-800 text-slate-300 border border-slate-700/50 font-semibold px-2 py-0.5 rounded uppercase tracking-wider">Advisory v2.4</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Enterprise Web Solution developed by Supun Tharaka (PDS)</p>
            </div>
          </div>

          {/* Main Module Tabs switcher & Theme switcher */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800">
              {[
                { id: 'client', label: 'Client Advisory Workspace', icon: Sparkles },
                { id: 'staff', label: 'Advisor Workstation', icon: Database },
                { id: 'design', label: 'Help Guidance | QA Test', icon: HelpCircle },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                      isActive 
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Currency Selector Dropdown - Positioned between Help Guidance | QA Test and Dark mode button */}
            <div className="relative">
              <button
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 hover:text-white hover:border-slate-700 transition-all shadow-sm cursor-pointer"
                aria-label="Select Currency"
                title="Choose Workspace Currency"
              >
                <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/30">
                  {currencySymbol}
                </span>
                <span>{SUPPORTED_CURRENCIES[currency]?.name || currency} ({currencySymbol})</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCurrencyOpen ? 'rotate-180 text-emerald-400' : 'text-slate-400'}`} />
              </button>

              <AnimatePresence>
                {isCurrencyOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsCurrencyOpen(false)} 
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-60 rounded-xl bg-[#0f172a] border border-slate-800 shadow-2xl p-1.5 z-50 overflow-hidden max-h-80 overflow-y-auto"
                    >
                      <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800/80 mb-1 flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5 text-emerald-400" />
                        Select Workspace Currency
                      </div>
                      {Object.values(SUPPORTED_CURRENCIES).map((option) => (
                        <button
                          key={option.code}
                          onClick={() => {
                            setCurrency(option.code as CurrencyCode);
                            setIsCurrencyOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                            currency === option.code
                              ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-semibold'
                              : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-sm">{option.flag}</span>
                            <span className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center font-bold text-xs text-emerald-400 border border-slate-700/50">
                              {option.symbol}
                            </span>
                            <div className="text-left">
                              <div className="text-xs font-semibold">{option.name} ({option.code})</div>
                            </div>
                          </div>
                          {currency === option.code && (
                            <Check className="w-4 h-4 text-emerald-400" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Elegant Theme Switcher Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all shadow-sm cursor-pointer"
              aria-label="Toggle Theme"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
              ) : (
                <Moon className="w-4 h-4 text-emerald-400" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Dynamic Viewport */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {activeTab === 'client' && (
            <motion.div
              key="client"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ClientPortal />
            </motion.div>
          )}

          {activeTab === 'staff' && (
            <motion.div
              key="staff"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <StaffDashboard />
            </motion.div>
          )}

          {activeTab === 'design' && (
            <motion.div
              key="design"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DesignHub />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Regulatory Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 px-6 text-center text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] font-sans">
          <p>© 2026 Enomy-Finances Advisory. Developed collaboratively by our group of seven.</p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-500" />
              Secure FCA Compliant Sweeps
            </span>
            <span>System v0.1-Alpha | PCI-DSS Audited</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <CurrencyProvider>
      <MainAppContent />
    </CurrencyProvider>
  );
}
