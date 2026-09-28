'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Check, Clock3, Copy, Link2, ShieldAlert, Swords, Trophy,
  UserPlus, X, Zap, Upload,
} from 'lucide-react';
import {
  advanceChallenge, challengeProgress, cancelChallenge, expireDueChallenges,
  getChallengeWorkflow, joinOpenChallenge, submitChallengeSide,
  subscribeChallengeWorkflow,
} from '@/data/challengeWorkflow';
import { currentUser } from '@/data/socialGraph';

type State = 'waiting'|'opponent_invited'|'opponent_joined'|'ready'|'live'|'closed'|'result'|'declined'|'cancelled'|'expired';

const states: { id: State; label: string; eyebrow: string; description: string }[] = [
  { id:'waiting', label:'Waiting for opponent', eyebrow:'OPEN ARENA', description:'Your side is locked. The challenge needs another person before voting can begin.' },
  { id:'opponent_invited', label:'Invite sent', eyebrow:'DIRECT INVITE', description:'Your opponent has been invited. They need to accept and submit their side.' },
  { id:'opponent_joined', label:'Opponent joined', eyebrow:'SECOND SIDE', description:'Someone accepted the challenge. Their side still needs to be submitted.' },
  { id:'ready', label:'Both sides ready', eyebrow:'READY TO GO', description:'Both sides are submitted. The arena can now open for community voting.' },
  { id:'live', label:'Voting is live', eyebrow:'LIVE ARENA', description:'The community is choosing between both sides right now.' },
  { id:'closed', label:'Voting closed', eyebrow:'VOTING CLOSED', description:'Voting has ended. The final split is being prepared.' },
  { id:'result', label:'Result', eyebrow:'FINAL RESULT', description:'The arena is complete and the final result is now public.' },
  { id:'declined', label:'Invite declined', eyebrow:'DECLINED', description:'The invited opponent declined this challenge.' },
  { id:'cancelled', label:'Challenge cancelled', eyebrow:'CANCELLED', description:'The creator cancelled this challenge before it went live.' },
  { id:'expired', label:'Challenge expired', eyebrow:'EXPIRED', description:'The challenge was not completed before its invite window ended.' },
];

function toState(status?: string, fallback: State = 'waiting'): State {
  if (status === 'waiting_for_opponent') return 'waiting';
  if (status === 'opponent_invited') return 'opponent_invited';
  if (status === 'opponent_joined') return 'opponent_joined';
  if (status === 'ready') return 'ready';
  if (status === 'live') return 'live';
  if (status === 'voting_closed') return 'closed';
  if (status === 'result') return 'result';
  if (status === 'declined') return 'declined';
  if (status === 'cancelled') return 'cancelled';
  if (status === 'expired') return 'expired';
  return fallback;
}

export function ChallengeStatusScreen({ initialState = 'waiting' }: { initialState?: State }) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const challengeId = params?.id || 'new';
  const [version, setVersion] = useState(0);
  const [copied, setCopied] = useState(false);
  const workflow = challengeId === 'new' ? null : getChallengeWorkflow(challengeId);

  useEffect(() => {
    if (!workflow) return;
    expireDueChallenges();
    const refresh = () => setVersion(value => value + 1);
    return subscribeChallengeWorkflow(refresh);
  }, [challengeId, workflow]);

  const state = useMemo(() => {
    void version;
    return toState(workflow?.status, initialState);
  }, [workflow?.status, initialState, version]);

  const current = states.find(item => item.id === state)!;
  const terminal = ['declined','cancelled','expired'].includes(state);
  const progressState = state === 'waiting' ? 'waiting_for_opponent' : state === 'closed' ? 'voting_closed' : state;
  const progress = challengeProgress(progressState as Parameters<typeof challengeProgress>[0]);

  const copyInvite = async () => {
    if (navigator.clipboard) await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const joinDemo = () => {
    if (!workflow) return;
    joinOpenChallenge(workflow.id, {
      name: currentUser.displayName,
      username: currentUser.username,
      image: currentUser.avatar,
    });
  };

  const submitSide = (side: 'creator'|'opponent') => {
    if (!workflow) return;
    submitChallengeSide(workflow.id, side, {
      mediaType: 'image',
      mediaUrl: `https://picsum.photos/seed/${workflow.id}-${side}/800/1000`,
    });
  };

  const advance = () => {
    if (!workflow) return;
    const updated = advanceChallenge(workflow.id);
    if (updated?.status === 'live') router.push('/challenge/' + workflow.id + '/live');
    if (updated?.status === 'result') router.push('/challenge/' + workflow.id + '/result');
  };

  const cancel = () => {
    if (workflow) cancelChallenge(workflow.id);
  };

  return (
    <div className="h-full overflow-y-auto bg-[#09090b] pb-10">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/[.06] bg-black/75 px-4 py-3 backdrop-blur-xl">
        <button onClick={() => router.back()} className="grid h-10 w-10 place-items-center rounded-full bg-white/[.06]" aria-label="Back"><ArrowLeft size={18}/></button>
        <div className="text-center"><p className="text-[10px] font-black uppercase tracking-[.18em] text-pop-400">Challenge status</p><p className="text-xs text-white/35">#{challengeId === 'new' ? 'PR-2048' : challengeId.toUpperCase()}</p></div>
        <button onClick={copyInvite} className="grid h-10 w-10 place-items-center rounded-full bg-white/[.06]" aria-label="Share">{copied ? <Check size={17}/> : <Copy size={17}/>}</button>
      </header>

      <main className="mx-auto max-w-xl px-4 py-6">
        <section className="rounded-[2rem] border border-white/10 bg-white/[.035] p-5">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-pop-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.14em] text-pop-300">{current.eyebrow}</span>
            {state === 'live' ? <Zap size={18} className="text-pop-300" fill="currentColor"/> : terminal ? <ShieldAlert size={18} className="text-white/35"/> : <Clock3 size={18} className="text-white/35"/>}
          </div>
          <h1 className="mt-5 text-3xl font-black tracking-[-.045em] text-white">{workflow?.title || current.label}</h1>
          {workflow && <p className="mt-2 text-xs font-bold text-white/30">{workflow.category} · {workflow.visibility === 'direct' ? 'Direct challenge' : 'Open challenge'}</p>}
          <p className="mt-3 text-sm leading-6 text-white/45">{current.description}</p>

          {!terminal && <div className="mt-6">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-[.12em] text-white/30"><span>Challenge lifecycle</span><span>{Math.max(progress + 1, 1)}/6</span></div>
            <div className="mt-2 grid grid-cols-6 gap-1">{['waiting','opponent_joined','ready','live','closed','result'].map((id,i)=><div key={id} className={`h-1.5 rounded-full ${i <= progress ? 'bg-pop-500' : 'bg-white/10'}`}/>)}</div>
          </div>}

          <div className="mt-6 grid grid-cols-2 gap-2">
            <Side label="Your side" image={workflow?.creatorSide || 'https://picsum.photos/seed/status-a/700/850'} ready={Boolean(workflow?.creatorSide)}/>
            <Side label={workflow?.opponent?.name || 'Opponent'} image={workflow?.opponentSide || 'https://picsum.photos/seed/status-b/700/850'} ready={Boolean(workflow?.opponentSide)}/>
          </div>
        </section>

        {!terminal && state === 'waiting' && <div className="mt-4 rounded-2xl border border-neon-400/20 bg-neon-500/5 p-4">
          <div className="flex gap-3"><Link2 size={18} className="mt-0.5 text-neon-300"/><div><p className="text-sm font-bold text-white">Your arena is waiting</p><p className="mt-1 text-xs leading-5 text-white/45">Share the challenge or let it appear in Open Challenges. Voting stays locked until a second side exists.</p></div></div>
          <div className="mt-4 grid grid-cols-2 gap-2"><button onClick={copyInvite} className="flex items-center justify-center gap-2 rounded-xl bg-white py-3 text-xs font-black text-black"><Copy size={15}/> {copied ? 'Copied' : 'Copy link'}</button><button onClick={joinDemo} className="flex items-center justify-center gap-2 rounded-xl bg-pop-500 py-3 text-xs font-black text-white"><UserPlus size={15}/> Join demo</button></div>
        </div>}

        {!terminal && state === 'opponent_joined' && <div className="mt-4 rounded-2xl border border-white/10 bg-white/[.035] p-4">
          <div className="flex gap-3"><Upload size={18} className="text-pop-300"/><div><p className="text-sm font-bold text-white">Opponent joined</p><p className="mt-1 text-xs leading-5 text-white/45">The second person is in. Their side must be submitted before the arena can launch.</p></div></div>
          <button onClick={() => submitSide('opponent')} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-xs font-black text-black"><Upload size={15}/> Submit opponent side</button>
        </div>}

        {!terminal && state === 'waiting' && <button onClick={() => submitSide('creator')} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white/[.06] py-3 text-xs font-black text-white/75"><Upload size={15}/> Replace your side</button>}

        {state === 'opponent_invited' && <Notice icon={<UserPlus size={18}/>} title="Invite sent" text="Your opponent has been invited. They can accept or decline from their challenge notification."/>}
        {state === 'ready' && <Notice icon={<Check size={18}/>} title="Both sides are locked" text="Everything required for voting is present. The arena can now go live."/>}
        {state === 'live' && <Notice icon={<Zap size={18}/>} title="Community voting is live" text="Votes are being counted in real time. The media is now immutable."/>}
        {state === 'closed' && <Notice icon={<Trophy size={18}/>} title="Voting has ended" text="No more votes can be submitted. The final result is ready to publish."/>}
        {state === 'result' && <Notice icon={<Trophy size={18}/>} title="Arena complete" text="The final result is public. This challenge is now immutable."/>}
        {terminal && <Notice icon={<ShieldAlert size={18}/>} title={current.label} text={current.description}/>}

        {!terminal && !['result','live'].includes(state) && <button onClick={cancel} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 py-3 text-xs font-bold text-white/45"><X size={14}/> Cancel challenge</button>}

        {!terminal && !['waiting','opponent_joined','opponent_invited','result'].includes(state) && <button onClick={advance} className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-pop-500 text-sm font-black text-white shadow-pop">
          {state === 'ready' ? <><Zap size={16}/> Launch arena</> : state === 'live' ? <><Trophy size={16}/> Close voting</> : <><Trophy size={16}/> Publish result</>}
        </button>}

        {state === 'live' && <button onClick={advance} className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-pop-500 text-sm font-black text-white shadow-pop"><Trophy size={16}/> Close voting</button>}

        <button onClick={() => router.push(state === 'result' ? '/challenge/'+challengeId+'/result' : state === 'live' ? '/challenge/'+challengeId+'/live' : '/challenges')} className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white/[.06] text-sm font-bold text-white/70">{state === 'result' ? <><Trophy size={16}/> View final result</> : <><Swords size={16}/> Back to arena</>}</button>
      </main>
    </div>
  );
}

function Side({ label, image, ready }: { label:string; image:string; ready:boolean }) {
  return <div className="relative overflow-hidden rounded-2xl bg-black"><img src={image} alt="" className="aspect-[4/5] w-full object-cover"/><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 pt-12"><p className="text-xs font-black text-white">{label}</p><p className={`mt-1 text-[9px] font-bold uppercase tracking-[.12em] ${ready ? 'text-emerald-300' : 'text-white/35'}`}>{ready ? 'Side submitted' : 'Waiting'}</p></div></div>;
}

function Notice({ icon, title, text }: { icon:React.ReactNode; title:string; text:string }) {
  return <div className="mt-4 flex gap-3 rounded-2xl border border-emerald-400/15 bg-emerald-400/5 p-4"><div className="mt-0.5 text-emerald-300">{icon}</div><div><p className="text-sm font-bold text-white">{title}</p><p className="mt-1 text-xs leading-5 text-white/45">{text}</p></div></div>;
}
