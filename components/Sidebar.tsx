import React from 'react';
import { LayoutDashboard, Stethoscope, Package, CircleDollarSign, Users, Activity } from 'lucide-react';
import { ModuleType } from '../types';

interface SidebarProps {
  activeModule: ModuleType;
  setActiveModule: (module: ModuleType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeModule, setActiveModule }) => {
  const menuItems = [
    { id: ModuleType.DASHBOARD, label: 'Executive BI', icon: LayoutDashboard },
    { id: ModuleType.CLINICAL, label: 'Clinical & CRM', icon: Stethoscope },
    { id: ModuleType.SCM, label: 'Pharmacy & SCM', icon: Package },
    { id: ModuleType.FINANCE, label: 'Finance & GL', icon: CircleDollarSign },
    { id: ModuleType.HR, label: 'Human Capital', icon: Users },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 shadow-xl z-50">
      <div className="p-6 flex items-center gap-3 border-b border-slate-700">
        <div className="bg-indigo-500 p-2 rounded-lg">
          <Activity size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Medius-AI</h1>
          <p className="text-xs text-slate-400">Hospital ERP Blueprint</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-1">System Status</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-sm font-medium text-emerald-400">Gemini AI Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;