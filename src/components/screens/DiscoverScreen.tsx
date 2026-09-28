'use client';

import { useEffect, useMemo, useState } from 'react';
import { posts, users, challenges, categories } from '@/data/mock';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { formatNumber } from '@/lib/utils';
import { Search, Flame, TrendingUp, Users, Palette, Trophy, Star, Play, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DiscoverTab } from '@/types';
import { getUnifiedFeed } from '@/data/content';
import { UnifiedContentCard } from '@/components/content/UnifiedContentCard';
import { subscribeSocialGraph, isFollowing } from '@/data/socialGraph';
import { subscribePublishedContent } from '@/data/contentCreation';
import { getSuggestedPeople, followSuggestedPerson } from '@/data/socialDiscovery';

export function DiscoverScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DiscoverTab>('trending');
  const [search, setSearch] = useState('');
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const onChange = () => setVersion(value => value + 1);
    const a = subscribeSocialGraph(onChange);
    const b = subscribePublishedContent(onChange);
    return () => { a(); b(); };
  }, []);

  const unifiedFeed = useMemo(() => getUnifiedFeed(), [version]);
  const suggestedPeople = useMemo(() => getSuggestedPeople(8), [version]);
  const discoveryGroups = useMemo(() => ({
    forYou: suggestedPeople.slice(0, 3),
    active: suggestedPeople.filter(item => item.reason === 'active_creator').slice(0, 3),
    new: suggestedPeople.filter(item => item.reason === 'new_to_you').slice(0, 3),
  }), [suggestedPeople]);

  const renderPerson = (item: ReturnType<typeof getSuggestedPeople>[number]) => {
    const { user, signals, mutualCount } = item;
    return (
      <div key={user.id} className="flex items-center gap-3 rounded-2xl border border-white/5 bg-surface-900 p-3">
        <button onClick={() => router.push('/user/' + user.username)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
          <Avatar src={user.avatar} size="lg" showBadge />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">{user.displayName}</p>
            <p className="text-xs text-white/40">@{user.username}</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {(signals.length ? signals : ['New to you']).map(signal => (
                <span key={signal} className="rounded-full bg-pop-500/10 px-2 py-0.5 text-[9px] font-bold text-pop-300">{signal}</span>
              ))}
              {mutualCount > 0 && <span className="rounded-full bg-white/[.05] px-2 py-0.5 text-[9px] font-bold text-white/35">{mutualCount} shared</span>}
            </div>
          </div>
        </button>
        <Button variant={isFollowing(user.id) ? 'secondary' : 'neon'} size="sm" onClick={() => followSuggestedPerson(user.id)}>
          {isFollowing(user.id) ? 'Following' : 'Follow'}
        </Button>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'trending':
        return <div className="space-y-4"><div className="flex items-center gap-2"><Flame size={20} className="text-orange-500" /><h2 className="text-xl font-bold text-white">Trending Now</h2></div>{unifiedFeed.slice(0, 5).map(content => <UnifiedContentCard key={content.id} content={content} />)}</div>;

      case 'rising':
        return <div className="space-y-4"><div className="flex items-center gap-2"><TrendingUp size={20} className="text-green-500" /><h2 className="text-xl font-bold text-white">Rising Stars</h2></div><div className="grid grid-cols-2 gap-3">{unifiedFeed.slice(0, 6).map(content => <UnifiedContentCard key={content.id} content={content} compact />)}</div></div>;

      case 'creators':
        return <div className="space-y-7">
          <section>
            <div className="mb-3 flex items-end justify-between"><div><div className="flex items-center gap-2"><Sparkles size={18} className="text-pop-400" /><h2 className="text-xl font-black text-white">Picked for you</h2></div><p className="mt-1 text-xs text-white/35">People connected to what you actually do on PopRate.</p></div></div>
            <div className="space-y-3">{discoveryGroups.forYou.map(renderPerson)}</div>
          </section>
          {discoveryGroups.active.length > 0 && <section><div className="mb-3 flex items-center gap-2"><Flame size={17} className="text-orange-400" /><h3 className="text-sm font-black text-white">Active creators</h3></div><div className="space-y-3">{discoveryGroups.active.map(renderPerson)}</div></section>}
          {discoveryGroups.new.length > 0 && <section><div className="mb-3 flex items-center gap-2"><Users size={17} className="text-white/50" /><h3 className="text-sm font-black text-white">New to you</h3></div><div className="space-y-3">{discoveryGroups.new.map(renderPerson)}</div></section>}
        </div>;

      case 'categories':
        return <div className="space-y-4"><div className="flex items-center gap-2"><Palette size={20} className="text-yellow-500" /><h2 className="text-xl font-bold text-white">Categories</h2></div><div className="grid grid-cols-2 gap-3">{categories.map(cat => <div key={cat.name} className="p-4 bg-surface-900 rounded-xl border border-white/5 text-center"><div className="w-12 h-12 rounded-xl bg-surface-800 flex items-center justify-center mx-auto mb-2"><span className="text-2xl">{cat.icon}</span></div><p className="font-semibold text-sm text-white">{cat.name}</p><p className="text-xs text-white/40">{formatNumber(cat.count)} posts</p></div>)}</div></div>;

      case 'challenges':
        return <div className="space-y-4"><div className="flex items-center gap-2"><Trophy size={20} className="text-yellow-500" /><h2 className="text-xl font-bold text-white">Challenges</h2></div><div className="space-y-3">{challenges.map(challenge => <button key={challenge.id} onClick={() => router.push('/challenges')} className="w-full text-left overflow-hidden rounded-xl bg-surface-900 border border-white/5"><div className="h-32 relative"><img src={challenge.image} alt="" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-surface-900 to-transparent" /><div className="absolute top-3 right-3"><Badge variant="warning">Active</Badge></div></div><div className="p-4"><div className="flex items-center gap-2 mb-1"><Star size={14} className="text-yellow-500 fill-yellow-500" /><p className="font-semibold text-sm text-white">{challenge.title}</p></div><p className="text-xs text-white/40 mb-3">{challenge.description.slice(0, 60)}...</p><div className="flex items-center justify-between"><p className="text-xs text-white/30">{formatNumber(challenge.participants)} participants</p><Button variant="secondary" size="sm">Join</Button></div></div></button>)}</div></div>;
    }
  };

  return <div className="h-full flex flex-col">
    <div className="sticky top-0 z-10 bg-surface-950/95 backdrop-blur-xl px-4 py-3">
      <div className="flex items-center gap-3 mb-3"><div className="flex-1 relative"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" /><input type="text" placeholder="Search people, posts, tags..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && search.trim()) router.push('/search?q=' + encodeURIComponent(search.trim())); }} className="w-full bg-surface-800 text-white pl-10 pr-4 py-2.5 rounded-full text-sm border border-white/5 focus:border-pop-500/50 focus:outline-none" /></div></div>
      <button onClick={() => router.push('/watch')} className="mb-3 flex w-full items-center justify-between rounded-2xl border border-pop-500/20 bg-gradient-to-r from-pop-500/15 to-transparent px-4 py-3 text-left"><span><span className="block text-[10px] font-black uppercase tracking-[0.18em] text-pop-300">New</span><span className="mt-0.5 block text-sm font-black text-white">PopRate Watch</span><span className="block text-[11px] text-white/45">Short videos. Instant ratings.</span></span><span className="grid h-10 w-10 place-items-center rounded-full bg-pop-500 text-white"><Play size={16} fill="currentColor" /></span></button>
      <div className="flex gap-1 overflow-x-auto pb-2">{(['trending', 'rising', 'creators', 'categories', 'challenges'] as DiscoverTab[]).map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={'px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap capitalize ' + (activeTab === tab ? 'bg-pop-500 text-white' : 'bg-surface-800 text-white/60')}>{tab}</button>)}</div>
    </div>
    <div className="flex-1 overflow-y-auto px-4 pb-24">{renderContent()}</div>
  </div>;
}
