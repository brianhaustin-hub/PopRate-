'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { users, posts } from '@/data/mock';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowUpRight, Bookmark, Camera, Check, Edit3, Link as LinkIcon, MoreHorizontal, Settings, Share2, Star, Trophy, UserPlus } from 'lucide-react';
import { ProfileTab } from '@/types';
import { getChallengeMemories, subscribeChallengeMemories } from '@/data/challengeMemories';
import { getUnifiedProfileContent } from '@/data/content';
import { subscribePublishedContent } from '@/data/contentCreation';
import { isFollowing, subscribeSocialGraph, toggleFollow } from '@/data/socialGraph';
import { UnifiedContentCard } from '@/components/content/UnifiedContentCard';

const user = users[0];
const tabs: { id: ProfileTab; label: string; icon: typeof Star }[] = [
  { id: 'posts', icon: Star, label: 'Posts' },
  { id: 'ratings', icon: Star, label: 'Ratings' },
  { id: 'battles', icon: Trophy, label: 'Battles' },
  { id: 'saved', icon: Bookmark, label: 'Saved' },
];

export function ProfileScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');
  const [following, setFollowing] = useState(() => isFollowing(user.id));
  const [contentVersion, setContentVersion] = useState(0);
  const [copied, setCopied] = useState(false);
  const [challengeMemories, setChallengeMemories] = useState(getChallengeMemories());

  useEffect(() => {
    const a = subscribeChallengeMemories(() => setChallengeMemories(getChallengeMemories()));
    const b = subscribePublishedContent(() => setContentVersion(value => value + 1));
    const c = subscribeSocialGraph(() => setFollowing(isFollowing(user.id)));
    return () => { a(); b(); c(); };
  }, []);
  const unifiedFeed = useMemo(() => getUnifiedProfileContent(), [challengeMemories, contentVersion]);
  const profileContent = useMemo(() => unifiedFeed.filter(content => content.creator.username === user.username || posts.some(post => post.id === content.id && post.creator.username === user.username)), [unifiedFeed]);

  const copyProfile = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.clipboard && url) await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="h-full flex flex-col">
      <header className="sticky top-0 z-20 bg-surface-950/95 backdrop-blur-xl border-b border-white/5"><div className="flex items-center justify-between px-4 py-3"><div><p className="text-[10px] uppercase tracking-[0.18em] text-white/30 font-bold">Profile</p><h1 className="text-lg font-black text-white">@{user.username}</h1></div><div className="flex items-center gap-2"><button onClick={copyProfile} className="w-9 h-9 rounded-full bg-surface-800 border border-white/5 flex items-center justify-center">{copied ? <Check size={17} className="text-green-400" /> : <Share2 size={17} className="text-white/65" />}</button><button onClick={() => router.push('/settings')} className="w-9 h-9 rounded-full bg-surface-800 border border-white/5 flex items-center justify-center"><Settings size={17} className="text-white/65" /></button></div></div></header>

      <main className="flex-1 overflow-y-auto pb-28">
        <section className="px-4 pt-5"><div className="flex items-start gap-4"><div className="relative"><Avatar src={user.avatar} alt={user.displayName} size="xl" /><button aria-label="Change profile photo" className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-pop-500 border-2 border-surface-950 flex items-center justify-center shadow-pop"><Camera size={14} className="text-white" /></button></div><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h2 className="text-xl font-black text-white truncate">{user.displayName}</h2><Badge variant="accent">Creator</Badge></div><p className="text-sm text-white/45 mt-0.5">@{user.username}</p><p className="text-sm text-white/65 mt-2 leading-5 line-clamp-2">{user.bio}</p></div></div>
          <div className="flex gap-2 mt-5"><Button size="sm" className="flex-1" onClick={() => router.push('/profile/edit')}><Edit3 size={14} className="mr-1.5" /> Edit profile</Button><Button size="sm" variant={following ? 'secondary' : 'neon'} className="flex-1" onClick={() => setFollowing(toggleFollow(user.id))}>{following ? <Check size={14} className="mr-1.5" /> : <UserPlus size={14} className="mr-1.5" />}{following ? 'Following' : 'Follow'}</Button><button onClick={() => router.push('/settings')} className="w-10 rounded-full bg-surface-800 border border-white/10 flex items-center justify-center"><MoreHorizontal size={17} className="text-white/60" /></button></div>
          <div className="grid grid-cols-4 mt-6 py-4 border-y border-white/5">{[['Followers', user.followers.toLocaleString()],['Following', user.following.toLocaleString()],['Avg rating', String(user.averageRating)],['Ratings', user.ratingsCount.toLocaleString()]].map(([label,value]) => <div key={label} className="text-center"><p className="text-base font-black text-white">{value}</p><p className="text-[10px] text-white/35 mt-0.5">{label}</p></div>)}</div>
          <div className="flex items-center gap-2 mt-4 p-3 rounded-2xl bg-surface-900 border border-white/5"><div className="w-9 h-9 rounded-xl bg-pop-500/10 flex items-center justify-center"><Star size={17} className="text-pop-400" /></div><div className="flex-1"><p className="text-xs font-bold text-white">Your PopRate score</p><p className="text-[11px] text-white/35 mt-0.5">Based on ratings across your posts</p></div><p className="text-lg font-black text-pop-400">{user.averageRating}</p></div>
        </section>

        <section className="mt-5"><div className="sticky top-[61px] z-10 px-4 py-2 bg-surface-950/95 backdrop-blur-xl border-y border-white/5"><div className="grid grid-cols-4 gap-1">{tabs.map(tab => {const Icon=tab.icon;const active=activeTab===tab.id;return <button key={tab.id} onClick={()=>setActiveTab(tab.id)} className={active?'flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-pop-500 text-white text-[11px] font-bold':'flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-white/40 text-[11px] font-semibold'}><Icon size={14}/>{tab.label}</button>})}</div></div>

          <div className="px-4 pt-4">
            {activeTab === 'posts' && <div className="space-y-4">{profileContent.length ? profileContent.map(content => <UnifiedContentCard key={content.id} content={content} />) : <div className="py-16 text-center"><p className="text-sm font-bold text-white">No PopRates yet</p><p className="mt-1 text-xs text-white/35">Your posts and completed challenge memories will appear here.</p></div>}</div>}
            {activeTab === 'ratings' && <div className="space-y-2">{Array.from({length:5}).map((_,i)=><div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-surface-900 border border-white/5"><img src={'https://picsum.photos/seed/rating-'+i+'/120/120'} alt="" className="w-12 h-12 rounded-xl object-cover"/><div className="flex-1 min-w-0"><p className="text-sm font-bold text-white">Community pick #{i+1}</p><p className="text-xs text-white/35 mt-1">Rated recently · Style</p></div><div className="text-right"><p className="text-base font-black text-pop-400">{(7.5+i*0.4).toFixed(1)}</p><p className="text-[9px] uppercase text-white/25 font-bold">rating</p></div></div>)}</div>}
            {activeTab === 'battles' && <div className="space-y-2">{Array.from({length:4}).map((_,i)=><div key={i} className="p-3 rounded-2xl bg-surface-900 border border-white/5"><div className="flex items-center gap-3"><div className="flex -space-x-2"><img src={'https://picsum.photos/seed/battle-a-'+i+'/100/100'} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-surface-900"/><img src={'https://picsum.photos/seed/battle-b-'+i+'/100/100'} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-surface-900"/></div><div className="flex-1"><p className="text-sm font-bold text-white">Head-to-head #{i+1}</p><p className="text-xs text-white/35">You voted · 2 sides</p></div><Badge variant={i===0?'success':'default'}>{i===0?'Won':'Closed'}</Badge></div></div>)}</div>}
            {activeTab === 'saved' && <div className="py-16 text-center"><div className="w-16 h-16 mx-auto rounded-3xl bg-surface-900 border border-white/5 flex items-center justify-center"><LinkIcon size={24} className="text-white/20"/></div><h3 className="text-sm font-bold text-white mt-4">Your saved PopRates</h3><p className="text-xs text-white/35 mt-1 max-w-xs mx-auto">Posts and challenges you save will appear here.</p><Button variant="secondary" size="sm" className="mt-4" onClick={() => router.push('/discover')}>Discover PopRates <ArrowUpRight size={14} className="ml-1.5"/></Button></div>}
          </div>
        </section>
      </main>
    </div>
  );
}
