"use client";
import { useState } from 'react';
import { AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';

const INITIAL_DISPUTES = [
  { id: 'ORD-8F92A', customer: 'Rahul K.', issue: 'Food spilled in transit', amount: 350, status: 'pending' },
  { id: 'ORD-1B47C', customer: 'Sneha P.', issue: 'Missing item (Coke)', amount: 60, status: 'pending' },
  { id: 'ORD-9X22Y', customer: 'Amit J.', issue: 'Delivered to wrong address', amount: 890, status: 'pending' }
];

export default function AdminDisputes() {
  const [disputes, setDisputes] = useState(INITIAL_DISPUTES);

  const handleAction = (id: string, action: 'resolved' | 'refunded') => {
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: action } : d));
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Dispute Resolution</h1>
        <p className="text-gray-500 font-medium mt-1">Review flagged orders and issue refunds.</p>
      </div>

      <div className="flex flex-col gap-4">
        {disputes.map(d => (
          <div key={d.id} className={`bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border transition-colors ${d.status === 'pending' ? 'border-red-100 dark:border-red-900/30' : 'border-gray-100 dark:border-gray-800 opacity-60'}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${d.status === 'pending' ? 'bg-red-50 text-red-500 dark:bg-red-900/30' : 'bg-gray-100 text-gray-500 dark:bg-gray-800'}`}>
                  {d.status === 'pending' ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 dark:text-white">{d.id}</h3>
                    <span className="text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-md">₹{d.amount}</span>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-white font-medium mb-0.5">{d.issue}</p>
                  <p className="text-xs text-gray-500">Customer: {d.customer}</p>
                </div>
              </div>

              {d.status === 'pending' ? (
                <div className="flex items-center gap-3 md:ml-auto">
                  <button onClick={() => handleAction(d.id, 'resolved')} className="px-4 py-3 rounded-xl font-bold text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 transition-colors">
                    Dismiss (No Fault)
                  </button>
                  <button onClick={() => handleAction(d.id, 'refunded')} className="px-4 py-3 rounded-xl font-bold text-sm bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 hover:bg-indigo-100 transition-colors flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" /> Issue Full Refund
                  </button>
                </div>
              ) : (
                <div className="font-bold text-sm text-gray-400 uppercase tracking-widest px-4">
                  {d.status}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
