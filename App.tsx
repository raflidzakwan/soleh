import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import { ModuleType, Patient, InventoryItem, JournalEntry } from './types';
import ClinicalModule from './components/ClinicalModule';
import InventoryModule from './components/InventoryModule';
import FinanceModule from './components/FinanceModule';
import Dashboard from './components/Dashboard';

// Mock Initial Data
const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'MED001', name: 'Amoxicillin 500mg', category: 'Medicine', currentStock: 120, minStockLevel: 200, unitCost: 1.50, monthlyUsageHistory: [180, 210, 190, 220, 250, 240] },
  { id: 'MED002', name: 'Paracetamol IV', category: 'Medicine', currentStock: 800, minStockLevel: 500, unitCost: 4.00, monthlyUsageHistory: [600, 550, 620, 580, 610, 590] },
  { id: 'MAT001', name: 'Surgical Gloves (L)', category: 'Consumable', currentStock: 45, minStockLevel: 100, unitCost: 0.20, monthlyUsageHistory: [120, 130, 110, 140, 150, 160] },
];

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ModuleType>(ModuleType.DASHBOARD);
  
  // Centralized State (Single Source of Truth Concept)
  const [patients, setPatients] = useState<Patient[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  // Function to handle "Integration" between modules
  const handleAdmitPatient = (patientData: Omit<Patient, 'id' | 'status' | 'admissionDate'>) => {
    const newId = `PAT-${Math.floor(Math.random() * 10000)}`;
    const admissionDate = new Date().toISOString().split('T')[0];
    
    // 1. Create Patient Record (Clinical)
    const newPatient: Patient = {
      id: newId,
      ...patientData,
      status: 'Admitted',
      admissionDate
    };
    setPatients(prev => [...prev, newPatient]);

    // 2. Automatically Create Financial Entry (Finance Integration)
    // Simulating an initial deposit/invoice creation upon admission
    const invoiceAmount = 500; // Standard admission fee
    const newEntry: JournalEntry = {
      id: `JE-${Date.now()}`,
      date: admissionDate,
      description: `Admission Invoice - ${newPatient.name}`,
      accountDebit: 'Accounts Receivable',
      accountCredit: 'Revenue - Medical Services',
      amount: invoiceAmount,
      referenceId: newId,
      moduleSource: 'CLINICAL'
    };
    setJournalEntries(prev => [...prev, newEntry]);

    // 3. Consume a "Registration Kit" (SCM Integration)
    // This demonstrates 3-way matching logic capability
    // (Simulated here by just logging, but could reduce inventory)
    console.log("Triggering SCM consumption for Admission Kit...");
  };

  const renderContent = () => {
    switch (activeModule) {
      case ModuleType.DASHBOARD:
        return <Dashboard journalEntries={journalEntries} patients={patients} />;
      case ModuleType.CLINICAL:
        return <ClinicalModule patients={patients} onAdmitPatient={handleAdmitPatient} />;
      case ModuleType.SCM:
        return <InventoryModule inventory={inventory} />;
      case ModuleType.FINANCE:
        return <FinanceModule journalEntries={journalEntries} />;
      case ModuleType.HR:
        return <div className="p-10 text-center text-slate-500">HR Module Placeholder (Phase 2)</div>;
      default:
        return <Dashboard journalEntries={journalEntries} patients={patients} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      
      <main className="ml-64 flex-1 p-8 overflow-y-auto h-screen">
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              {activeModule} VIEW
            </h1>
            <p className="text-xs text-slate-400">
              Last Sync: {new Date().toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-800">Prof. Accountant</p>
              <p className="text-xs text-slate-500">System Architect</p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">
              PA
            </div>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
};

export default App;