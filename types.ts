export enum ModuleType {
  DASHBOARD = 'DASHBOARD',
  CLINICAL = 'CLINICAL',
  SCM = 'SCM', // Supply Chain Management (Pharmacy/Inventory)
  FINANCE = 'FINANCE', // GL/AR/AP
  HR = 'HR'
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  status: 'Admitted' | 'Discharged' | 'Outpatient';
  admissionDate: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Medicine' | 'Equipment' | 'Consumable';
  currentStock: number;
  minStockLevel: number;
  unitCost: number;
  monthlyUsageHistory: number[]; // Last 6 months
  predictedDemand?: number; // AI Field
  riskLevel?: 'Low' | 'Medium' | 'High'; // AI Field
}

export interface JournalEntry {
  id: string;
  date: string;
  description: string;
  accountDebit: string;
  accountCredit: string;
  amount: number;
  referenceId: string; // Links back to Patient or PO
  moduleSource: 'CLINICAL' | 'SCM' | 'HR' | 'FINANCE';
}

export interface FinancialMetric {
  revenue: number;
  expenses: number;
  netIncome: number;
  arTurnover: number;
}