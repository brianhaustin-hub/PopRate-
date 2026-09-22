'use client';

import { cn } from '@/lib/cn';
import { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'neon';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-pop-500 text-white hover:bg-pop-600 shadow-pop',
    secondary: 'bg-surface-800 text-white hover:bg-surface-700 border border-white/10',
    ghost: 'bg-transparent text-white/70 hover:text-white hover:bg-white/10',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    neon: 'bg-neon-500 text-white hover:bg-neon-600 shadow-neon',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
