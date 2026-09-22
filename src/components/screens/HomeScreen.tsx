'use client';

import { useState } from 'react';
import { posts } from '@/data/mock';
import { PostCard } from '@/components/shell/PostCard';
import { PostDetail } from '@/components/shell/PostDetail';
import { Loading } from '@/components/ui/Loading';
import { FeedTab } from '@/types';

export function HomeScreen() {
  const [activeTab, setActiveTab] = useState<FeedTab>('forYou');
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredPosts = activeTab === 'forYou'
    ? posts
    : activeTab === 'following'
    ? posts.filter((p) => p.creator.isFollowing)
    : activeTab === 'battles'
    ? posts.slice(0, 4)
    : posts.filter((p) => p.category === '3D Art' || p.category === 'Digital Art');

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-surface-950/95 backdrop-blur-xl px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold text-white">PopRate</h1>
            <p className="text-xs text-white/40">Discover what's trending</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-full bg-surface-800 flex items-center justify-center">
              <span className="text-white/60 text-sm">🔔</span>
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pop-500 to-neon-500 flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-2">
          {(['forYou', 'following', 'battles', 'challenges'] as FeedTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-pop-500 text-white shadow-pop'
                  : 'bg-surface-800 text-white/60 hover:text-white'
              }`}
            >
              {tab === 'forYou' ? 'For You' : tab === 'following' ? 'Following' : tab === 'battles' ? 'Battles' : 'Challenges'}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Loading key={i} />
            ))}
          </div>
        ) : (
          <div className="space-y-0">
            {filteredPosts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                onPress={() => setSelectedPost(post.id)}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      {/* Post Detail Overlay */}
      {selectedPost && (
        <PostDetail
          post={posts.find((p) => p.id === selectedPost)!}
          onClose={() => setSelectedPost(null)}
          onRate={(value) => console.log('Rated:', value)}
        />
      )}
    </div>
  );
}
