"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Clock, ShieldCheck, CheckCircle2, Package, ArrowRight } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { list as listOrders, update as updateOrder } from '@/lib/services/order.service';
import { Order } from '@/lib/types/order';

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
  { name: 'Mon', total: 4000 },
  { name: 'Tue', total: 3000 },
  { name: 'Wed', total: 2000 },
  { name: 'Thu', total: 2780 },
  { name: 'Fri', total: 1890 },
  { name: 'Sat', total: 6000 },
  { name: 'Sun', total: 7200 },
];

export default function RestaurantDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Stats
  const revenue = useCountUp(12450, 1500, '₹');
  const orderCount = useCountUp(42, 1000);
  const prepTime = useCountUp(18, 1000);
  const trustScore = useCountUp(96, 1500);

  useEffect(() => {
    async function load() {
      // Mock restaurant ID r1 for demo
      const data = await listOrders();
      setOrders(data.filter(o => o.restaurantId === 'r1' && ['placed', 'accepted', 'preparing', 'ready'].includes(o.status)));
    }
    load();
  }, []);

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    let nextStatus: any = 'accepted';
    if (currentStatus === 'placed' || currentStatus === 'accepted') nextStatus = 'preparing';
    else if (currentStatus === 'preparing') nextStatus = 'ready';
    else if (currentStatus === 'ready') return; // Handled by delivery
    
    // Optimistic UI
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: nextStatus, statusTimestamps: { ...o.statusTimestamps, [nextStatus]: new Date().toISOString() } } : o));
    await updateOrder(id, { 
      status: nextStatus, 
      statusTimestamps: { [nextStatus]: new Date().toISOString() } 
    });
  };

  const newOrders = orders.filter(o => o.status === 'placed' || o.status === 'accepted');
  const preparingOrders = orders.filter(o => o.status === 'preparing');
  const readyOrders = orders.filter(o => o.status === 'ready');

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Overview</h1>
        <p className="text-gray-500 font-medium mt-1">Here's what's happening at your restaurant today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Revenue Today', value: revenue, trend: '+14%', color: 'text-green-500' },
          { label: 'Orders Today', value: orderCount, trend: '+5%', color: 'text-green-500' },
          { label: 'Avg Prep Time', value: `${prepTime}m`, trend: '-2m', color: 'text-green-500' },
          { label: 'Trust Score', value: `${trustScore}%`, trend: '+1.2%', color: 'text-emerald-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col">
            <span className="text-sm font-bold text-gray-500 mb-2">{stat.label}</span>
            <div className="flex items-end justify-between mt-auto">
              <span className="text-3xl font-black text-gray-900 dark:text-white leading-none">{stat.value}</span>
              <span className={`text-xs font-bold flex items-center ${stat.color}`}>
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart & Kanban Area */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Sales Chart */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Weekly Sales</h2>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SALES_DATA} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} dy={10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} 
                  itemStyle={{ fontWeight: 'bold', color: '#f97316' }}
                />
                <Area type="monotone" dataKey="total" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Kanban */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
            
            {/* NEW ORDERS */}
            <div className="bg-gray-100/50 dark:bg-gray-900/30 rounded-3xl p-4 border border-gray-200/50 dark:border-gray-800/50 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" /> New
                </h3>
                <span className="bg-white dark:bg-gray-800 text-xs font-black px-2 py-1 rounded-lg">{newOrders.length}</span>
              </div>
              <div className="flex flex-col gap-3 flex-1">
                <AnimatePresence>
                  {newOrders.map(order => (
                    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} key={order.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                      <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                        <span>#{order.id.slice(0,6).toUpperCase()}</span>
                        <span>{order.items.length} items</span>
                      </div>
                      <div className="font-black text-gray-900 dark:text-white text-lg mb-3">₹{order.totalAmount}</div>
                      <button onClick={() => handleUpdateStatus(order.id, order.status)} className="w-full bg-orange-500 text-white font-bold py-2 rounded-xl text-sm active:scale-95 transition-transform">
                        Start Prep
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* PREPARING */}
            <div className="bg-gray-100/50 dark:bg-gray-900/30 rounded-3xl p-4 border border-gray-200/50 dark:border-gray-800/50 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Preparing
                </h3>
                <span className="bg-white dark:bg-gray-800 text-xs font-black px-2 py-1 rounded-lg">{preparingOrders.length}</span>
              </div>
              <div className="flex flex-col gap-3 flex-1">
                <AnimatePresence>
                  {preparingOrders.map(order => (
                    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} key={order.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-orange-100 dark:border-orange-900/50">
                      <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                        <span>#{order.id.slice(0,6).toUpperCase()}</span>
                        <span className="text-orange-500 flex items-center gap-1"><Clock className="w-3 h-3" /> 12m</span>
                      </div>
                      <div className="font-black text-gray-900 dark:text-white text-lg mb-3">₹{order.totalAmount}</div>
                      <button onClick={() => handleUpdateStatus(order.id, order.status)} className="w-full bg-green-500 text-white font-bold py-2 rounded-xl text-sm active:scale-95 transition-transform flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Mark Ready
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* READY */}
            <div className="bg-gray-100/50 dark:bg-gray-900/30 rounded-3xl p-4 border border-gray-200/50 dark:border-gray-800/50 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Ready
                </h3>
                <span className="bg-white dark:bg-gray-800 text-xs font-black px-2 py-1 rounded-lg">{readyOrders.length}</span>
              </div>
              <div className="flex flex-col gap-3 flex-1">
                <AnimatePresence>
                  {readyOrders.map(order => (
                    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} key={order.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-green-100 dark:border-green-900/50 opacity-70 hover:opacity-100 transition-opacity">
                      <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                        <span>#{order.id.slice(0,6).toUpperCase()}</span>
                      </div>
                      <div className="font-black text-gray-900 dark:text-white text-lg mb-3 flex items-center gap-2">
                         Waiting Pickup
                      </div>
                      <div className="text-xs font-bold text-gray-400 flex items-center gap-1">
                        <Package className="w-4 h-4" /> Partner arriving soon
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
