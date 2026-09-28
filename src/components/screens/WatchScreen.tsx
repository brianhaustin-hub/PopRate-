'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Heart, MessageCircle, Share2, Bookmark, Star, Volume2, VolumeX, MoreHorizontal, Swords } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { posts } from '@/data/mock';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { formatNumber } from '@/lib/utils';

export function WatchScreen() {
  const router = useRouter();
  const videos = useMemo(() => posts.filter((post) => post.mediaType === 'video'), []);
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [rated, setRated] = useState<Record<string, number>>({});
  const [ratingOpen, setRatingOpen] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onScroll = () => {
      const next = Math.round(container.scrollTop / Math.max(container.clientHeight, 1));
      setActiveIndex(Math.min(Math.max(next, 0), videos.length - 1));
    };
    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, [videos.length]);

  if (!videos.length) {
    return (
      <div className="grid h-[100dvh] place-items-center bg-black px-6 text-center text-white">
        <div><p className="text-xl font-black">No videos yet</p><button onClick={() => router.back()} className="mt-4 rounded-full bg-white px-5 py-2 text-sm font-bold text-black">Go back</button></div>
      </div>
    );
  }

  return (
    <div className="relative h-[100dvh] overflow-hidden bg-black text-white">
      <div ref={containerRef} className="h-full snap-y snap-mandatory overflow-y-auto overscroll-y-contain">
        {videos.map((post, index) => (
          <section key={post.id} className="relative h-[100dvh] snap-start">
            <MediaFrame
              media={{ type: 'video', url: post.mediaUrl ?? post.image, thumbnail: post.thumbnail ?? post.image }}
              className="h-full w-full"
              videoClassName="h-full w-full object-cover"
              autoPlay={index === activeIndex}
              active={index === activeIndex}
              loop
              muted={muted}
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35" />

            <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 pt-[max(16px,env(safe-area-inset-top))]">
              <button onClick={() => router.back()} className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-black/40 backdrop-blur-md" aria-label="Back"><ArrowLeft size={21}/></button>
              <div className="rounded-full border border-white/15 bg-black/35 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] backdrop-blur-md">PopRate Watch</div>
              <button onClick={() => setMuted((value) => !value)} className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-black/40 backdrop-blur-md" aria-label={muted ? 'Unmute' : 'Mute'}>{muted ? <VolumeX size={18}/> : <Volume2 size={18}/>}</button>
            </header>

            <div className="absolute bottom-0 left-0 right-0 z-10 flex items-end gap-4 px-4 pb-[max(28px,env(safe-area-inset-bottom))]">
              <div className="min-w-0 flex-1 pb-1">
                <button onClick={() => router.push('/user/' + post.creator.username)} className="flex items-center gap-2">
                  <img src={post.creator.avatar} alt="" className="h-9 w-9 rounded-full border border-white/30 object-cover"/>
                  <span className="text-sm font-black">@{post.creator.username}</span>
                </button>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/90">{post.caption}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="rounded-full bg-pop-500 px-2.5 py-1 text-[11px] font-black">★ {post.rating}</span>
                  <span className="text-[11px] text-white/60">{formatNumber(post.ratingCount)} ratings</span>
                  <span className="text-[11px] text-white/50">#{post.category}</span>
                </div>
              </div>

              <div className="flex w-12 flex-col items-center gap-5 pb-1">
                <button className="flex flex-col items-center gap-1"><Heart size={26} fill="currentColor"/><span className="text-[10px] font-bold">{formatNumber(post.likes)}</span></button>
                <button className="flex flex-col items-center gap-1"><MessageCircle size={25}/><span className="text-[10px] font-bold">{formatNumber(post.comments)}</span></button>
                <button onClick={() => setRatingOpen(post.id)} className="flex flex-col items-center gap-1">
                  <Star size={25} fill={rated[post.id] ? "currentColor" : "none"} />
                  <span className="text-[10px] font-bold">{rated[post.id] ? rated[post.id] + "/10" : "Rate"}</span>
                </button>
                <button className="flex flex-col items-center gap-1"><Bookmark size={24}/><span className="text-[10px] font-bold">{formatNumber(post.saves)}</span></button>
                <button className="flex flex-col items-center gap-1"><Share2 size={23}/><span className="text-[10px] font-bold">{formatNumber(post.shares)}</span></button>
                <button onClick={() => router.push('/challenge/new')} className="grid h-11 w-11 place-items-center rounded-full bg-white text-black shadow-xl" aria-label="Create challenge"><Swords size={20}/></button>
              </div>

              {ratingOpen === post.id && (
                <div className="absolute inset-x-3 bottom-24 z-30 rounded-3xl border border-white/10 bg-surface-950/95 p-4 shadow-2xl backdrop-blur-xl">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-black text-white">Rate this Pop</p>
                      <p className="text-[11px] text-white/45">Tap a score from 1 to 10</p>
                    </div>
                    <button onClick={() => setRatingOpen(null)} className="text-xs font-bold text-white/50">Close</button>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {[1,2,3,4,5,6,7,8,9,10].map((score) => (
                      <button key={score} onClick={() => { setRated((prev) => ({ ...prev, [post.id]: score })); setRatingOpen(null); }} className="grid aspect-square place-items-center rounded-2xl bg-white/5 text-sm font-black text-white hover:bg-pop-500 active:scale-95">
                        {score}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
