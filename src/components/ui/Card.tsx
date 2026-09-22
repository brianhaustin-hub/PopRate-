'use client';

import { cn } from '@/lib/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover = false, padding = true, onClick }: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface-900 border border-white/5 rounded-2xl overflow-hidden',
        hover && 'hover:border-white/10 transition-colors cursor-pointer',
        padding && 'p-4',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
