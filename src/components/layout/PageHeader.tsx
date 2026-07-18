"use client";
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PageHeader({ title, showBack = true }: { title: string, showBack?: boolean }) {
  const router = useRouter();
  
  return (
    <div className="flex items-center gap-3 py-4 px-4 bg-transparent sticky top-0 z-40 backdrop-blur-sm">
      {showBack && (
        <button 
          onClick={() => router.back()} 
          className="p-2 -ml-2 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 hover:scale-105 active:scale-95 transition-all text-gray-700 dark:text-gray-300"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h1>
    </div>
  );
}
