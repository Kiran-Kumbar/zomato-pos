"use client";

import { Banknote, TrendingUp, Zap, Clock, CalendarDays, ShieldCheck } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

const EARNINGS_DATA = [
  { name: '10am', value: 120 },
  { name: '12pm', value: 450 },
  { name: '2pm', value: 890 },
  { name: '4pm', value: 920 },
  { name: '6pm', value: 1240 },
  { name: '8pm', value: 1850 },
];

const BREAKDOWN = [
  { label: 'Base Pay', amount: 950 },
  { label: 'Distance Pay', amount: 450 },
  { label: 'Surge (Dynamic)', amount: 320 },
  { label: 'Tips', amount: 130 },
];

// Mock Zone Demand grid (4x4)
// High values = red/hot, Low values = green/cool
const ZONE_GRID = [
  [2, 3, 5, 8],
  [1, 4, 9, 7],
  [2, 5, 8, 4],
  [1, 2, 3, 2]
];

function getZoneColor(val: number) {
  if (val >= 8) return 'bg-red-500 border-red-600';
  if (val >= 5) return 'bg-orange-400 border-orange-500';
  if (val >= 3) return 'bg-yellow-400 border-yellow-500';
  return 'bg-emerald-400 border-emerald-500';
}

export default function EarningsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Earnings</h1>
        <p className="text-gray-500 font-medium mt-1 text-sm">Transparent breakdown of your payout today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Total Hero */}
        <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-600/20 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-blue-200 font-bold text-sm tracking-widest uppercase mb-1 block">Today's Earnings</span>
              <span className="text-5xl font-black flex items-center">
                ₹1,850
              </span>
            </div>
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <Banknote className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div className="flex gap-4 mt-8">
            <div className="bg-black/20 px-4 py-2 rounded-xl flex-1">
              <span className="text-[10px] text-blue-200 font-bold uppercase tracking-widest block">Trips</span>
              <span className="font-black text-xl">14</span>
            </div>
            <div className="bg-black/20 px-4 py-2 rounded-xl flex-1">
              <span className="text-[10px] text-blue-200 font-bold uppercase tracking-widest block">Online</span>
              <span className="font-black text-xl">6.5h</span>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Earnings Breakdown</h2>
          <div className="flex flex-col gap-3">
            {BREAKDOWN.map(b => (
              <div key={b.label} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">{b.label}</span>
                <span className="font-black text-gray-900 dark:text-white">₹{b.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fairness Dashboard - Zone Demand */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mt-2">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="font-black text-xl text-gray-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-500 fill-current" /> Live Zone Demand
            </h2>
            <p className="text-gray-500 font-medium text-sm mt-1 max-w-sm leading-relaxed">
              We show exactly where orders are surging so you can position yourself for higher earnings.
            </p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-3 py-1.5 rounded-xl flex items-center gap-1 text-xs font-bold border border-orange-200 dark:border-orange-800/30">
            <ShieldCheck className="w-4 h-4" /> Fair Algorithms
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Heatmap Grid */}
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-3xl border border-gray-100 dark:border-gray-800">
            <div className="grid grid-cols-4 gap-2">
              {ZONE_GRID.map((row, ri) => (
                row.map((cell, ci) => (
                  <div 
                    key={`${ri}-${ci}`} 
                    className={`aspect-square rounded-xl border-2 flex items-center justify-center transition-colors shadow-inner opacity-90 ${getZoneColor(cell)}`}
                  >
                    <span className="font-black text-white/90 text-sm">{cell}x</span>
                  </div>
                ))
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-400 block" /> Normal</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500 block" /> High Demand</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
             <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl flex gap-4">
               <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center shrink-0 shadow-sm text-red-500">
                 <Zap className="w-6 h-6 fill-current" />
               </div>
               <div>
                 <h4 className="font-bold text-gray-900 dark:text-white">Zone 2 (Koramangala)</h4>
                 <p className="text-xs text-gray-500 mt-1 font-medium">Currently surging at +₹30 per order due to low rider availability.</p>
               </div>
             </div>
             <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl flex gap-4">
               <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center shrink-0 shadow-sm text-emerald-500">
                 <TrendingUp className="w-6 h-6" />
               </div>
               <div>
                 <h4 className="font-bold text-gray-900 dark:text-white">Your Positioning</h4>
                 <p className="text-xs text-gray-500 mt-1 font-medium">You are 2.5km away from the highest demand zone. Move North to increase trips.</p>
               </div>
             </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}
