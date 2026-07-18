"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Sparkles, 
  Clock, 
  Leaf, 
  MapPin, 
  ArrowRight, 
  Zap, 
  ChevronRight,
  ShoppingCart
} from 'lucide-react';
import Link from 'next/link';

import { GroceryVendor, GroceryCategory, GroceryProduct } from '@/lib/types/grocery-ecosystem';
import { getAllCategories, getAllProducts, getExpiringSoon } from '@/lib/services/groceryProduct.service';
import { getAllVendors } from '@/lib/services/groceryVendor.service';
import { useGroceryMarketStore } from '@/store/groceryMarketStore';

export default function GroceryPage() {
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useGroceryMarketStore();
  
  const [vendors, setVendors] = useState<GroceryVendor[]>([]);
  const [categories, setCategories] = useState<GroceryCategory[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<GroceryProduct[]>([]);
  const [expiringItems, setExpiringItems] = useState<GroceryProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedCategories, fetchedVendors, fetchedProducts, fetchedExpiring] = await Promise.all([
          getAllCategories(),
          getAllVendors(),
          getAllProducts(),
          getExpiringSoon()
        ]);
        
        setCategories(fetchedCategories);
        setVendors(fetchedVendors);
        setTrendingProducts(fetchedProducts.slice(0, 8)); // Mock trending
        setExpiringItems(fetchedExpiring);
      } catch (error) {
        console.error("Failed to load grocery data", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 dark:bg-[#0a0a0a] pt-24 pb-32 px-4 flex flex-col gap-8">
        <div className="w-full h-12 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
        <div className="flex gap-4 overflow-hidden"><div className="w-24 h-10 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"></div><div className="w-24 h-10 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"></div></div>
        <div className="w-full h-40 bg-gray-200 dark:bg-gray-800 rounded-3xl animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-3xl animate-pulse"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-3xl animate-pulse hidden sm:block"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-3xl animate-pulse hidden md:block"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 pb-32 selection:bg-[#FF5A36]/30">

      {/* ═══════════ HERO SECTION ═══════════ */}
      <div className="w-full px-4 md:px-6 pt-4 md:pt-6">
        <section className="relative w-full h-[480px] md:h-[520px] rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Background Image */}
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&q=80&auto=format&fit=crop"
            alt="Fresh groceries"
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/60"></div>

          {/* Hero Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 md:px-8 max-w-3xl mx-auto text-center">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5"
          >
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#FF5A36]" />
              AI-Powered Grocery
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight mb-4"
          >
            Fresh. <span className="text-[#FF5A36]">Fast.</span>{" "}
            <span className="text-emerald-400">Futuristic.</span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-white/80 text-base md:text-lg font-medium max-w-lg mb-8"
          >
            Farm-to-table in minutes. Smart pantry, vendor comparison, and AI-powered recipes — all in one place.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="w-full max-w-lg"
          >
            <div className="flex items-center bg-white rounded-2xl overflow-hidden shadow-xl">
              <div className="pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search veggies, dairy, vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 h-13 pl-3 pr-2 bg-transparent border-none outline-none text-gray-900 text-sm md:text-base placeholder:text-gray-400 font-medium py-3.5"
              />
              <button className="mr-1.5 px-5 py-2.5 bg-[#FF5A36] hover:bg-[#E23744] text-white text-sm font-bold rounded-xl transition-colors shrink-0">
                Search
              </button>
            </div>
          </motion.div>

          {/* Stat Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-2.5 mt-6"
          >
            <span className="flex items-center gap-1.5 text-white/80 text-xs font-semibold"><Leaf className="w-3.5 h-3.5 text-emerald-400" /> Organic Farms</span>
            <span className="w-1 h-1 bg-white/30 rounded-full"></span>
            <span className="flex items-center gap-1.5 text-white/80 text-xs font-semibold"><Zap className="w-3.5 h-3.5 text-yellow-400" /> 15-min Delivery</span>
            <span className="w-1 h-1 bg-white/30 rounded-full"></span>
            <span className="flex items-center gap-1.5 text-white/80 text-xs font-semibold"><Clock className="w-3.5 h-3.5 text-cyan-400" /> Live Freshness</span>
          </motion.div>
        </div>
        </section>
      </div>

      {/* ═══════════ PAGE CONTENT ═══════════ */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col gap-10 pt-8">

        {/* Categories (Horizontal Chips) */}
        <section className="relative w-full -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
            <button 
              onClick={() => setSelectedCategory(null)}
              className={`snap-start shrink-0 px-6 py-2.5 rounded-full font-semibold text-sm transition-all border ${
                selectedCategory === null 
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent shadow-md'
                  : 'bg-white/50 dark:bg-gray-900/50 backdrop-blur-md text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              All
            </button>
            {categories.map((cat, idx) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`snap-start shrink-0 px-6 py-2.5 rounded-full font-semibold text-sm transition-all border ${
                  selectedCategory === cat.id
                    ? 'bg-[#FF5A36] text-white border-transparent shadow-md shadow-emerald-500/20'
                    : 'bg-white/50 dark:bg-gray-900/50 backdrop-blur-md text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </section>

        {/* Offers Banner Row */}
        <section>
          <div className="w-full h-40 md:h-48 rounded-[2rem] overflow-hidden relative group cursor-pointer shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-400 transition-transform duration-700 group-hover:scale-105"></div>
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 p-8 flex flex-col justify-center">
              <span className="text-white/80 font-bold uppercase tracking-wider text-xs mb-2">Weekend Special</span>
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
                Get 20% off<br/>Organic Farms
              </h2>
              <div className="flex items-center gap-2 text-white font-medium">
                Shop Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            {/* Glass decoration */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          </div>
        </section>

        {/* Expiring Soon Strip */}
        {expiringItems.length > 0 && (
          <section>
            <Link href="/ai-kitchen">
              <div className="w-full bg-orange-500/10 dark:bg-orange-500/5 border border-orange-500/20 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group hover:bg-orange-500/15 transition-colors cursor-pointer relative overflow-hidden">
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-orange-800 dark:text-orange-300 flex items-center gap-2">
                      Smart Expiry Alert
                      <span className="bg-orange-500 text-white text-[10px] uppercase font-black px-1.5 py-0.5 rounded-sm">
                        {expiringItems.length} items
                      </span>
                    </h3>
                    <p className="text-sm text-orange-700/80 dark:text-orange-400/80 font-medium">
                      Some items in your pantry are expiring soon. Let AI suggest a recipe!
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold text-sm bg-orange-500/10 px-4 py-2 rounded-xl group-hover:bg-orange-500/20 transition-colors relative z-10 shrink-0">
                  <Sparkles className="w-4 h-4" /> Cook before it expires
                </div>
                
                {/* Decorative background blur */}
                <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-orange-500/10 to-transparent pointer-events-none"></div>
              </div>
            </Link>
          </section>
        )}

        {/* Nearby Vendors */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Nearby Vendors</h2>
            <button className="text-[#FF5A36] font-semibold text-sm hover:text-emerald-600 transition-colors flex items-center gap-1">
              See All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {vendors.map((vendor, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={vendor.id} 
                className="group flex flex-col bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 rounded-3xl overflow-hidden hover:border-[#FF5A36]/30 transition-all cursor-pointer shadow-sm hover:shadow-xl hover:shadow-emerald-500/5"
              >
                <div className="relative h-40 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img src={vendor.bannerUrl} alt={vendor.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <div className="bg-[#FF5A36]/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg flex items-center gap-1">
                      <Leaf className="w-3 h-3" /> {vendor.freshnessScore}% Fresh
                    </div>
                  </div>
                  
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                    <h3 className="text-white font-bold text-lg leading-tight">{vendor.name}</h3>
                    <div className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                      <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" /> {vendor.etaMins}m
                    </div>
                  </div>
                </div>
                
                <div className="p-4 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 font-medium">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {vendor.distanceKm}km</span>
                    <span className="flex items-center gap-1 text-gray-900 dark:text-gray-100 font-bold">★ {vendor.rating}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Trending Products */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Trending Products</h2>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x -mx-4 px-4 md:mx-0 md:px-0">
            {trendingProducts.map((product) => (
              <div 
                key={product.id} 
                className="snap-start shrink-0 w-40 md:w-48 flex flex-col gap-3 group cursor-pointer"
              >
                <div className="w-full aspect-square bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden relative shadow-sm group-hover:border-[#FF5A36]/30 transition-colors">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute bottom-2 right-2 w-8 h-8 bg-[#FF5A36] rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all shadow-md">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 truncate">{product.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{product.weight} • {product.brand}</p>
                  <div className="mt-1 font-black text-gray-900 dark:text-white">₹{product.price}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Large AI Kitchen Promo */}
        <section className="mt-4">
          <Link href="/ai-kitchen">
            <div className="w-full bg-gray-900 dark:bg-black rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group cursor-pointer border border-gray-800 shadow-2xl">
              {/* Animated Gradients */}
              <div className="absolute -inset-[100%] bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-fuchsia-500/20 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000 animate-spin-slow pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex flex-col gap-4 max-w-xl text-center md:text-left">
                  <div className="inline-flex items-center justify-center md:justify-start gap-2 text-purple-400 font-bold tracking-wider text-sm uppercase">
                    <Sparkles className="w-4 h-4" /> Introducing AI Kitchen
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                    Don't know what to cook? <br/> Let AI decide.
                  </h2>
                  <p className="text-gray-400 text-lg">
                    Generate recipes, automatically check your pantry, and order missing ingredients from the best vendors in one tap.
                  </p>
                  <div className="mt-4 inline-flex items-center justify-center md:justify-start gap-2 bg-white text-gray-900 font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors self-center md:self-start">
                    Try AI Kitchen Beta <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                
                {/* Decorative Interface Element */}
                <div className="hidden lg:flex flex-col gap-3 w-72 bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl transform rotate-3 group-hover:rotate-0 transition-transform duration-500 shadow-2xl">
                  <div className="w-full h-8 bg-white/10 rounded-lg flex items-center px-3 gap-2">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <div className="w-32 h-2 bg-white/20 rounded-full"></div>
                  </div>
                  <div className="w-full h-24 bg-white/5 rounded-lg border border-white/5 mt-2 flex flex-col p-3 gap-3">
                    <div className="w-3/4 h-2 bg-white/20 rounded-full"></div>
                    <div className="w-1/2 h-2 bg-white/20 rounded-full"></div>
                    <div className="w-full h-8 bg-[#FF5A36]/20 rounded-md mt-auto border border-[#FF5A36]/30"></div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </section>

      </div>
    </div>
  );
}
