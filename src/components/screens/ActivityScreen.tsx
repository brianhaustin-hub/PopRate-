'use client';

import { useEffect, useMemo, useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { formatTimeAgo } from '@/lib/utils';
import {
  AtSign,
  Bell,
  Check,
  ChevronRight,
  Gift,
  Heart,
  MessageCircle,
  Star,
  TrendingUp,
  Trophy,
  UserPlus,
} from 'lucide-react';
import { Notification } from '@/types';
import { getActivity, subscribeActivity, markActivityRead, markAllActivityRead } from '@/data/activityStore';
import { useRouter } from 'next/navigation';

type ActivityFilter = 'all' | 'likes' | 'comments' | 'follows' | 'ratings' | 'challenges';

const typeIcons: Record<Notification['type'], typeof Heart> = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  rating: Star,
  battle_result: Trophy,
  mention: AtSign,
  trending: TrendingUp,
  challenge: Gift,
};

const typeColors: Record<Notification['type'], string> = {
  like: 'text-pink-400 bg-pink-500/10',
  comment: 'text-blue-400 bg-blue-500/10',
  follow: 'text-emerald-400 bg-emerald-500/10',
  rating: 'text-yellow-400 bg-yellow-500/10',
  battle_result: 'text-violet-400 bg-violet-500/10',
  mention: 'text-cyan-400 bg-cyan-500/10',
  trending: 'text-orange-400 bg-orange-500/10',
  challenge: 'text-pop-400 bg-pop-500/10',
};

const filterMap: Record<ActivityFilter, Notification['type'][]> = {
  all: ['like', 'comment', 'follow', 'rating', 'battle_result', 'mention', 'trending', 'challenge'],
  likes: ['like'],
  comments: ['comment', 'mention'],
  follows: ['follow'],
  ratings: ['rating', 'battle_result'],
  challenges: ['challenge'],
};

export function ActivityScreen() {
  const router = useRouter();
  const [items, setItems] = useState<Notification[]>(getActivity());
  const [filter, setFilter] = useState<ActivityFilter>('all');

  useEffect(() => subscribeActivity(() => setItems(getActivity())), []);

  const unreadCount = items.filter((item) => !item.read).length;
  const filtered = useMemo(
    () => items.filter((item) => filterMap[filter].includes(item.type)),
    [items, filter],
  );

  const markAllRead = () => {
    markAllActivityRead();
    setItems(getActivity());
  };

  const markRead = (id: string) => {
    markActivityRead(id);
    setItems(getActivity());
  };

  return (
    <div className="h-full flex flex-col">
      <header className="sticky top-0 z-20 bg-surface-950/95 backdrop-blur-xl border-b border-white/5">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-white">Activity</h1>
                {unreadCount > 0 && (
                  <span className="min-w-5 h-5 px-1.5 rounded-full bg-pop-500 text-white text-[10px] font-black flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <p className="text-xs text-white/40 mt-0.5">What&apos;s happening around your PopRate</p>
            </div>

            <button
              onClick={markAllRead}
              disabled={unreadCount === 0}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-surface-800 text-xs font-bold text-white/70 disabled:opacity-30 transition"
            >
              <Check size={14} />
              Read all
            </button>
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide pb-0.5">
            {(['all', 'likes', 'comments', 'follows', 'ratings', 'challenges'] as ActivityFilter[]).map((tab) => {
              const active = filter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={
                    active
                      ? 'px-3.5 py-2 rounded-full bg-pop-500 text-white text-xs font-bold shadow-pop whitespace-nowrap'
                      : 'px-3.5 py-2 rounded-full bg-surface-800 text-white/50 text-xs font-semibold whitespace-nowrap'
                  }
                >
                  {tab === 'all' ? 'All' : tab === 'challenges' ? 'Challenges' : tab[0].toUpperCase() + tab.slice(1)}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pt-3 pb-28">
        {filtered.length === 0 ? (
          <div className="min-h-[55vh] flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-3xl bg-surface-900 border border-white/5 flex items-center justify-center mb-4">
              <Bell size={26} className="text-white/25" />
            </div>
            <h2 className="text-base font-bold text-white">Nothing here yet</h2>
            <p className="text-sm text-white/35 mt-1 max-w-xs">
              New activity will appear here when people interact with your PopRate.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filtered.map((notification) => {
              const Icon = typeIcons[notification.type];
              const color = typeColors[notification.type];

              return (
                <button
                  key={notification.id}
                  onClick={() => { markRead(notification.id); if (notification.href) router.push(notification.href); }}
                  className={
                    notification.read
                      ? 'w-full flex items-center gap-3 p-3.5 rounded-2xl text-left transition hover:bg-surface-900/70'
                      : 'w-full flex items-center gap-3 p-3.5 rounded-2xl text-left bg-surface-900 border border-white/5 shadow-sm transition hover:border-white/10'
                  }
                >
                  <div className="relative shrink-0">
                    <Avatar src={notification.image || ''} size="md" />
                    <span className={'absolute -right-1 -bottom-1 w-6 h-6 rounded-full border-2 border-surface-950 flex items-center justify-center ' + color}>
                      <Icon size={11} />
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                      <p className="text-sm leading-5 text-white/90 flex-1">
                        <span className="font-bold text-white">{notification.title}</span>{' '}
                        <span className="text-white/55">{notification.message}</span>
                      </p>
                      {!notification.read && <span className="w-2 h-2 rounded-full bg-pop-500 shrink-0 mt-2" />}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[11px] text-white/30">{formatTimeAgo(notification.timestamp)}</span>
                      {!notification.read && (
                        <span className="text-[10px] font-bold text-pop-400">NEW</span>
                      )}
                    </div>
                  </div>

                  <ChevronRight size={16} className="text-white/15 shrink-0" />
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-white/5 bg-gradient-to-br from-pop-500/10 via-surface-900 to-surface-900 p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-pop-500/15 flex items-center justify-center shrink-0">
              <Trophy size={18} className="text-pop-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Keep the arena moving</p>
              <p className="text-xs text-white/40 mt-1 leading-5">
                Vote on live challenges, react to posts, and follow creators to shape your feed.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
