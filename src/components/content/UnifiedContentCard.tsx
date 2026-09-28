'use client';

import { useEffect, useRef, useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Star, Play, Clock3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { Avatar } from '@/components/ui/Avatar';
import { formatNumber } from '@/lib/utils';
import type { UnifiedContent } from '@/data/content';
import { useUnifiedEngagement } from '@/data/contentEngagement';
import { addActivity } from '@/data/activityStore';
import { recordBehavior } from '@/data/behaviorStore';

function expiryLabel(expiresAt?: string) {
  if (!expiresAt) return null;
  const remaining = new Date(expiresAt).getTime() - Date.now();
  if (remaining <= 0) return 'Expired';
  const hours = Math.floor(remaining / (60 * 60 * 1000));
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
  return hours + 'h ' + minutes + 'm left';
}

export function UnifiedContentCard({ content, compact = false }: { content: UnifiedContent; compact?: boolean }) {
  const router = useRouter();
  const engagement = useUnifiedEngagement(content.kind, content.kind === 'challenge_memory' ? (content.challengeId ?? content.id) : content.id);
  const [shared, setShared] = useState(false);
  const media = content.media[0] ?? { type: 'image' as const, url: content.image };
  const expiry = expiryLabel(content.expiresAt);
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        recordBehavior({ type: 'impression', contentId: content.id, kind: content.kind, category: content.category, creatorUsername: content.creator.username, dedupeKey: `impression:${content.kind}:${content.id}` });
      }
    }, { threshold: 0.45 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [content.id, content.kind, content.category, content.creator.username]);

  const share = async () => {
    engagement.share();
    recordBehavior({ type: 'share', contentId: content.id, kind: content.kind, category: content.category, creatorUsername: content.creator.username });
    addActivity({ type: 'trending', title: `You shared ${content.creator.name}'s PopRate`, message: content.caption.slice(0, 70), image: content.creator.avatar });
    setShared(true);
    if (typeof navigator !== 'undefined' && navigator.share) {
      await navigator.share({ title: content.title, text: content.caption, url: window.location.href }).catch(() => undefined);
    }
    window.setTimeout(() => setShared(false), 1400);
  };

  return (
    <article ref={cardRef} className={'overflow-hidden rounded-3xl border border-white/10 bg-surface-900/80 shadow-xl shadow-black/10 ' + (compact ? '' : 'mb-5')}>
      <button type="button" onClick={() => { recordBehavior({ type: 'watch', contentId: content.id, kind: content.kind, category: content.category, creatorUsername: content.creator.username, dedupeKey: `open:${content.kind}:${content.id}` }); router.push('/post/' + content.id); }} className="block w-full text-left">
        <div className={'relative overflow-hidden ' + (compact ? 'aspect-square' : 'aspect-[4/5]')}>
          <MediaFrame media={media} alt={content.title} className="h-full w-full" autoPlay={media.type === 'video'} loop muted />
          {media.type === 'video' && <span className="absolute left-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/55 text-white backdrop-blur"><Play size={14} fill="currentColor" /></span>}
          {content.kind === 'challenge_memory' && <span className="absolute right-3 top-3 rounded-full bg-pop-500/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-black">Challenge result</span>}
          {expiry && <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white/80 backdrop-blur"><Clock3 size={11} /> {expiry}</span>}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 pt-16">
            <div className="flex items-center gap-2"><Avatar src={content.creator.avatar} size="sm" /><span className="text-xs font-bold text-white">{content.creator.name}</span><span className="text-[10px] text-white/50">@{content.creator.username}</span></div>
          </div>
        </div>
      </button>

      <div className="p-4">
        <p className="text-sm leading-5 text-white">{content.caption}</p>
        <div className="mt-2 flex items-center gap-2 text-[11px] text-white/40"><span>{content.category}</span><span>•</span><span className="inline-flex items-center gap-1 text-pop-400"><Star size={11} fill="currentColor" /> {content.rating.toFixed(1)}</span><span>({formatNumber(content.ratingCount)})</span></div>

        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
          <button type="button" onClick={() => { const nextLiked = !engagement.liked; engagement.toggleLike(); if (nextLiked) { recordBehavior({ type: 'like', contentId: content.id, kind: content.kind, category: content.category, creatorUsername: content.creator.username }); addActivity({ type: 'like', title: `You liked ${content.creator.name}'s PopRate`, message: content.caption.slice(0, 70), image: content.creator.avatar }); } className={'inline-flex items-center gap-1.5 text-xs ' + (engagement.liked ? 'text-red-400' : 'text-white/50')}><Heart size={17} fill={engagement.liked ? 'currentColor' : 'none'} /> {formatNumber(engagement.likes)}</button>
          <button type="button" onClick={() => router.push('/post/' + content.id)} className="inline-flex items-center gap-1.5 text-xs text-white/50"><MessageCircle size={17} /> {formatNumber(content.comments)}</button>
          <button type="button" onClick={share} className={'inline-flex items-center gap-1.5 text-xs ' + (shared ? 'text-pop-400' : 'text-white/50')}><Share2 size={17} /> {shared ? 'Shared' : formatNumber(content.kind === 'challenge_memory' ? engagement.shares : content.shares)}</button>
          <button type="button" onClick={() => { const nextSaved = !engagement.saved; engagement.toggleSave(); recordBehavior({ type: nextSaved ? 'save' : 'unsave', contentId: content.id, kind: content.kind, category: content.category, creatorUsername: content.creator.username }); }} className={'inline-flex items-center gap-1.5 text-xs ' + (engagement.saved ? 'text-pop-400' : 'text-white/50')}><Bookmark size={17} fill={engagement.saved ? 'currentColor' : 'none'} /> {formatNumber(engagement.saves)}</button>
        </div>
      </div>
    </article>
  );
}
