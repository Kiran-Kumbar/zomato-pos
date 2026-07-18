"use client";

import { useEffect, useState, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Star, ShieldCheck, Leaf, Info, Plus, Minus, Search, ShoppingBag, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Restaurant } from '@/lib/types/restaurant';
import { MenuItem } from '@/lib/types/menuItem';
import { getById as getRestaurant } from '@/lib/services/restaurant.service';
import { list as listMenu } from '@/lib/services/menu.service';
import { create as createGroupOrder } from '@/lib/services/groupOrder.service';
import { useCartStore } from '@/store/cartStore';
import { calculateItemTotal } from '@/lib/utils/pricing';
import Link from 'next/link';
import { Review } from '@/lib/types/review';
import { list as listReviews } from '@/lib/services/review.service';
import { Video, Play, BadgeCheck, X } from 'lucide-react';

export default function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [sheetItem, setSheetItem] = useState<MenuItem | null>(null);
  
  // Sheet state
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [sheetQuantity, setSheetQuantity] = useState(1);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // Cart
  const { items: cartItems, itemCount, cartTotal, addItem, updateQuantity } = useCartStore();
  const [isStartingGroup, setIsStartingGroup] = useState(false);

  const handleStartGroupOrder = async () => {
    if (!id || !restaurant) return;
    setIsStartingGroup(true);
    try {
      const go = await createGroupOrder({
        hostUserId: 'u1',
        restaurantId: id,
        status: 'open',
        members: [{
          userId: 'u1',
          name: 'You (Host)',
          items: [],
          paymentStatus: 'pending'
        }],
        totalAmount: 0
      });
      router.push(`/group/${go.id}`);
    } catch (e) {
      console.error(e);
      setIsStartingGroup(false);
    }
  };

  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    async function fetchAll() {
      try {
        const [res, menu, revs] = await Promise.all([
          getRestaurant(id as string),
          listMenu(id as string),
          listReviews(id as string)
        ]);
        if (res) setRestaurant(res);
        setMenuItems(menu);
        
        // Sort reviews: Video reviews first, then by date
        const sorted = revs.sort((a, b) => {
          if (a.videoUrl && !b.videoUrl) return -1;
          if (!a.videoUrl && b.videoUrl) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setReviews(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [id]);

  // Group menu by first mood tag, or 'Recommended'
  const groupedMenu = menuItems.reduce((acc, item) => {
    const cat = item.moodTags.length > 0 ? item.moodTags[0].replace('_', ' ').toUpperCase() : 'RECOMMENDED';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);
  
  const categories = Object.keys(groupedMenu);

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) setActiveCategory(categories[0]);
  }, [categories, activeCategory]);

  const handleOpenSheet = (item: MenuItem) => {
    setSheetItem(item);
    setSheetQuantity(1);
    setSelectedVariant(item.variants?.[0]?.id || '');
    setSelectedAddons([]);
  };

  const handleDirectAdd = (item: MenuItem) => {
    addItem(item, 1);
  };

  const handleSheetAdd = () => {
    if (!sheetItem) return;
    addItem(sheetItem, sheetQuantity, selectedVariant || undefined, selectedAddons);
    setSheetItem(null);
  };

  const getItemCartQty = (itemId: string) => {
    return cartItems.filter(i => i.menuItem.id === itemId).reduce((acc, i) => acc + i.quantity, 0);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950 animate-pulse">
        <div className="h-64 bg-gray-200 dark:bg-gray-800 w-full" />
        <div className="p-4 space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 w-3/4 rounded" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 w-1/2 rounded" />
        </div>
      </div>
    );
  }

  if (!restaurant) return <div className="p-8 text-center">Restaurant not found</div>;

  return (
    <div className="flex flex-col pb-32 bg-gray-50 dark:bg-gray-950 min-h-screen relative">
      
      {/* Header Image & Back Button */}
      <div className="relative h-64 md:h-80 w-full bg-gray-900 overflow-hidden shadow-lg shrink-0">
        <img 
          src={restaurant.imageUrl} 
          alt={restaurant.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <button onClick={() => router.back()} className="absolute top-4 left-4 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full transition-colors z-10">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <div className="absolute bottom-4 left-4 right-4 text-white z-10 max-w-4xl mx-auto md:px-6">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight drop-shadow-md">{restaurant.name}</h1>
          <p className="text-sm md:text-base font-medium opacity-90 drop-shadow-md mt-1">{restaurant.cuisine.join(' • ')}</p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-4xl px-4 md:px-6 flex flex-col gap-6 pt-6">
      {/* Info Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded-lg text-sm font-bold">
              {restaurant.rating} <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-sm font-bold text-gray-500">{restaurant.deliveryTimeMinutes} mins</span>
          </div>
          
          <div className="relative">
            <button 
              onMouseEnter={() => setShowTooltip(true)} 
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip(!showTooltip)}
              className="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-xl text-xs font-bold border border-green-200 dark:border-green-800/30 transition-all hover:bg-green-100 dark:hover:bg-green-900/40"
            >
              <ShieldCheck className="w-4 h-4" /> {restaurant.transparencyScore}% Trust <Info className="w-3 h-3 opacity-70" />
            </button>
            {showTooltip && (
              <div className="absolute right-0 top-10 w-48 bg-gray-900 text-white text-[10px] p-2 rounded-lg shadow-2xl z-50 animate-in fade-in zoom-in duration-200">
                Transparency Score measures real-time audit data of this restaurant's hygiene, sourcing, and ethical practices.
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
            <Leaf className="w-5 h-5 text-[#FF5A36]" />
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              Eco deliveries: {restaurant.ecoDeliveriesCount} this month
            </span>
          </div>

          <button 
            onClick={handleStartGroupOrder} 
            disabled={isStartingGroup}
            className="w-full bg-[#FF5A36]/10 dark:bg-purple-900/20 text-[#FF5A36] font-bold py-3 rounded-xl border border-[#FF5A36]/30 dark:border-[#FF5A36]/30/30 flex items-center justify-center gap-2 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors disabled:opacity-50"
          >
            <Users className="w-5 h-5" />
            {isStartingGroup ? 'Starting...' : 'Start Group Order'}
          </button>
        </div>
      </div>

      {/* Sticky Category Tabs */}
      <div className="sticky top-0 z-30 bg-gray-50/90 dark:bg-gray-950/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 -mx-4 md:-mx-6 px-4 md:px-6">
        <div className="flex overflow-x-auto hide-scrollbar gap-4 py-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                document.getElementById(`category-${cat}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`shrink-0 font-bold text-sm tracking-wide transition-colors ${
                activeCategory === cat ? 'text-red-500 border-b-2 border-red-500 pb-1' : 'text-gray-500 pb-1.5'
              }`}
            >
              {cat}
            </button>
          ))}
          <button
            onClick={() => {
              setActiveCategory('Reviews');
              document.getElementById('section-reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className={`shrink-0 font-bold text-sm tracking-wide transition-colors ${
              activeCategory === 'Reviews' ? 'text-red-500 border-b-2 border-red-500 pb-1' : 'text-gray-500 pb-1.5'
            }`}
          >
            REVIEWS ({reviews.length})
          </button>
        </div>
      </div>

      {/* Menu List */}
      <div className="py-4 flex flex-col gap-8">
        {categories.map(cat => (
          <div key={cat} id={`category-${cat}`} className="scroll-mt-20">
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4">{cat}</h2>
            <div className="flex flex-col gap-6">
              {groupedMenu[cat].map(item => {
                const hasOptions = (item.variants && item.variants.length > 0) || (item.addons && item.addons.length > 0);
                const cartQty = getItemCartQty(item.id);

                return (
                  <div key={item.id} className="flex gap-4 border-b border-gray-200 dark:border-gray-800 pb-6 last:border-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-3.5 h-3.5 rounded-sm border ${item.isVeg ? 'border-green-500 bg-green-50 dark:bg-green-500/10' : 'border-red-500 bg-red-50 dark:bg-red-500/10'} flex items-center justify-center`}>
                          <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                        </div>
                        {item.moodTags.length > 0 && (
                          <span className="text-[9px] uppercase tracking-wider font-bold text-red-500 bg-red-50 dark:bg-red-950 px-1.5 py-0.5 rounded">
                            {item.moodTags[0].replace('_', ' ')}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight">{item.name}</h3>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-200 mt-1">₹{item.price}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">{item.description}</p>
                    </div>

                    <div className="relative flex flex-col items-center">
                        <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                      </div>
                      
                      <div className="absolute -bottom-3 w-24">
                        {cartQty > 0 && !hasOptions ? (
                          <div className="flex items-center justify-between bg-white dark:bg-gray-900 border border-red-500 text-red-500 rounded-xl px-2 py-1.5 shadow-md font-bold">
                            <button onClick={() => updateQuantity(cartItems.find(i => i.menuItem.id === item.id)!.cartItemId, -1)} className="p-1"><Minus className="w-4 h-4" /></button>
                            <span>{cartQty}</span>
                            <button onClick={() => updateQuantity(cartItems.find(i => i.menuItem.id === item.id)!.cartItemId, 1)} className="p-1"><Plus className="w-4 h-4" /></button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => hasOptions ? handleOpenSheet(item) : handleDirectAdd(item)}
                            className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-red-500 rounded-xl py-1.5 shadow-md font-black tracking-wide text-sm uppercase hover:bg-gray-50 transition-colors"
                          >
                            ADD {hasOptions && <span className="absolute -top-1 -right-1 text-red-500 font-bold text-lg leading-none">+</span>}
                          </button>
                        )}
                        {hasOptions && <span className="text-[9px] text-gray-500 block text-center mt-1">Customizable</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        
        {/* Reviews Section */}
        <div id="section-reviews" className="scroll-mt-20 mt-4">
          <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6">Customer Reviews</h2>
          <div className="flex flex-col gap-4">
            {reviews.map(review => (
              <div key={review.id} className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 px-2 py-0.5 rounded text-xs font-bold">
                    {review.rating} <Star className="w-3 h-3 fill-current" />
                  </div>
                  {review.videoUrl && (
                    <div className="flex items-center gap-1 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                      <BadgeCheck className="w-3.5 h-3.5" /> Verified Video Review
                    </div>
                  )}
                  <span className="text-xs text-gray-400 ml-auto">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{review.comment}</p>
                
                {review.videoUrl && (
                  <button 
                    onClick={() => setActiveVideo(review.videoUrl!)}
                    className="relative w-24 h-24 bg-black rounded-xl overflow-hidden group shadow-md"
                  >
                    <video src={review.videoUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40">
                        <Play className="w-4 h-4 text-white fill-current" />
                      </div>
                    </div>
                  </button>
                )}
              </div>
            ))}
            {reviews.length === 0 && (
               <p className="text-gray-500 text-center py-4">No reviews yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Floating View Cart Bar */}
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-24 left-4 right-4 z-40"
          >
            <Link href="/cart" className="flex items-center justify-between bg-red-500 text-white rounded-2xl p-4 shadow-2xl shadow-red-500/30 active:scale-95 transition-transform">
              <div className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-wider opacity-90">{itemCount} items</span>
                <span className="text-lg font-black">₹{cartTotal}</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold">
                View Cart <ShoppingBag className="w-5 h-5" />
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Bottom Sheet for Variants/Add-ons */}
      <AnimatePresence>
        {sheetItem && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSheetItem(null)}
              className="fixed inset-0 bg-black/60 z-[999] backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ y: '100%' }} 
              animate={{ y: 0 }} 
              exit={{ y: '100%' }} 
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 md:top-1/2 md:-translate-y-1/2 md:bottom-auto left-0 md:left-1/2 md:-translate-x-1/2 right-0 md:right-auto md:w-full md:max-w-md bg-white dark:bg-gray-950 rounded-t-3xl md:rounded-3xl z-[1000] max-h-[85vh] flex flex-col shadow-2xl"
            >
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">{sheetItem.name}</h3>
                  <p className="text-sm font-semibold text-gray-500">₹{sheetItem.price} Base</p>
                </div>
                <div className={`w-4 h-4 rounded-sm border ${sheetItem.isVeg ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'} flex items-center justify-center`}>
                  <div className={`w-2 h-2 rounded-full ${sheetItem.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>
              </div>
              
              <div className="overflow-y-auto p-4 flex-1">
                {sheetItem.variants && sheetItem.variants.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Quantity / Size</h4>
                    <div className="flex flex-col gap-3">
                      {sheetItem.variants.map(v => (
                        <label key={v.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 p-3 rounded-xl cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                          <div className="flex items-center gap-3">
                            <input 
                              type="radio" 
                              name="variant" 
                              checked={selectedVariant === v.id}
                              onChange={() => setSelectedVariant(v.id)}
                              className="w-4 h-4 text-red-500 focus:ring-red-500 accent-red-500"
                            />
                            <span className="font-semibold text-gray-900 dark:text-gray-100">{v.name}</span>
                          </div>
                          <span className="font-bold text-gray-700 dark:text-gray-300">₹{v.price}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {sheetItem.addons && sheetItem.addons.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Add-ons</h4>
                    <div className="flex flex-col gap-3">
                      {sheetItem.addons.map(a => {
                        const isChecked = selectedAddons.includes(a.id);
                        return (
                          <label key={a.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 p-3 rounded-xl cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                            <div className="flex items-center gap-3">
                              <input 
                                type="checkbox" 
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedAddons([...selectedAddons, a.id]);
                                  else setSelectedAddons(selectedAddons.filter(id => id !== a.id));
                                }}
                                className="w-4 h-4 rounded text-red-500 focus:ring-red-500 accent-red-500"
                              />
                              <span className="font-semibold text-gray-900 dark:text-gray-100">{a.name}</span>
                            </div>
                            <span className="font-bold text-gray-700 dark:text-gray-300">+₹{a.price}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 pb-safe">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-900 rounded-2xl px-4 py-3 w-1/3">
                    <button onClick={() => setSheetQuantity(Math.max(1, sheetQuantity - 1))} className="text-gray-500 hover:text-gray-900 dark:hover:text-white"><Minus className="w-5 h-5" /></button>
                    <span className="font-bold text-lg">{sheetQuantity}</span>
                    <button onClick={() => setSheetQuantity(sheetQuantity + 1)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white"><Plus className="w-5 h-5" /></button>
                  </div>
                  <button onClick={handleSheetAdd} className="flex-1 bg-red-500 text-white font-bold rounded-2xl py-4 shadow-xl shadow-red-500/20 active:scale-95 transition-transform flex justify-center gap-2 items-center">
                    Add Item • ₹{calculateItemTotal(sheetItem, sheetQuantity, selectedVariant || undefined, selectedAddons)}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[600] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          >
            <button onClick={() => setActiveVideo(null)} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative"
            >
              <video src={activeVideo} controls autoPlay className="w-full h-full object-cover" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      </div> {/* Close mx-auto max-w-4xl wrapper */}

      {/* Footer spacing so cart doesn't overlap */}
      <div className="h-32" />
    </div>
  );
}
