"use client";

import PageHeader from '@/components/layout/PageHeader';
import EmptyState from '@/components/ui/EmptyState';
import { useRouter } from 'next/navigation';
import { Receipt } from 'lucide-react';

export default function OrdersPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      <PageHeader title="Orders" showBack />
      
      <div className="flex-1 p-4 flex flex-col justify-center mt-6">
        <EmptyState 
          icon={Receipt} 
          title="Coming soon" 
          description="Order history is not fully built yet in this POC."
          action={<button onClick={() => router.push('/')} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors">Go Home</button>}
        />
      </div>
    </div>
  );
}
