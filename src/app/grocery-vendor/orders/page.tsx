"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, CheckCircle2, PackageOpen, ListChecks } from 'lucide-react';
import { list as listOrders, update as updateOrder } from '@/lib/services/order.service';
import { Order } from '@/lib/types/order';

export default function GroceryOrdersKanban() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // Mock grocery vendor ID v1 for demo
      const data = await listOrders();
      // Assume grocery orders use the same order statuses, but mapped differently in UI:
      // 'accepted' -> Picking
      // 'preparing' -> Packing
      setOrders(data.filter(o => o.orderType !== 'food' && ['accepted', 'preparing', 'ready'].includes(o.status)));
      setIsLoading(false);
    }
    load();
  }, []);

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    let nextStatus: any = 'preparing';
    if (currentStatus === 'accepted') nextStatus = 'preparing'; // Picking -> Packing
    else if (currentStatus === 'preparing') nextStatus = 'ready'; // Packing -> Ready
    else if (currentStatus === 'ready') return; // Handled by delivery
    
    // Optimistic UI
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: nextStatus, statusTimestamps: { ...o.statusTimestamps, [nextStatus]: new Date().toISOString() } } : o));
    await updateOrder(id, { 
      status: nextStatus, 
      statusTimestamps: { [nextStatus]: new Date().toISOString() } 
    });
  };

  const pickingOrders = orders.filter(o => o.status === 'accepted');
  const packingOrders = orders.filter(o => o.status === 'preparing');
  const readyOrders = orders.filter(o => o.status === 'ready');

  return (
    <div className="flex flex-col gap-8 h-full">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Live Orders</h1>
        <p className="text-gray-500 font-medium mt-1">Manage grocery fulfillment workflow.</p>
      </div>

      {/* Live Kanban */}
      <div className="flex-1 min-h-[500px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          
          {/* PICKING */}
          <div className="bg-gray-100/50 dark:bg-gray-900/30 rounded-3xl p-4 border border-gray-200/50 dark:border-gray-800/50 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" /> Picking
              </h3>
              <span className="bg-white dark:bg-gray-800 text-xs font-black px-2 py-1 rounded-lg">{pickingOrders.length}</span>
            </div>
            <div className="flex flex-col gap-4 flex-1">
              <AnimatePresence>
                {isLoading ? (
                  Array.from({ length: 2 }).map((_, i) => (
                    <motion.div key={`sk1-${i}`} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-3">
                      <div className="flex justify-between items-center"><div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div><div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div></div>
                      <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse mt-2"></div>
                    </motion.div>
                  ))
                ) : pickingOrders.map(order => (
                  <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} key={order.id} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded-md text-gray-600 dark:text-gray-400">
                        #{order.id.slice(0,6).toUpperCase()}
                      </span>
                      <span className="text-xs font-bold text-gray-500">{order.items.length} items</span>
                    </div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {order.items.slice(0, 3).map(i => `${i.quantity}x Item`).join(', ')}{order.items.length > 3 ? '...' : ''}
                    </div>
                    <button onClick={() => handleUpdateStatus(order.id, order.status)} className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl text-sm active:scale-95 transition-all flex items-center justify-center gap-2">
                      <ListChecks className="w-4 h-4" /> Finish Picking
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* PACKING */}
          <div className="bg-gray-100/50 dark:bg-gray-900/30 rounded-3xl p-4 border border-gray-200/50 dark:border-gray-800/50 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Packing
              </h3>
              <span className="bg-white dark:bg-gray-800 text-xs font-black px-2 py-1 rounded-lg">{packingOrders.length}</span>
            </div>
            <div className="flex flex-col gap-4 flex-1">
              <AnimatePresence>
                {isLoading ? (
                  Array.from({ length: 1 }).map((_, i) => (
                    <motion.div key={`sk2-${i}`} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-orange-100 dark:border-orange-900/50 flex flex-col gap-3">
                      <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="w-24 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse mt-2"></div>
                    </motion.div>
                  ))
                ) : packingOrders.map(order => (
                  <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} key={order.id} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-orange-100 dark:border-orange-900/50 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded-md text-gray-600 dark:text-gray-400">
                        #{order.id.slice(0,6).toUpperCase()}
                      </span>
                    </div>
                    <div className="font-black text-gray-900 dark:text-white text-lg">₹{order.totalAmount}</div>
                    <button onClick={() => handleUpdateStatus(order.id, order.status)} className="mt-2 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-sm active:scale-95 transition-all flex items-center justify-center gap-2">
                      <PackageOpen className="w-4 h-4" /> Mark Packed
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* READY */}
          <div className="bg-gray-100/50 dark:bg-gray-900/30 rounded-3xl p-4 border border-gray-200/50 dark:border-gray-800/50 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Ready
              </h3>
              <span className="bg-white dark:bg-gray-800 text-xs font-black px-2 py-1 rounded-lg">{readyOrders.length}</span>
            </div>
            <div className="flex flex-col gap-4 flex-1">
              <AnimatePresence>
                {isLoading ? (
                  Array.from({ length: 1 }).map((_, i) => (
                    <motion.div key={`sk3-${i}`} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-emerald-100 dark:border-emerald-900/50 flex flex-col gap-3">
                      <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </motion.div>
                  ))
                ) : readyOrders.map(order => (
                  <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} key={order.id} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-emerald-100 dark:border-emerald-900/50 opacity-80 hover:opacity-100 transition-opacity flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded-md text-gray-600 dark:text-gray-400">
                        #{order.id.slice(0,6).toUpperCase()}
                      </span>
                    </div>
                    <div className="font-black text-emerald-600 dark:text-emerald-400 text-lg flex items-center gap-2">
                       <CheckCircle2 className="w-5 h-5" /> Awaiting Pickup
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
