'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Heart, MessageCircle, Share2, Bookmark, Star, Volume2, VolumeX, Swords } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getUnifiedVideos } from '@/data/content';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { formatNumber } from '@/lib/utils';
import { rateUnifiedContent, useUnifiedEngagement } from '@/data/contentEngagement';
import { useContentComments } from '@/data/contentComments';
import { CommentSheet } from '@/components/content/CommentSheet';
import { motion, AnimatePresence } from 'framer-motion';
import { recordBehavior } from '@/data/behaviorStore';
import { subscribePublishedContent } from '@/data/contentCreation';

type WatchContent = ReturnType<typeof getUnifiedVideos>[number];

type WatchVideoCardProps = {
  content: WatchContent;
  active: boolean;
  muted: boolean;
  setMuted: (muted: boolean) => void;
  router: ReturnType<typeof useRouter>;
  onToast: (message: string) => void;
  onRating: (id: string, score: number) => void;
  ratingMessage: string | null;
  ratingOpen: string | null;
  setRatingOpen: (id: string | null) => void;
  commentOpen: string | null;
  setCommentOpen: (id: string | null) => void;
};

function WatchVideoCard({
  content,
  active,
  muted,
  setMuted,
  router,
  onToast,
  onRating,
  ratingMessage,
  ratingOpen,
  setRatingOpen,
  commentOpen,
  setCommentOpen,
}: WatchVideoCardProps) {
  const engagement = useUnifiedEngagement(
    content.kind,
    content.kind === 'challenge_memory' ? (content.challengeId ?? content.id) : content.id,
  );
  const comments = useContentComments(
    content.kind === 'challenge_memory' ? (content.challengeId ?? content.id) : content.id,
    content.kind,
  );
  const media = content.media.find((item) => item.type === 'video') ?? content.media[0];
  const watchStartedAt = useRef<number | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!active) return;
    watchStartedAt.current = Date.now();
    completedRef.current = false;
    recordBehavior({ type: 'view_start', contentId: content.id, kind: content.kind, category: content.category, creatorUsername: content.creator.username, dedupeKey: `watch-start:${content.id}:${Math.floor(Date.now() / 60000)}` });
    return () => {
      const durationMs = watchStartedAt.current ? Date.now() - watchStartedAt.current : 0;
      if (durationMs > 900) recordBehavior({ type: 'watch', contentId: content.id, kind: content.kind, category: content.category, creatorUsername: content.creator.username, durationMs });
      watchStartedAt.current = null;
    };
  }, [active, content.id, content.kind, content.category, content.creator.username]);

  const handleProgress = (currentTime: number, duration: number) => {
    if (!duration || completedRef.current) return;
    if (currentTime / duration >= 0.9) {
      completedRef.current = true;
      recordBehavior({ type: 'view_complete', contentId: content.id, kind: content.kind, category: content.category, creatorUsername: content.creator.username, durationMs: watchStartedAt.current ? Date.now() - watchStartedAt.current : undefined, dedupeKey: `complete:${content.id}` });
    }
  };


  return (
    <section className="relative h-[100dvh] snap-start">
      <MediaFrame
        media={media}
        className="h-full w-full"
        videoClassName="h-full w-full object-cover"
        autoPlay={active && media.type === 'video'}
        active={active}
        loop
        muted={muted}
        onProgress={handleProgress}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35" />
      <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 pt-[max(16px,env(safe-area-inset-top))]">
        <button onClick={() => router.back()} className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-black/40 backdrop-blur-md"><ArrowLeft size={21}/></button>
        <div className="rounded-full border border-white/15 bg-black/35 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] backdrop-blur-md">PopRate Watch</div>
        <button onClick={() => setMuted(!muted)} className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-black/40 backdrop-blur-md">{muted ? <VolumeX size={18}/> : <Volume2 size={18}/>}</button>
      </header>

      <div className="absolute bottom-0 left-0 right-0 z-10 flex items-end gap-4 px-4 pb-[max(28px,env(safe-area-inset-bottom))]">
        <div className="min-w-0 flex-1 pb-1">
          <button onClick={() => { recordBehavior({ type: 'profile_open', contentId: content.id, kind: content.kind, category: content.category, creatorUsername: content.creator.username }); router.push('/user/' + content.creator.username); }} className="flex items-center gap-2">
            <img src={content.creator.avatar} alt="" className="h-9 w-9 rounded-full border border-white/30 object-cover"/>
            <span className="text-sm font-black">@{content.creator.username}</span>
          </button>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/90">{content.caption}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="rounded-full bg-pop-500 px-2.5 py-1 text-[11px] font-black">★ {engagement.ratingAverage || content.rating}</span>
            <span className="text-[11px] text-white/60">{formatNumber(engagement.ratingCount || content.ratingCount)} ratings</span>
            <span className="text-[11px] text-white/50">#{content.category}</span>
          </div>
        </div>

        <div className="flex w-12 flex-col items-center gap-5 pb-1">
          <button onClick={() => { const next = !engagement.liked; engagement.toggleLike(); recordBehavior({ type: next ? 'like' : 'unlike', contentId: content.id, kind: content.kind, category: content.category, creatorUsername: content.creator.username }); }} className="flex flex-col items-center gap-1 active:scale-90"><Heart size={26} fill={engagement.liked ? 'currentColor' : 'none'} className={engagement.liked ? 'text-red-400' : ''}/><span className="text-[10px] font-bold">{formatNumber(engagement.likes)}</span></button>
          <button onClick={() => setCommentOpen(content.id)} className="flex flex-col items-center gap-1"><MessageCircle size={25}/><span className="text-[10px] font-bold">{formatNumber(comments.length || content.comments)}</span></button>
          <button onClick={() => setRatingOpen(content.id)} className="flex flex-col items-center gap-1"><Star size={25} fill={engagement.rating ? 'currentColor' : 'none'} /><span className="text-[10px] font-bold">{engagement.rating ? engagement.rating + '/10' : 'Rate'}</span></button>
          <button onClick={() => { const next = !engagement.saved; engagement.toggleSave(); recordBehavior({ type: next ? 'save' : 'unsave', contentId: content.id, kind: content.kind, category: content.category, creatorUsername: content.creator.username }); }} className="flex flex-col items-center gap-1"><Bookmark size={24} fill={engagement.saved ? 'currentColor' : 'none'}/><span className="text-[10px] font-bold">{formatNumber(engagement.saves)}</span></button>
          <button onClick={async () => {
            const url = window.location.origin + '/post/' + content.id;
            try {
              if (navigator.share) await navigator.share({ title: 'PopRate', text: content.caption, url });
              else await navigator.clipboard.writeText(url);
              recordBehavior({ type: 'share', contentId: content.id, kind: content.kind, category: content.category, creatorUsername: content.creator.username });
              onToast('Shared');
            } catch {}
          }} className="flex flex-col items-center gap-1"><Share2 size={23}/><span className="text-[10px] font-bold">{formatNumber(content.kind === 'challenge_memory' ? engagement.shares : content.shares)}</span></button>
          <button onClick={() => { recordBehavior({ type: 'challenge_open', contentId: content.id, kind: content.kind, category: content.category, creatorUsername: content.creator.username }); router.push('/challenge/new'); }} className="grid h-11 w-11 place-items-center rounded-full bg-white text-black shadow-xl"><Swords size={20}/></button>
        </div>

        {ratingOpen === content.id && (
          <div className="absolute inset-x-3 bottom-24 z-30 rounded-3xl border border-white/10 bg-surface-950/95 p-4 shadow-2xl backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between"><div><p className="text-sm font-black">Rate this Pop</p><p className="text-[11px] text-white/45">Tap a score from 1 to 10</p></div><button onClick={() => setRatingOpen(null)} className="text-xs font-bold text-white/50">Close</button></div>
            <div className="grid grid-cols-5 gap-2">{[1,2,3,4,5,6,7,8,9,10].map(score => <button key={score} onClick={() => { onRating(content.id, score); setRatingOpen(null); }} className="grid aspect-square place-items-center rounded-2xl bg-white/5 text-sm font-black hover:bg-pop-500 active:scale-95">{score}</button>)}</div>
          </div>
        )}

        <CommentSheet
          contentId={content.kind === 'challenge_memory' ? (content.challengeId ?? content.id) : content.id}
          kind={content.kind}
          open={commentOpen === content.id}
          onClose={() => setCommentOpen(null)}
          onToast={onToast}
        />

        <AnimatePresence>{ratingMessage && <motion.div initial={{ y:12, opacity:0, scale:.96 }} animate={{ y:0, opacity:1, scale:1 }} exit={{ y:8, opacity:0 }} className="absolute left-1/2 bottom-8 z-40 -translate-x-1/2 rounded-full border border-white/10 bg-black/75 px-4 py-2.5 text-xs font-black backdrop-blur-xl">{ratingMessage}</motion.div>}</AnimatePresence>
      </div>
    </section>
  );
}

export function WatchScreen() {
  const router = useRouter();
  const [contentVersion, setContentVersion] = useState(0);
  const videos = useMemo(() => getUnifiedVideos().filter(content => content.media.some(media => media.type === 'video')), [contentVersion]);
  const [activeIndex,setActiveIndex]=useState(0);
  const [muted,setMuted]=useState(true);
  const [ratingOpen,setRatingOpen]=useState<string|null>(null);
  const [commentOpen,setCommentOpen]=useState<string|null>(null);
  const [toast,setToast]=useState<string|null>(null);
  const [ratingMessage,setRatingMessage]=useState<string|null>(null);
  const containerRef=useRef<HTMLDivElement>(null);

  useEffect(() => subscribePublishedContent(() => setContentVersion(value => value + 1)), []);

  useEffect(() => {
    if (!toast && !ratingMessage) return;
    const t=window.setTimeout(()=>{setToast(null);setRatingMessage(null)},1800);
    return()=>window.clearTimeout(t);
  },[toast,ratingMessage]);

  useEffect(() => {
    const c=containerRef.current;
    if(!c)return;
    const onScroll=()=>setActiveIndex(Math.min(Math.max(Math.round(c.scrollTop/Math.max(c.clientHeight,1)),0),Math.max(videos.length-1, 0)));
    c.addEventListener('scroll',onScroll,{passive:true});
    return()=>c.removeEventListener('scroll',onScroll);
  },[videos.length]);

  const onRating=(id:string,score:number)=>{
    const content=videos.find(item=>item.id===id);
    if(!content)return;
    const engagementId=content.kind === 'challenge_memory' ? (content.challengeId ?? content.id) : content.id;
    rateUnifiedContent(content.kind, engagementId, score);
    recordBehavior({ type: 'rate', contentId: content.id, kind: content.kind, category: content.category, creatorUsername: content.creator.username, score });
    setRatingMessage(`Rated ${score}/10`);
  };

  if(!videos.length)return <div className="grid h-[100dvh] place-items-center bg-black px-6 text-center text-white"><div><p className="text-xl font-black">No videos yet</p><button onClick={()=>router.back()} className="mt-4 rounded-full bg-white px-5 py-2 text-sm font-bold text-black">Go back</button></div></div>;

  return <div className="relative h-[100dvh] overflow-hidden bg-black text-white">
    <div ref={containerRef} className="h-full snap-y snap-mandatory overflow-y-auto overscroll-y-contain">
      {videos.map((content,index)=><WatchVideoCard key={content.id} content={content} active={index===activeIndex} muted={muted} setMuted={setMuted} router={router} onToast={setToast} onRating={onRating} ratingMessage={ratingMessage} ratingOpen={ratingOpen} setRatingOpen={setRatingOpen} commentOpen={commentOpen} setCommentOpen={setCommentOpen} comment={comment} setComment={setComment}/>)}
    </div>
  </div>;
}
