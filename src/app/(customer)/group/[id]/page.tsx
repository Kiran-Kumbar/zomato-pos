"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Users, Lock, CheckCircle2, HandCoins, ArrowRight, UserPlus, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getById, update as updateGroupOrder } from '@/lib/services/groupOrder.service';
import { create as createOrder } from '@/lib/services/order.service';
import { list as listMenu } from '@/lib/services/menu.service';
import { GroupOrder, GroupOrderMember } from '@/lib/types/groupOrder';
import { MenuItem } from '@/lib/types/menuItem';
import PageHeader from '@/components/layout/PageHeader';

const MOCK_NAMES = ['Rahul', 'Priya', 'Amit', 'Sneha', 'Vikram'];

export default function GroupOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [groupOrder, setGroupOrder] = useState<GroupOrder | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [splitMode, setSplitMode] = useState<'equal' | 'itemized'>('itemized');
  const [linkCopied, setLinkCopied] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);

  useEffect(() => {
    params.then(p => {
      async function load() {
        const go = await getById(p.id);
        if (go) {
          setGroupOrder(go);
          const menu = await listMenu(go.restaurantId);
          setMenuItems(menu);
        }
      }
      load();
    });
  }, [params]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://trustbite.demo/join/${groupOrder?.id}`);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleSimulateJoin = async () => {
    if (!groupOrder || menuItems.length === 0) return;
    
    // Pick random items
    const randomItems = [];
    const count = Math.floor(Math.random() * 2) + 1; // 1 or 2 items
    for (let i = 0; i < count; i++) {
      const mi = menuItems[Math.floor(Math.random() * menuItems.length)];
      randomItems.push({
        menuItemId: mi.id,
        quantity: 1,
        price: mi.price
      });
    }

    const newMember: GroupOrderMember = {
      userId: `u${Math.floor(Math.random() * 1000)}`,
      name: MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)],
      items: randomItems,
      paymentStatus: 'pending'
    };

    const updated = await updateGroupOrder(groupOrder.id, {
      members: [...groupOrder.members, newMember]
    });
    setGroupOrder(updated);
  };

  const handleLockOrder = async () => {
    if (!groupOrder) return;
    const updated = await updateGroupOrder(groupOrder.id, { status: 'locked' });
    setGroupOrder(updated);
  };

  const handlePay = async (userId: string) => {
    if (!groupOrder) return;
    const newMembers = groupOrder.members.map(m => 
      m.userId === userId ? { ...m, paymentStatus: 'paid' as const } : m
    );
    const updated = await updateGroupOrder(groupOrder.id, { members: newMembers });
    setGroupOrder(updated);
  };

  const handlePlaceGroupOrder = async () => {
    if (!groupOrder) return;
    setIsPlacing(true);
    
    // Flatten all items
    const allItems = groupOrder.members.flatMap(m => m.items);
    
    const o = await createOrder({
      userId: groupOrder.hostUserId,
      restaurantId: groupOrder.restaurantId,
      items: allItems,
      totalAmount: totalBill,
      status: 'placed',
      createdAt: new Date().toISOString()
    });
    
    router.push(`/orders/${o.id}/track`);
  };

  if (!groupOrder || menuItems.length === 0) {
    return <div className="h-screen bg-gray-50 flex items-center justify-center animate-pulse">Loading Room...</div>;
  }

  const getItemName = (id: string) => menuItems.find(m => m.id === id)?.name || 'Item';
  
  const totalBill = groupOrder.members.reduce((acc, m) => {
    return acc + m.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, 0);

  const getMemberShare = (member: GroupOrderMember) => {
    if (splitMode === 'equal') {
      return groupOrder.members.length > 0 ? Math.round(totalBill / groupOrder.members.length) : 0;
    }
    return member.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const hasItems = groupOrder.members.some(m => m.items.length > 0);
  const allPaid = groupOrder.members.every(m => m.paymentStatus === 'paid' || m.items.length === 0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 pb-32">
      <PageHeader title="Group Order" />
      
      <div className="px-4 py-2 flex flex-col gap-6">
        
        {/* Header / Invite Code */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-purple-500/20">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-black mb-1">Group Session</h2>
              <p className="text-purple-100 text-sm font-medium">Ordering from your selected restaurant</p>
            </div>
            <Users className="w-8 h-8 opacity-50" />
          </div>
          
          <div className="mt-6 flex gap-2">
            <div className="flex-1 bg-white/20 backdrop-blur-md rounded-xl px-4 py-3 font-mono font-bold tracking-widest flex items-center justify-center border border-white/30">
              {groupOrder.id.substring(0, 8).toUpperCase()}
            </div>
            <button 
              onClick={handleCopyLink}
              className="bg-white text-purple-600 px-4 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-100 transition-colors"
            >
              {linkCopied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Bill Split Toggle */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-1.5 shadow-sm border border-gray-100 dark:border-gray-800 flex relative">
          <div 
            className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-gray-100 dark:bg-gray-800 rounded-xl transition-all duration-300 ease-in-out shadow-sm"
            style={{ left: splitMode === 'itemized' ? '6px' : 'calc(50%)' }}
          />
          <button 
            onClick={() => setSplitMode('itemized')} 
            className={`flex-1 py-2.5 text-sm font-bold z-10 transition-colors ${splitMode === 'itemized' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}
          >
            Pay for yours
          </button>
          <button 
            onClick={() => setSplitMode('equal')} 
            className={`flex-1 py-2.5 text-sm font-bold z-10 transition-colors ${splitMode === 'equal' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}
          >
            Split Equally
          </button>
        </div>

        {/* Dev Tools (Mock Data) */}
        {groupOrder.status === 'open' && (
          <button 
            onClick={handleSimulateJoin}
            className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold py-3 rounded-2xl border border-purple-200 dark:border-purple-800/50 border-dashed flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <UserPlus className="w-5 h-5" />
            [Dev] Simulate Friend Joining
          </button>
        )}

        {/* Participants List */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-gray-900 dark:text-white">Participants ({groupOrder.members.length})</h3>
          
          <AnimatePresence>
            {groupOrder.members.map((member) => {
              const share = getMemberShare(member);
              const isPaid = member.paymentStatus === 'paid';
              
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={member.userId} 
                  className={`bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border ${isPaid ? 'border-green-200 dark:border-green-800/50' : 'border-gray-100 dark:border-gray-800'} relative overflow-hidden`}
                >
                  {isPaid && (
                    <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-bl-full flex items-start justify-end p-2 border-b border-l border-green-500/20">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                  )}

                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${member.userId === 'u1' ? 'bg-purple-500' : 'bg-gray-400'}`}>
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white block">{member.name}</span>
                        <span className="text-xs text-gray-500 font-medium">{member.items.length} items</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block font-black text-lg text-gray-900 dark:text-white">₹{share}</span>
                    </div>
                  </div>
                  
                  {member.items.length > 0 ? (
                    <div className="pl-13 flex flex-col gap-1.5 mt-2">
                      {member.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="text-gray-600 dark:text-gray-400 font-medium">
                            {item.quantity}x {getItemName(item.menuItemId)}
                          </span>
                          <span className="text-gray-400 text-xs">₹{item.price}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic mt-2 ml-13">Selecting items...</p>
                  )}

                  {groupOrder.status === 'locked' && !isPaid && share > 0 && (
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePay(member.userId)}
                      className="mt-4 w-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-bold py-2.5 rounded-xl border border-green-200 dark:border-green-800/30 flex justify-center items-center gap-2"
                    >
                      <HandCoins className="w-4 h-4" /> Pay your share (₹{share})
                    </motion.button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 pb-safe z-40 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
        
        {groupOrder.status === 'open' && (
          <button 
            onClick={handleLockOrder}
            disabled={groupOrder.members.length < 2 || !hasItems}
            className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black text-lg rounded-2xl py-4 shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
          >
            <Lock className="w-5 h-5" /> Lock Order
          </button>
        )}

        {groupOrder.status === 'locked' && (
          <button 
            onClick={handlePlaceGroupOrder}
            disabled={!allPaid || isPlacing}
            className="w-full bg-red-500 text-white font-black text-lg rounded-2xl py-4 shadow-xl shadow-red-500/30 flex items-center justify-between px-6 active:scale-95 transition-transform disabled:opacity-50 disabled:bg-gray-400 disabled:shadow-none"
          >
            {isPlacing ? (
              <div className="flex justify-center w-full">
                <span className="animate-pulse">Placing Order...</span>
              </div>
            ) : (
              <>
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-[11px] uppercase tracking-wider opacity-90">Total Bill</span>
                  <span>₹{totalBill}</span>
                </div>
                <span className="flex items-center gap-1">{allPaid ? 'Place Group Order' : 'Awaiting Payments'} <ArrowRight className="w-5 h-5" /></span>
              </>
            )}
          </button>
        )}

      </div>
    </div>
  );
}
