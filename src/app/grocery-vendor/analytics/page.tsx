"use client";

import { BarChart, Bar, AreaChart, Area, ResponsiveContainer, XAxis, Tooltip, YAxis } from 'recharts';
import { ArrowUpRight, TrendingUp, Package, IndianRupee } from 'lucide-react';

const REVENUE_DATA = [
  { month: 'Jan', total: 45000 },
  { month: 'Feb', total: 52000 },
  { month: 'Mar', total: 48000 },
  { month: 'Apr', total: 61000 },
  { month: 'May', total: 72000 },
  { month: 'Jun', total: 68000 },
];

const TOP_PRODUCTS = [
  { name: 'Nandini Milk 1L', sales: 450, revenue: 22500, trend: '+15%' },
  { name: 'Aashirvaad Atta 5kg', sales: 320, revenue: 64000, trend: '+8%' },
  { name: 'Amul Butter 500g', sales: 280, revenue: 14000, trend: '-2%' },
  { name: 'Fortune Sunflower Oil 1L', sales: 210, revenue: 31500, trend: '+5%' },
  { name: 'Surf Excel 1kg', sales: 180, revenue: 21600, trend: '+12%' },
];

export default function GroceryAnalyticsPage() {
  return (
    <div className="flex flex-col gap-8 h-full">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-500 font-medium mt-1">Deep dive into your store's performance metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-500 rounded-3xl p-6 text-white shadow-lg shadow-emerald-500/30 flex flex-col justify-between">
          <div>
             <div className="text-emerald-100 font-bold text-sm tracking-widest uppercase mb-1">Total Revenue</div>
             <div className="text-4xl font-black flex items-center gap-2 mt-2">
               ₹3.4L <TrendingUp className="w-6 h-6 text-white/50" />
             </div>
          </div>
          <div className="text-sm font-medium text-emerald-100 mt-6">+24% vs last month</div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
          <div>
             <div className="text-gray-500 font-bold text-sm tracking-widest uppercase mb-1">Total Orders</div>
             <div className="text-4xl font-black text-gray-900 dark:text-white mt-2">
               1,248
             </div>
          </div>
          <div className="text-sm font-bold text-emerald-500 flex items-center mt-6">
            <ArrowUpRight className="w-4 h-4 mr-1" /> 12% vs last month
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
          <div>
             <div className="text-gray-500 font-bold text-sm tracking-widest uppercase mb-1">Avg Order Value</div>
             <div className="text-4xl font-black text-gray-900 dark:text-white mt-2">
               ₹275
             </div>
          </div>
          <div className="text-sm font-bold text-emerald-500 flex items-center mt-6">
            <ArrowUpRight className="w-4 h-4 mr-1" /> 4% vs last month
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Revenue Trend Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Revenue Trend (6 Months)</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} 
                  itemStyle={{ fontWeight: 'bold', color: '#10b981' }}
                  formatter={(val: any) => [`₹${val}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="total" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Top Performing Products</h2>
          <div className="flex flex-col gap-4 flex-1">
            {TOP_PRODUCTS.map((prod, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-xl flex items-center justify-center font-black">
                    #{i + 1}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white text-sm">{prod.name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                      <span className="flex items-center"><Package className="w-3 h-3 mr-1" /> {prod.sales} sold</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-black text-gray-900 dark:text-white">₹{prod.revenue.toLocaleString()}</span>
                  <span className={`text-xs font-bold ${prod.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                    {prod.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
