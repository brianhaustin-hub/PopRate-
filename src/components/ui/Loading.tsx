'use client';

import { cn } from '@/lib/cn';

export function Loading({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="w-8 h-8 border-3 border-white/20 border-t-pop-500 rounded-full animate-spin" />
    </div>
  );
}

export function PostLoading() {
  return (
    <div className="bg-surface-900 rounded-2xl overflow-hidden p-4 border border-white/5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-surface-800 animate-pulse" />
        <div className="flex-1">
          <div className="h-3 bg-surface-800 rounded-full w-24 animate-pulse mb-2" />
          <div className="h-2 bg-surface-800 rounded-full w-16 animate-pulse" />
        </div>
      </div>
      <div className="aspect-[3/4] bg-surface-800 rounded-xl animate-pulse mb-4" />
      <div className="h-3 bg-surface-800 rounded-full w-3/4 animate-pulse mb-2" />
      <div className="h-3 bg-surface-800 rounded-full w-1/2 animate-pulse" />
    </div>
  );
}
