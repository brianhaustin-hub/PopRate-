'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Bell, Compass, Home, Plus, User } from 'lucide-react';
import { cn } from '@/lib/cn';

const navItems = [
  { id: 'home', label: 'Home', icon: Home, href: '/' },
  { id: 'discover', label: 'Discover', icon: Compass, href: '/discover' },
  { id: 'create', label: 'Create', icon: Plus, href: '/create' },
  { id: 'activity', label: 'Activity', icon: Bell, href: '/activity' },
  { id: 'profile', label: 'Profile', icon: User, href: '/profile' },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const currentTab = pathname === '/' ? 'home' : pathname.split('/')[1] || 'home';

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.07] bg-surface-950/90 backdrop-blur-2xl safe-bottom">
      <div className="mx-auto flex h-[72px] max-w-2xl items-center justify-around px-2">
        {navItems.map((item) => {
          const active = currentTab === item.id;
          const Icon = item.icon;
          const create = item.id === 'create';
          return (
            <button key={item.id} onClick={() => router.push(item.href)} aria-label={item.label}
              className={cn('relative flex min-w-[58px] flex-col items-center justify-center gap-1 rounded-2xl py-1.5 transition-all active:scale-95', active ? 'text-white' : 'text-white/40 hover:text-white/70')}>
              {create ? (
                <span className={cn('grid h-11 w-11 place-items-center rounded-2xl shadow-pop transition-transform', active ? 'bg-pop-500' : 'bg-white text-surface-950')}><Icon size={23} strokeWidth={2.6} /></span>
              ) : (
                <span className="relative grid h-7 place-items-center"><Icon size={21} strokeWidth={active ? 2.4 : 2} className={active ? 'text-pop-500' : ''} />{active && <span className="absolute -bottom-2 h-1 w-1 rounded-full bg-pop-500" />}</span>
              )}
              <span className={cn('text-[10px] font-semibold tracking-tight', create && 'mt-0.5')}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
