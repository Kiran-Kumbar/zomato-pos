"use client";

import { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { getAllProducts } from '@/lib/services/groceryProduct.service';
import { GroceryProduct } from '@/lib/types/grocery-ecosystem';

export default function GroceryInventoryPage() {
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
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Inventory Management</h1>
          <p className="text-gray-500 font-medium mt-1">Manage stock levels and alerts.</p>
        </div>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" /> Update Stock
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col flex-1">
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by product or brand..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border-none outline-none text-gray-900 dark:text-white rounded-xl py-3 pl-12 pr-4 focus:ring-2 ring-emerald-500"
            />
          </div>
          <button className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <Filter className="w-5 h-5" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 text-xs uppercase tracking-widest text-gray-400">
                <th className="font-bold py-4 px-4">Product</th>
                <th className="font-bold py-4 px-4">Brand</th>
                <th className="font-bold py-4 px-4">Current Stock</th>
                <th className="font-bold py-4 px-4">Status</th>
                <th className="font-bold py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50 dark:border-gray-800/50">
                    <td className="py-4 px-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse"></div><div><div className="w-32 h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-1"></div><div className="w-16 h-3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div></div></div></td>
                    <td className="py-4 px-4"><div className="w-24 h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div></td>
                    <td className="py-4 px-4"><div className="w-12 h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div></td>
                    <td className="py-4 px-4"><div className="w-20 h-6 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div></td>
                    <td className="py-4 px-4 text-right"><div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse ml-auto"></div></td>
                  </tr>
                ))
              ) : filtered.map((product, i) => {
                // Mock random stock
                const stock = (i * 7) % 25;
                let status = 'In Stock';
                let color = 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30';
                if (stock === 0) {
                  status = 'Out of Stock';
                  color = 'text-red-500 bg-red-100 dark:bg-red-900/30';
                } else if (stock < 5) {
                  status = 'Low Stock';
                  color = 'text-orange-500 bg-orange-100 dark:bg-orange-900/30';
                }

                return (
                  <tr key={product.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100 dark:bg-gray-800" />
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white">{product.name}</div>
                          <div className="text-xs text-gray-500">{product.weight}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-gray-600 dark:text-gray-400">{product.brand}</td>
                    <td className="py-4 px-4 font-black text-gray-900 dark:text-white">{stock}</td>
                    <td className="py-4 px-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${color}`}>{status}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-emerald-500 transition-colors rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
