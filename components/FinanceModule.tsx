import React, { useState } from 'react';
import { JournalEntry } from '../types';
import { analyzeFinancialHealth } from '../services/geminiService';
import { BookOpen, Sparkles, ArrowUpRight, ArrowDownLeft, ShieldCheck } from 'lucide-react';

interface FinanceProps {
  journalEntries: JournalEntry[];
}

const FinanceModule: React.FC<FinanceProps> = ({ journalEntries }) => {
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const runAnalysis = async () => {
    setAnalyzing(true);
    const result = await analyzeFinancialHealth(journalEntries);
    setAiAnalysis(result);
    setAnalyzing(false);
  };

  // Calculate generic totals
  const totalDebits = journalEntries.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Finance & General Ledger</h2>
          <p className="text-slate-500">Single Source of Truth (SSOT) - Real-time Integration</p>
        </div>
        <button
          onClick={runAnalysis}
          disabled={analyzing}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition disabled:opacity-70"
        >
          {analyzing ? <Sparkles className="animate-spin" size={18} /> : <Sparkles size={18} />}
          <span>AI CFO Analysis</span>
        </button>
      </div>

      {/* AI Insight Card */}
      {aiAnalysis && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-xl shadow-lg border border-slate-700 animate-slide-up">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-emerald-500/20 p-2 rounded-lg">
              <ShieldCheck className="text-emerald-400" size={24} />
            </div>
            <h3 className="text-lg font-semibold">CFO Executive Summary</h3>
          </div>
          <p className="text-slate-300 leading-relaxed text-sm lg:text-base font-light">
            {aiAnalysis}
          </p>
        </div>
      )}

      {/* Ledger Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2 text-slate-700">
            <BookOpen size={20} />
            <span className="font-semibold">General Ledger (GL) Transactions</span>
          </div>
          <div className="text-sm font-mono text-slate-500">
            Total Volume: <span className="text-slate-900 font-bold">${totalDebits.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Source Module</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Debit Account</th>
                <th className="px-6 py-3">Credit Account</th>
                <th className="px-6 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {journalEntries.slice().reverse().map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 text-sm text-slate-500 font-mono">{entry.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      entry.moduleSource === 'CLINICAL' ? 'bg-blue-100 text-blue-800' :
                      entry.moduleSource === 'SCM' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {entry.moduleSource}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-800 font-medium">{entry.description}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <ArrowUpRight size={14} className="text-emerald-500" />
                      {entry.accountDebit}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                     <div className="flex items-center gap-1">
                      <ArrowDownLeft size={14} className="text-red-500" />
                      {entry.accountCredit}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900 font-bold text-right">
                    ${entry.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
              {journalEntries.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No transactions recorded in the General Ledger yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinanceModule;