"use client";

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  MapPin, 
  Star, 
  Zap, 
  ChevronLeft, 
  Info, 
  ShoppingCart,
  Plus,
  Minus
} from 'lucide-react';
import { getVendorById } from '@/lib/services/groceryVendor.service';
import { getAllProducts, getAllCategories } from '@/lib/services/groceryProduct.service';
import { GroceryVendor, GroceryProduct, GroceryCategory } from '@/lib/types/grocery-ecosystem';
import { useGroceryCartStore } from '@/store/groceryCartStore';

export default function VendorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const vendorId = params.id as string;

  const [vendor, setVendor] = useState<GroceryVendor | null>(null);
  const [products, setProducts] = useState<GroceryProduct[]>([]);
  const [categories, setCategories] = useState<GroceryCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { getItemQuantity, updateQuantity, addToCart } = useGroceryCartStore();

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const [fetchedVendor, allProducts, allCats] = await Promise.all([
          getVendorById(vendorId),
          getAllProducts(),
          getAllCategories()
        ]);
        
        if (fetchedVendor) {
          setVendor(fetchedVendor);
          setProducts(allProducts.filter(p => p.vendorId === vendorId));
          setCategories(allCats.filter(c => fetchedVendor.categories.includes(c.id)));
          if (fetchedVendor.categories.length > 0) {
            setSelectedCategoryId(fetchedVendor.categories[0]);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVendorData();
  }, [vendorId]);

  const filteredProducts = useMemo(() => {
    if (!selectedCategoryId) return products;
    return products.filter(p => p.categoryId === selectedCategoryId);
  }, [products, selectedCategoryId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 dark:bg-[#0a0a0a] pt-24 pb-32 flex flex-col">
        <div className="w-full h-64 bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
        <div className="p-4 md:p-6 mt-[-40px] relative z-10 max-w-7xl mx-auto w-full">
          <div className="w-64 h-12 bg-gray-300 dark:bg-gray-700 rounded-xl animate-pulse mb-4"></div>
          <div className="flex gap-4 mb-8">
            <div className="w-24 h-8 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
            <div className="w-24 h-8 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return <div className="p-24 text-center">Vendor not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] pb-32 pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col gap-8">
        
        {/* Standard Header */}
        <section className="flex flex-col gap-6 mt-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A36] to-orange-400">{vendor.name}</span> Store.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-2 text-gray-500 dark:text-gray-400 font-medium"
            >
              Fresh groceries delivered in {vendor.etaMins} mins.
            </motion.p>
          </div>
        </section>

      {/* Banner */}
      <div className="relative w-full h-48 md:h-64 bg-gray-900 rounded-3xl overflow-hidden shadow-sm">
        <img src={vendor.bannerUrl} alt={vendor.name} className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        
        {/* Top Nav */}
        <div className="absolute top-4 left-4 z-10">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>

        {/* Vendor Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 flex flex-col md:flex-row items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap items-center gap-3 mt-2"
            >
              <div className="bg-[#FF5A36] text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm group relative cursor-help">
                <Leaf className="w-4 h-4" /> {vendor.freshnessScore}% Fresh
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  <div className="font-bold mb-1 flex items-center gap-1"><Info className="w-3 h-3"/> Freshness Score</div>
                  AI-calculated metric based on time-since-harvest, batch quality, and user reports.
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-md text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {vendor.rating}
              </div>
              <div className="bg-white/20 backdrop-blur-md text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm">
                <MapPin className="w-4 h-4" /> {vendor.distanceKm} km
              </div>
              <div className="bg-white/20 backdrop-blur-md text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm">
                <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" /> {vendor.etaMins} mins
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-8">
        
        {/* Category Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`snap-start shrink-0 px-6 py-2.5 rounded-full font-bold text-sm transition-all border ${
                selectedCategoryId === cat.id
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent shadow-md'
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {filteredProducts.map((product) => {
            // Mock out of stock for some products dynamically (e.g. ID ends in 3 or 7)
            const idNum = parseInt(product.id.replace('p', ''));
            const isOutOfStock = idNum % 7 === 0 || idNum % 13 === 0;
            // Mock an offer badge
            const hasOffer = idNum % 5 === 0;
            
            const quantity = getItemQuantity(product.id);

            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col ${isOutOfStock ? 'opacity-60 grayscale-[0.5]' : ''}`}
              >
                <div className="relative w-full aspect-square bg-gray-50 dark:bg-gray-800 p-4">
                  <img src={product.imageUrl} alt={product.name} className={`w-full h-full object-contain ${isOutOfStock ? 'opacity-50' : ''} mix-blend-multiply dark:mix-blend-normal`} />
                  
                  {hasOffer && !isOutOfStock && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">
                      15% OFF
                    </div>
                  )}

                  {isOutOfStock && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap">
                      Out of Stock
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1 gap-1">
                  <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">{product.brand}</div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm leading-tight line-clamp-2 mb-1">{product.name}</h3>
                  <div className="text-xs text-gray-500 font-medium">{product.weight}</div>
                  
                  <div className="mt-auto pt-3 flex items-center justify-between">
                    <div className="font-black text-base md:text-lg text-gray-900 dark:text-white">
                      ₹{product.price}
                    </div>

                    {!isOutOfStock && (
                      <div className="h-8">
                        {quantity > 0 ? (
                          <div className="flex items-center bg-emerald-50 dark:bg-[#FF5A36]/10 border border-emerald-200 dark:border-[#FF5A36]/30 rounded-lg overflow-hidden h-full">
                            <button 
                              onClick={() => updateQuantity(product.id, -1)}
                              className="w-8 h-full flex items-center justify-center text-emerald-600 hover:bg-emerald-100 dark:hover:bg-[#FF5A36]/20 transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-6 text-center font-bold text-sm text-emerald-700 dark:text-emerald-400">
                              {quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(product.id, 1)}
                              className="w-8 h-full flex items-center justify-center text-emerald-600 hover:bg-emerald-100 dark:hover:bg-[#FF5A36]/20 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => addToCart(product)}
                            className="bg-[#FF5A36] hover:bg-[#E23744] text-white font-bold text-sm px-4 h-full rounded-lg transition-colors shadow-sm shadow-emerald-500/20"
                          >
                            ADD
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        </div>
      </div>
    </div>
  );
}
