"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, CheckCircle2, ShoppingCart, Receipt, UserRound } from 'lucide-react';
import { useGroceryCartStore } from '@/store/groceryCartStore';
import { getAllProducts } from '@/lib/services/groceryProduct.service';
import { GroceryProduct } from '@/lib/types/grocery-ecosystem';
import { useRouter } from 'next/navigation';

interface FamilyMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
}

const FAMILY_MEMBERS: FamilyMember[] = [
  { id: 'm1', name: 'Mom', role: 'Admin', avatar: '👩', color: 'bg-[#FF5A36]' },
  { id: 'm2', name: 'Dad', role: 'Member', avatar: '👨', color: 'bg-blue-500' },
  { id: 'm3', name: 'Kids', role: 'Member', avatar: '👧', color: 'bg-pink-500' },
];

export default function FamilyCartPage() {
  const router = useRouter();
  const { cartItems, addToCart, updateQuantity, markPaid } = useGroceryCartStore();
  const [products, setProducts] = useState<GroceryProduct[]>([]);
  const [activeMember, setActiveMember] = useState<string>(FAMILY_MEMBERS[0].id);
  const [splitMode, setSplitMode] = useState<'equal' | 'itemized'>('itemized');

  useEffect(() => {
    getAllProducts().then(setProducts);
  }, []);

  const handleMockAdd = (memberId: string) => {
    if (products.length === 0) return;
    // Mock logic: Mom adds Veggies, Dad adds Fruits, Kids add Snacks
    let prod: GroceryProduct;
    if (memberId === 'm1') {
      prod = products.find(p => p.categoryId === 'c1' || p.categoryId === 'c2') || products[0];
    } else if (memberId === 'm2') {
      prod = products.find(p => p.categoryId === 'c3' || p.categoryId === 'c4') || products[1];
    } else {
      prod = products.find(p => p.categoryId === 'c5' || p.categoryId === 'c6') || products[2];
    }
    addToCart(prod, memberId);
  };

  const totalCost = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  
  const getMemberTotal = (memberId: string) => {
    if (splitMode === 'equal') {
      return totalCost / FAMILY_MEMBERS.length;
    }
    return cartItems
      .filter(item => item.addedBy === memberId)
      .reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  };

  const isMemberPaid = (memberId: string) => {
    const items = cartItems.filter(item => item.addedBy === memberId);
    if (items.length === 0) return true; // nothing to pay
    return items.every(item => item.paymentStatus === 'paid');
  };

  const handlePayShare = (memberId: string) => {
    const items = cartItems.filter(item => item.addedBy === memberId);
    items.forEach(item => markPaid(item.cartItemId));
  };

  const allPaid = cartItems.length > 0 && cartItems.every(item => item.paymentStatus === 'paid');

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] pt-24 pb-32">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        
        <section className="flex flex-col gap-6 mt-4 mb-8">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight"
            >
              Family <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A36] to-orange-400">Shared</span> Cart.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-2 text-gray-500 dark:text-gray-400 font-medium"
            >
              Collaborate on groceries with your household.
            </motion.p>
          </div>
        </section>

        {/* Member Selector (Simulation Tool) */}
        <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 shadow-sm border border-gray-200 dark:border-gray-800 mb-8">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Simulate Adding Items</h3>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {FAMILY_MEMBERS.map(member => (
              <button 
                key={member.id}
                onClick={() => { setActiveMember(member.id); handleMockAdd(member.id); }}
                className={`flex-1 min-w-[120px] p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${activeMember === member.id ? 'border-[#FF5A36] bg-[#FF5A36]/10 dark:bg-purple-900/10' : 'border-gray-100 dark:border-gray-800 hover:border-purple-300'}`}
              >
                <div className="text-3xl">{member.avatar}</div>
                <div className="font-bold text-gray-900 dark:text-white text-sm">{member.name}</div>
                <div className="text-[10px] uppercase tracking-widest font-bold text-[#FF5A36] bg-[#FF5A36]/10 px-2 py-0.5 rounded-full">
                  Add Item
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Cart List */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-gray-400" /> Current Basket
            </h2>
            
            {cartItems.length === 0 ? (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-10 text-center border border-gray-100 dark:border-gray-800 border-dashed">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-bold">Basket is empty. Tap a family member above to simulate adding their preferred items.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <AnimatePresence>
                  {cartItems.map(item => {
                    const member = FAMILY_MEMBERS.find(m => m.id === item.addedBy);
                    return (
                      <motion.div 
                        key={item.cartItemId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4"
                      >
                        <div className="relative">
                          <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-xl p-2 flex items-center justify-center">
                            <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                          </div>
                          {member && (
                            <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-sm border-2 border-white dark:border-gray-900 ${member.color} text-white`} title={`Added by ${member.name}`}>
                              {member.avatar}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">{item.product.name}</h4>
                          <div className="text-xs text-gray-500 mt-0.5">{item.product.brand}</div>
                          <div className="text-sm font-black text-[#FF5A36] mt-1">₹{item.product.price}</div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-black text-gray-900 dark:text-white">x{item.quantity}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Bill Splitter */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Receipt className="w-5 h-5 text-gray-400" /> Split Bill
            </h2>
            
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-800 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              
              <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6">
                <button 
                  onClick={() => setSplitMode('itemized')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${splitMode === 'itemized' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500'}`}
                >
                  Itemized
                </button>
                <button 
                  onClick={() => setSplitMode('equal')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${splitMode === 'equal' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500'}`}
                >
                  Equal Split
                </button>
              </div>

              <div className="flex flex-col gap-4 mb-6">
                {FAMILY_MEMBERS.map(member => {
                  const share = getMemberTotal(member.id);
                  const paid = isMemberPaid(member.id);
                  const hasItems = cartItems.some(i => i.addedBy === member.id);
                  
                  if (!hasItems && splitMode === 'itemized') return null;

                  return (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="text-xl">{member.avatar}</div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{member.name}</span>
                          <span className="text-[10px] font-bold text-gray-400">{paid ? 'PAID' : 'PENDING'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-gray-900 dark:text-white">₹{share.toFixed(0)}</span>
                        {!paid && share > 0 && (
                          <button 
                            onClick={() => handlePayShare(member.id)}
                            className="bg-gray-900 dark:bg-white text-white dark:text-black px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors"
                          >
                            Pay
                          </button>
                        )}
                        {paid && share > 0 && (
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mb-6">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-gray-500">Total Basket</span>
                  <span className="text-3xl font-black text-gray-900 dark:text-white">₹{totalCost.toFixed(0)}</span>
                </div>
              </div>

              <button 
                onClick={() => router.push('/grocery/cart')}
                disabled={!allPaid || cartItems.length === 0}
                className={`w-full py-4 rounded-xl font-black text-white flex items-center justify-center transition-colors shadow-lg ${allPaid && cartItems.length > 0 ? 'bg-[#FF5A36] hover:bg-[#E23744] shadow-purple-500/30' : 'bg-gray-300 dark:bg-gray-800 text-gray-500 shadow-none'}`}
              >
                {allPaid && cartItems.length > 0 ? 'Proceed to Group Checkout' : 'Waiting for Payments'}
              </button>

            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
