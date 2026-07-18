"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, PackageOpen, CheckCircle2, Package, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

function useCountUp(end: number, duration: number = 1000, prefix: string = '') {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return `${prefix}${count}`;
}

const SALES_DATA = [
  { name: 'Mon', total: 12000 },
  { name: 'Tue', total: 15000 },
  { name: 'Wed', total: 18000 },
  { name: 'Thu', total: 16500 },
  { name: 'Fri', total: 24000 },
  { name: 'Sat', total: 32000 },
  { name: 'Sun', total: 29000 },
];

export default function GroceryVendorDashboard() {
  const revenue = useCountUp(45600, 1500, '₹');
  const orderCount = useCountUp(124, 1000);
  const inventoryAlerts = useCountUp(12, 1000);
  const pickingTime = useCountUp(4, 1000);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 font-medium mt-1">Real-time overview of your grocery store performance.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Revenue Today', value: revenue, trend: '+18%', color: 'text-emerald-500' },
          { label: 'Orders Today', value: orderCount, trend: '+12%', color: 'text-emerald-500' },
          { label: 'Low Stock Alerts', value: inventoryAlerts, trend: '+2', color: 'text-red-500', isNegative: true },
          { label: 'Avg Picking Time', value: `${pickingTime}m`, trend: '-1m', color: 'text-emerald-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col">
            <span className="text-sm font-bold text-gray-500 mb-2">{stat.label}</span>
            <div className="flex items-end justify-between mt-auto">
              <span className="text-3xl font-black text-gray-900 dark:text-white leading-none">{stat.value}</span>
              <span className={`text-xs font-bold flex items-center ${stat.color}`}>
                {stat.isNegative ? <ArrowDownRight className="w-3 h-3 mr-0.5" /> : <ArrowUpRight className="w-3 h-3 mr-0.5" />} {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Weekly Sales</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SALES_DATA} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} dy={10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} 
                  itemStyle={{ fontWeight: 'bold', color: '#10b981' }}
                />
                <Area type="monotone" dataKey="total" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" /> Inventory Alerts
            </h2>
          </div>
          
          <div className="flex flex-col gap-4 flex-1">
            {[
              { item: 'Aashirvaad Atta 5kg', stock: 2, status: 'Critical' },
              { item: 'Amul Butter 500g', stock: 5, status: 'Low' },
              { item: 'Nandini Milk 1L', stock: 8, status: 'Low' },
              { item: 'Onion 1kg', stock: 1, status: 'Critical' },
            ].map((alert, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-gray-900 dark:text-white">{alert.item}</span>
                  <span className="text-xs text-gray-500">{alert.stock} units left</span>
                </div>
                <div className={`px-2 py-1 rounded-lg text-xs font-bold ${alert.status === 'Critical' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-orange-100 text-orange-600 dark:bg-orange-900/30'}`}>
                  {alert.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
