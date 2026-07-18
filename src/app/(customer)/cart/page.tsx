"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { Minus, Plus, ShoppingCart, Tag, ChevronRight, CheckCircle2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/layout/PageHeader';
import EmptyState from '@/components/ui/EmptyState';
import SurgeDisclosure from '@/components/ui/SurgeDisclosure';
import { calculateSurge } from '@/lib/utils/surgeCalc';

const MOCK_COUPONS: Record<string, { type: 'flat' | 'percent', value: number }> = {
  'TRUSTBITE50': { type: 'flat', value: 50 },
  'WELCOME': { type: 'percent', value: 10 },
};

export default function CartPage() {
  const router = useRouter();
  const { items, itemCount, cartTotal, updateQuantity, appliedCoupon, discountAmount, setCoupon } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [surge] = useState(() => calculateSurge());

  if (itemCount === 0) {
    return (
      <div className="h-full flex flex-col">
        <PageHeader title="Your Cart" />
        <EmptyState 
          icon={ShoppingCart} 
          title="Cart is empty" 
          description="Looks like you haven't added anything to your cart yet." 
          action={<button onClick={() => router.push('/')} className="w-full bg-red-500 text-white font-bold py-3 rounded-xl shadow-lg">Browse Restaurants</button>}
        />
      </div>
    );
  }

  const deliveryFee = 50;
  const tax = Math.round(cartTotal * 0.05); // 5% tax
  const finalTotal = cartTotal + deliveryFee + surge.amount + tax - discountAmount;

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponCode.toUpperCase().trim();
    const coupon = MOCK_COUPONS[code];
    
    if (!coupon) {
      setCouponError('Invalid coupon code');
      return;
    }

    let calculatedDiscount = 0;
    if (coupon.type === 'flat') {
      calculatedDiscount = coupon.value;
    } else if (coupon.type === 'percent') {
      calculatedDiscount = Math.round(cartTotal * (coupon.value / 100));
    }

    setCoupon(code, calculatedDiscount);
    setCouponCode('');
  };

  const handleRemoveCoupon = () => {
    setCoupon(null, 0);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-6rem)] bg-gray-50 dark:bg-gray-950 pb-32">
      <PageHeader title={`Cart (${itemCount} items)`} />

      <div className="px-4 py-2 flex flex-col gap-6">
        
        {/* Line Items */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex flex-col gap-6">
            {items.map((item) => (
              <div key={item.cartItemId} className="flex flex-col border-b border-gray-50 dark:border-gray-800 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-start gap-3">
                    <img 
                      src={item.menuItem.imageUrl} 
                      alt={item.menuItem.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 bg-gray-100 dark:bg-gray-800"
                    />
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-3.5 h-3.5 rounded-sm border ${item.menuItem.isVeg ? 'border-green-500' : 'border-red-500'} flex items-center justify-center shrink-0`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${item.menuItem.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white leading-tight">{item.menuItem.name}</span>
                      </div>
                      {(item.variantId || (item.addonIds && item.addonIds.length > 0)) && (
                        <div className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                          {item.variantId && <span>{item.menuItem.variants?.find(v => v.id === item.variantId)?.name} </span>}
                          {item.addonIds && item.addonIds.length > 0 && (
                            <span>+ {item.addonIds.map(id => item.menuItem.addons?.find(a => a.id === id)?.name).join(', ')}</span>
                          )}
                        </div>
                      )}
                      <span className="font-semibold text-gray-900 dark:text-white mt-1">₹{item.totalPrice}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-red-50 dark:bg-red-950/30 text-red-600 rounded-xl px-2 py-1.5 border border-red-100 dark:border-red-900/50 font-bold shrink-0 shadow-sm">
                    <button onClick={() => updateQuantity(item.cartItemId, -1)} className="p-1 text-red-500 hover:text-red-700 active:scale-90 transition-transform"><Minus className="w-4 h-4" /></button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.cartItemId, 1)} className="p-1 text-red-500 hover:text-red-700 active:scale-90 transition-transform"><Plus className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Offers & Benefits */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 text-gray-900 dark:text-white font-bold mb-4">
            <Tag className="w-5 h-5 text-blue-500" /> Offers & Benefits
          </div>
          
          {appliedCoupon ? (
            <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                <div className="flex flex-col">
                  <span className="font-bold text-blue-700 dark:text-blue-400">'{appliedCoupon}' applied</span>
                  <span className="text-xs text-blue-600 dark:text-blue-500 font-semibold">₹{discountAmount} savings</span>
                </div>
              </div>
              <button onClick={handleRemoveCoupon} className="text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  placeholder="Enter TRUSTBITE50 or WELCOME" 
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  className="flex-1 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold uppercase tracking-wider"
                />
                <button 
                  onClick={handleApplyCoupon}
                  disabled={!couponCode.trim()}
                  className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold px-5 py-3 rounded-xl disabled:opacity-50 transition-opacity"
                >
                  Apply
                </button>
              </div>
              {couponError && <span className="text-red-500 text-xs font-semibold ml-2">{couponError}</span>}
            </div>
          )}
        </div>

        {/* Bill Details */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Bill Summary</h3>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between font-semibold text-gray-600 dark:text-gray-400">
              <span>Item Total</span>
              <span className="text-gray-900 dark:text-white">₹{cartTotal}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-600 dark:text-gray-400">
              <span className="flex items-center">Delivery Partner Fee <SurgeDisclosure details={surge.details} totalAmount={surge.amount} /></span>
              <span className="text-gray-900 dark:text-white">₹{deliveryFee + surge.amount}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-600 dark:text-gray-400">
              <span>Taxes</span>
              <span className="text-gray-900 dark:text-white">₹{tax}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between font-bold text-blue-600 dark:text-blue-400 pt-1">
                <span>Discount applied</span>
                <span>- ₹{discountAmount}</span>
              </div>
            )}
            <div className="w-full h-[1px] bg-gray-200 dark:bg-gray-800 my-2" />
            <div className="flex justify-between font-black text-lg text-gray-900 dark:text-white">
              <span>Grand Total</span>
              <span>₹{finalTotal}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Floating Checkout Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 pb-safe z-40 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
        <button onClick={() => router.push('/checkout')} className="w-full bg-red-500 text-white font-black text-lg rounded-2xl py-4 shadow-xl shadow-red-500/30 flex items-center justify-between px-6 active:scale-95 transition-transform">
          <span>₹{finalTotal}</span>
          <span className="flex items-center gap-1">Proceed to Pay <ChevronRight className="w-5 h-5" /></span>
        </button>
      </div>

    </div>
  );
}
