import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { forecastInventoryDemand } from '../services/geminiService';
import { BrainCircuit, Package, AlertTriangle, TrendingUp, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface InventoryProps {
  inventory: InventoryItem[];
}

const InventoryModule: React.FC<InventoryProps> = ({ inventory }) => {
  const [predictions, setPredictions] = useState<Record<string, { val: number; reason: string }>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handlePredict = async (item: InventoryItem) => {
    setLoadingId(item.id);
    const result = await forecastInventoryDemand(item);
    setPredictions(prev => ({
      ...prev,
      [item.id]: { val: result.prediction, reason: result.reasoning }
    }));
    setLoadingId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Pharmacy & SCM</h2>
          <p className="text-slate-500">Material Management with Predictive AI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {inventory.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex flex-col lg:flex-row gap-6">
              
              {/* Item Details */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${item.currentStock < item.minStockLevel ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                      <Package size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">{item.name}</h3>
                      <p className="text-sm text-slate-500">{item.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Current Stock</p>
                    <p className={`text-2xl font-bold ${item.currentStock < item.minStockLevel ? 'text-red-600' : 'text-slate-800'}`}>
                      {item.currentStock} <span className="text-sm font-normal text-slate-400">units</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase font-semibold">Min Level</p>
                    <p className="font-medium">{item.minStockLevel} units</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase font-semibold">Unit Cost</p>
                    <p className="font-medium">${item.unitCost.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Usage Chart */}
              <div className="flex-1 h-48 min-h-[200px]">
                <p className="text-xs text-center text-slate-400 mb-2">6-Month Usage History</p>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={item.monthlyUsageHistory.map((val, i) => ({ month: `M-${6-i}`, usage: val }))}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" hide />
                    <YAxis hide />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="usage" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* AI Prediction Section */}
              <div className="flex-1 border-l border-slate-100 pl-0 lg:pl-6">
                <div className="flex items-center gap-2 mb-3 text-purple-600">
                  <BrainCircuit size={20} />
                  <h4 className="font-semibold">AI Demand Forecast</h4>
                </div>
                
                {!predictions[item.id] ? (
                  <div className="text-center py-6">
                    <p className="text-sm text-slate-500 mb-4">
                      Generate a demand prediction for next month based on history.
                    </p>
                    <button
                      onClick={() => handlePredict(item)}
                      disabled={loadingId === item.id}
                      className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition flex items-center gap-2 mx-auto disabled:opacity-50"
                    >
                      {loadingId === item.id ? <RefreshCw className="animate-spin" size={16} /> : <TrendingUp size={16} />}
                      Run Prediction
                    </button>
                  </div>
                ) : (
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 animate-fade-in">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-purple-700 font-medium">Predicted Demand:</span>
                      <span className="text-xl font-bold text-purple-900">{predictions[item.id].val} units</span>
                    </div>
                    <p className="text-xs text-purple-600 leading-relaxed italic">
                      "{predictions[item.id].reason}"
                    </p>
                    {predictions[item.id].val > item.currentStock && (
                      <div className="mt-3 flex items-center gap-2 text-red-600 text-xs font-bold">
                        <AlertTriangle size={14} />
                        <span>High Stockout Risk - Reorder recommended</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryModule;