"use client";
import { MapPin, Search, UtensilsCrossed, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import Logo from '@/components/logo';

export default function Topbar() {
  const pathname = usePathname();
  const itemCount = useCartStore((state) => state.itemCount);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 md:h-20 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 z-50 flex items-center justify-between px-4 md:px-6 transition-all">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        
        {/* Left: Logo & Location */}
        <div className="flex items-center gap-6">
          <Link href="/" className="hidden md:flex items-center gap-2 group">
            <div className="transform -rotate-6 group-hover:rotate-0 transition-all drop-shadow-md">
              <Logo size={40} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white">TrustBite</span>
          </Link>
          
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="p-2 bg-red-50 dark:bg-red-950/50 rounded-full group-hover:bg-red-100 transition-colors">
              <MapPin className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-red-500/80">Delivering to</span>
              <span className="text-sm md:text-base font-bold text-gray-900 dark:text-gray-100 truncate max-w-[160px] md:max-w-[200px] leading-tight hover:text-red-500 transition-colors">
                Koramangala, Bangalore
              </span>
            </div>
          </div>
        </div>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <Link href="/" className={`text-base font-bold transition-colors hover:text-red-500 ${pathname === '/' ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}>
            Discover
          </Link>
          <Link href="/orders" className={`text-base font-bold transition-colors hover:text-red-500 ${pathname?.startsWith('/orders') ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}>
            Orders
          </Link>
          <Link href="/cart" className={`relative text-base font-bold transition-colors hover:text-red-500 ${pathname?.startsWith('/cart') ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}>
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-white dark:border-gray-950 shadow-sm">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          <button className="p-2.5 rounded-full bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors md:hidden">
            <Search className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          
          <Link href="/profile" className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors overflow-hidden border border-gray-200 dark:border-gray-700">
            <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </Link>
        </div>

      </div>
    </header>
  );
}
