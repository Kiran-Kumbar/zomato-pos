"use client";

import { useEffect, useState } from 'react';
import { ArrowUpRight, TrendingUp, Store, Bike, Package, Leaf } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { list as listOrders } from '@/lib/services/order.service';
import { list as listRestaurants } from '@/lib/services/restaurant.service';
import { list as listPartners } from '@/lib/services/deliveryPartner.service';

function useCountUp(end: number, duration: number = 1000, prefix: string = '') {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    if (end === 0) return setCount(0);
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
  return `${prefix}${count.toLocaleString()}`;
}

const REVENUE_DATA = [
  { name: 'Mon', value: 120000 },
  { name: 'Tue', value: 145000 },
  { name: 'Wed', value: 130000 },
  { name: 'Thu', value: 180000 },
  { name: 'Fri', value: 240000 },
  { name: 'Sat', value: 320000 },
  { name: 'Sun', value: 290000 },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({ gmv: 0, orders: 0, restaurants: 0, riders: 0, eco: 0, commission: 0 });

  useEffect(() => {
    async function load() {
      const [orders, rests, partners] = await Promise.all([
        listOrders(), listRestaurants(), listPartners()
      ]);
      
      const gmv = orders.reduce((sum, o) => sum + o.totalAmount, 0) + 1420000; // adding baseline for demo
      const activeOrders = orders.filter(o => !['delivered'].includes(o.status)).length + 342;
      const eco = rests.reduce((sum, r) => sum + r.ecoDeliveriesCount, 0) + 12500;
      
      setStats({
        gmv,
        orders: activeOrders,
        restaurants: rests.length + 120, // baseline
        riders: partners.length + 450, // baseline
        eco,
        commission: Math.round(gmv * 0.2)
      });
    }
    load();
  }, []);

  const gmvDisplay = useCountUp(stats.gmv, 1500, '₹');
  const ordersDisplay = useCountUp(stats.orders, 1000);
  const restsDisplay = useCountUp(stats.restaurants, 1000);
  const ridersDisplay = useCountUp(stats.riders, 1000);
  const ecoDisplay = useCountUp(stats.eco, 1500);
  const commissionDisplay = useCountUp(stats.commission, 1500, '₹');

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Platform Overview</h1>
        <p className="text-gray-500 font-medium mt-1">Live operational metrics and financials.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total GMV Today', value: gmvDisplay, icon: TrendingUp, color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
          { label: 'Commission (20%)', value: commissionDisplay, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
          { label: 'Active Orders', value: ordersDisplay, icon: Package, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
          { label: 'Active Restaurants', value: restsDisplay, icon: Store, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
          { label: 'Active Riders', value: ridersDisplay, icon: Bike, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
          { label: 'Eco Deliveries (Mo)', value: ecoDisplay, icon: Leaf, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
        ].map((stat, i) => (
          <div key={i} className={`bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col ${i < 2 ? 'col-span-2 lg:col-span-1' : ''}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider leading-tight">{stat.label}</span>
            </div>
            <span className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white mt-auto tracking-tight">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Platform Revenue Trend</h2>
            <span className="text-sm font-bold text-emerald-500 flex items-center mt-1"><ArrowUpRight className="w-4 h-4 mr-1" /> +12% this week</span>
          </div>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={REVENUE_DATA} margin={{ left: -20, right: 0, bottom: 0, top: 20 }}>
              <defs>
                <linearGradient id="colorAdminRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#9ca3af' }} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} itemStyle={{ fontWeight: 'bold', color: '#6366f1' }}/>
              <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAdminRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
