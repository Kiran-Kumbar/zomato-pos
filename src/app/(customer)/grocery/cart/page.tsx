"use client";

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ShoppingCart, 
  Minus, 
  Plus, 
  Trash2, 
  ChevronLeft, 
  Clock, 
  Store, 
  Wallet,
  AlertTriangle,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useGroceryCartStore } from '@/store/groceryCartStore';
import { useBudgetStore } from '@/store/budgetStore';
import { getVendorById } from '@/lib/services/groceryVendor.service';
import { GroceryVendor } from '@/lib/types/grocery-ecosystem';

export default function GroceryCartPage() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart } = useGroceryCartStore();
  const { spentThisMonth, monthlyLimit } = useBudgetStore();
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [vendorsMap, setVendorsMap] = useState<Record<string, GroceryVendor>>({});

  // Toggle selection for partial checkout
  const toggleSelection = (productId: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(productId)) newSet.delete(productId);
    else newSet.add(productId);
    setSelectedIds(newSet);
  };

  // Ensure items added to cart are selected by default when page loads
  useEffect(() => {
    if (cartItems.length > 0 && selectedIds.size === 0) {
      setSelectedIds(new Set(cartItems.map(item => item.product.id)));
    }
  }, [cartItems]);

  // Fetch Vendor details to show in price panel
  useEffect(() => {
    const fetchVendors = async () => {
      const vendorIds = Array.from(new Set(cartItems.map(item => item.product.vendorId)));
      const vMap: Record<string, GroceryVendor> = {};
      
      await Promise.all(
        vendorIds.map(async (vId) => {
          const v = await getVendorById(vId);
          if (v) vMap[vId] = v;
        })
      );
      setVendorsMap(vMap);
    };
    
    if (cartItems.length > 0) fetchVendors();
  }, [cartItems]);

  // Derived values for the Price Panel
  const { selectedTotal, allTotal, selectedCount, uniqueVendors, maxEta } = useMemo(() => {
    let sTotal = 0;
    let aTotal = 0;
    let sCount = 0;
    const vIds = new Set<string>();
    let eta = 0;

    cartItems.forEach(item => {
      const itemTotal = item.product.price * item.quantity;
      aTotal += itemTotal;
      
      if (selectedIds.has(item.product.id)) {
        sTotal += itemTotal;
        sCount += item.quantity;
        vIds.add(item.product.vendorId);
        
        const vendorEta = vendorsMap[item.product.vendorId]?.etaMins || 0;
        if (vendorEta > eta) eta = vendorEta;
      }
    });

    return { 
      selectedTotal: sTotal, 
      allTotal: aTotal,
      selectedCount: sCount,
      uniqueVendors: Array.from(vIds).map(id => vendorsMap[id]?.name || 'Unknown Vendor'),
      maxEta: eta
    };
  }, [cartItems, selectedIds, vendorsMap]);

  const deliveryFee = selectedTotal > 0 ? (selectedTotal > 500 ? 0 : 40) : 0;
  const savings = selectedTotal * 0.1; // Mock 10% savings
  const finalTotal = selectedTotal + deliveryFee - savings;
  
  // Budget calculations
  const totalAfterPurchase = spentThisMonth + finalTotal;
  const budgetPercentage = Math.min((totalAfterPurchase / monthlyLimit) * 100, 100);
  const isOverBudget = totalAfterPurchase > monthlyLimit;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] pt-24 pb-32 flex flex-col items-center justify-center gap-6">
        <div className="w-24 h-24 bg-[#FF5A36]/10 rounded-full flex items-center justify-center">
          <ShoppingCart className="w-12 h-12 text-[#FF5A36]" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black mb-2 text-gray-900 dark:text-white">Your cart is empty</h2>
          <p className="text-gray-500 dark:text-gray-400">Time to fill it with fresh groceries!</p>
        </div>
        <button 
          onClick={() => router.push('/grocery')}
          className="bg-[#FF5A36] hover:bg-[#E23744] text-white font-bold px-8 py-3 rounded-full transition-colors"
        >
          Browse Groceries
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] pt-20 md:pt-28 pb-48 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        <section className="flex flex-col gap-6 mt-4 mb-8">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight"
            >
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A36] to-orange-400">Grocery</span> Cart.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-2 text-gray-500 dark:text-gray-400 font-medium"
            >
              Review your items and proceed to checkout.
            </motion.p>
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Main Cart Items Area */}
          <div className="flex-1 w-full flex flex-col gap-4">
            <AnimatePresence>
              {cartItems.map((item) => {
                const isSelected = selectedIds.has(item.product.id);
                return (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`flex items-center gap-4 p-4 rounded-3xl border transition-all ${
                      isSelected 
                        ? 'bg-white dark:bg-gray-900 border-[#FF5A36]/30 shadow-md shadow-emerald-500/5' 
                        : 'bg-white/50 dark:bg-gray-900/50 border-gray-200/50 dark:border-gray-800/50 opacity-70'
                    }`}
                  >
                    {/* Custom Checkbox */}
                    <div 
                      onClick={() => toggleSelection(item.product.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors shrink-0 ${
                        isSelected 
                          ? 'bg-[#FF5A36] border-[#FF5A36] text-white' 
                          : 'border-gray-300 dark:border-gray-700 bg-transparent text-transparent'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </div>

                    {/* Image */}
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center overflow-hidden shrink-0">
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-3/4 h-3/4 object-contain mix-blend-multiply dark:mix-blend-normal" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider truncate">{item.product.brand}</div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm md:text-base leading-tight truncate">{item.product.name}</h3>
                      <div className="text-xs text-gray-500 font-medium mb-1">{item.product.weight}</div>
                      <div className="font-black text-[#FF5A36]">₹{item.product.price}</div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col items-end justify-between h-full gap-2 shrink-0">
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden h-9">
                        <button 
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="w-8 h-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center font-bold text-sm text-gray-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="w-8 h-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Sticky Live Price Panel */}
          <div className="w-full lg:w-[400px] fixed bottom-0 left-0 right-0 lg:static z-40 lg:z-auto">
            <div className="bg-white/80 dark:bg-gray-900/80 lg:bg-white lg:dark:bg-gray-900 backdrop-blur-xl lg:backdrop-blur-none border-t lg:border border-gray-200 dark:border-gray-800 lg:rounded-[2rem] p-5 md:p-8 lg:sticky lg:top-28 shadow-2xl lg:shadow-xl flex flex-col gap-6 rounded-t-3xl transition-all">
              
              {/* Budget Mode Indicator */}
              <div className="flex flex-col gap-2 bg-gray-50 dark:bg-black/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                    <Wallet className="w-4 h-4 text-[#FF5A36]" /> Budget Mode
                  </span>
                  <span className={isOverBudget ? 'text-red-500' : 'text-[#FF5A36]'}>
                    ₹{totalAfterPurchase.toFixed(0)} / ₹{monthlyLimit}
                  </span>
                </div>
                
                <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${budgetPercentage}%` }}
                    className={`h-full rounded-full transition-colors duration-500 ${isOverBudget ? 'bg-red-500' : 'bg-[#FF5A36]'}`}
                  />
                </div>
                
                {isOverBudget && (
                  <div className="text-[11px] font-bold text-red-500 flex items-center gap-1 mt-1">
                    <AlertTriangle className="w-3 h-3" /> This order exceeds your monthly grocery limit.
                  </div>
                )}
              </div>

              {/* Order Meta info */}
              <div className="flex gap-4">
                <div className="flex-1 bg-[#FF5A36]/10 dark:bg-[#FF5A36]/5 p-3 rounded-xl border border-purple-100 dark:border-[#FF5A36]/10 flex flex-col gap-1">
                  <div className="text-xs text-[#FF5A36]/70 font-bold uppercase tracking-wider">Vendors</div>
                  <div className="font-bold text-sm text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                    <Store className="w-4 h-4" /> 
                    <span className="truncate">{uniqueVendors.length > 1 ? `${uniqueVendors.length} Vendors` : uniqueVendors[0] || 'Unknown'}</span>
                  </div>
                </div>
                <div className="flex-1 bg-emerald-50 dark:bg-[#FF5A36]/5 p-3 rounded-xl border border-emerald-100 dark:border-[#FF5A36]/10 flex flex-col gap-1">
                  <div className="text-xs text-emerald-600/70 font-bold uppercase tracking-wider">Delivery Time</div>
                  <div className="font-bold text-sm text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> 
                    {maxEta} mins
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400 font-medium">
                  <span>Selected Items ({selectedCount})</span>
                  <span>₹{selectedTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400 font-medium">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? <span className="text-[#FF5A36] font-bold">FREE</span> : `₹${deliveryFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-[#FF5A36] font-bold">
                  <span>Total Savings</span>
                  <span>-₹{savings.toFixed(2)}</span>
                </div>
                <div className="w-full h-px bg-gray-200 dark:bg-gray-800 my-1"></div>
                <div className="flex justify-between text-xl font-black text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 mt-2">
                <button 
                  disabled={selectedCount === 0}
                  className="flex-1 w-full bg-[#FF5A36] disabled:bg-[#FF5A36]/50 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                >
                  Add Selected Items <ArrowRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setSelectedIds(new Set(cartItems.map(i => i.product.id)))}
                  disabled={selectedCount === cartItems.length}
                  className="flex-1 w-full bg-gray-900 disabled:bg-gray-900/50 dark:bg-white dark:disabled:bg-white/50 hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 font-bold py-4 rounded-xl transition-all"
                >
                  Buy Everything (₹{(allTotal + deliveryFee - (allTotal * 0.1)).toFixed(0)})
                </button>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
