import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center p-8 h-full min-h-[50vh]"
    >
      <div className="w-24 h-24 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center mb-6 shadow-inner relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-red-100 to-transparent dark:from-red-900/20 opacity-50" />
        <Icon className="w-12 h-12 text-red-400 dark:text-red-500 relative z-10" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100 tracking-tight">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-[280px] leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-2 w-full max-w-[200px]">{action}</div>}
    </motion.div>
  );
}
