/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Search, Filter, AlertTriangle, CheckCircle, FileSpreadsheet, 
  Settings2, Edit2, Check, UserCheck, ChevronRight, FileText, ArrowLeft, RefreshCw 
} from 'lucide-react';
import { MOCK_CLIENTS } from '../data';
import { Client } from '../types';
import { useCurrency } from '../CurrencyContext';

export default function StaffDashboard() {
  const { currencySymbol } = useCurrency();
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  
  // Inline edit state
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [editIncome, setEditIncome] = useState<number>(0);
  const [editCredit, setEditCredit] = useState<number>(0);
  const [editSavings, setEditSavings] = useState<number>(0);
  const [editInvestment, setEditInvestment] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<any>('Active');

  // Report compiler state
  const [advisorNotes, setAdvisorNotes] = useState('');
  const [recProduct, setRecProduct] = useState('Standard Amortized Mortgage + ISA savings package');
  const [isReportCompiled, setIsReportCompiled] = useState(false);

  const resetDataset = () => {
    setClients(MOCK_CLIENTS);
    setSelectedClientId(null);
    setEditingClientId(null);
    setIsReportCompiled(false);
  };

  const handleStartEdit = (client: Client) => {
    setEditingClientId(client.id);
    setEditIncome(client.annualIncome);
    setEditCredit(client.creditScore);
    setEditSavings(client.savingsBalance);
    setEditInvestment(client.investmentBalance);
    setEditStatus(client.status);
  };

  const handleSaveEdit = (id: string) => {
    setClients(prev => prev.map(c => {
      if (c.id !== id) return c;
      return {
        ...c,
        annualIncome: editIncome,
        creditScore: editCredit,
        savingsBalance: editSavings,
        investmentBalance: editInvestment,
        status: editStatus
      };
    }));
    setEditingClientId(null);
  };

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesRisk = riskFilter === 'all' || c.riskProfile === riskFilter;
    return matchesSearch && matchesStatus && matchesRisk;
  });

  const selectedClient = clients.find(c => c.id === selectedClientId);

  return (
    <div className="bg-slate-50 min-h-screen p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="w-6 h-6 text-emerald-600" />
              Enomy Advisor Workstation
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Internal client accounts dashboard. Audit credit risk scores, monitor debt-to-income tolerances, and compile official advisory reports.
            </p>
          </div>
          <button 
            onClick={resetDataset}
            className="mt-4 md:mt-0 flex items-center gap-1.5 text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 px-3.5 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reload Dataset
          </button>
        </div>

        {/* Unified Layout splits lists and compilers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List and Management Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Search by ID, name, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all font-medium"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold bg-white text-slate-700"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Review Required">Review Required</option>
                    <option value="Pending Approval">Pending Approval</option>
                  </select>

                  <select 
                    value={riskFilter} 
                    onChange={(e) => setRiskFilter(e.target.value)}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold bg-white text-slate-700"
                  >
                    <option value="all">All Risks</option>
                    <option value="Low">Low Risk</option>
                    <option value="Medium">Medium Risk</option>
                    <option value="High">High Risk</option>
                    <option value="Unassessed">Unassessed</option>
                  </select>
                </div>
              </div>

              {/* Client accounts list */}
              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs bg-white">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Client</th>
                      <th className="p-3">Income & Credit</th>
                      <th className="p-3">Balances</th>
                      <th className="p-3">Risk Assessment</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    {filteredClients.map(client => {
                      const isEditing = editingClientId === client.id;
                      const hasCreditAlert = client.creditScore < 600;
                      
                      return (
                        <tr 
                          key={client.id} 
                          onClick={() => {
                            if (!isEditing) {
                              setSelectedClientId(client.id);
                              setIsReportCompiled(false);
                            }
                          }}
                          className={`hover:bg-emerald-50/10 transition-all cursor-pointer ${
                            selectedClientId === client.id ? 'bg-emerald-50/20' : ''
                          }`}
                        >
                          {/* Client Identity */}
                          <td className="p-3">
                            <div className="font-semibold text-slate-900 text-xs">{client.name}</div>
                            <div className="text-xxs text-slate-400 font-mono">{client.id} | {client.email}</div>
                          </td>

                          {/* Income and credit score */}
                          <td className="p-3">
                            {isEditing ? (
                              <div className="space-y-1.5 max-w-[120px]">
                                <input 
                                  type="number" 
                                  value={editIncome} 
                                  onChange={(e) => setEditIncome(Number(e.target.value))}
                                  className="w-full border border-slate-200 rounded p-1 text-[10px] font-mono"
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <input 
                                  type="number" 
                                  value={editCredit} 
                                  onChange={(e) => setEditCredit(Number(e.target.value))}
                                  className="w-full border border-slate-200 rounded p-1 text-[10px] font-mono"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            ) : (
                              <div>
                                <div className="font-medium text-slate-800 text-xs">{currencySymbol}{client.annualIncome.toLocaleString()}/yr</div>
                                <div className={`text-xxs font-mono flex items-center gap-1 ${
                                  hasCreditAlert ? 'text-rose-600 font-bold' : 'text-slate-500'
                                }`}>
                                  Credit Score: {client.creditScore}
                                  {hasCreditAlert && <AlertTriangle className="w-3 h-3 animate-pulse" />}
                                </div>
                              </div>
                            )}
                          </td>

                          {/* Balances */}
                          <td className="p-3 font-mono text-[10px]">
                            {isEditing ? (
                              <div className="space-y-1.5 max-w-[120px]">
                                <input 
                                  type="number" 
                                  value={editSavings} 
                                  onChange={(e) => setEditSavings(Number(e.target.value))}
                                  className="w-full border border-slate-200 rounded p-1 text-[10px]"
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <input 
                                  type="number" 
                                  value={editInvestment} 
                                  onChange={(e) => setEditInvestment(Number(e.target.value))}
                                  className="w-full border border-slate-200 rounded p-1 text-[10px]"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            ) : (
                              <div>
                                <div className="text-slate-800">Sav: {currencySymbol}{client.savingsBalance.toLocaleString()}</div>
                                <div className="text-slate-500">Inv: {currencySymbol}{client.investmentBalance.toLocaleString()}</div>
                              </div>
                            )}
                          </td>

                          {/* Risk */}
                          <td className="p-3">
                            <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              client.riskProfile === 'Low' ? 'bg-emerald-50 text-emerald-700' :
                              client.riskProfile === 'Medium' ? 'bg-emerald-100 text-emerald-800' :
                              client.riskProfile === 'High' ? 'bg-rose-50 text-rose-700' :
                              'bg-slate-100 text-slate-400'
                            }`}>
                              {client.riskProfile}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="p-3">
                            {isEditing ? (
                              <select
                                value={editStatus}
                                onChange={(e) => setEditStatus(e.target.value as any)}
                                className="border border-slate-200 rounded p-1 text-[10px]"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <option value="Active">Active</option>
                                <option value="Review Required">Review Required</option>
                                <option value="Pending Approval">Pending Approval</option>
                                <option value="Closed">Closed</option>
                              </select>
                            ) : (
                              <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                client.status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                                client.status === 'Review Required' ? 'bg-amber-50 text-amber-600' :
                                client.status === 'Pending Approval' ? 'bg-emerald-100 text-emerald-700' :
                                'bg-slate-100 text-slate-400'
                              }`}>
                                {client.status}
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                            {isEditing ? (
                              <button
                                onClick={() => handleSaveEdit(client.id)}
                                className="text-emerald-600 hover:text-emerald-800 bg-emerald-50 p-1.5 rounded-lg transition-all"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleStartEdit(client)}
                                className="text-emerald-600 hover:text-emerald-800 bg-emerald-50 p-1.5 rounded-lg transition-all"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Advice Compiler Column */}
          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              {selectedClient ? (
                <motion.div
                  key="compiler"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4"
                >
                  {!isReportCompiled ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-slate-900">Advisory Report Workspace</h3>
                        <button 
                          onClick={() => setSelectedClientId(null)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-xxs text-slate-600 space-y-1">
                        <div><strong>Selected Client:</strong> {selectedClient.name}</div>
                        <div><strong>Income:</strong> {currencySymbol}{selectedClient.annualIncome.toLocaleString()}/yr</div>
                        <div><strong>Credit Score:</strong> {selectedClient.creditScore}</div>
                        <div><strong>Savings:</strong> {currencySymbol}{selectedClient.savingsBalance.toLocaleString()}</div>
                      </div>

                      {/* Advisory Form */}
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-semibold text-slate-500">Verified Advisory Product Recommendation</label>
                          <select 
                            value={recProduct}
                            onChange={(e) => setRecProduct(e.target.value)}
                            className="w-full border border-slate-200 rounded-lg p-2 text-xs mt-1 bg-white font-medium"
                          >
                            <option value="Premium Amortized Fixed-Rate Mortgage + ISA Sweeper">Premium Fixed-Rate Mortgage + ISA Sweeper</option>
                            <option value="First-Time Buyer Help-to-Buy Amortization Pack">First-Time Buyer Help-to-Buy Plan</option>
                            <option value="High-Yield Investment Portfolio Re-balancing + Tracker">High-Yield Aggressive Stock Re-allocation</option>
                            <option value="Easy-Access Compound Savings Ladder">Easy-Access Savings Ladder</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-500">Custom Advisory Analysis Notes</label>
                          <textarea 
                            rows={4}
                            placeholder="Type bespoke advisor assessment notes here..."
                            value={advisorNotes}
                            onChange={(e) => setAdvisorNotes(e.target.value)}
                            className="w-full border border-slate-200 rounded-lg p-2 text-xs mt-1 bg-white focus:ring-2 focus:ring-emerald-100 font-medium"
                          />
                        </div>

                        <button
                          onClick={() => setIsReportCompiled(true)}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                        >
                          <FileText className="w-4 h-4" />
                          Compile Advisory Report
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Beautiful Printable Report
                    <motion.div 
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      className="space-y-4"
                    >
                      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                        <span className="text-xxs font-bold text-slate-400 uppercase tracking-wider">OFFICIAL ADVISORY STATEMENT</span>
                        <button 
                          onClick={() => setIsReportCompiled(false)}
                          className="text-xs font-semibold text-emerald-600 hover:underline"
                        >
                          Edit
                        </button>
                      </div>

                      {/* Official Print Layout */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-[10px] text-slate-700 space-y-3 font-serif">
                        <div className="text-center pb-2 border-b border-slate-200/80">
                          <h4 className="font-bold text-slate-900 uppercase tracking-wide text-xs">Enomy-Finances Advisory</h4>
                          <span className="text-[8px] font-mono text-slate-400">DOCUMENT ID: EN-REP-{selectedClient.id}</span>
                        </div>

                        <div className="space-y-1 text-xxs font-sans">
                          <div><strong>Prepared For:</strong> {selectedClient.name} ({selectedClient.email})</div>
                          <div><strong>Credit Rating:</strong> {selectedClient.creditScore} / 850</div>
                          <div><strong>Annual Earnings:</strong> {currencySymbol}{selectedClient.annualIncome.toLocaleString()}</div>
                          <div><strong>Active Balance Sets:</strong> Savings: {currencySymbol}{selectedClient.savingsBalance.toLocaleString()}</div>
                        </div>

                        <div className="pt-2 border-t border-slate-200/60 font-sans space-y-1">
                          <span className="text-[9px] font-bold text-slate-400 block uppercase">PRODUCT RECOMMENDATION</span>
                          <p className="font-bold text-emerald-700">{recProduct}</p>
                        </div>

                        <div className="pt-2 border-t border-slate-200/60 space-y-1">
                          <span className="text-[9px] font-bold text-slate-400 font-sans block uppercase">ADVISOR NOTES & ANALYSIS</span>
                          <p className="leading-relaxed italic text-slate-600">"{advisorNotes || 'No custom notes provided. Client fits standard yield portfolios.'}"</p>
                        </div>

                        <div className="pt-4 border-t border-slate-200/60 text-center text-[8px] text-slate-400 font-sans leading-relaxed">
                          This statement represents preliminary advice based on provided inputs. Approved under PDS software methodology SDLC controls.
                        </div>
                      </div>

                      <button
                        onClick={() => window.print()}
                        className="w-full bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold py-2.5 rounded-xl transition-all"
                      >
                        Print Statement (PDF)
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm flex flex-col items-center justify-center min-h-[250px]">
                  <UserCheck className="w-12 h-12 text-slate-300 mb-3" />
                  <h4 className="text-xs font-bold text-slate-900">Select Client Profile</h4>
                  <p className="text-xxs text-slate-500 max-w-sm leading-relaxed mt-1">Pick an account from the left list table to verify parameters, analyze credit ratio variables, and generate a printable bespoke financial advisory statement.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
