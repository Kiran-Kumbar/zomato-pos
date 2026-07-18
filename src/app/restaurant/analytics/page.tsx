"use client";
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { TrendingUp, Star } from 'lucide-react';

const REVENUE_DATA = [
  { name: 'W1', value: 12000 },
  { name: 'W2', value: 18000 },
  { name: 'W3', value: 15000 },
  { name: 'W4', value: 24000 },
];

const RATINGS_DATA = [
  { name: '5 Star', value: 65, color: '#22c55e' },
  { name: '4 Star', value: 20, color: '#84cc16' },
  { name: '3 Star', value: 10, color: '#eab308' },
  { name: '2 Star', value: 3, color: '#f97316' },
  { name: '1 Star', value: 2, color: '#ef4444' },
];

export default function RestaurantAnalytics() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-500 font-medium mt-1">Deep dive into your restaurant's performance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Trend */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Monthly Revenue Trend</h2>
              <span className="text-sm font-bold text-green-500 flex items-center mt-1"><TrendingUp className="w-4 h-4 mr-1" /> +24% vs last month</span>
            </div>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white">₹69,000</h3>
          </div>
          <div className="h-64 w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA} margin={{ left: -20, right: 0, bottom: 0, top: 20 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} itemStyle={{ fontWeight: 'bold', color: '#10b981' }}/>
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ratings Breakdown */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8">Ratings Breakdown</h2>
          
          <div className="flex flex-col items-center justify-center mb-8">
            <span className="text-6xl font-black text-gray-900 dark:text-white">4.8</span>
            <div className="flex text-yellow-400 mt-2 gap-1 justify-center">
              <Star className="w-5 h-5 fill-current"/><Star className="w-5 h-5 fill-current"/><Star className="w-5 h-5 fill-current"/><Star className="w-5 h-5 fill-current"/><Star className="w-5 h-5 fill-current opacity-30"/>
            </div>
            <span className="text-sm font-bold text-gray-400 mt-2">Based on 4,120 reviews</span>
          </div>
          
          <div className="flex flex-col gap-3.5">
             {RATINGS_DATA.map(d => (
               <div key={d.name} className="flex items-center gap-3">
                 <span className="text-sm font-bold w-12 text-gray-500">{d.name}</span>
                 <div className="flex-1 h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                   <div className="h-full rounded-full" style={{ width: `${d.value}%`, backgroundColor: d.color }} />
                 </div>
                 <span className="text-sm font-bold text-gray-900 dark:text-white w-8 text-right">{d.value}%</span>
               </div>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
}
