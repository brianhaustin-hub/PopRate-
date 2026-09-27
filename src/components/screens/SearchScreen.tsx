'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { users, posts, categories, trendingTags } from '@/data/mock';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Search, User, Image, Hash, Palette, ArrowUpRight, SlidersHorizontal } from 'lucide-react';
import { SearchTab } from '@/types';

export function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('people');

  const tabs = [
    { id: 'people' as SearchTab, icon: User, label: 'People' },
    { id: 'creators' as SearchTab, icon: User, label: 'Creators' },
    { id: 'posts' as SearchTab, icon: Image, label: 'Posts' },
    { id: 'categories' as SearchTab, icon: Palette, label: 'Categories' },
    { id: 'hashtags' as SearchTab, icon: Hash, label: 'Tags' },
  ];

  const normalized = query.trim().toLowerCase();

  const results = useMemo(() => {
    const people = users.filter((u) =>
      !normalized ||
      u.username.toLowerCase().includes(normalized) ||
      u.displayName.toLowerCase().includes(normalized) ||
      u.bio.toLowerCase().includes(normalized)
    );

    const creators = users
      .filter((u) => u.averageRating >= 8.5)
      .filter((u) =>
        !normalized ||
        u.username.toLowerCase().includes(normalized) ||
        u.displayName.toLowerCase().includes(normalized) ||
        u.bio.toLowerCase().includes(normalized)
      );

    const postResults = posts.filter((post) =>
      !normalized ||
      post.caption.toLowerCase().includes(normalized) ||
      post.category.toLowerCase().includes(normalized) ||
      post.tags.some((tag) => tag.toLowerCase().includes(normalized))
    );

    const categoryResults = categories.filter((category) =>
      !normalized || category.name.toLowerCase().includes(normalized)
    );

    const hashtagResults = trendingTags.filter((tag) =>
      !normalized || tag.toLowerCase().includes(normalized.replace(/^#/, ''))
    );

    return { people, creators, posts: postResults, categories: categoryResults, hashtags: hashtagResults };
  }, [normalized]);

  const activeResults = results[activeTab];

  return (
    <div className="h-full flex flex-col">
      <div className="sticky top-0 z-10 bg-surface-950/95 backdrop-blur-xl px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              autoFocus
              type="text"
              placeholder="Search people, posts, tags..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-surface-800 text-white pl-11 pr-4 py-3 rounded-full text-sm border border-white/5 focus:border-pop-500/50 focus:outline-none"
            />
          </div>
          <button
            className="w-11 h-11 shrink-0 rounded-full bg-surface-800 border border-white/5 flex items-center justify-center"
            aria-label="Search filters"
          >
            <SlidersHorizontal size={17} className="text-white/55" />
          </button>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pt-3 pb-1 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={active
                  ? 'flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold whitespace-nowrap bg-pop-500 text-white'
                  : 'flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold whitespace-nowrap bg-surface-800 text-white/55'}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-28">
        {!normalized ? (
          <div className="pt-6">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/30 font-bold">Explore</p>
            <h2 className="text-xl font-black text-white mt-1">Find your next PopRate</h2>
            <p className="text-sm text-white/40 mt-1">Search creators, categories, posts and conversations.</p>

            <div className="grid grid-cols-2 gap-2 mt-5">
              {categories.slice(0, 4).map((category) => (
                <button
                  key={category.name}
                  onClick={() => { setActiveTab('categories'); setQuery(category.name); }}
                  className="p-4 rounded-2xl bg-surface-900 border border-white/5 text-left hover:border-white/10"
                >
                  <div className="w-9 h-9 rounded-xl bg-pop-500/10 flex items-center justify-center">
                    <Palette size={17} className="text-pop-400" />
                  </div>
                  <p className="text-sm font-bold text-white mt-3">{category.name}</p>
                  <p className="text-[11px] text-white/35 mt-1">{category.count.toLocaleString()} posts</p>
                </button>
              ))}
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-white/60">Popular creators</p>
                <button onClick={() => setActiveTab('creators')} className="text-[11px] text-pop-400 font-bold">See all</button>
              </div>
              <div className="space-y-2">
                {users.slice(0, 4).map((user) => (
                  <button
                    key={user.id}
                    onClick={() => router.push('/user/' + user.username)}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl bg-surface-900 border border-white/5 text-left"
                  >
                    <Avatar src={user.avatar} alt={user.displayName} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{user.displayName}</p>
                      <p className="text-xs text-white/35 truncate">@{user.username} · {user.followers.toLocaleString()} followers</p>
                    </div>
                    <ArrowUpRight size={15} className="text-white/25" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-4">
            <p className="text-xs text-white/35 mb-3">
              {activeResults.length} result{activeResults.length === 1 ? '' : 's'} for <span className="text-white/70">"{query}"</span>
            </p>

            {activeResults.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-surface-900 border border-white/5 flex items-center justify-center">
                  <Search size={22} className="text-white/20" />
                </div>
                <p className="text-sm font-bold text-white mt-4">Nothing popped up</p>
                <p className="text-xs text-white/35 mt-1">Try a username, category, tag or keyword.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {activeResults.map((item: any, index: number) => (
                  <button
                    key={item.id || item.name || item || index}
                    onClick={() => {
                      if (activeTab === 'people' || activeTab === 'creators') router.push('/user/' + item.username);
                      else if (activeTab === 'posts') router.push('/discover');
                    }}
                    className="w-full flex items-center gap-3 p-3 bg-surface-900 rounded-2xl border border-white/5 text-left hover:border-white/10"
                  >
                    {activeTab === 'hashtags' ? (
                      <div className="w-10 h-10 rounded-xl bg-surface-800 flex items-center justify-center">
                        <Hash size={18} className="text-white/40" />
                      </div>
                    ) : activeTab === 'categories' ? (
                      <div className="w-10 h-10 rounded-xl bg-surface-800 flex items-center justify-center">
                        <Palette size={18} className="text-white/40" />
                      </div>
                    ) : activeTab === 'posts' ? (
                      <img src={item.image} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    ) : (
                      <Avatar src={item.avatar} alt={item.displayName} size="md" />
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-bold truncate">
                        {activeTab === 'hashtags' ? item : item.displayName || item.name}
                      </p>
                      <p className="text-xs text-white/40 truncate">
                        {activeTab === 'people' ? '@' + item.username + ' · ' + item.followers.toLocaleString() + ' followers' :
                         activeTab === 'creators' ? '@' + item.username + ' · ★ ' + item.averageRating.toFixed(1) + ' average' :
                         activeTab === 'posts' ? item.category + ' · ' + item.likes.toLocaleString() + ' likes' :
                         activeTab === 'categories' ? item.count.toLocaleString() + ' posts' :
                         'Trending tag'}
                      </p>
                    </div>

                    {activeTab !== 'hashtags' && activeTab !== 'categories' && activeTab !== 'posts' && (
                      <Badge variant="accent">Profile</Badge>
                    )}
                    <ArrowUpRight size={15} className="text-white/20 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
