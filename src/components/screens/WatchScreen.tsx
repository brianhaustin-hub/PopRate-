'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Heart, MessageCircle, Share2, Bookmark, Star, Volume2, VolumeX, Swords, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { posts } from '@/data/mock';
import { getUnifiedVideos } from '@/data/content';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { formatNumber } from '@/lib/utils';
import { ratePost, toggleLike, toggleSave, usePostEngagement } from '@/data/postEngagement';
import { motion, AnimatePresence } from 'framer-motion';

function WatchVideoCard({
  post,
  index,
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
  comment,
  setComment,
}: any) {
  const engagement = usePostEngagement(post.id);

  return <section className="relative h-[100dvh] snap-start">
    <MediaFrame media={{ type: 'video', url: post.mediaUrl ?? post.image, thumbnail: post.thumbnail ?? post.image }}
      className="h-full w-full" videoClassName="h-full w-full object-cover" autoPlay={active} active={active} loop muted={muted} />
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35" />
    <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 pt-[max(16px,env(safe-area-inset-top))]">
      <button onClick={() => router.back()} className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-black/40 backdrop-blur-md"><ArrowLeft size={21}/></button>
      <div className="rounded-full border border-white/15 bg-black/35 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] backdrop-blur-md">PopRate Watch</div>
      <button onClick={() => setMuted((v:boolean) => !v)} className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-black/40 backdrop-blur-md">{muted ? <VolumeX size={18}/> : <Volume2 size={18}/>}</button>
    </header>
    <div className="absolute bottom-0 left-0 right-0 z-10 flex items-end gap-4 px-4 pb-[max(28px,env(safe-area-inset-bottom))]">
      <div className="min-w-0 flex-1 pb-1">
        <button onClick={() => router.push('/user/' + post.creator.username)} className="flex items-center gap-2">
          <img src={post.creator.avatar} alt="" className="h-9 w-9 rounded-full border border-white/30 object-cover"/><span className="text-sm font-black">@{post.creator.username}</span>
        </button>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/90">{post.caption}</p>
        <div className="mt-3 flex items-center gap-2"><span className="rounded-full bg-pop-500 px-2.5 py-1 text-[11px] font-black">★ {engagement.ratingAverage.toFixed(1)}</span><span className="text-[11px] text-white/60">{formatNumber(engagement.ratingCount)} ratings</span><span className="text-[11px] text-white/50">#{post.category}</span></div>
      </div>
      <div className="flex w-12 flex-col items-center gap-5 pb-1">
        <button onClick={() => toggleLike(post.id)} className="flex flex-col items-center gap-1 active:scale-90"><Heart size={26} fill={engagement.liked ? "currentColor" : "none"} className={engagement.liked ? "text-red-400" : ""}/><span className="text-[10px] font-bold">{formatNumber(engagement.likes)}</span></button>
        <button onClick={() => setCommentOpen(post.id)} className="flex flex-col items-center gap-1"><MessageCircle size={25}/><span className="text-[10px] font-bold">{formatNumber(post.comments)}</span></button>
        <button onClick={() => setRatingOpen(post.id)} className="flex flex-col items-center gap-1"><Star size={25} fill={engagement.rating ? "currentColor" : "none"} /><span className="text-[10px] font-bold">{engagement.rating ? engagement.rating + "/10" : "Rate"}</span></button>
        <button onClick={() => toggleSave(post.id)} className="flex flex-col items-center gap-1"><Bookmark size={24} fill={engagement.saved ? "currentColor" : "none"}/><span className="text-[10px] font-bold">{formatNumber(engagement.saves)}</span></button>
        <button onClick={async () => { const url = window.location.origin + '/post/' + post.id; try { if (navigator.share) await navigator.share({ title: 'PopRate', text: post.caption, url }); else await navigator.clipboard.writeText(url); onToast(navigator.share ? 'Shared' : 'Link copied'); } catch {} }} className="flex flex-col items-center gap-1"><Share2 size={23}/><span className="text-[10px] font-bold">{formatNumber(post.shares)}</span></button>
        <button onClick={() => router.push('/challenge/new')} className="grid h-11 w-11 place-items-center rounded-full bg-white text-black shadow-xl"><Swords size={20}/></button>
      </div>
      {ratingOpen === post.id && <div className="absolute inset-x-3 bottom-24 z-30 rounded-3xl border border-white/10 bg-surface-950/95 p-4 shadow-2xl backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between"><div><p className="text-sm font-black">Rate this Pop</p><p className="text-[11px] text-white/45">Tap a score from 1 to 10</p></div><button onClick={() => setRatingOpen(null)} className="text-xs font-bold text-white/50">Close</button></div>
        <div className="grid grid-cols-5 gap-2">{[1,2,3,4,5,6,7,8,9,10].map(score => <button key={score} onClick={() => { onRating(post.id, score); setRatingOpen(null); }} className="grid aspect-square place-items-center rounded-2xl bg-white/5 text-sm font-black hover:bg-pop-500 active:scale-95">{score}</button>)}</div>
      </div>}
      <AnimatePresence>{commentOpen === post.id && <motion.div initial={{ y:30, opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:30, opacity:0 }} className="absolute inset-x-3 bottom-24 z-30 rounded-3xl border border-white/10 bg-surface-950/95 p-4 shadow-2xl backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between"><p className="text-sm font-black">Comments</p><button onClick={() => setCommentOpen(null)} className="text-xs font-bold text-white/50">Close</button></div>
        <div className="flex gap-2"><input value={comment} onChange={(e) => setComment(e.target.value)} onKeyDown={e => {if(e.key==='Enter'&&comment.trim()){setComment('');setCommentOpen(null);onToast('Comment posted')}}} placeholder="Add a comment..." className="min-w-0 flex-1 rounded-2xl bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/30"/><button onClick={() => {if(!comment.trim())return;setComment('');setCommentOpen(null);onToast('Comment posted')}} className="grid h-12 w-12 place-items-center rounded-2xl bg-pop-500 text-black"><Send size={17}/></button></div>
      </motion.div>}</AnimatePresence>
      <AnimatePresence>{ratingMessage && <motion.div initial={{ y:12, opacity:0, scale:.96 }} animate={{ y:0, opacity:1, scale:1 }} exit={{ y:8, opacity:0 }} className="absolute left-1/2 bottom-8 z-40 -translate-x-1/2 rounded-full border border-white/10 bg-black/75 px-4 py-2.5 text-xs font-black backdrop-blur-xl">{ratingMessage}</motion.div>}</AnimatePresence>
    </div>
  </section>;
}

export function WatchScreen() {
  const router = useRouter();
  const unifiedVideos = useMemo(() => getUnifiedVideos(), []);
  const videos = useMemo(() => unifiedVideos.filter(content => content.media[0]?.type === 'video').map(content => posts.find(post => post.id === content.id)).filter(Boolean), [unifiedVideos]);
  const [activeIndex,setActiveIndex]=useState(0), [muted,setMuted]=useState(true), [ratingOpen,setRatingOpen]=useState<string|null>(null), [commentOpen,setCommentOpen]=useState<string|null>(null), [comment,setComment]=useState(''), [toast,setToast]=useState<string|null>(null), [ratingMessage,setRatingMessage]=useState<string|null>(null);
  const containerRef=useRef<HTMLDivElement>(null);

  useEffect(() => { if(!toast&&!ratingMessage)return; const t=window.setTimeout(()=>{setToast(null);setRatingMessage(null)},1800); return()=>window.clearTimeout(t); },[toast,ratingMessage]);
  useEffect(() => { const c=containerRef.current;if(!c)return;const onScroll=()=>setActiveIndex(Math.min(Math.max(Math.round(c.scrollTop/Math.max(c.clientHeight,1)),0),videos.length-1));c.addEventListener('scroll',onScroll,{passive:true});return()=>c.removeEventListener('scroll',onScroll)},[videos.length]);

  const onRating=(postId:string,score:number)=>{ratePost(postId,score);setRatingMessage(`Rated ${score}/10`);};
  if(!videos.length)return <div className="grid h-[100dvh] place-items-center bg-black px-6 text-center text-white"><div><p className="text-xl font-black">No videos yet</p><button onClick={()=>router.back()} className="mt-4 rounded-full bg-white px-5 py-2 text-sm font-bold text-black">Go back</button></div></div>;

  return <div className="relative h-[100dvh] overflow-hidden bg-black text-white">
    <div ref={containerRef} className="h-full snap-y snap-mandatory overflow-y-auto overscroll-y-contain">
      {videos.map((post,index)=><WatchVideoCard key={post.id} post={post} index={index} active={index===activeIndex} muted={muted} setMuted={setMuted} router={router} onToast={setToast} onRating={onRating} ratingMessage={ratingMessage} ratingOpen={ratingOpen} setRatingOpen={setRatingOpen} commentOpen={commentOpen} setCommentOpen={setCommentOpen} comment={comment} setComment={setComment}/>)}
    </div>
  </div>;
}
