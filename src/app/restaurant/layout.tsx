"use client";

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Utensils, BarChart3, LogOut, Bell } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const NAV = [
  { href: '/restaurant/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/restaurant/menu', label: 'Menu', icon: Utensils },
  { href: '/restaurant/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function RestaurantLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 font-sans selection:bg-orange-500/30 text-gray-900 dark:text-gray-100">
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 shrink-0">
        <div className="flex items-center gap-3 px-2 py-4 mb-6">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Utensils className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tight leading-none">Partner</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Dashboard</span>
          </div>
        </div>
        
        <nav className="flex-1 flex flex-col gap-2">
          {NAV.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${isActive ? 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                <item.icon className="w-5 h-5" /> {item.label}
              </Link>
            );
          })}
        </nav>
        
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative max-w-full overflow-hidden">
        {/* Topbar Mobile */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-10 sticky top-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Utensils className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-lg tracking-tight">Partner</span>
          </div>
          <button className="relative p-2 bg-gray-50 dark:bg-gray-800 rounded-full">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-around p-2 pb-safe z-50">
          {NAV.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all ${isActive ? 'text-orange-500' : 'text-gray-400'}`}>
                <item.icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-orange-100 dark:fill-orange-900/30' : ''}`} />
                <span className="text-[10px] font-bold tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </main>
    </div>
  );
}
