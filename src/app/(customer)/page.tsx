"use client";

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Clock, ShieldCheck, Filter, AlertCircle, ChevronDown } from 'lucide-react';
import { Restaurant } from '@/lib/types/restaurant';
import { MenuItem, MoodTag } from '@/lib/types/menuItem';
import { list as listRestaurants } from '@/lib/services/restaurant.service';
import { list as listMenuItems } from '@/lib/services/menu.service';
import { rankItemsByMood } from '@/lib/utils/moodMatch';
import EmptyState from '@/components/ui/EmptyState';
import Link from 'next/link';

const MOODS: { label: string; value: MoodTag, emoji: string }[] = [
  { label: 'Light Meal', value: 'light_meal', emoji: '🥗' },
  { label: 'Post-Workout', value: 'post_workout', emoji: '💪' },
  { label: 'Comfort Food', value: 'comfort_food', emoji: '🧀' },
  { label: 'Under ₹150', value: 'budget_friendly', emoji: '🪙' },
  { label: 'High Protein', value: 'high_protein', emoji: '🥚' },
  { label: 'Quick Bite', value: 'quick_bite', emoji: '⚡' },
];

const BANNERS = [
  { id: 1, title: '50% OFF', subtitle: 'On your first order', imageId: 'https://foodish-api.com/images/pizza/pizza1.jpg' },
  { id: 2, title: 'Pro Match', subtitle: 'High protein meals', imageId: 'https://foodish-api.com/images/burger/burger2.jpg' },
  { id: 3, title: 'Late Night', subtitle: 'Open till 3 AM', imageId: 'https://foodish-api.com/images/dessert/dessert3.jpg' },
];

export default function CustomerHome() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<MoodTag | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [resData, menuData] = await Promise.all([
          listRestaurants(),
          listMenuItems()
        ]);
        setRestaurants(resData);
        setMenuItems(menuData);
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const { finalRestaurants, matchedMenuByRest } = useMemo(() => {
    let finalRes = [...restaurants];
    let matchedMenuByRest: Record<string, MenuItem[]> = {};

    if (selectedMood) {
      const matchedItems = rankItemsByMood(menuItems, selectedMood);
      const restIds = new Set(matchedItems.map(m => m.restaurantId));
      finalRes = finalRes.filter(r => restIds.has(r.id));
      
      matchedItems.forEach(item => {
        if (!matchedMenuByRest[item.restaurantId]) matchedMenuByRest[item.restaurantId] = [];
        matchedMenuByRest[item.restaurantId].push(item);
      });
    }

    if (searchQuery.trim() !== '') {
      const lowerQ = searchQuery.toLowerCase();
      finalRes = finalRes.filter(r => 
        r.name.toLowerCase().includes(lowerQ) || 
        r.cuisine.some(c => c.toLowerCase().includes(lowerQ))
      );
    }

    return { finalRestaurants: finalRes, matchedMenuByRest };
  }, [restaurants, menuItems, selectedMood, searchQuery]);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-4 animate-pulse max-w-7xl mx-auto w-full">
        <div className="h-[420px] bg-gray-200 dark:bg-gray-800 rounded-2xl w-full" />
        <div className="flex gap-3 overflow-hidden">
          {[1,2,3,4].map(i => <div key={i} className="h-12 w-32 bg-gray-200 dark:bg-gray-800 rounded-full shrink-0" />)}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-72 bg-gray-200 dark:bg-gray-800 rounded-3xl w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-12">
      
      {/* Hero Section */}
      <section className="relative w-full min-h-[420px] flex items-center justify-center overflow-hidden mb-12 rounded-b-3xl md:rounded-3xl md:mt-4 md:max-w-7xl md:mx-auto">
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            poster="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"
            className="w-full h-full object-cover"
          >
            <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-4xl mx-auto mt-8 md:mt-0">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
            Order food you actually <span className="text-red-500">trust</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 font-medium mb-10 max-w-2xl drop-shadow-md">
            Discover restaurants with transparent prep times, verified hygiene scores, and real video reviews from food lovers.
          </p>
          
          <div className="w-full bg-white dark:bg-gray-900 rounded-full p-2 md:p-3 flex flex-col md:flex-row items-center shadow-2xl border border-gray-200/20 dark:border-gray-700/50 gap-2 md:gap-0">
            <div className="flex items-center flex-1 w-full px-4">
              <Search className="w-6 h-6 text-gray-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Search for restaurants, cuisines, or dishes..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none py-3 px-4 outline-none text-gray-900 dark:text-white placeholder:text-gray-400 font-medium text-lg"
              />
            </div>
            
            <div className="hidden md:flex items-center gap-2 border-l border-gray-200 dark:border-gray-800 px-4 h-10">
              <button className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Cuisine <ChevronDown className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-2">
                Rating <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            
            <button className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white font-bold py-3 md:py-4 px-8 rounded-full transition-colors whitespace-nowrap shadow-md shadow-red-500/20 mt-2 md:mt-0">
              Find Food
            </button>
          </div>
        </div>
      </section>

      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 flex flex-col gap-12">
        
        {/* Banner Carousel */}
        <section>
          <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-6 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory">
            {BANNERS.map(banner => (
              <div 
                key={banner.id} 
                className="relative shrink-0 w-[85vw] md:w-80 h-44 rounded-3xl overflow-hidden snap-center group cursor-pointer shadow-lg transition-transform hover:-translate-y-1"
              >
                <img 
                  src={banner.imageId} 
                  alt={banner.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-center text-white">
                  <h2 className="text-3xl font-black italic tracking-tight drop-shadow-md">{banner.title}</h2>
                  <p className="text-base font-semibold text-gray-200 mt-1 drop-shadow-md">{banner.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mood Filters */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">What's your mood?</h2>
          </div>
          <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-4 -mx-4 px-4 md:mx-0 md:px-0 flex-wrap md:flex-nowrap">
            {MOODS.map(mood => {
              const isSelected = selectedMood === mood.value;
              return (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(isSelected ? null : mood.value)}
                  className={`shrink-0 flex items-center gap-2 px-6 py-4 rounded-2xl text-base font-bold border-2 transition-all transform hover:-translate-y-0.5 ${
                    isSelected 
                      ? 'bg-red-500 text-white border-red-500 shadow-xl shadow-red-500/20 scale-105' 
                      : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 shadow-sm'
                  }`}
                >
                  <span className="text-xl">{mood.emoji}</span>
                  {mood.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Restaurant Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              {selectedMood ? `${finalRestaurants.length} matches for your mood` : 'Top Restaurants in Bangalore'}
            </h2>
          </div>

          <AnimatePresence mode="popLayout">
            {finalRestaurants.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <EmptyState 
                  icon={AlertCircle} 
                  title="No restaurants found" 
                  description="Try changing your mood filter or search query." 
                />
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {finalRestaurants.map((restaurant) => {
                  const matchedItems = matchedMenuByRest[restaurant.id];
                  
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      key={restaurant.id}
                      className="group"
                    >
                      <Link href={`/restaurant/${restaurant.id}`} className="block h-full bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                        
                        {/* Image */}
                        <div className="w-full aspect-[16/9] relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                          <img 
                            src={restaurant.imageUrl} 
                            alt={restaurant.name}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          {/* Promoting Badge */}
                          {restaurant.isPromoted && (
                            <div className="absolute top-4 left-4 bg-gray-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                              Promoted
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-5 flex flex-col flex-1">
                          
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1 min-w-0 pr-2">
                              <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight truncate">{restaurant.name}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate font-medium">{restaurant.cuisine.join(', ')}</p>
                            </div>
                          </div>

                          {/* Badges Row */}
                          <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded-lg">
                              <span className="text-xs font-bold">{restaurant.rating}</span>
                              <Star className="w-3 h-3 fill-current" />
                            </div>
                            <div className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 px-2.5 py-1 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span className="text-xs font-bold">{restaurant.transparencyScore}% Trust</span>
                            </div>
                          </div>

                          <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-sm font-bold text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4 text-gray-400" />
                              {restaurant.deliveryTimeMinutes} mins
                            </div>
                            <div className="flex items-center gap-1.5">
                              ₹{restaurant.priceRange === '$' ? '300' : restaurant.priceRange === '$$' ? '500' : restaurant.priceRange === '$$$' ? '800' : '1000'} for two
                            </div>
                          </div>

                          {/* Matched Items Section (Only visible if mood filter is active) */}
                          {selectedMood && matchedItems && (
                            <div className="mt-4 pt-4 border-t border-dashed border-gray-200 dark:border-gray-700">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                                  Matched for {MOODS.find(m => m.value === selectedMood)?.label}
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                {matchedItems.slice(0, 2).map(item => (
                                  <div key={item.id} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-700 dark:text-gray-300 font-semibold truncate pr-2 flex items-center gap-2">
                                      <div className={`w-3.5 h-3.5 rounded-[3px] border-2 ${item.isVeg ? 'border-green-500 bg-green-50 dark:bg-green-500/10' : 'border-red-500 bg-red-50 dark:bg-red-500/10'} flex items-center justify-center shrink-0`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                                      </div>
                                      {item.name}
                                    </span>
                                    <span className="text-gray-900 dark:text-white font-bold shrink-0">₹{item.price}</span>
                                  </div>
                                ))}
                                {matchedItems.length > 2 && (
                                  <span className="text-xs font-bold text-red-500 mt-1">
                                    +{matchedItems.length - 2} more matching items
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </section>

      </div>
    </div>
  );
}
