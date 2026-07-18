"use client";

import PageHeader from '@/components/layout/PageHeader';
import EmptyState from '@/components/ui/EmptyState';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { User } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const logout = useAuthStore(state => state.logout);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      <PageHeader title="Profile" showBack />
      
      <div className="flex-1 p-4 flex flex-col gap-4 mt-6">
        <EmptyState 
          icon={User} 
          title="Coming soon" 
          description="Profile management is not fully built yet in this POC."
        />

        <div className="mt-8 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm max-w-md mx-auto w-full">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Demo Controls</h3>
          
          <button 
            onClick={() => {
              // Switch role by un-setting the role and going to login
              // Wait, user says "without logging out".
              router.push('/login');
            }}
            className="w-full mb-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold py-3 px-4 rounded-xl transition-colors"
          >
            Switch Role
          </button>
          
          <button 
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="w-full bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-bold py-3 px-4 rounded-xl transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
