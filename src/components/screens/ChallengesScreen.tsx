'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock3, Link2, Plus, Search, Swords, Users, X } from 'lucide-react';

const live=[
  {id:'1',title:'Which fit wins?',category:'Fashion',a:'https://picsum.photos/seed/live-a/800/1000',b:'https://picsum.photos/seed/live-b/800/1000',names:['Maya','Alex'],votes:1842,time:'18m'},
  {id:'2',title:'Best city sunset?',category:'Photography',a:'https://picsum.photos/seed/sunset-a/800/1000',b:'https://picsum.photos/seed/sunset-b/800/1000',names:['Nia','Chris'],votes:927,time:'42m'},
];
const waiting=[
  {id:'w1',title:'Who has the better sneakers?',category:'Fashion',image:'https://picsum.photos/seed/sneakers/800/1000',time:'2h ago'},
  {id:'w2',title:'Pick the better game setup',category:'Gaming',image:'https://picsum.photos/seed/setup/800/1000',time:'5h ago'},
];

export function ChallengesScreen(){
  const router=useRouter();
  const [picked,setPicked]=useState<Record<string,'a'|'b'>>({});
  const [copied,setCopied]=useState<string|null>(null);

  const copyInvite=(id:string)=>{
    setCopied(id);
    setTimeout(()=>setCopied(null),1400);
  };

  return <div className="h-full overflow-y-auto bg-[#09090b] pb-24">
    <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-black/70 px-4 py-4 backdrop-blur-xl">
      <div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-pop-300">The arena</p><h1 className="text-2xl font-black text-white">Challenges</h1></div><button onClick={()=>router.push('/create')} className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-black text-black"><Plus size={15}/> Create</button></div>
      <div className="mt-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-2.5"><Search size={16} className="text-white/30"/><input placeholder="Find a challenge" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25"/></div>
    </header>
    <main className="space-y-7 px-4 pt-5">
      <section><div className="mb-3 flex items-end justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">Live now</p><h2 className="text-lg font-black text-white">Pick a side</h2></div><span className="text-xs text-white/35">voting live</span></div>
        <div className="space-y-4">{live.map(item=><article key={item.id} className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035]"><div className="flex items-center justify-between px-4 py-3"><div><span className="rounded-full bg-pop-500/15 px-2.5 py-1 text-[10px] font-bold text-pop-300">{item.category}</span><p className="mt-2 text-lg font-black text-white">{item.title}</p></div><button onClick={()=>copyInvite(item.id)} className="rounded-full bg-white/5 p-2.5 text-white/55">{copied===item.id?'✓':<Link2 size={16}/>}</button></div><div className="grid grid-cols-2 gap-1 bg-black">{[['a',item.a,item.names[0]],['b',item.b,item.names[1]] as const].map(([side,image,name])=><button key={side} onClick={()=>{setPicked(v=>({...v,[item.id]:side})); router.push('/challenge/'+item.id+'/live')}} className={['relative aspect-[4/5] overflow-hidden',picked[item.id]===side?'ring-2 ring-inset ring-pop-400':''].join(' ')}><img src={image} alt="" className="h-full w-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"/><div className="absolute bottom-3 left-3"><p className="text-sm font-black text-white">{name}</p><p className="text-[10px] text-white/50">{picked[item.id]===side?'YOUR PICK':'Tap to vote'}</p></div></button>)}</div><div className="flex items-center justify-between px-4 py-3 text-xs text-white/40"><span className="flex items-center gap-1"><Users size={13}/>{item.votes.toLocaleString()} votes</span><span className="flex items-center gap-1"><Clock3 size={13}/> {item.time}</span></div></article>)}</div>
      </section>
      <section><div className="mb-3"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">Waiting for opponent</p><h2 className="text-lg font-black text-white">Open challenges</h2></div><div className="space-y-3">{waiting.map(item=><article key={item.id} className="flex gap-3 rounded-3xl border border-white/10 bg-white/[0.035] p-3"><img src={item.image} alt="" className="h-24 w-20 rounded-2xl object-cover"/><div className="min-w-0 flex-1 py-1"><div className="flex items-center gap-2"><span className="rounded-full bg-neon-500/10 px-2 py-1 text-[9px] font-bold text-neon-300">{item.category}</span><span className="text-[10px] text-white/25">{item.time}</span></div><h3 className="mt-2 font-black text-white">{item.title}</h3><p className="mt-1 text-xs leading-5 text-white/40">One side is ready. You can become the opponent.</p><button onClick={()=>router.push('/challenge/'+item.id)} className="mt-2 rounded-xl bg-white px-3 py-2 text-[11px] font-black text-black">Join challenge</button></div></article>)}</div></section>
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-pop-500/10 to-neon-500/5 p-5"><div className="flex gap-3"><Swords size={20} className="mt-0.5 text-pop-300"/><div><h3 className="font-black text-white">Got someone in mind?</h3><p className="mt-1 text-xs leading-5 text-white/45">Create your side, then challenge a friend or share an open invite. The second side always comes from another person.</p><button onClick={()=>router.push('/create')} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-black text-black"><Plus size={14}/> Start a challenge</button></div></div></section>
    </main>
  </div>;
}
