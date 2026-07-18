"use client";
import { Home, ShoppingBag, ShoppingCart, User, Store, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { motion } from 'framer-motion';

export default function BottomNav() {
  const pathname = usePathname();
  const itemCount = useCartStore((state) => state.itemCount);

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Grocery', path: '/grocery', icon: Store },
    { name: 'Kitchen', path: '/ai-kitchen', icon: Sparkles },
    { name: 'Orders', path: '/orders', icon: ShoppingBag },
    { name: 'Cart', path: '/cart', icon: ShoppingCart, badge: itemCount },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50 z-50 flex items-center justify-around px-2 pb-4 md:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.path || (item.path !== '/' && pathname?.startsWith(item.path));
        const Icon = item.icon;
        return (
          <Link key={item.name} href={item.path} className="relative flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-red-500 transition-colors">
            {isActive && (
              <motion.div
                layoutId="bottom-nav-indicator"
                className="absolute top-0 w-8 h-1 bg-red-500 rounded-b-full"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <div className="relative mt-2">
              <Icon className={`w-[22px] h-[22px] mb-1.5 transition-all ${isActive ? 'text-red-500 fill-red-500/10' : ''}`} />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-gray-950 shadow-sm">
                  {item.badge}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-semibold tracking-wide ${isActive ? 'text-red-500' : ''}`}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
