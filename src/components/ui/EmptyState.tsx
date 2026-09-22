'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex flex-col items-center justify-center py-16 px-6 text-center')}
    >
      <div className="w-20 h-20 rounded-full bg-surface-800 flex items-center justify-center mb-4">
        <Icon size={36} className="text-white/30" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-white/40 max-w-xs mb-6">{description}</p>
      {action}
    </motion.div>
  );
}
