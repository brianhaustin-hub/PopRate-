'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { posts, comments } from '@/data/mock';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { ArrowLeft, Bookmark, Check, Heart, MessageCircle, MoreHorizontal, Send, Share2, Star, UserPlus } from 'lucide-react';
import { ratePost, toggleLike, toggleSave, usePostEngagement } from '@/data/postEngagement';

export function PostDetailScreen({ postId }: { postId: string }) {
  const router = useRouter();
  const post = useMemo(() => posts.find((item) => item.id === postId) ?? posts[0], [postId]);
  const postComments = useMemo(() => comments.filter((item) => item.postId === post.id), [post.id]);
  const engagement = usePostEngagement(post.id);
  const [rating, setRating] = useState<number | null>(null);
  const [following, setFollowing] = useState(post.creator.isFollowing);
  const [comment, setComment] = useState('');
  const [shared, setShared] = useState(false);

  const share = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.clipboard && url) await navigator.clipboard.writeText(url);
    setShared(true);
    window.setTimeout(() => setShared(false), 1600);
  };

  return (
    <div className="h-full flex flex-col bg-surface-950">
      <header className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-surface-950/90 backdrop-blur-xl border-b border-white/5">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-surface-800 flex items-center justify-center" aria-label="Back">
          <ArrowLeft size={17} className="text-white/70" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/30 font-bold">PopRate</p>
          <p className="text-sm font-black text-white truncate">{post.category}</p>
        </div>
        <button onClick={share} className="w-9 h-9 rounded-full bg-surface-800 flex items-center justify-center" aria-label="Share">
          {shared ? <Check size={16} className="text-green-400" /> : <Share2 size={16} className="text-white/65" />}
        </button>
        <button className="w-9 h-9 rounded-full bg-surface-800 flex items-center justify-center" aria-label="More">
          <MoreHorizontal size={17} className="text-white/65" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-32">
        <div className="relative bg-black">
          <MediaFrame media={{ type: post.mediaType ?? "image", url: post.mediaUrl ?? post.image, thumbnail: post.thumbnail }} alt={post.caption} controls={post.mediaType === "video"} className="w-full max-h-[68vh]" videoClassName="max-h-[68vh]" />
          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/65 px-3 py-1.5 backdrop-blur">
            <Star size={14} className="text-pop-400 fill-pop-400" />
            <span className="text-sm font-black text-white">{post.rating.toFixed(1)}</span>
            <span className="text-[10px] text-white/45">{post.ratingCount.toLocaleString()} ratings</span>
          </div>
        </div>

        <section className="px-4 pt-4">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/user/' + post.creator.username)}>
              <Avatar src={post.creator.avatar} alt={post.creator.displayName} size="md" />
            </button>
            <button onClick={() => router.push('/user/' + post.creator.username)} className="text-left flex-1 min-w-0">
              <p className="text-sm font-black text-white truncate">{post.creator.displayName}</p>
              <p className="text-xs text-white/35">@{post.creator.username}</p>
            </button>
            <button onClick={() => setFollowing((value) => !value)} className="rounded-full border border-white/10 bg-surface-800 px-3 py-2 text-xs font-bold text-white">
              <span className="flex items-center gap-1.5">
                {following ? <Check size={13} /> : <UserPlus size={13} />}
                {following ? 'Following' : 'Follow'}
              </span>
            </button>
          </div>

          <p className="mt-4 text-sm leading-6 text-white/75">{post.caption}</p>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.map((tag) => <Badge key={tag} variant="default">#{tag}</Badge>)}
          </div>

          <div className="flex items-center justify-between mt-5 py-3 border-y border-white/5">
            <div className="flex items-center gap-5">
              <button onClick={() => toggleLike(post.id)} className="flex items-center gap-1.5 text-sm font-semibold text-white/65">
                <Heart size={19} className={engagement.liked ? 'fill-pop-500 text-pop-500' : ''} /> {engagement.likes.toLocaleString()}
              </button>
              <span className="flex items-center gap-1.5 text-sm text-white/45"><MessageCircle size={19} /> {post.comments}</span>
              <button onClick={share} className="flex items-center gap-1.5 text-sm text-white/45"><Send size={18} /> Share</button>
            </div>
            <button onClick={() => toggleSave(post.id)} className="text-white/55" aria-label="Save">
              <Bookmark size={20} className={engagement.saved ? 'fill-white text-white' : ''} />
            </button>
          </div>
        </section>

        <section className="mx-4 mt-5 rounded-3xl bg-surface-900 border border-white/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-pop-400 font-black">Your take</p>
              <h2 className="text-base font-black text-white mt-1">Rate this PopRate</h2>
            </div>
            {rating && <span className="text-xl font-black text-pop-400">{rating}/10</span>}
          </div>
          <div className="grid grid-cols-5 gap-2 mt-4">
            {[1,2,3,4,5,6,7,8,9,10].map((value) => (
              <button key={value} onClick={() => { setRating(value); ratePost(post.id, value); }} className={rating === value ? 'h-10 rounded-xl bg-pop-500 text-white font-black text-xs' : 'h-10 rounded-xl bg-surface-800 text-white/55 font-bold text-xs hover:bg-surface-700'}>
                {value}
              </button>
            ))}
          </div>
          {rating && <p className="text-[11px] text-white/35 mt-3">Your rating is reflected across this prototype session.</p>}
        </section>

        <section className="px-4 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-black text-white">Comments</h2>
            <span className="text-xs text-white/30">{postComments.length} shown</span>
          </div>
          <div className="space-y-4">
            {postComments.map((item) => (
              <div key={item.id} className="flex gap-3">
                <Avatar src={item.user.avatar} alt={item.user.displayName} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white">{item.user.displayName} <span className="font-normal text-white/30">@{item.user.username}</span></p>
                  <p className="text-sm text-white/65 mt-1 leading-5">{item.text}</p>
                  <p className="text-[10px] text-white/25 mt-1">{item.likes} likes</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-2xl -translate-x-1/2 border-t border-white/5 bg-surface-950/95 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Avatar src="https://picsum.photos/seed/me/100/100" size="sm" />
          <div className="flex-1 flex items-center gap-2 rounded-full bg-surface-800 border border-white/5 px-4 py-2">
            <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment..." className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-white/25" />
          </div>
          <button disabled={!comment.trim()} className="w-10 h-10 rounded-full bg-pop-500 disabled:opacity-30 flex items-center justify-center">
            <Send size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
