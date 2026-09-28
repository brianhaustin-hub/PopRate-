'use client';

import { useEffect, useMemo, useState } from 'react';
import { Bell, ChevronRight, Flame, Plus, Search, Share2, Sparkles, Swords, Trophy, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getChallengeMemories, subscribeChallengeMemories } from '@/data/challengeMemories';
import { getUnifiedFeed } from '@/data/content';
import { getFollowedUsernames, subscribeSocialGraph, useSocialGraphVersion } from '@/data/socialGraph';
import { subscribePublishedContent } from '@/data/contentCreation';
import { UnifiedContentCard } from '@/components/content/UnifiedContentCard';
import { FeedTab } from '@/types';

const challengeSamples = [
  { id:'ch-01', title:'Which fit wins?', category:'Fashion', left:{name:'Maya',handle:'@maya',image:'https://picsum.photos/seed/maya/700/900'}, right:{name:'Alex',handle:'@alex',image:'https://picsum.photos/seed/alex/700/900'}, votes:1842, ends:'18m' },
  { id:'ch-02', title:'Pick the better shot', category:'Photography', left:{name:'Chris',handle:'@chris',image:'https://picsum.photos/seed/chris/700/900'}, right:{name:'Nia',handle:'@nia',image:'https://picsum.photos/seed/nia/700/900'}, votes:927, ends:'42m' },
];

export function HomeScreen() {
  const router=useRouter();
  const [activeTab,setActiveTab]=useState<FeedTab>('forYou');
  const [voted,setVoted]=useState<Record<string,'left'|'right'>>({});
  const [challengeMemories,setChallengeMemories]=useState(getChallengeMemories());
  const [contentVersion,setContentVersion]=useState(0);
  useSocialGraphVersion();

  useEffect(() => {
    const unsubMemory = subscribeChallengeMemories(() => setChallengeMemories(getChallengeMemories()));
    const unsubContent = subscribePublishedContent(() => setContentVersion(value => value + 1));
    const unsubGraph = subscribeSocialGraph(() => setContentVersion(value => value + 1));
    return () => { unsubMemory(); unsubContent(); unsubGraph(); };
  }, []);

  const unifiedFeed = useMemo(() => getUnifiedFeed(), [challengeMemories, contentVersion]);
  const followingUsernames = useMemo(() => getFollowedUsernames(), [contentVersion]);

  const feedItems = useMemo(() => {
    if (activeTab === 'following') {
      return unifiedFeed.filter(content => followingUsernames.has(content.creator.username));
    }
    return unifiedFeed;
  }, [activeTab, unifiedFeed, followingUsernames]);

  return <div className="h-full overflow-y-auto bg-[radial-gradient(circle_at_top,#21102b_0,#09090b_38%)] pb-24">
    <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-black/60 px-4 pb-3 pt-4 backdrop-blur-2xl">
      <div className="flex items-center justify-between">
        <div><div className="flex items-center gap-2"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pop-500 to-neon-500 shadow-lg shadow-pop-500/20"><Swords size={18} className="text-white"/></div><h1 className="text-xl font-black tracking-tight text-white">PopRate</h1></div><p className="mt-1 pl-11 text-[11px] text-white/40">Pick a side. Make your call.</p></div>
        <div className="flex items-center gap-2"><button onClick={()=>router.push('/search')} className="rounded-full bg-white/5 p-2.5 text-white/70"><Search size={18}/></button><button onClick={()=>router.push('/activity')} className="relative rounded-full bg-white/5 p-2.5 text-white/70"><Bell size={18}/><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-pop-500"/></button></div>
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto">
        {(['forYou','following','battles','challenges'] as FeedTab[]).map(tab=><button key={tab} onClick={()=>setActiveTab(tab)} className={['whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold',activeTab===tab?'bg-white text-black':'bg-white/5 text-white/55'].join(' ')}>{tab==='forYou'?'For You':tab==='following'?'Following':tab==='battles'?'Head-to-Head':'Challenges'}</button>)}
      </div>
    </header>

    <main className="space-y-6 px-4 pt-5">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-pop-500/20 via-neon-500/10 to-transparent p-5">
        <div className="relative"><div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-pop-300"><Flame size={14}/> Today's arena</div><h2 className="max-w-[280px] text-2xl font-black leading-tight text-white">Two sides. One question. The crowd decides.</h2><p className="mt-2 max-w-[300px] text-sm leading-5 text-white/55">Vote on live challenges or create one and invite someone to face you.</p><button onClick={()=>router.push('/create')} className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-black"><Plus size={17}/> Create a Challenge</button></div>
      </section>

      {activeTab !== 'following' && <section><div className="mb-3 flex items-center justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/35">Live now</p><h2 className="text-lg font-black text-white">Make your call</h2></div><button onClick={()=>router.push('/challenges')} className="flex items-center gap-1 text-xs font-bold text-pop-400">See all <ChevronRight size={14}/></button></div>
        <div className="space-y-4">{challengeSamples.map(challenge=><article key={challenge.id} className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035]">
          <div className="flex items-center justify-between px-4 py-3"><div className="flex items-center gap-2"><span className="rounded-full bg-pop-500/15 px-2.5 py-1 text-[10px] font-bold text-pop-300">{challenge.category}</span><span className="text-[10px] text-white/35">ends in {challenge.ends}</span></div><button className="text-white/35"><Share2 size={16}/></button></div>
          <h3 className="px-4 pb-3 text-lg font-black text-white">{challenge.title}</h3>
          <div className="grid grid-cols-2 gap-1 bg-black">{[challenge.left,challenge.right].map((side,index)=>{const choice=index===0?'left':'right';const isVoted=voted[challenge.id]===choice;return <button key={side.handle} onClick={()=>setVoted(v=>({...v,[challenge.id]:choice}))} className={['group relative aspect-[4/5] overflow-hidden text-left',isVoted?'ring-2 ring-inset ring-pop-400':''].join(' ')}><img src={side.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"/><div className="absolute bottom-3 left-3"><p className="text-sm font-black text-white">{side.name}</p><p className="text-[11px] text-white/55">{side.handle}</p></div>{isVoted&&<span className="absolute right-3 top-3 rounded-full bg-white px-2 py-1 text-[10px] font-black text-black">YOUR PICK</span>}</button>})}</div>
          <div className="flex items-center justify-between px-4 py-3"><div className="flex items-center gap-2 text-xs text-white/40"><Users size={14}/> {challenge.votes.toLocaleString()} votes</div>{voted[challenge.id]&&<span className="text-xs font-bold text-pop-300">Vote locked in ✓</span>}</div>
        </article>)}</div></section>}

      {activeTab === 'battles' || activeTab === 'challenges' ? (
        <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
          <div className="flex items-center gap-2 text-pop-300"><Sparkles size={16}/><span className="text-[11px] font-black uppercase tracking-[0.18em]">Arena mode</span></div>
          <h2 className="mt-2 text-xl font-black text-white">{activeTab === 'battles' ? 'Head-to-head content' : 'Open challenges'}</h2>
          <p className="mt-2 text-sm leading-5 text-white/50">Jump into the dedicated challenge arena to discover two-sided matchups, join open challenges, and see completed results.</p>
          <button onClick={()=>router.push('/challenges')} className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-xs font-black text-black">Explore the arena <ChevronRight size={14}/></button>
        </section>
      ) : (
        <section>
          <div className="mb-3 flex items-center justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/35">{activeTab === 'following' ? 'Following' : 'Your feed'}</p><h2 className="text-lg font-black text-white">{activeTab === 'following' ? 'From people you follow' : 'More from PopRate'}</h2></div><Trophy size={18} className="text-neon-400"/></div>
          {feedItems.length ? (
            <div className="space-y-5">{feedItems.slice(0, 5).map(content => <UnifiedContentCard key={content.id} content={content} />)}</div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.025] p-8 text-center"><p className="text-sm font-bold text-white">Your following feed is quiet.</p><p className="mt-1 text-xs text-white/40">Discover creators and follow people to fill this space.</p><button onClick={()=>router.push('/discover')} className="mt-4 rounded-2xl bg-white px-4 py-2.5 text-xs font-black text-black">Discover creators</button></div>
          )}
        </section>
      )}
    </main>
  </div>;
}
