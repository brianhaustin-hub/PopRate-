'use client';

import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/cn';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'Something went wrong', onRetry }: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn('flex flex-col items-center justify-center py-16 px-6 text-center')}
    >
      <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <AlertCircle size={36} className="text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-1">Oops!</h3>
      <p className="text-sm text-white/40 max-w-xs mb-6">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </motion.div>
  );
}
