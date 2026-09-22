'use client';

import { ReactNode } from 'react';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-surface-950 overflow-hidden">
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
