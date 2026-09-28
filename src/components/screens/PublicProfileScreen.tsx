'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, posts } from '@/data/mock';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Check, Grid3X3, MessageCircle, Share2, Star, Trophy, UserPlus } from 'lucide-react';
import { isFollowing, subscribeSocialGraph, toggleFollow } from '@/data/socialGraph';

export function PublicProfileScreen({ user }: { user: User }) {
  const router = useRouter();
  const [following, setFollowing] = useState(() => isFollowing(user.id));
  const [copied, setCopied] = useState(false);
  useEffect(() => subscribeSocialGraph(() => setFollowing(isFollowing(user.id))), [user.id]);

  const userPosts = useMemo(
    () => posts.filter((post) => post.creator.id === user.id),
    [user.id]
  );

  const copyProfile = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.clipboard && url) await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="h-full flex flex-col">
      <header className="sticky top-0 z-20 bg-surface-950/95 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-surface-800 border border-white/5 flex items-center justify-center"
            aria-label="Go back"
          >
            <ArrowLeft size={17} className="text-white/70" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/30 font-bold">PopRate profile</p>
            <h1 className="text-base font-black text-white truncate">@{user.username}</h1>
          </div>
          <button
            onClick={copyProfile}
            className="w-9 h-9 rounded-full bg-surface-800 border border-white/5 flex items-center justify-center"
            aria-label="Share profile"
          >
            {copied ? <Check size={17} className="text-green-400" /> : <Share2 size={17} className="text-white/65" />}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-10">
        <section className="px-4 pt-6">
          <div className="flex items-start gap-4">
            <Avatar src={user.avatar} alt={user.displayName} size="xl" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-white">{user.displayName}</h2>
                {user.averageRating >= 9 && <Badge variant="accent">Top creator</Badge>}
              </div>
              <p className="text-sm text-white/40 mt-0.5">@{user.username}</p>
              <p className="text-sm text-white/65 mt-2 leading-5">{user.bio}</p>
            </div>
          </div>

          <div className="flex gap-2 mt-5">
            <Button
              size="sm"
              variant={following ? 'secondary' : 'neon'}
              className="flex-1"
              onClick={() => { const next = toggleFollow(user.id); setFollowing(next); }}
            >
              {following ? <Check size={14} className="mr-1.5" /> : <UserPlus size={14} className="mr-1.5" />}
              {following ? 'Following' : 'Follow'}
            </Button>
            <Button size="sm" variant="secondary" className="flex-1" onClick={() => router.push('/search')}>
              <MessageCircle size={14} className="mr-1.5" /> Message
            </Button>
          </div>

          <div className="grid grid-cols-4 mt-6 py-4 border-y border-white/5">
            {[
              ['Followers', user.followers.toLocaleString()],
              ['Following', user.following.toLocaleString()],
              ['Avg rating', user.averageRating.toFixed(1)],
              ['Ratings', user.ratingsCount.toLocaleString()],
            ].map(([label, value]) => (
              <div key={label} className="text-center">
                <p className="text-base font-black text-white">{value}</p>
                <p className="text-[10px] text-white/35 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-4 p-3 rounded-2xl bg-surface-900 border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-pop-500/10 flex items-center justify-center">
              <Star size={18} className="text-pop-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-white">Community rating</p>
              <p className="text-[11px] text-white/35 mt-0.5">Average across {user.ratingsCount.toLocaleString()} ratings</p>
            </div>
            <span className="text-xl font-black text-pop-400">{user.averageRating.toFixed(1)}</span>
          </div>
        </section>

        <section className="mt-6 px-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Grid3X3 size={16} className="text-white/50" />
              <h3 className="text-sm font-black text-white">PopRates</h3>
            </div>
            <span className="text-[11px] text-white/30">{userPosts.length} posts</span>
          </div>

          {userPosts.length > 0 ? (
            <div className="grid grid-cols-3 gap-1.5">
              {userPosts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => router.push('/post/' + post.id)}
                  className="aspect-square rounded-xl overflow-hidden bg-surface-900 relative group"
                >
                  <img src={post.image} alt={post.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                    <span className="text-[10px] text-white font-bold">★ {post.rating.toFixed(1)}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-14 text-center rounded-2xl bg-surface-900 border border-white/5">
              <Trophy size={22} className="mx-auto text-white/20" />
              <p className="text-sm font-bold text-white mt-3">No PopRates yet</p>
              <p className="text-xs text-white/35 mt-1">This creator has not published a PopRate.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
