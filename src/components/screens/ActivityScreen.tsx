'use client';

import { notifications } from '@/data/mock';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { formatTimeAgo } from '@/lib/utils';
import { Heart, MessageCircle, UserPlus, Star, Trophy, AtSign, TrendingUp, Gift } from 'lucide-react';
import { Notification } from '@/types';

const typeIcons = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  rating: Star,
  battle_result: Trophy,
  mention: AtSign,
  trending: TrendingUp,
  challenge: Gift,
};

const typeColors = {
  like: 'text-pink-500',
  comment: 'text-blue-500',
  follow: 'text-green-500',
  rating: 'text-yellow-500',
  battle_result: 'text-purple-500',
  mention: 'text-cyan-500',
  trending: 'text-orange-500',
  challenge: 'text-red-500',
};

export function ActivityScreen() {
  return (
    <div className="h-full flex flex-col">
      <div className="sticky top-0 z-10 bg-surface-950/95 backdrop-blur-xl px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Activity</h1>
            <p className="text-xs text-white/40">Your notifications</p>
          </div>
          <button className="text-sm text-pop-500 font-semibold">Mark all read</button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 mt-3 overflow-x-auto">
          {['all', 'likes', 'comments', 'follows', 'ratings'].map((tab) => (
            <button
              key={tab}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${
                tab === 'all' ? 'bg-pop-500 text-white' : 'bg-surface-800 text-white/60'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24">
        <div className="space-y-1">
          {notifications.map((notification, index) => {
            const Icon = typeIcons[notification.type];
            const colorClass = typeColors[notification.type];

            return (
              <div
                key={notification.id}
                className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-colors ${
                  notification.read ? 'bg-transparent' : 'bg-surface-900/50'
                } hover:bg-surface-900/50`}
              >
                <Avatar src={notification.image || ''} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/90">
                    <span className="font-semibold text-white">{notification.title}</span>{' '}
                    <span className="text-white/60">{notification.message}</span>
                  </p>
                  <p className="text-xs text-white/30 mt-1">{formatTimeAgo(notification.timestamp)}</p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-pop-500 flex-shrink-0 mt-2" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
