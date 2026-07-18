"use client";

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Store, Bike, Map, AlertOctagon, LogOut, Shield } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const NAV = [
  { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/restaurants', label: 'Restaurants', icon: Store },
  { href: '/admin/delivery-partners', label: 'Riders', icon: Bike },
  { href: '/admin/zones', label: 'Zones', icon: Map },
  { href: '/admin/disputes', label: 'Disputes', icon: AlertOctagon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 font-sans selection:bg-indigo-500/30 text-gray-900 dark:text-gray-100">
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white p-4 shrink-0">
        <div className="flex items-center gap-3 px-2 py-4 mb-6">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tight leading-none">Admin</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Control Center</span>
          </div>
        </div>
        
        <nav className="flex-1 flex flex-col gap-2">
          {NAV.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${isActive ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <item.icon className="w-5 h-5" /> {item.label}
              </Link>
            );
          })}
        </nav>
        
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-400 font-bold hover:bg-red-500/10 rounded-xl transition-colors">
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative max-w-full overflow-hidden bg-gray-50 dark:bg-gray-950">
        {/* Topbar Mobile */}
        <header className="md:hidden flex items-center justify-between p-4 bg-slate-900 text-white z-10 sticky top-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-lg tracking-tight">Admin</span>
          </div>
          <button onClick={handleLogout} className="p-2 bg-slate-800 rounded-full text-red-400">
            <LogOut className="w-5 h-5" />
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
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 flex justify-around p-2 pb-safe z-50">
          {NAV.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all ${isActive ? 'text-indigo-400' : 'text-slate-500'}`}>
                <item.icon className={`w-6 h-6 mb-1 ${isActive ? 'text-indigo-400' : ''}`} />
                <span className="text-[10px] font-bold tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </main>
    </div>
  );
}
