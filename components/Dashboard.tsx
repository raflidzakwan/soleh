import React from 'react';
import { JournalEntry, Patient } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { DollarSign, Users, Activity, TrendingUp } from 'lucide-react';

interface DashboardProps {
  journalEntries: JournalEntry[];
  patients: Patient[];
}

const Dashboard: React.FC<DashboardProps> = ({ journalEntries, patients }) => {
  // Simple KPI Calc
  const revenue = journalEntries
    .filter(j => j.accountCredit === 'Revenue - Medical Services')
    .reduce((acc, curr) => acc + curr.amount, 0);
  
  const expenses = journalEntries
    .filter(j => j.accountDebit.startsWith('Expense'))
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netIncome = revenue - expenses;

  // Mock data for charts if no real data exists yet
  const revenueData = journalEntries.length > 0 
    ? journalEntries.map((e, i) => ({ name: `T${i}`, amount: e.amount }))
    : [
        { name: 'Jan', amount: 4000 }, { name: 'Feb', amount: 3000 },
        { name: 'Mar', amount: 2000 }, { name: 'Apr', amount: 2780 },
        { name: 'May', amount: 1890 }, { name: 'Jun', amount: 2390 },
      ];

  const pieData = [
    { name: 'In-Patient', value: patients.filter(p => p.status === 'Admitted').length || 4 },
    { name: 'Out-Patient', value: 2 },
    { name: 'Discharged', value: 1 },
  ];

  const COLORS = ['#6366f1', '#10b981', '#f59e0b'];

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
      </div>
      <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
        <TrendingUp size={14} />
        <span>+2.5% from last month</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Executive Overview</h2>
        <p className="text-slate-500">Real-time Hospital Performance Indicators</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`$${revenue.toLocaleString()}`} icon={DollarSign} color="bg-indigo-600" />
        <StatCard title="Net Income" value={`$${netIncome.toLocaleString()}`} icon={Activity} color="bg-emerald-600" />
        <StatCard title="Active Patients" value={patients.length} icon={Users} color="bg-blue-600" />
        <StatCard title="Expenses" value={`$${expenses.toLocaleString()}`} icon={DollarSign} color="bg-red-500" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-80">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-6">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <Tooltip />
              <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-4">Patient Distribution</h3>
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 text-xs text-slate-500">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }}></span>
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;