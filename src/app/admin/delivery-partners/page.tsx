"use client";

import { useEffect, useState } from 'react';
import { Check, X, Search, Star } from 'lucide-react';
import { list as listPartners } from '@/lib/services/deliveryPartner.service';
import { DeliveryPartner } from '@/lib/types/deliveryPartner';
import { toast } from 'sonner';

export default function AdminRiders() {
  const [riders, setRiders] = useState<DeliveryPartner[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await listPartners();
      setRiders(data);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = riders.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Delivery Partners</h1>
          <p className="text-gray-500 font-medium mt-1">Manage rider fleets and approvals.</p>
        </div>
      </div>

      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search riders by name..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl py-3 pl-12 pr-4 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm"
        />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">
                <th className="p-4 font-bold">Rider Info</th>
                <th className="p-4 font-bold">Vehicle</th>
                <th className="p-4 font-bold">Rating</th>
                <th className="p-4 font-bold">Active Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="border-b border-gray-100 dark:border-gray-800 animate-pulse">
                    <td className="p-4"><div className="w-32 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg"></div></td>
                    <td className="p-4"><div className="w-24 h-6 bg-gray-200 dark:bg-gray-800 rounded-md"></div></td>
                    <td className="p-4"><div className="w-16 h-6 bg-gray-200 dark:bg-gray-800 rounded-md"></div></td>
                    <td className="p-4"><div className="w-20 h-6 bg-gray-200 dark:bg-gray-800 rounded-md"></div></td>
                    <td className="p-4 text-right"><div className="w-20 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg ml-auto"></div></td>
                  </tr>
                ))
              ) : filtered.map(r => (
                <tr key={r.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                        <img src={r.photoUrl} alt={r.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 dark:text-white leading-tight">{r.name}</span>
                        <span className="text-xs text-gray-500">{r.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 dark:text-gray-300 text-sm capitalize">{r.vehicleType}</span>
                      <span className="text-xs text-gray-500 font-mono mt-0.5">EV</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 px-2 py-1 rounded-md text-xs font-bold">
                      {r.rating} <Star className="w-3 h-3 fill-current" />
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${r.rating >= 4.5 ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                      {r.rating >= 4.5 ? 'Online' : 'Offline'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => toast.success(`Partner ${r.name} rejected`)}
                        className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 flex items-center justify-center transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => toast.success(`Partner ${r.name} approved`)}
                        className="w-8 h-8 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 flex items-center justify-center transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
