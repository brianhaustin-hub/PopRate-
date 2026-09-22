'use client';

import { useState } from 'react';
import { users, posts, categories, trendingTags } from '@/data/mock';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { formatNumber } from '@/lib/utils';
import { Search, User, Image, Hash, Palette } from 'lucide-react';
import { SearchTab } from '@/types';

export function SearchScreen() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('people');

  const tabs = [
    { id: 'people', icon: User, label: 'People' },
    { id: 'creators', icon: User, label: 'Creators' },
    { id: 'posts', icon: Image, label: 'Posts' },
    { id: 'categories', icon: Palette, label: 'Categories' },
    { id: 'hashtags', icon: Hash, label: 'Tags' },
  ];

  const searchResults = {
    people: users.slice(0, 5),
    creators: users.filter((u) => u.averageRating >= 8.5).slice(0, 5),
    posts: posts.slice(0, 5),
    categories: categories.slice(0, 5),
    hashtags: trendingTags.slice(0, 10),
  };

  return (
    <div className="h-full flex flex-col">
      <div className="sticky top-0 z-10 bg-surface-950/95 backdrop-blur-xl px-4 py-3">
        <div className="relative mb-3">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search people, posts, categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-surface-800 text-white pl-12 pr-4 py-3 rounded-full text-sm border border-white/5 focus:border-pop-500/50 focus:outline-none"
          />
        </div>

        <div className="flex gap-1 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id ? 'bg-pop-500 text-white' : 'bg-surface-800 text-white/60'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {query && (
          <p className="text-sm text-white/40 mt-3 mb-2">{searchResults[activeTab].length} results for "{query}"</p>
        )}

        <div className="space-y-2">
          {searchResults[activeTab].map((item: any, index: number) => (
            <div
              key={item.id || index}
              className="flex items-center gap-3 p-3 bg-surface-900 rounded-xl border border-white/5 hover:border-white/10 cursor-pointer"
            >
              {activeTab === 'hashtags' ? (
                <div className="w-10 h-10 rounded-lg bg-surface-800 flex items-center justify-center">
                  <Hash size={18} className="text-white/40" />
                </div>
              ) : activeTab === 'categories' ? (
                <div className="w-10 h-10 rounded-lg bg-surface-800 flex items-center justify-center">
                  <Palette size={18} className="text-white/40" />
                </div>
              ) : (
                <Avatar src={item.avatar || item.image} size="md" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">
                  {activeTab === 'hashtags' ? item : item.displayName || item.name}
                </p>
                <p className="text-xs text-white/40 truncate">
                  {activeTab === 'people' ? `${item.followers.toLocaleString()} followers` :
                   activeTab === 'creators' ? `★ ${item.averageRating} avg rating` :
                   activeTab === 'posts' ? `${item.likes.toLocaleString()} likes` :
                   activeTab === 'categories' ? `${item.count.toLocaleString()} posts` :
                   item}
                </p>
              </div>
              {activeTab !== 'hashtags' && activeTab !== 'categories' && (
                <Badge variant="accent">{item.category || item.name}</Badge>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
