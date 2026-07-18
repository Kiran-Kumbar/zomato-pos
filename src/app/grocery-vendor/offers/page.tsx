"use client";

import { useState } from 'react';
import { Tag, Plus, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_OFFERS = [
  { id: 'o1', code: 'DIWALI20', discount: '20%', minOrder: 500, maxCap: 200, status: 'Active', used: 145 },
  { id: 'o2', code: 'FRESH50', discount: 'Flat ₹50', minOrder: 300, maxCap: 50, status: 'Active', used: 89 },
  { id: 'o3', code: 'WEEKEND', discount: '10%', minOrder: 1000, maxCap: 150, status: 'Paused', used: 412 },
];

export default function GroceryOffersPage() {
  const [offers] = useState(MOCK_OFFERS);

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Discount & Offers</h1>
          <p className="text-gray-500 font-medium mt-1">Boost sales with targeted promotions.</p>
        </div>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" /> Create Offer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {offers.map((offer) => (
            <motion.div 
              key={offer.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col relative overflow-hidden"
            >
              {/* Badge */}
              <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl font-bold text-xs ${offer.status === 'Active' ? 'bg-emerald-500 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'}`}>
                {offer.status}
              </div>

              <div className="flex items-center gap-3 mb-6 mt-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500">
                  <Tag className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-black text-2xl tracking-wider text-gray-900 dark:text-white">{offer.code}</div>
                  <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest">{offer.discount} OFF</div>
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-6 border-y border-gray-100 dark:border-gray-800 py-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Min. Order Value</span>
                  <span className="font-bold text-gray-900 dark:text-white">₹{offer.minOrder}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Max Discount Cap</span>
                  <span className="font-bold text-gray-900 dark:text-white">₹{offer.maxCap}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-auto">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                  <CheckCircle2 className="w-4 h-4 text-gray-400" /> Used {offer.used} times
                </div>
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
