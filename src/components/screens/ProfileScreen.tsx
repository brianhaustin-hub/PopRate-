'use client';

import { useState } from 'react';
import { users } from '@/data/mock';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatNumber } from '@/lib/utils';
import { Heart, Star, Trophy, Bookmark, Camera, Edit3, Settings } from 'lucide-react';
import { ProfileTab } from '@/types';

const user = users[0];

export function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');

  const tabs = [
    { id: 'posts', icon: Heart, label: 'Posts' },
    { id: 'ratings', icon: Star, label: 'Ratings' },
    { id: 'battles', icon: Trophy, label: 'Battles' },
    { id: 'saved', icon: Bookmark, label: 'Saved' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Profile Header */}
      <div className="bg-surface-950 px-4 pt-6 pb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar src={user.avatar} size="xl" />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-pop-500 flex items-center justify-center border-2 border-surface-950">
              <Camera size={14} className="text-white" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{user.displayName}</h1>
              <button className="w-6 h-6 rounded-full bg-surface-800 flex items-center justify-center">
                <Edit3 size={12} className="text-white/60" />
              </button>
            </div>
            <p className="text-sm text-white/60">@{user.username}</p>
            <p className="text-xs text-white/40 mt-1">{user.bio}</p>
          </div>
          <button className="w-9 h-9 rounded-full bg-surface-800 flex items-center justify-center">
            <Settings size={18} className="text-white/60" />
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 mt-4">
          <div className="text-center">
            <p className="text-lg font-bold text-white">{user.followers.toLocaleString()}</p>
            <p className="text-xs text-white/40">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-white">{user.following.toLocaleString()}</p>
            <p className="text-xs text-white/40">Following</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-pop-500">{user.averageRating}</p>
            <p className="text-xs text-white/40">Avg Rating</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-white">{user.ratingsCount.toLocaleString()}</p>
            <p className="text-xs text-white/40">Ratings</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-10 bg-surface-950/95 backdrop-blur-xl px-4">
        <div className="flex gap-1 pb-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === tab.id ? 'bg-pop-500 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {activeTab === 'posts' && (
          <div className="grid grid-cols-2 gap-2 mt-4">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden">
                <img
                  src={`https://picsum.photos/seed/profile${i}/400/400`}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'ratings' && (
          <div className="mt-4 space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-surface-900 rounded-xl">
                <div className="w-12 h-12 rounded-xl overflow-hidden">
                  <img src={`https://picsum.photos/seed/rate${i}/200/200`} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">Post {i + 1}</p>
                  <p className="text-xs text-white/40">Rated {8 + Math.random().toFixed(1)}</p>
                </div>
                <span className="text-pop-500 font-bold">★</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'battles' && (
          <div className="mt-4 space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-surface-900 rounded-xl">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-surface-800 overflow-hidden">
                    <img src={`https://picsum.photos/seed/b${i}a/100/100`} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-surface-800 overflow-hidden -ml-2">
                    <img src={`https://picsum.photos/seed/b${i}b/100/100`} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">Battle {i + 1}</p>
                  <p className="text-xs text-white/40">Voted Winner</p>
                </div>
                <Badge variant="success">Won</Badge>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="mt-4 text-center py-16">
            <Bookmark size={48} className="text-white/20 mx-auto mb-3" />
            <p className="text-white/40">No saved posts yet</p>
            <p className="text-xs text-white/30 mt-1">Save posts you love to find them later</p>
          </div>
        )}
      </div>
    </div>
  );
}
