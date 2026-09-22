'use client';

import { useState } from 'react';
import { posts, users, battles, challenges, categories, trendingTags } from '@/data/mock';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { formatNumber } from '@/lib/utils';
import { Search, Flame, TrendingUp, Users, Palette, Trophy, Star } from 'lucide-react';
import { DiscoverTab } from '@/types';

export function DiscoverScreen() {
  const [activeTab, setActiveTab] = useState<DiscoverTab>('trending');

  const renderContent = () => {
    switch (activeTab) {
      case 'trending':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Flame size={20} className="text-orange-500" />
              <h2 className="text-xl font-bold text-white">Trending Now</h2>
            </div>
            {posts.slice(0, 5).map((post, i) => (
              <div key={post.id} className="flex gap-3 p-3 bg-surface-900 rounded-xl border border-white/5 mb-2 hover:border-white/10 transition-colors cursor-pointer">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={post.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-white truncate">{post.caption.slice(0, 50)}...</p>
                  <p className="text-xs text-white/40 mt-1">{post.creator.displayName}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-pop-500">★ {post.rating}</span>
                    <span className="text-xs text-white/30">{formatNumber(post.likes)} likes</span>
                  </div>
                </div>
                <Badge variant="accent">{post.category}</Badge>
              </div>
            ))}
          </div>
        );

      case 'rising':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={20} className="text-green-500" />
              <h2 className="text-xl font-bold text-white">Rising Stars</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {posts.slice(0, 6).map((post, i) => (
                <div key={post.id} className="overflow-hidden rounded-xl bg-surface-900 border border-white/5 cursor-pointer hover:border-white/10 transition-colors">
                  <div className="aspect-square relative">
                    <img src={post.image} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white font-semibold text-xs">{post.creator.displayName}</p>
                      <p className="text-pop-500 text-xs font-bold">★ {post.rating}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'creators':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Users size={20} className="text-neon-500" />
              <h2 className="text-xl font-bold text-white">Top Creators</h2>
            </div>
            <div className="space-y-3">
              {users.slice(0, 6).map((user, i) => (
                <div key={user.id} className="flex items-center gap-3 p-3 bg-surface-900 rounded-xl border border-white/5 hover:border-white/10 cursor-pointer">
                  <Avatar src={user.avatar} size="lg" showBadge />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-white">{user.displayName}</p>
                    <p className="text-xs text-white/40">{user.followers.toLocaleString()} followers</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-pop-500">★ {user.averageRating}</p>
                    <p className="text-[10px] text-white/30">{user.ratingsCount.toLocaleString()} ratings</p>
                  </div>
                  <Button variant="secondary" size="sm">Follow</Button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'categories':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Palette size={20} className="text-yellow-500" />
              <h2 className="text-xl font-bold text-white">Categories</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat, i) => (
                <div key={cat.name} className="p-4 bg-surface-900 rounded-xl border border-white/5 cursor-pointer hover:border-white/10 transition-colors text-center">
                  <div className="w-12 h-12 rounded-xl bg-surface-800 flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">{cat.icon}</span>
                  </div>
                  <p className="font-semibold text-sm text-white">{cat.name}</p>
                  <p className="text-xs text-white/40">{formatNumber(cat.count)} posts</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'challenges':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy size={20} className="text-yellow-500" />
              <h2 className="text-xl font-bold text-white">Challenges</h2>
            </div>
            <div className="space-y-3">
              {challenges.map((challenge, i) => (
                <div key={challenge.id} className="overflow-hidden rounded-xl bg-surface-900 border border-white/5 cursor-pointer hover:border-white/10 transition-colors">
                  <div className="h-32 relative">
                    <img src={challenge.image} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-900 to-transparent" />
                    <div className="absolute top-3 right-3">
                      <Badge variant="warning">Active</Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      <p className="font-semibold text-sm text-white">{challenge.title}</p>
                    </div>
                    <p className="text-xs text-white/40 mb-3">{challenge.description.slice(0, 60)}...</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-white/30">{formatNumber(challenge.participants)} participants</p>
                      <Button variant="secondary" size="sm">Join</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="sticky top-0 z-10 bg-surface-950/95 backdrop-blur-xl px-4 py-3">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-surface-800 text-white pl-10 pr-4 py-2.5 rounded-full text-sm border border-white/5 focus:border-pop-500/50 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-1 overflow-x-auto pb-2">
          {(['trending', 'rising', 'creators', 'categories', 'challenges'] as DiscoverTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all capitalize ${
                activeTab === tab
                  ? 'bg-pop-500 text-white shadow-pop'
                  : 'bg-surface-800 text-white/60 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {renderContent()}
      </div>
    </div>
  );
}
