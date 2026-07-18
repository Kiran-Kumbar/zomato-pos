"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Search, Store, ShoppingCart, TrendingUp, Package, Tag, Filter } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip, BarChart, Bar } from 'recharts';
import { toast } from 'sonner';

import { GROCERY_VENDORS, GROCERY_CATEGORIES } from '@/lib/mock-data/grocery';
import { list as listOrders } from '@/lib/services/order.service';
import { Order } from '@/lib/types/order';

const TABS = ['Approvals & Verification', 'Analytics & Revenue', 'Categories', 'Live Orders'];

const REVENUE_DATA = [
  { name: 'Mon', revenue: 45000 },
  { name: 'Tue', revenue: 52000 },
  { name: 'Wed', revenue: 48000 },
  { name: 'Thu', revenue: 61000 },
  { name: 'Fri', revenue: 72000 },
  { name: 'Sat', revenue: 89000 },
  { name: 'Sun', revenue: 95000 },
];

export default function AdminGroceryManagement() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    async function load() {
      const data = await listOrders();
      setOrders(data.filter(o => o.orderType !== 'food'));
    }
    load();
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Grocery Management</h1>
          <p className="text-gray-500 font-medium mt-1">Control center for grocery vendors, categories, and ecosystem analytics.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto scrollbar-hide gap-2 p-1 bg-gray-100 dark:bg-gray-800/50 rounded-2xl w-fit">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === tab 
                ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-6"
        >
          {/* TAB 1: Approvals & Verification */}
          {activeTab === 'Approvals & Verification' && (
            <div className="flex flex-col gap-6">
              
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Store className="w-5 h-5 text-indigo-500" /> Vendor Approval Queue
                  </h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">
                        <th className="p-4 font-bold">Vendor Name</th>
                        <th className="p-4 font-bold">Distance Limit</th>
                        <th className="p-4 font-bold">Verification Status</th>
                        <th className="p-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {GROCERY_VENDORS.map((v, i) => (
                        <tr key={v.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img src={v.bannerUrl} alt={v.name} className="w-10 h-10 rounded-lg object-cover bg-gray-200 shrink-0" />
                              <span className="font-bold text-gray-900 dark:text-white">{v.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                            Up to {v.distanceKm + 2} km
                          </td>
                          <td className="p-4">
                            {i % 3 === 0 ? (
                              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                                Pending
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                                Verified
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              {i % 3 === 0 ? (
                                <>
                                  <button onClick={() => toast.success(`Vendor ${v.name} rejected`)} className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 flex items-center justify-center transition-colors">
                                    <X className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => toast.success(`Vendor ${v.name} approved`)} className="w-8 h-8 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 flex items-center justify-center transition-colors">
                                    <Check className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <button className="text-xs font-bold text-indigo-500 hover:text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg">View Details</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Analytics & Revenue */}
          {activeTab === 'Analytics & Revenue' && (
            <div className="flex flex-col gap-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-indigo-500 rounded-3xl p-6 text-white shadow-lg shadow-indigo-500/30 flex flex-col justify-between">
                  <div>
                     <div className="text-indigo-100 font-bold text-sm tracking-widest uppercase mb-1">Ecosystem Revenue</div>
                     <div className="text-4xl font-black flex items-center gap-2 mt-2">
                       ₹4.6M <TrendingUp className="w-6 h-6 text-white/50" />
                     </div>
                  </div>
                  <div className="text-sm font-medium text-indigo-100 mt-6">+32% vs last month</div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
                  <div>
                     <div className="text-gray-500 font-bold text-sm tracking-widest uppercase mb-1">Active Vendors</div>
                     <div className="text-4xl font-black text-gray-900 dark:text-white mt-2">
                       {GROCERY_VENDORS.length}
                     </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
                  <div>
                     <div className="text-gray-500 font-bold text-sm tracking-widest uppercase mb-1">Total Network Inventory</div>
                     <div className="text-4xl font-black text-gray-900 dark:text-white mt-2">
                       85K+
                     </div>
                  </div>
                  <div className="text-sm font-bold text-green-500 flex items-center mt-6">
                    Healthy Stock Levels
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Grocery Revenue Trend (Last 7 Days)</h2>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={REVENUE_DATA} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} dy={10} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} 
                          itemStyle={{ fontWeight: 'bold', color: '#6366f1' }}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="lg:col-span-1 bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Inventory Statistics</h2>
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl">
                      <span className="font-bold text-gray-600 dark:text-gray-300">Fastest Moving</span>
                      <span className="font-black text-gray-900 dark:text-white">Vegetables</span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl">
                      <span className="font-bold text-gray-600 dark:text-gray-300">Highest Margin</span>
                      <span className="font-black text-gray-900 dark:text-white">Personal Care</span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-red-100 dark:border-red-900/30">
                      <span className="font-bold text-red-500">Critical Stock Alerts</span>
                      <span className="font-black text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 px-2 py-1 rounded-lg">45 Items</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Categories */}
          {activeTab === 'Categories' && (
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Tag className="w-5 h-5 text-indigo-500" /> Category Management
                </h2>
                <button className="bg-indigo-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md">Add Category</button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {GROCERY_CATEGORIES.map(cat => (
                  <div key={cat.id} className="group relative rounded-2xl overflow-hidden aspect-square border border-gray-200 dark:border-gray-800 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                    <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                      <span className="text-white font-bold text-sm leading-tight">{cat.name}</span>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-7 h-7 bg-white/90 text-gray-800 rounded flex items-center justify-center text-xs font-bold hover:text-indigo-600">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Live Orders */}
          {activeTab === 'Live Orders' && (
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col flex-1 h-[600px]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-indigo-500" /> Ecosystem Grocery Orders
                </h2>
                <button className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold py-2 px-4 rounded-xl flex items-center gap-2 text-sm">
                  <Filter className="w-4 h-4" /> Filter
                </button>
              </div>

              <div className="overflow-y-auto flex-1 border border-gray-100 dark:border-gray-800 rounded-2xl">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800/90 backdrop-blur-sm z-10 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">
                    <tr>
                      <th className="p-4 font-bold">Order ID</th>
                      <th className="p-4 font-bold">Items</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold">Amount</th>
                      <th className="p-4 font-bold text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                        <td className="p-4 font-bold text-gray-900 dark:text-white">#{order.id.slice(0,6).toUpperCase()}</td>
                        <td className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">{order.items.length} items</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                            order.status === 'delivered' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 font-black text-gray-900 dark:text-white">₹{order.totalAmount}</td>
                        <td className="p-4 text-right">
                          <button className="text-xs font-bold text-indigo-500 hover:text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg">Track</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
