"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Phone, MessageCircle, CheckCircle2, Package, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { list as listOrders, update as updateOrder } from '@/lib/services/order.service';
import { Order } from '@/lib/types/order';

export default function ActiveOrderPage() {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function load() {
      const orders = await listOrders();
      // Find any order that's active (placed, accepted, preparing, ready, picked_up, on_the_way)
      const active = orders.find(o => ['ready', 'picked_up', 'on_the_way', 'preparing'].includes(o.status));
      setOrder(active || null);
    }
    load();
  }, []);

  const handleStatusUpdate = async () => {
    if (!order) return;
    
    let nextStatus: any = 'delivered';
    if (order.status === 'ready' || order.status === 'preparing') nextStatus = 'on_the_way';
    
    const updated = await updateOrder(order.id, { 
      status: nextStatus,
      statusTimestamps: { ...order.statusTimestamps, [nextStatus]: new Date().toISOString() }
    });
    
    if (nextStatus === 'delivered') {
      setOrder(null);
      router.push('/delivery/home');
    } else {
      setOrder(updated);
    }
  };

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <Package className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" />
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">No Active Orders</h2>
        <p className="text-gray-500 font-medium mt-2">Go online to receive delivery requests.</p>
      </div>
    );
  }

  const isHeadingToDrop = order.status === 'on_the_way';

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto w-full">
      
      {/* Map Placeholder */}
      <div className="h-48 w-full bg-gray-200 dark:bg-gray-800 rounded-3xl overflow-hidden relative border border-gray-300 dark:border-gray-700 shadow-inner flex items-center justify-center">
         <Navigation className="w-8 h-8 text-gray-400 opacity-50" />
         <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.1) 1px, transparent 0)', backgroundSize: '20px 20px' }} />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-black text-xl text-gray-900 dark:text-white flex items-center gap-2">
            {isHeadingToDrop ? (
              <><MapPin className="w-5 h-5 text-blue-500" /> Drop Location</>
            ) : (
              <><Package className="w-5 h-5 text-orange-500" /> Pickup Location</>
            )}
          </h2>
          <span className="font-bold text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-full">
            #{order.id.slice(0,6).toUpperCase()}
          </span>
        </div>

        <div className="flex flex-col gap-1 mb-8">
          <p className="font-black text-2xl text-gray-900 dark:text-white leading-tight">
            {isHeadingToDrop ? 'HSR Layout, Sector 2' : 'Koramangala Restaurant'}
          </p>
          <p className="text-gray-500 font-medium text-sm">
            {isHeadingToDrop ? 'Customer: Rahul Kumar' : 'Order is ready for pickup'}
          </p>
        </div>

        <div className="flex gap-3 mb-8">
          <button className="flex-1 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 font-bold py-3 rounded-2xl flex items-center justify-center gap-2">
            <Phone className="w-4 h-4" /> Call
          </button>
          <button className="flex-1 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-bold py-3 rounded-2xl flex items-center justify-center gap-2">
            <MessageCircle className="w-4 h-4" /> Message
          </button>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 flex justify-between items-center mb-8 border border-gray-100 dark:border-gray-700">
           <div className="flex flex-col">
             <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Order Value</span>
             <span className="font-black text-gray-900 dark:text-white text-lg">₹{order.totalAmount}</span>
           </div>
           <div className="flex flex-col text-right">
             <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Items</span>
             <span className="font-black text-gray-900 dark:text-white text-lg">{order.items.length}</span>
           </div>
        </div>

        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={handleStatusUpdate}
          className={`w-full font-black text-white py-5 rounded-2xl shadow-xl flex items-center justify-center gap-2 text-lg transition-colors ${isHeadingToDrop ? 'bg-green-500 hover:bg-green-600 shadow-green-500/30' : 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/30'}`}
        >
          {isHeadingToDrop ? (
            <><CheckCircle2 className="w-6 h-6" /> Mark Delivered</>
          ) : (
            <><Package className="w-6 h-6" /> Mark Picked Up</>
          )}
        </motion.button>
        
      </div>
    </div>
  );
}
