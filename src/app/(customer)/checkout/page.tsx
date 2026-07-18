"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { create as createOrder } from '@/lib/services/order.service';
import { MapPin, CreditCard, Banknote, Smartphone, Leaf, ChevronRight, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/layout/PageHeader';
import EmptyState from '@/components/ui/EmptyState';
import SurgeDisclosure from '@/components/ui/SurgeDisclosure';
import { calculateSurge } from '@/lib/utils/surgeCalc';
import { toast } from 'sonner';

const ADDRESSES = [
  { id: 'a1', label: 'Home', text: '123 MG Road, Bangalore, 560001' },
  { id: 'a2', label: 'Work', text: 'Prestige Tech Park, Marathahalli, Bangalore' }
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, cartTotal, discountAmount, isEcoDelivery, setEcoDelivery, clearCart, restaurantId } = useCartStore();
  const { role } = useAuthStore();
  
  const [selectedAddress, setSelectedAddress] = useState(ADDRESSES[0].id);
  const [selectedPayment, setSelectedPayment] = useState<'upi' | 'card' | 'cod'>('upi');
  const [isPlacing, setIsPlacing] = useState(false);
  const [surge, setSurge] = useState({ amount: 0, details: [] as any[] });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setSurge(calculateSurge());
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 pb-32">
        <PageHeader title="Checkout" />
        <div className="p-4 flex flex-col gap-6 animate-pulse mt-4">
          <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-3xl" />
          <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-3xl" />
          <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-3xl" />
        </div>
      </div>
    );
  }

  // Totals Calc
  const baseDeliveryFee = 50;
  const ecoDiscount = isEcoDelivery ? 10 : 0;
  const finalDeliveryFee = baseDeliveryFee - ecoDiscount + surge.amount;
  const tax = Math.round(cartTotal * 0.05);
  const finalTotal = cartTotal + finalDeliveryFee + tax - discountAmount;

  if (items.length === 0 && !isPlacing) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 pb-32">
        <PageHeader title="Checkout" />
        <div className="flex-1 p-4 flex flex-col justify-center mt-6">
          <EmptyState 
            icon={ShoppingBag} 
            title="Your cart is empty" 
            description="Add some items before checking out."
            action={<button onClick={() => router.push('/')} className="w-full px-6 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors">Browse Restaurants</button>}
          />
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setIsPlacing(true);
    try {
      const newOrder = await createOrder({
        userId: 'u1', // mock user ID
        restaurantId: restaurantId || 'unknown',
        items: items.map(i => ({
          menuItemId: i.menuItem.id,
          quantity: i.quantity,
          variantId: i.variantId,
          addonIds: i.addonIds,
          price: i.totalPrice
        })),
        totalAmount: finalTotal,
        status: 'placed',
        createdAt: new Date().toISOString()
      });

      toast.success('Order placed successfully!');
      clearCart();
      router.push(`/orders/${newOrder.id}/track`);
    } catch (err) {
      console.error(err);
      setIsPlacing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 pb-32">
      <PageHeader title="Checkout" />

      <div className="px-4 py-2 flex flex-col gap-6">
        
        {/* Address Selection */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" /> Delivery Address
          </h3>
          <div className="flex flex-col gap-3">
            {ADDRESSES.map(addr => (
              <label key={addr.id} className={`flex items-start gap-3 p-4 rounded-2xl cursor-pointer border-2 transition-all ${selectedAddress === addr.id ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20' : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'}`}>
                <input 
                  type="radio" 
                  name="address" 
                  checked={selectedAddress === addr.id}
                  onChange={() => setSelectedAddress(addr.id)}
                  className="mt-1 w-4 h-4 text-red-500 accent-red-500"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900 dark:text-white">{addr.label}</span>
                  <span className="text-sm text-gray-500 font-medium leading-relaxed mt-0.5">{addr.text}</span>
                </div>
              </label>
            ))}
            <button className="text-red-500 font-bold text-sm text-left px-2 py-1 hover:underline w-max">
              + Add new address
            </button>
          </div>
        </div>

        {/* Eco Delivery Toggle */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-emerald-100 dark:border-emerald-900/30 flex items-start gap-4">
          <div className="bg-emerald-100 dark:bg-emerald-900/40 p-2.5 rounded-full shrink-0">
            <Leaf className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-emerald-800 dark:text-emerald-400">Eco Delivery</h3>
              <button 
                onClick={() => setEcoDelivery(!isEcoDelivery)}
                className={`w-12 h-6 rounded-full p-1 transition-colors relative ${isEcoDelivery ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'}`}
              >
                <motion.div 
                  layout 
                  className="w-4 h-4 bg-white rounded-full shadow-sm"
                  animate={{ x: isEcoDelivery ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
            <p className="text-sm text-emerald-600 dark:text-emerald-500/80 font-medium leading-tight pr-4">
              Slightly slower, ₹10 off, fewer solo trips
            </p>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Payment Method</h3>
          <div className="flex flex-col gap-3">
            {[
              { id: 'upi', label: 'Pay via UPI', icon: Smartphone },
              { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
              { id: 'cod', label: 'Cash on Delivery', icon: Banknote },
            ].map(method => (
              <label key={method.id} className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer border-2 transition-all ${selectedPayment === method.id ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20' : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  checked={selectedPayment === method.id}
                  onChange={() => setSelectedPayment(method.id as any)}
                  className="w-4 h-4 text-red-500 accent-red-500"
                />
                <method.icon className={`w-5 h-5 ${selectedPayment === method.id ? 'text-red-500' : 'text-gray-400'}`} />
                <span className="font-bold text-gray-900 dark:text-white">{method.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Bill Summary */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 mb-8">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Bill Summary</h3>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between font-medium text-gray-600 dark:text-gray-400">
              <span>Item Total</span>
              <span className="text-gray-900 dark:text-white">₹{cartTotal}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between font-medium text-green-600">
                <span>Discount</span>
                <span>-₹{discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between font-medium text-gray-600 dark:text-gray-400">
              <span className="flex items-center">Delivery Fee <SurgeDisclosure details={surge.details} totalAmount={surge.amount} /></span>
              <span className="text-gray-900 dark:text-white">₹{finalDeliveryFee}</span>
            </div>
            {isEcoDelivery && (
              <div className="flex justify-between font-medium text-emerald-600">
                <span>Eco Delivery Discount</span>
                <span>-₹10</span>
              </div>
            )}
            <div className="flex justify-between font-medium text-gray-600 dark:text-gray-400">
              <span>Taxes and Charges</span>
              <span className="text-gray-900 dark:text-white">₹{tax}</span>
            </div>
            <div className="w-full h-[1px] bg-gray-100 dark:bg-gray-800 my-2" />
            <div className="flex justify-between font-black text-lg text-gray-900 dark:text-white">
              <span>To Pay</span>
              <span>₹{finalTotal}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Place Order Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 pb-safe z-40 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
        <button 
          onClick={handlePlaceOrder}
          disabled={isPlacing}
          className="w-full bg-red-500 text-white font-black text-lg rounded-2xl py-4 shadow-xl shadow-red-500/30 flex items-center justify-between px-6 active:scale-95 transition-transform disabled:opacity-70 disabled:scale-100"
        >
          {isPlacing ? (
            <div className="flex justify-center w-full">
              <span className="animate-pulse">Placing Order...</span>
            </div>
          ) : (
            <>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[11px] uppercase tracking-wider opacity-90">Total to pay</span>
                <span>₹{finalTotal}</span>
              </div>
              <span className="flex items-center gap-1">Place Order <ChevronRight className="w-5 h-5" /></span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
