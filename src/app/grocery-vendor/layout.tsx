"use client";

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, ShoppingCart, Package, Tag, BarChart, Settings, LogOut, Store } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const NAV = [
  { href: '/grocery-vendor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/grocery-vendor/orders', label: 'Orders (Kanban)', icon: ShoppingCart },
  { href: '/grocery-vendor/inventory', label: 'Inventory', icon: Package },
  { href: '/grocery-vendor/offers', label: 'Offers', icon: Tag },
  { href: '/grocery-vendor/analytics', label: 'Analytics', icon: BarChart },
  { href: '/grocery-vendor/settings', label: 'Settings', icon: Settings },
];

export default function GroceryVendorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 font-sans selection:bg-emerald-500/30 text-gray-900 dark:text-gray-100">
      
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 shrink-0 shadow-sm">
        <div className="flex items-center gap-3 px-2 py-4 mb-6">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Store className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tight leading-none text-emerald-600 dark:text-emerald-400">Vendor</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Grocery Portal</span>
          </div>
        </div>
        
        <nav className="flex-1 flex flex-col gap-2">
          {NAV.map(item => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${isActive ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                <item.icon className={`w-5 h-5 ${isActive ? 'text-emerald-500' : ''}`} /> {item.label}
              </Link>
            );
          })}
        </nav>
        
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors">
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative max-w-full overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Store className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-lg text-emerald-600 dark:text-emerald-400">Vendor Portal</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
