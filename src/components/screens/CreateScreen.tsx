'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { challengeWorkflow } from '@/data/challengeWorkflow';
import { publishPost } from '@/data/contentCreation';
import {
  ArrowLeft, Check, ChevronRight, Copy, ImagePlus, Link2, Search, Send,
  ShieldCheck, Sparkles, Users, UserRound, Video, Camera, Hash, X
} from 'lucide-react';

type Mode = 'pop' | 'challenge' | null;
type ChallengeMode = 'direct' | 'open' | null;

const categories = ['Fashion','Photography','Music','Gaming','Sports','Lifestyle','Art','Food','Travel','Campus'];
const popMedia = {
  image: 'https://picsum.photos/seed/poprate-create/900/1100',
  video: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  thumbnail: 'https://picsum.photos/seed/poprate-video/900/1100',
};

export function CreateScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(null);

  if (!mode) {
    return (
      <div className="h-full overflow-y-auto bg-[#09090b] px-4 pb-28 pt-6 text-white">
        <header className="px-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-pop-300">Create</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Put something into the Pop.</h1>
          <p className="mt-2 max-w-md text-sm leading-6 text-white/45">Share a Pop with the community or start a two-sided Challenge.</p>
        </header>

        <div className="mt-7 space-y-3">
          <button onClick={() => setMode('pop')} className="group flex w-full items-center gap-4 rounded-[28px] border border-white/10 bg-white/[0.045] p-5 text-left transition active:scale-[.99]">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-pop-500 text-black"><Sparkles size={24}/></div>
            <div className="flex-1"><p className="text-lg font-black">Create a Pop</p><p className="mt-1 text-xs leading-5 text-white/40">Photo or video. Ask the community what they think.</p></div>
            <ChevronRight className="text-white/25 group-hover:text-white/60"/>
          </button>
          <button onClick={() => setMode('challenge')} className="group flex w-full items-center gap-4 rounded-[28px] border border-white/10 bg-white/[0.045] p-5 text-left transition active:scale-[.99]">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-black"><Users size={24}/></div>
            <div className="flex-1"><p className="text-lg font-black">Start a Challenge</p><p className="mt-1 text-xs leading-5 text-white/40">Put your side on the board and find an opponent.</p></div>
            <ChevronRight className="text-white/25 group-hover:text-white/60"/>
          </button>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-br from-pop-500/10 to-transparent p-5">
          <div className="flex items-start gap-3"><ShieldCheck size={18} className="mt-0.5 shrink-0 text-emerald-400"/><div><p className="text-sm font-black">Keep it social.</p><p className="mt-1 text-xs leading-5 text-white/40">Posts can be rated, liked, commented on, saved and shared. Challenges always have two sides.</p></div></div>
        </div>
      </div>
    );
  }

  if (mode === 'pop') return <PopComposer onBack={() => setMode(null)} onPublished={() => router.push('/')} />;

  return <ChallengeComposer onBack={() => setMode(null)} router={router} />;
}

function PopComposer({ onBack, onPublished }: { onBack: () => void; onPublished: () => void }) {
  const [mediaType, setMediaType] = useState<'image'|'video'>('image');
  const [media, setMedia] = useState(popMedia.image);
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('Fashion');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [published, setPublished] = useState(false);

  const addTag = () => {
    const value = tagInput.trim().replace(/^#/, '');
    if (!value || tags.includes(value) || tags.length >= 5) return;
    setTags([...tags, value]);
    setTagInput('');
  };

  const publish = () => {
    if (!caption.trim()) return;
    publishPost({ caption: caption.trim(), category, mediaType, mediaUrl: media, thumbnail: mediaType === 'video' ? popMedia.thumbnail : undefined, tags });
    setPublished(true);
  };

  if (published) {
    return <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,#301238,#09090b_55%)] px-6 text-center text-white">
      <div className="w-full max-w-sm">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-pop-500/15 text-pop-300"><Check size={36}/></div>
        <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-pop-300">Published</p>
        <h1 className="mt-2 text-3xl font-black">Your Pop is live.</h1>
        <p className="mt-3 text-sm leading-6 text-white/45">People can now rate it, react to it and start a conversation.</p>
        <button onClick={onPublished} className="mt-7 w-full rounded-2xl bg-white py-4 text-sm font-black text-black">See it in Home</button>
      </div>
    </div>;
  }

  return <div className="h-full overflow-y-auto bg-[#09090b] pb-28 text-white">
    <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-black/75 px-4 py-4 backdrop-blur-xl">
      <div className="flex items-center gap-3"><button onClick={onBack} className="rounded-full bg-white/5 p-2 text-white/70"><ArrowLeft size={18}/></button><div className="flex-1"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-pop-300">Create Pop</p><h1 className="text-lg font-black">Make something people want to rate.</h1></div></div>
    </header>
    <main className="space-y-5 px-4 pt-5">
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035]">
        <div className="relative aspect-[4/5] overflow-hidden bg-black">
          {mediaType === 'video' ? <video src={media} poster={popMedia.thumbnail} muted loop autoPlay playsInline className="h-full w-full object-cover"/> : <img src={media} alt="Pop preview" className="h-full w-full object-cover"/>}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-20"><p className="text-xs font-bold text-white/60">@you</p><p className="mt-1 line-clamp-2 text-sm font-bold">{caption || 'Your Pop will look like this.'}</p></div>
        </div>
        <div className="grid grid-cols-2 gap-2 p-3">
          <button onClick={() => {setMediaType('image');setMedia(popMedia.image)}} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-black ${mediaType==='image'?'bg-white text-black':'bg-white/5 text-white/60'}`}><ImagePlus size={15}/> Photo</button>
          <button onClick={() => {setMediaType('video');setMedia(popMedia.video)}} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-black ${mediaType==='video'?'bg-pop-500 text-black':'bg-white/5 text-white/60'}`}><Video size={15}/> Video</button>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-4">
        <label className="text-xs font-black uppercase tracking-[0.15em] text-white/35">Caption</label>
        <textarea value={caption} onChange={e=>setCaption(e.target.value)} maxLength={220} placeholder="What do you want people to rate or react to?" className="mt-3 h-24 w-full resize-none bg-transparent text-lg font-bold leading-7 outline-none placeholder:text-white/20"/>
        <div className="text-right text-[10px] text-white/25">{caption.length}/220</div>
      </section>

      <section><p className="mb-3 text-xs font-black uppercase tracking-[0.15em] text-white/35">Category</p><div className="flex gap-2 overflow-x-auto pb-1">{categories.map(item=><button key={item} onClick={()=>setCategory(item)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${category===item?'bg-white text-black':'bg-white/5 text-white/55'}`}>{item}</button>)}</div></section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-4">
        <div className="flex items-center gap-2"><Hash size={16} className="text-pop-300"/><p className="text-xs font-black uppercase tracking-[0.15em] text-white/35">Tags</p></div>
        <div className="mt-3 flex flex-wrap gap-2">{tags.map(tag=><button key={tag} onClick={()=>setTags(tags.filter(item=>item!==tag))} className="inline-flex items-center gap-1 rounded-full bg-pop-500/15 px-3 py-1.5 text-xs font-bold text-pop-300">#{tag}<X size={12}/></button>)}</div>
        <div className="mt-3 flex gap-2"><input value={tagInput} onChange={e=>setTagInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();addTag()}}} placeholder="Add a tag" className="min-w-0 flex-1 rounded-2xl bg-black/30 px-4 py-3 text-sm outline-none placeholder:text-white/25"/><button onClick={addTag} className="rounded-2xl bg-white/10 px-4 text-xs font-black">Add</button></div>
      </section>

      <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4"><ShieldCheck size={18} className="shrink-0 text-emerald-400"/><p className="text-xs leading-5 text-white/45">Your Pop will appear in the social feed and can be discovered through category and video surfaces.</p></div>
      <button disabled={!caption.trim()} onClick={publish} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-pop-500 py-4 text-sm font-black text-black disabled:opacity-25">Publish Pop <Send size={16}/></button>
    </main>
  </div>;
}

function ChallengeComposer({ onBack, router }: { onBack: () => void; router: ReturnType<typeof useRouter> }) {
  const [step,setStep]=useState(1); const [challengeMode,setChallengeMode]=useState<ChallengeMode>(null);
  const [title,setTitle]=useState(''); const [category,setCategory]=useState('Fashion');
  const [media,setMedia]=useState(popMedia.image); const [mediaType,setMediaType]=useState<'image'|'video'>('image');
  const [opponent,setOpponent]=useState(''); const [published,setPublished]=useState(false); const [copied,setCopied]=useState(false); const [createdId,setCreatedId]=useState('');

  const createChallenge = () => {
    const id = `ch_${Date.now().toString(36)}`;
    challengeWorkflow.unshift({
      id, title: title.trim(), category,
      creator: { name: 'You', username: 'you', image: 'https://picsum.photos/seed/you/200/200' },
      opponent: challengeMode === 'direct' ? { name: opponent, username: opponent, image: 'https://picsum.photos/seed/opponent/200/200' } : null,
      creatorSide: media, creatorMediaType: mediaType, creatorMediaUrl: mediaType === 'video' ? popMedia.video : undefined, creatorThumbnail: mediaType === 'video' ? popMedia.thumbnail : undefined,
      opponentSide: null, visibility: challengeMode === 'direct' ? 'direct' : 'open',
      status: challengeMode === 'direct' ? 'opponent_invited' : 'waiting_for_opponent',
      votesA: 0, votesB: 0, endsAt: new Date(Date.now() + 24*60*60*1000).toISOString()
    });
    setCreatedId(id); setPublished(true);
  };

  const canContinue=step===1?title.trim().length>=4:step===2?!!media:!!challengeMode&&(challengeMode==='open'||opponent.length>0);

  if(published)return <div className="flex h-full items-center justify-center overflow-y-auto bg-[radial-gradient(circle_at_top,#301238,#09090b_55%)] px-6 py-10"><div className="w-full max-w-sm text-center"><div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-pop-500/15 text-pop-300"><Check size={36}/></div><p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-pop-300">{challengeMode==='open'?'Challenge created':'Invitation sent'}</p><h1 className="mt-2 text-3xl font-black text-white">{challengeMode==='open'?'Your arena is ready.':'Opponent invited.'}</h1><p className="mt-3 text-sm leading-6 text-white/50">{challengeMode==='open'?'Share your link. The first person to join becomes your opponent.':'@'+opponent+' will add their side before the Challenge goes live.'}</p><div className="mt-7 space-y-3"><button onClick={()=>router.push('/challenge/'+createdId+'/status')} className="w-full rounded-2xl bg-white py-3.5 text-sm font-black text-black">Open Challenge Status</button>{challengeMode==='open'&&<button onClick={()=>{if(navigator.clipboard)navigator.clipboard.writeText(window.location.origin+'/challenge/'+createdId);setCopied(true);setTimeout(()=>setCopied(false),1400)}} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/5 py-3.5 text-sm font-bold text-white">{copied?<Check size={16}/>:<Copy size={16}/>} {copied?'Link copied':'Copy invite link'}</button>}<button onClick={()=>router.push('/')} className="w-full rounded-2xl bg-white/5 py-3.5 text-sm font-bold text-white">Back home</button></div></div></div>;

  return <div className="h-full overflow-y-auto bg-[#09090b] pb-28">
    <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-black/75 px-4 py-4 backdrop-blur-xl"><div className="flex items-center gap-3"><button onClick={()=>step===1?onBack():setStep(step-1)} className="rounded-full bg-white/5 p-2 text-white/70"><ArrowLeft size={18}/></button><div className="flex-1"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">Create Challenge</p><h1 className="text-lg font-black">{step===1?'Set the question':step===2?'Add your side':'Choose your opponent'}</h1></div><span className="text-xs font-bold text-white/30">{step}/3</span></div><div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-pop-500 to-neon-500" style={{width:(step*33.33)+'%'}}/></div></header>
    <main className="space-y-5 px-4 pt-5">
      {step===1&&<><section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5"><div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-pop-500/15 text-pop-300"><Sparkles size={21}/></div><label className="text-xs font-bold uppercase tracking-[0.15em] text-white/40">Your question</label><textarea value={title} onChange={e=>setTitle(e.target.value)} maxLength={80} placeholder="Who has the better style?" className="mt-3 h-28 w-full resize-none bg-transparent text-2xl font-black leading-tight text-white outline-none placeholder:text-white/20"/><div className="text-right text-[10px] text-white/25">{title.length}/80</div></section><section><p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-white/40">Category</p><div className="flex flex-wrap gap-2">{categories.map(cat=><button key={cat} onClick={()=>setCategory(cat)} className={`rounded-full px-4 py-2 text-xs font-bold ${category===cat?'bg-white text-black':'bg-white/5 text-white/55'}`}>{cat}</button>)}</div></section></>}
      {step===2&&<><section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035]"><div className="aspect-[4/5] overflow-hidden bg-black">{mediaType === 'video' ? <video src={popMedia.video} poster={media} muted loop autoPlay playsInline className="h-full w-full object-cover"/> : <img src={media} alt="Your challenge side" className="h-full w-full object-cover"/>}</div><div className="p-4"><p className="text-xs font-bold uppercase tracking-[0.15em] text-pop-300">Your side</p><p className="mt-1 text-lg font-black">This is what voters will compare.</p><div className="mt-3 grid grid-cols-2 gap-2"><button onClick={()=>{setMediaType('image');setMedia(popMedia.image)}} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold ${mediaType==='image'?'bg-white text-black':'bg-white/5 text-white/70'}`}><ImagePlus size={15}/> Photo</button><button onClick={()=>{setMediaType('video');setMedia(popMedia.thumbnail)}} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold ${mediaType==='video'?'bg-pop-500 text-black':'bg-white/5 text-white/70'}`}><Video size={15}/> Video</button></div></div></section><div className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4"><ShieldCheck size={18} className="shrink-0 text-emerald-400"/><p className="text-xs leading-5 text-white/45">Your opponent adds their own media. You never need to upload both sides yourself.</p></div></>}
      {step===3&&<><section className="space-y-3"><button onClick={()=>setChallengeMode('direct')} className={`flex w-full items-center gap-4 rounded-3xl border p-5 text-left ${challengeMode==='direct'?'border-pop-400/60 bg-pop-500/10':'border-white/10 bg-white/[0.035]'}`}><div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/5"><UserRound size={22}/></div><div className="flex-1"><p className="font-black">Challenge someone</p><p className="mt-1 text-xs leading-5 text-white/40">Pick a friend or creator you want to face.</p></div>{challengeMode==='direct'?<Check size={19}/>:<ChevronRight size={19} className="text-white/25"/>}</button><button onClick={()=>setChallengeMode('open')} className={`flex w-full items-center gap-4 rounded-3xl border p-5 text-left ${challengeMode==='open'?'border-neon-400/60 bg-neon-500/10':'border-white/10 bg-white/[0.035]'}`}><div className="grid h-12 w-12 items-center justify-center rounded-2xl bg-white/5"><Link2 size={22}/></div><div className="flex-1"><p className="font-black">Open Challenge</p><p className="mt-1 text-xs leading-5 text-white/40">Share a link. The first person who joins becomes your opponent.</p></div>{challengeMode==='open'?<Check size={19}/>:<ChevronRight size={19} className="text-white/25"/>}</button></section>{challengeMode==='direct'&&<section className="rounded-3xl border border-white/10 bg-white/[0.035] p-4"><label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-white/40"><Search size={14}/> Find opponent</label><input value={opponent} onChange={e=>setOpponent(e.target.value.replace('@',''))} placeholder="username" className="mt-3 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm font-bold outline-none"/></section>}{challengeMode==='open'&&<div className="rounded-3xl border border-neon-400/20 bg-neon-500/5 p-5"><div className="flex items-start gap-3"><Users size={18} className="mt-0.5 text-neon-300"/><div><p className="font-bold">No opponent? No problem.</p><p className="mt-1 text-xs leading-5 text-white/45">Your Challenge waits until someone joins.</p></div></div></div>}</>}
      <button disabled={!canContinue} onClick={()=>step<3?setStep(step+1):createChallenge()} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 text-sm font-black text-black disabled:opacity-25">{step<3?<>Continue <ChevronRight size={17}/></>:challengeMode==='open'?<>Create & Share <Send size={16}/></>:<>Send Challenge <Send size={16}/></>}</button>
    </main>
  </div>;
}
