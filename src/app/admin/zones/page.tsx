"use client";
import dynamic from 'next/dynamic';
import { Plus, Trash2 } from 'lucide-react';

const AdminZonesMap = dynamic(() => import('@/components/map/AdminZonesMap'), { ssr: false });

export default function AdminZones() {
  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Service Zones</h1>
          <p className="text-gray-500 font-medium mt-1">Manage geographical boundaries for operations.</p>
        </div>
        <button className="bg-indigo-500 text-white font-bold px-6 py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/30">
          <Plus className="w-5 h-5" /> Add New Zone
        </button>
      </div>
      
      <div className="flex-1 bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden relative">
        <div className="absolute inset-0 z-0">
          <AdminZonesMap />
        </div>
        
        {/* Floating Panel overlaying map */}
        <div className="absolute top-4 left-4 z-[400] w-72 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 p-5">
          <h3 className="font-black text-lg text-gray-900 dark:text-white mb-4">Active Zones (2)</h3>
          <div className="flex flex-col gap-3">
             <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
               <div className="flex items-center gap-3">
                 <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/50" />
                 <span className="font-bold text-sm text-gray-900 dark:text-white">Koramangala Core</span>
               </div>
               <button className="text-gray-400 hover:text-red-500 transition-colors bg-gray-50 dark:bg-gray-900 p-1.5 rounded-lg"><Trash2 className="w-4 h-4"/></button>
             </div>
             <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
               <div className="flex items-center gap-3">
                 <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                 <span className="font-bold text-sm text-gray-900 dark:text-white">HSR Layout</span>
               </div>
               <button className="text-gray-400 hover:text-red-500 transition-colors bg-gray-50 dark:bg-gray-900 p-1.5 rounded-lg"><Trash2 className="w-4 h-4"/></button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
