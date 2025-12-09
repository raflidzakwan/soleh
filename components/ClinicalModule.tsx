import React, { useState } from 'react';
import { Patient } from '../types';
import { UserPlus, FileText, CheckCircle } from 'lucide-react';

interface ClinicalProps {
  patients: Patient[];
  onAdmitPatient: (patient: Omit<Patient, 'id' | 'status' | 'admissionDate'>) => void;
}

const ClinicalModule: React.FC<ClinicalProps> = ({ patients, onAdmitPatient }) => {
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientAge, setNewPatientAge] = useState('');
  const [newPatientCondition, setNewPatientCondition] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPatientName && newPatientAge && newPatientCondition) {
      onAdmitPatient({
        name: newPatientName,
        age: parseInt(newPatientAge),
        condition: newPatientCondition
      });
      setNewPatientName('');
      setNewPatientAge('');
      setNewPatientCondition('');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Clinical Management</h2>
          <p className="text-slate-500">Patient Admissions & EMR Gateway</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Admission Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4 text-indigo-600">
            <UserPlus size={20} />
            <h3 className="font-semibold text-lg">New Admission</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Admitting a patient will automatically generate a preliminary Invoice and AR entry in the Finance Module.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input 
                type="text" 
                value={newPatientName}
                onChange={(e) => setNewPatientName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="e.g. John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
              <input 
                type="number" 
                value={newPatientAge}
                onChange={(e) => setNewPatientAge(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="e.g. 45"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Condition / Diagnosis</label>
              <input 
                type="text" 
                value={newPatientCondition}
                onChange={(e) => setNewPatientCondition(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="e.g. Acute Appendicitis"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              Admit Patient & Generate Invoice
            </button>
          </form>
        </div>

        {/* Patient List */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4 text-slate-700">
            <FileText size={20} />
            <h3 className="font-semibold text-lg">Active Patients (In-Patient)</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 text-sm">
                  <th className="pb-3 font-medium">Patient ID</th>
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Condition</th>
                  <th className="pb-3 font-medium">Admission Date</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition">
                    <td className="py-3 font-mono text-xs text-slate-500">{p.id.slice(0, 8)}</td>
                    <td className="py-3 font-medium text-slate-800">{p.name}</td>
                    <td className="py-3 text-slate-600">{p.condition}</td>
                    <td className="py-3 text-slate-600">{p.admissionDate}</td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                        <CheckCircle size={10} />
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {patients.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No active patients found. Admit a patient to start data flow.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalModule;