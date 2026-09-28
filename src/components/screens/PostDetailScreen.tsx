'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { posts } from '@/data/mock';
import { getUnifiedContent } from '@/data/content';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { addChallengeMemoryComment, getChallengeMemoryById, shareChallengeMemory, subscribeChallengeMemories } from '@/data/challengeMemories';
import { ArrowLeft, Bookmark, Check, Heart, MessageCircle, MoreHorizontal, Send, Share2, Star, UserPlus, Trophy } from 'lucide-react';
import { ratePost, toggleLike, toggleSave, usePostEngagement } from '@/data/postEngagement';
import { useUnifiedEngagement } from '@/data/contentEngagement';
import { addPostComment, useContentComments } from '@/data/contentComments';

export function PostDetailScreen({ postId }: { postId: string }) {
  const router = useRouter();
  const [memory, setMemory] = useState(() => getChallengeMemoryById(postId));
  useEffect(() => subscribeChallengeMemories(() => setMemory(getChallengeMemoryById(postId))), [postId]);

  if (memory) return <ChallengeMemoryDetail memory={memory} onBack={() => router.back()} />;

  const unified = getUnifiedContent(postId);
  const post = useMemo(() => posts.find((item) => item.id === postId) ?? posts[0], [postId]);
  return <RegularPostDetail post={post} unified={unified} onBack={() => router.back()} />;
}

function ChallengeMemoryDetail({ memory, onBack }: { memory: NonNullable<ReturnType<typeof getChallengeMemoryById>>; onBack: () => void }) {
  const router = useRouter();
  const [comment, setComment] = useState('');
  const [shared, setShared] = useState(false);
  const engagement = useUnifiedEngagement('challenge_memory', memory.challengeId);
  const memoryComments = useContentComments(memory.challengeId, 'challenge_memory');
  const [commentsOpen, setCommentsOpen] = useState(false);

  const share = async () => {
    engagement.share();
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      if (navigator.share) await navigator.share({ title: memory.title, url });
      else if (navigator.clipboard && url) await navigator.clipboard.writeText(url);
    } catch {}
    setShared(true);
    window.setTimeout(() => setShared(false), 1600);
  };

  const postComment = () => {
    if (!comment.trim()) return;
    addChallengeMemoryComment(memory.challengeId, comment);
    setComment('');
    setCommentsOpen(true);
  };

  return <div className="h-full flex flex-col bg-surface-950">
    <header className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-surface-950/90 backdrop-blur-xl border-b border-white/5">
      <button onClick={onBack} className="w-9 h-9 rounded-full bg-surface-800 flex items-center justify-center"><ArrowLeft size={17}/></button>
      <div className="flex-1 min-w-0"><p className="text-[10px] uppercase tracking-[.18em] text-pop-400 font-black">Challenge memory</p><p className="text-sm font-black truncate">{memory.title}</p></div>
      <button onClick={share} className="w-9 h-9 rounded-full bg-surface-800 flex items-center justify-center">{shared ? <Check size={16} className="text-green-400"/> : <Share2 size={16}/>}</button>
      <button className="w-9 h-9 rounded-full bg-surface-800 flex items-center justify-center"><MoreHorizontal size={17}/></button>
    </header>

    <main className="flex-1 overflow-y-auto pb-28">
      <div className="grid grid-cols-2 gap-1 bg-black">
        {[memory.creatorMedia, memory.opponentMedia].map((media, i) => (
          <div key={i} className="relative aspect-[4/5] overflow-hidden">
            <MediaFrame media={media} className="h-full w-full" videoClassName="h-full w-full object-cover" controls={media.type === 'video'} />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-10">
              <p className="text-[10px] font-black uppercase tracking-[.12em] text-white/55">{i === 0 ? 'Side A' : 'Side B'}</p>
              <p className="mt-1 text-sm font-black">{i === 0 ? memory.creatorName : memory.opponentName}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="px-4 pt-5">
        <div className="flex items-center gap-3">
          <Avatar src={memory.creatorImage} alt={memory.creatorName} size="md"/>
          <div className="min-w-0 flex-1"><p className="text-sm font-black">{memory.creatorName}</p><p className="text-xs text-white/35">@{memory.creatorUsername} · vs @{memory.opponentUsername}</p></div>
          <span className="rounded-full bg-pop-500/10 px-3 py-1.5 text-[10px] font-black text-pop-300">{memory.category}</span>
        </div>
        <h1 className="mt-5 text-2xl font-black tracking-[-.035em]">{memory.title}</h1>
        <p className="mt-2 text-sm leading-6 text-white/50">Finished challenge memory · automatically expires after 25 hours.</p>

        <div className="mt-5 rounded-3xl bg-surface-900 border border-white/5 p-4">
          <div className="flex items-center gap-3"><Trophy size={18} className="text-pop-400"/><div><p className="text-[10px] uppercase tracking-[.16em] text-pop-400 font-black">Final result</p><p className="text-lg font-black mt-1">{memory.votesA.toLocaleString()} — {memory.votesB.toLocaleString()}</p></div></div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5"><div className="h-full bg-pop-500" style={{width: `${Math.round(memory.votesA / Math.max(memory.votesA + memory.votesB, 1) * 100)}%`}}/></div>
          <div className="mt-2 flex justify-between text-[10px] font-bold text-white/35"><span>Side A</span><span>Side B</span></div>
        </div>

        <div className="flex items-center justify-between mt-5 py-3 border-y border-white/5">
          <div className="flex items-center gap-5">
            <button onClick={engagement.toggleLike} className={`flex items-center gap-1.5 text-sm font-semibold ${engagement.liked ? 'text-pop-400' : 'text-white/65'}`}><Heart size={19} fill={engagement.liked ? 'currentColor' : 'none'}/> {engagement.likes}</button>
            <button onClick={() => setCommentsOpen(v => !v)} className="flex items-center gap-1.5 text-sm text-white/45"><MessageCircle size={19}/> {memoryComments.length}</button>
            <button onClick={share} className="flex items-center gap-1.5 text-sm text-white/45"><Send size={18}/> Share</button>
          </div>
          <button onClick={engagement.toggleSave}><Bookmark size={20} fill={engagement.saved ? 'currentColor' : 'none'}/></button>
        </div>

        {commentsOpen && <section className="mt-5 rounded-3xl bg-surface-900 border border-white/5 p-4">
          <h2 className="text-base font-black">Comments</h2>
          <div className="mt-4 space-y-3">{memoryComments.map(item => <p key={item.id} className="rounded-2xl bg-white/[.04] px-3 py-2.5 text-sm text-white/70">@{item.author.username} · {item.text}</p>)}</div>
        </section>}
      </section>
    </main>

    <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-2xl -translate-x-1/2 border-t border-white/5 bg-surface-950/95 px-4 py-3 backdrop-blur-xl">
      <div className="flex items-center gap-2"><Avatar src="https://picsum.photos/seed/me/100/100" size="sm"/><div className="flex-1 rounded-full bg-surface-800 border border-white/5 px-4 py-2"><input value={comment} onChange={e => setComment(e.target.value)} onKeyDown={e => e.key === 'Enter' && postComment()} placeholder="Add a comment..." className="w-full bg-transparent outline-none text-sm placeholder:text-white/25"/></div><button disabled={!comment.trim()} onClick={postComment} className="w-10 h-10 rounded-full bg-pop-500 disabled:opacity-30 flex items-center justify-center"><Send size={16}/></button></div>
    </div>
  </div>;
}

function RegularPostDetail({ post, unified, onBack }: { post: any; unified: ReturnType<typeof getUnifiedContent>; onBack: () => void }) {
  const router = useRouter();
  const engagement = usePostEngagement(post.id);
  const postComments = useContentComments(post.id, 'post');
  const content = unified ?? getUnifiedContent(post.id);
  const [rating, setRating] = useState<number | null>(engagement.rating ?? null);
  const [following, setFollowing] = useState(post.creator.isFollowing);
  const [comment, setComment] = useState('');
  const [shared, setShared] = useState(false);

  const share = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try { if (navigator.share) await navigator.share({ title: 'PopRate', text: post.caption, url }); else if (navigator.clipboard && url) await navigator.clipboard.writeText(url); } catch {}
    setShared(true); window.setTimeout(() => setShared(false), 1600);
  };

  return <div className="h-full flex flex-col bg-surface-950">
    <header className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-surface-950/90 backdrop-blur-xl border-b border-white/5">
      <button onClick={onBack} className="w-9 h-9 rounded-full bg-surface-800 flex items-center justify-center"><ArrowLeft size={17}/></button>
      <div className="flex-1 min-w-0"><p className="text-[10px] uppercase tracking-[.18em] text-white/30 font-bold">PopRate</p><p className="text-sm font-black truncate">{post.category}</p></div>
      <button onClick={share} className="w-9 h-9 rounded-full bg-surface-800 flex items-center justify-center">{shared ? <Check size={16} className="text-green-400"/> : <Share2 size={16}/>}</button>
      <button className="w-9 h-9 rounded-full bg-surface-800 flex items-center justify-center"><MoreHorizontal size={17}/></button>
    </header>
    <main className="flex-1 overflow-y-auto pb-32">
      <div className="relative bg-black"><MediaFrame media={{type: post.mediaType ?? 'image', url: post.mediaUrl ?? post.image, thumbnail: post.thumbnail}} alt={post.caption} controls={post.mediaType === 'video'} className="w-full max-h-[68vh]" videoClassName="max-h-[68vh]"/><div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/65 px-3 py-1.5 backdrop-blur"><Star size={14} className="text-pop-400 fill-pop-400"/><span className="text-sm font-black">{engagement.ratingAverage.toFixed(1)}</span><span className="text-[10px] text-white/45">{engagement.ratingCount.toLocaleString()} ratings</span></div></div>
      <section className="px-4 pt-4">
        <div className="flex items-center gap-3"><button onClick={() => router.push('/user/' + post.creator.username)}><Avatar src={post.creator.avatar} alt={post.creator.displayName} size="md"/></button><button onClick={() => router.push('/user/' + post.creator.username)} className="text-left flex-1 min-w-0"><p className="text-sm font-black truncate">{post.creator.displayName}</p><p className="text-xs text-white/35">@{post.creator.username}</p></button><button onClick={() => setFollowing(v => !v)} className="rounded-full border border-white/10 bg-surface-800 px-3 py-2 text-xs font-bold"><span className="flex items-center gap-1.5">{following ? <Check size={13}/> : <UserPlus size={13}/>} {following ? 'Following' : 'Follow'}</span></button></div>
        <p className="mt-4 text-sm leading-6 text-white/75">{post.caption}</p>
        <div className="flex flex-wrap gap-1.5 mt-3">{post.tags.map((tag:string) => <Badge key={tag} variant="default">#{tag}</Badge>)}</div>
        <div className="flex items-center justify-between mt-5 py-3 border-y border-white/5"><div className="flex items-center gap-5"><button onClick={() => toggleLike(post.id)} className="flex items-center gap-1.5 text-sm font-semibold"><Heart size={19} className={engagement.liked ? 'fill-pop-500 text-pop-500' : ''}/> {engagement.likes.toLocaleString()}</button><span className="flex items-center gap-1.5 text-sm text-white/45"><MessageCircle size={19}/> {post.comments}</span><button onClick={share} className="flex items-center gap-1.5 text-sm text-white/45"><Send size={18}/> Share</button></div><button onClick={() => toggleSave(post.id)}><Bookmark size={20} className={engagement.saved ? 'fill-white text-white' : ''}/></button></div>
      </section>
      <section className="mx-4 mt-5 rounded-3xl bg-surface-900 border border-white/5 p-4"><div className="flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-[.18em] text-pop-400 font-black">Your take</p><h2 className="text-base font-black mt-1">Rate this PopRate</h2></div>{rating && <span className="text-xl font-black text-pop-400">{rating}/10</span>}</div><div className="grid grid-cols-5 gap-2 mt-4">{[1,2,3,4,5,6,7,8,9,10].map(value => <button key={value} onClick={() => {setRating(value);ratePost(post.id,value)}} className={rating===value?'h-10 rounded-xl bg-pop-500 text-white font-black text-xs':'h-10 rounded-xl bg-surface-800 text-white/55 font-bold text-xs'}>{value}</button>)}</div></section>
      <section className="px-4 mt-6"><div className="flex items-center justify-between mb-3"><h2 className="text-base font-black">Comments</h2><span className="text-xs text-white/30">{postComments.length} shown</span></div><div className="space-y-4">{postComments.map(item => <div key={item.id} className="flex gap-3"><Avatar src={item.author.avatar} alt={item.author.displayName} size="sm"/><div className="flex-1"><p className="text-xs font-bold">{item.author.displayName} <span className="font-normal text-white/30">@{item.author.username}</span></p><p className="text-sm text-white/65 mt-1">{item.text}</p><p className="text-[10px] text-white/25 mt-1">{item.likes} likes</p></div></div>)}</div></section>
    </main>
    <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-2xl -translate-x-1/2 border-t border-white/5 bg-surface-950/95 px-4 py-3 backdrop-blur-xl"><div className="flex items-center gap-2"><Avatar src="https://picsum.photos/seed/me/100/100" size="sm"/><div className="flex-1 flex items-center rounded-full bg-surface-800 border border-white/5 px-4 py-2"><input value={comment} onChange={e=>setComment(e.target.value)} placeholder="Add a comment..." className="flex-1 bg-transparent outline-none text-sm placeholder:text-white/25"/></div><button disabled={!comment.trim()} onClick={() => { addPostComment(post.id, comment); setComment(''); }} className="w-10 h-10 rounded-full bg-pop-500 disabled:opacity-30 flex items-center justify-center"><Send size={16}/></button></div></div>
  </div>;
}
