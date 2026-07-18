"use client";
import { useEffect, useState } from 'react';
import { Plus, Edit2, Check, X, Search, Tag } from 'lucide-react';
import { list as listMenu, update as updateMenu } from '@/lib/services/menu.service';
import { MenuItem } from '@/lib/types/menuItem';
import { toast } from 'sonner';

export default function RestaurantMenu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      // Hardcoded 'r1' for the demo restaurant owner perspective
      const data = await listMenu('r1');
      setItems(data);
    }
    load();
  }, []);

  const handleToggleAvail = async (item: MenuItem) => {
    const next = !item.isAvailable;
    // Optimistic update
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, isAvailable: next } : i));
    await updateMenu(item.id, { isAvailable: next });
    toast.success(`${item.name} is now ${next ? 'available' : 'out of stock'}`);
  };

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Menu Manager</h1>
          <p className="text-gray-500 font-medium mt-1">Manage your catalogue and availability live.</p>
        </div>
        <button className="bg-orange-500 text-white font-bold px-6 py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30">
          <Plus className="w-5 h-5" /> Add New Item
        </button>
      </div>

      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search menu items..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl py-4 pl-12 pr-4 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(item => (
          <div key={item.id} className={`bg-white dark:bg-gray-900 rounded-3xl p-5 border shadow-sm transition-all ${item.isAvailable ? 'border-gray-100 dark:border-gray-800' : 'border-red-100 dark:border-red-900/30 opacity-75'}`}>
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-800">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{item.name}</h3>
                    <div className={`w-3 h-3 rounded-full shrink-0 border-2 ${item.isVeg ? 'border-green-500 bg-green-100' : 'border-red-500 bg-red-100'}`} />
                  </div>
                  <p className="text-lg font-black text-gray-900 dark:text-white">₹{item.price}</p>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.moodTags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 px-2 py-1 rounded-md flex items-center gap-1">
                      <Tag className="w-3 h-3" /> {tag.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full h-[1px] bg-gray-100 dark:bg-gray-800 my-4" />

            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleToggleAvail(item)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 ${item.isAvailable ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20' : 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20'}`}
              >
                {item.isAvailable ? <><X className="w-4 h-4"/> Mark Out of Stock</> : <><Check className="w-4 h-4"/> Mark Available</>}
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-200 transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
