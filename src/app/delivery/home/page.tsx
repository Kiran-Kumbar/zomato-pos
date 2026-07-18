"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Power, MapPin, Navigation, Banknote, X, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { list as listOrders, update as updateOrder } from '@/lib/services/order.service';
import { Order } from '@/lib/types/order';

export default function DeliveryHome() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(false);
  const [incomingOrder, setIncomingOrder] = useState<Order | null>(null);
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isOnline && !incomingOrder) {
      // Simulate waiting for an order assignment (3 seconds)
      timer = setTimeout(async () => {
        const orders = await listOrders();
        // Grab any order that needs delivery for demo
        const pending = orders.find(o => ['placed', 'accepted', 'preparing', 'ready'].includes(o.status));
        if (pending) {
          setIncomingOrder(pending);
          setCountdown(15);
        }
      }, 3000);
    }
    
    return () => clearTimeout(timer);
  }, [isOnline, incomingOrder]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (incomingOrder && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    } else if (incomingOrder && countdown === 0) {
      // Auto reject on timeout
      setIncomingOrder(null);
    }
    return () => clearInterval(timer);
  }, [incomingOrder, countdown]);

  const handleAccept = async () => {
    if (!incomingOrder) return;
    // In real app, we'd assign this to the partner ID
    await updateOrder(incomingOrder.id, { deliveryPartnerId: 'd1' });
    router.push('/delivery/active-order');
  };

  const handleReject = () => {
    setIncomingOrder(null);
  };

  // SVG circle calculation
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - ((countdown / 15) * circumference);

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-8rem)]">
      
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Background Map Placeholder */}
        <div className="absolute inset-0 z-0 opacity-10 dark:opacity-5 pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, gray 1px, transparent 0)', backgroundSize: '24px 24px' }} 
        />
        
        <AnimatePresence mode="wait">
          {!incomingOrder ? (
            <motion.div 
              key="toggle"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="z-10 flex flex-col items-center"
            >
              <button 
                onClick={() => setIsOnline(!isOnline)}
                className={`w-32 h-32 rounded-full flex flex-col items-center justify-center gap-2 shadow-2xl transition-all duration-500 ${isOnline ? 'bg-blue-500 text-white shadow-blue-500/40 ring-8 ring-blue-500/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 ring-8 ring-gray-200 dark:ring-gray-800'}`}
              >
                <Power className={`w-10 h-10 ${isOnline ? 'animate-pulse' : ''}`} />
                <span className="font-black text-lg tracking-widest uppercase">{isOnline ? 'Online' : 'Offline'}</span>
              </button>
              
              <p className="mt-8 font-bold text-gray-500 h-6">
                {isOnline ? "Looking for orders near you..." : "Go online to start earning"}
              </p>
            </motion.div>
          ) : (
            <motion.div 
              key="incoming"
              initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              className="z-10 w-full max-w-sm bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-gray-800"
            >
              <div className="flex flex-col items-center mb-6 relative">
                <div className="relative flex items-center justify-center">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-100 dark:text-gray-800" />
                    <motion.circle 
                      cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" 
                      className={`${countdown > 5 ? 'text-blue-500' : 'text-red-500'}`}
                      strokeDasharray={circumference}
                      animate={{ strokeDashoffset }}
                      transition={{ duration: 1, ease: "linear" }}
                    />
                  </svg>
                  <div className="absolute font-black text-3xl text-gray-900 dark:text-white">
                    {countdown}
                  </div>
                </div>
                <h2 className="text-xl font-black mt-4 text-gray-900 dark:text-white">New Request!</h2>
              </div>

              <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Banknote className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Est. Earn</span>
                    <span className="font-black text-2xl text-gray-900 dark:text-white">₹72</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Dist</span>
                  <span className="font-black text-lg text-gray-900 dark:text-white">4.2 km</span>
                </div>
              </div>

              <div className="relative pl-6 py-2 mb-8">
                <div className="absolute left-2.5 top-3 bottom-3 w-[2px] bg-gray-200 dark:bg-gray-700" />
                <div className="mb-4 relative">
                  <div className="absolute -left-[23px] top-1 w-4 h-4 rounded-full bg-orange-100 border-4 border-white dark:border-gray-900 flex items-center justify-center">
                     <div className="w-2 h-2 rounded-full bg-orange-500" />
                  </div>
                  <p className="font-bold text-sm text-gray-900 dark:text-white">Koramangala Restaurant</p>
                  <p className="text-xs text-gray-500 font-medium">Pickup (1.2 km away)</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[23px] top-1 w-4 h-4 rounded-full bg-blue-100 border-4 border-white dark:border-gray-900 flex items-center justify-center">
                     <div className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                  <p className="font-bold text-sm text-gray-900 dark:text-white">HSR Layout, Sector 2</p>
                  <p className="text-xs text-gray-500 font-medium">Drop (3.0 km away)</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={handleReject} className="flex-1 py-4 rounded-2xl font-black text-gray-500 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex justify-center items-center gap-2">
                  <X className="w-5 h-5" /> Reject
                </button>
                <button onClick={handleAccept} className="flex-1 py-4 rounded-2xl font-black text-white bg-blue-500 hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30 flex justify-center items-center gap-2">
                  <Check className="w-5 h-5" /> Accept
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
