"use client";

import { useState, useEffect } from 'react';
import { Search, Plus, Filter, Edit2, Trash2 } from 'lucide-react';
import { getAllProducts } from '@/lib/services/groceryProduct.service';
import { GroceryProduct } from '@/lib/types/grocery-ecosystem';

export default function GroceryProductsPage() {
  const [products, setProducts] = useState<GroceryProduct[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock loading vendor v1's products
    getAllProducts().then(data => {
      setProducts(data.filter(p => p.vendorId === 'v1'));
      setIsLoading(false);
    });
  }, []);

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Products Catalog</h1>
          <p className="text-gray-500 font-medium mt-1">Manage product details, pricing, and images.</p>
        </div>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" /> Add New Product
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col flex-1">
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search catalog..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border-none outline-none text-gray-900 dark:text-white rounded-xl py-3 pl-12 pr-4 focus:ring-2 ring-emerald-500"
            />
          </div>
          <button className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <Filter className="w-5 h-5" /> Filter
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col shadow-sm">
                <div className="h-40 w-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                <div className="p-4 flex flex-col flex-1 gap-2">
                  <div className="w-16 h-3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                  <div className="w-full h-5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                  <div className="w-2/3 h-5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-end">
                    <div className="w-12 h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                    <div className="w-16 h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))
          ) : filtered.map((product) => (
            <div key={product.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
              <div className="h-40 w-full relative bg-gray-100 dark:bg-gray-800">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 flex gap-1">
                  <button className="w-8 h-8 rounded-lg bg-white/90 dark:bg-black/90 backdrop-blur-sm flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-emerald-500 transition-colors shadow-sm">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-white/90 dark:bg-black/90 backdrop-blur-sm flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors shadow-sm">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="text-xs font-bold text-gray-500 mb-1">{product.brand}</div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight mb-2 line-clamp-2">{product.name}</h3>
                
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-end">
                  <div className="text-xs font-medium text-gray-500">{product.weight}</div>
                  <div className="font-black text-emerald-600 dark:text-emerald-400 text-lg">₹{product.price}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
