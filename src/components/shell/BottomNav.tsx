'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Compass, Plus, Bell, User } from 'lucide-react';
import { cn } from '@/lib/cn';

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'discover', label: 'Discover', icon: Compass },
  { id: 'create', label: 'Create', icon: Plus },
  { id: 'activity', label: 'Activity', icon: Bell },
  { id: 'profile', label: 'Profile', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const currentTab = pathname.split('/')[1] || 'home';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface-950/95 backdrop-blur-xl border-t border-white/5 safe-bottom">
      <div className="flex items-center justify-around py-2 px-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => router.push(`/${item.id}`)}
              className={cn(
                'relative flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-colors',
                isActive ? 'text-white' : 'text-white/40'
              )}
            >
              {isActive && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-pop-500" />
              )}
              <Icon
                size={22}
                className={cn(isActive && 'text-pop-500')}
              />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
