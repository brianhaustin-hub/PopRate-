'use client';

import { ReactNode } from 'react';
import { BottomNav } from './BottomNav';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-950 text-white">
      <div className="mx-auto flex h-[100dvh] w-full max-w-2xl flex-col overflow-hidden border-x border-white/[0.04] bg-surface-950 shadow-2xl">
        <main className="min-h-0 flex-1 overflow-hidden pb-[calc(72px+env(safe-area-inset-bottom))]">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
