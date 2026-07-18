import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

export type TimelineStep = {
  id: string;
  label: string;
  description?: string;
  isCompleted: boolean;
  isActive: boolean;
};

export default function StatusTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="flex flex-col gap-0 py-4 px-2">
      {steps.map((step, index) => (
        <div key={step.id} className="flex gap-6 relative">
          {/* Connecting Line */}
          {index < steps.length - 1 && (
            <div className="absolute top-8 left-[15px] w-0.5 h-[calc(100%-1rem)] -z-10 bg-gray-200 dark:bg-gray-800">
              {step.isCompleted && (
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: '100%' }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-full bg-green-500" 
                />
              )}
            </div>
          )}
          
          <div className="flex flex-col items-center">
            <motion.div 
              initial={step.isActive ? { scale: 0.8, opacity: 0 } : false}
              animate={step.isActive ? { scale: 1, opacity: 1 } : false}
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 bg-white dark:bg-gray-950 shadow-sm transition-all duration-300 ${
                step.isCompleted 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : step.isActive 
                    ? 'border-red-500 ring-4 ring-red-50 dark:ring-red-950/50' 
                    : 'border-gray-300 dark:border-gray-700'
              }`}
            >
              {step.isCompleted ? (
                <Check className="w-4 h-4 text-white" strokeWidth={3} />
              ) : (
                <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${step.isActive ? 'bg-red-500 scale-100' : 'bg-transparent scale-0'}`} />
              )}
            </motion.div>
          </div>
          <div className="flex flex-col pb-8 pt-1">
            <span className={`font-bold text-[15px] tracking-tight transition-colors ${
              step.isActive ? 'text-red-500' : step.isCompleted ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-600'
            }`}>
              {step.label}
            </span>
            {step.description && (
              <span className={`text-xs mt-1 transition-colors ${
                step.isActive ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
              }`}>
                {step.description}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
