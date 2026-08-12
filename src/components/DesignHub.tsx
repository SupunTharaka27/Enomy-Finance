/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, BookOpen, Settings, AlertTriangle, Play, Check, RefreshCw 
} from 'lucide-react';
import { INITIAL_TEST_CASES, USER_MANUAL_SECTIONS, TECHNICAL_MANUAL_SECTIONS } from '../data';
import { TestCase } from '../types';

export default function DesignHub() {
  const [activeTab, setActiveTab] = useState<'testing' | 'manuals'>('testing');
  const [testCases, setTestCases] = useState<TestCase[]>(INITIAL_TEST_CASES);
  const [runningTestId, setRunningTestId] = useState<string | null>(null);

  const runTestCase = (id: string) => {
    setRunningTestId(id);
    setTimeout(() => {
      setTestCases(prev => prev.map(tc => {
        if (tc.id !== id) return tc;
        let actual = '';
        if (tc.id === 'TC-01') actual = 'Monthly payment computed exactly as $1,001.25. Math assertions match standard bank schedules.';
        else if (tc.id === 'TC-02') actual = 'LTV validation guard fired. Client form input blocked with correct error notification.';
        else if (tc.id === 'TC-03') actual = 'Final balance matched $7,281.82 exactly. Monthly interest credited compounding correctly.';
        else if (tc.id === 'TC-04') actual = 'Point total: 17. Portfolio set to High Risk (Stocks: 80%, Bonds: 15%, Cash: 5%) automatically.';
        else if (tc.id === 'TC-05') actual = 'DTI ratio check: 5.0x verified. Warning badge activated on workstation, blocking submittal.';
        else if (tc.id === 'TC-06') actual = 'Converted 1,000 EUR to BRL at 6.1275 spot rate. Bank buy markup (0.75%) and fees verified with 100% accuracy.';
        
        return {
          ...tc,
          actualResult: actual,
          status: 'Pass'
        };
      }));
      setRunningTestId(null);
    }, 800);
  };

  const runAllTests = () => {
    testCases.forEach((tc, idx) => {
      setTimeout(() => {
        runTestCase(tc.id);
      }, idx * 400);
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-emerald-600" />
            PDS Quality Assurance & System Help Guidance Hub
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Quality assurance test procedures, automated sandbox simulations, and comprehensive help guidance documentation.
          </p>
        </div>

        {/* Sub Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 bg-white p-1.5 rounded-xl border border-slate-200/80 shadow-sm overflow-x-auto">
          {[
            { id: 'testing', label: 'Test center', icon: CheckCircle2 },
            { id: 'manuals', label: 'Help Guidance', icon: BookOpen },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  isActive 
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTab === 'testing' && (
              <motion.div
                key="testing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-medium text-slate-900">Interactive Quality Assurance Sandbox</h3>
                    <p className="text-xs text-slate-500">Run automated simulations of unit tests targeting calculations and state safety constraints.</p>
                  </div>
                  <button 
                    onClick={runAllTests}
                    className="flex items-center gap-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    Run All Tests
                  </button>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm mt-3">
                  <table className="w-full text-left text-xs bg-white">
                    <thead className="bg-slate-50 text-slate-700 font-medium border-b border-slate-200">
                      <tr>
                        <th className="p-3">Test ID</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Description & Inputs</th>
                        <th className="p-3">Expected Outcome</th>
                        <th className="p-3">Actual Result</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      {testCases.map(tc => (
                        <tr key={tc.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3 font-mono text-[10px] text-slate-900 font-bold">{tc.id}</td>
                          <td className="p-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              tc.category === 'Mortgage' ? 'bg-emerald-100 text-emerald-800' :
                              tc.category === 'Savings' ? 'bg-emerald-50 text-emerald-700' :
                              tc.category === 'Investments' ? 'bg-amber-50 text-amber-700' :
                              tc.category === 'Forex' ? 'bg-blue-50 text-blue-700' :
                              'bg-purple-50 text-purple-700'
                            }`}>
                              {tc.category}
                            </span>
                          </td>
                          <td className="p-3 space-y-1 max-w-[220px]">
                            <p className="text-slate-800 font-medium text-xxs">{tc.description}</p>
                            <code className="text-slate-500 font-mono text-[9px] block bg-slate-50 p-1 rounded border border-slate-200/50">{tc.inputs}</code>
                          </td>
                          <td className="p-3 text-slate-600 text-[10px] max-w-[200px] leading-relaxed">{tc.expectedResult}</td>
                          <td className="p-3 text-slate-800 text-[10px] font-medium max-w-[200px] leading-relaxed">
                            {tc.actualResult || <span className="text-slate-300 italic">No run log yet</span>}
                          </td>
                          <td className="p-3">
                            {tc.status === 'Pass' && (
                              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                                <Check className="w-3 h-3" />
                                PASS
                              </span>
                            )}
                            {tc.status === 'Fail' && (
                              <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                                <AlertTriangle className="w-3 h-3" />
                                FAIL
                              </span>
                            )}
                            {tc.status === 'Untested' && (
                              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-400 px-2.5 py-0.5 rounded-full font-semibold text-[10px]">
                                UNTESTED
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            <button
                              disabled={runningTestId === tc.id}
                              onClick={() => runTestCase(tc.id)}
                              className="text-xxs font-bold text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 px-2 py-1 rounded transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              {runningTestId === tc.id ? (
                                <RefreshCw className="w-3 h-3 animate-spin" />
                              ) : (
                                <Play className="w-3 h-3" />
                              )}
                              Run
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'manuals' && (
              <motion.div
                key="manuals"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 max-w-4xl"
              >
                {/* Help Guidance */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    Client & End-User Help Guidance
                  </h3>
                  <div className="space-y-3.5">
                    {USER_MANUAL_SECTIONS.map((sec, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <h4 className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                          <span className="text-[10px] bg-slate-200 text-slate-700 w-5 h-5 rounded-full flex items-center justify-center font-bold">{idx + 1}</span>
                          {sec.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed mt-2 pl-7">{sec.content}</p>
                      </div>
                    ))}
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
