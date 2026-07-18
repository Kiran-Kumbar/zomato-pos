"use client";
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import Topbar from './Topbar';
import BottomNav from './BottomNav';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCustomerApp = !pathname?.startsWith('/login') && !pathname?.startsWith('/restaurant') && !pathname?.startsWith('/delivery') && !pathname?.startsWith('/admin');
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans selection:bg-red-500/30">
      {isCustomerApp && <Topbar />}
      <main className={`flex-1 relative ${isCustomerApp ? 'pb-24 pt-16' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.3 }}
            className={`h-full min-h-screen ${isCustomerApp ? 'w-full max-w-7xl mx-auto px-4 md:px-6' : ''}`}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      {isCustomerApp && <BottomNav />}
    </div>
  );
}
