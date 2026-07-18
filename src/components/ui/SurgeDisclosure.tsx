"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, TrendingUp, Users, CloudRain, Moon, Sparkles, Zap, X } from 'lucide-react';
import { SurgeDetail } from '@/lib/utils/surgeCalc';

const iconMap = {
  'High Demand': TrendingUp,
  'Fewer Riders': Users,
  'Rain': CloudRain,
  'Late Night': Moon,
  'Festival': Sparkles,
};

export default function SurgeDisclosure({ details, totalAmount }: { details: SurgeDetail[], totalAmount: number }) {
  const [isOpen, setIsOpen] = useState(false);

  if (totalAmount <= 0) return null;

  return (
    <>
      <button 
        onClick={(e) => { e.preventDefault(); setIsOpen(true); }}
        className="inline-flex items-center justify-center ml-1.5 w-[18px] h-[18px] rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors border border-blue-200 dark:border-blue-800/50"
      >
        <Info className="w-3 h-3" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999]"
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 md:top-1/2 md:-translate-y-1/2 md:bottom-auto left-0 md:left-1/2 md:-translate-x-1/2 right-0 md:right-auto md:w-full md:max-w-md bg-white dark:bg-gray-900 rounded-t-3xl md:rounded-3xl z-[1000] p-6 pb-12 md:pb-6 shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <Zap className="w-6 h-6 text-blue-500 fill-current opacity-80" /> Dynamic Fee
                  </h3>
                  <p className="text-sm text-gray-500 font-medium mt-1 pr-6">
                    A small fee applied when conditions require extra effort from delivery partners.
                  </p>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-3 mb-8">
                {details.map((detail, idx) => {
                  const Icon = iconMap[detail.reason] || Zap;
                  return (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 dark:text-white leading-tight">{detail.reason}</span>
                          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5 pr-2 leading-snug">{detail.message}</span>
                        </div>
                      </div>
                      <span className="font-black text-gray-900 dark:text-white">₹{detail.amount}</span>
                    </div>
                  );
                })}
              </div>

              <button onClick={() => setIsOpen(false)} className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-4 rounded-2xl shadow-xl active:scale-95 transition-transform text-lg">
                Got it, thanks!
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
