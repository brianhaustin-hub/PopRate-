'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { getChallengeWorkflow, challengeProgress, advanceChallenge, setChallengeStatus } from '@/data/challengeWorkflow';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Clock3, Copy, Link2, ShieldAlert, Swords, Trophy, UserPlus, X, Zap } from 'lucide-react';

type State = 'waiting' | 'opponent_joined' | 'ready' | 'live' | 'closed' | 'result' | 'declined' | 'cancelled' | 'expired';

const states: { id: State; label: string; eyebrow: string; description: string }[] = [
  { id: 'waiting', label: 'Waiting for opponent', eyebrow: 'OPEN ARENA', description: 'Your side is locked. The challenge needs another person before voting can begin.' },
  { id: 'opponent_joined', label: 'Opponent joined', eyebrow: 'SECOND SIDE', description: 'Someone accepted the challenge. Their side still needs to be submitted.' },
  { id: 'ready', label: 'Both sides ready', eyebrow: 'READY TO GO', description: 'Both sides are submitted. The arena can now open for community voting.' },
  { id: 'live', label: 'Voting is live', eyebrow: 'LIVE ARENA', description: 'The community is choosing between both sides right now.' },
  { id: 'closed', label: 'Voting closed', eyebrow: 'VOTING CLOSED', description: 'Voting has ended. The final split is being prepared.' },
  { id: 'result', label: 'Result', eyebrow: 'FINAL RESULT', description: 'The arena is complete and the final result is now public.' },
  { id: 'declined', label: 'Invite declined', eyebrow: 'DECLINED', description: 'The invited opponent declined this challenge.' },
  { id: 'cancelled', label: 'Challenge cancelled', eyebrow: 'CANCELLED', description: 'The creator cancelled this challenge before it went live.' },
  { id: 'expired', label: 'Challenge expired', eyebrow: 'EXPIRED', description: 'The challenge was not completed before its invite window ended.' },
];

export function ChallengeStatusScreen({ initialState = 'waiting' }: { initialState?: State }) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const challengeId = params?.id || 'new';
  const workflow = challengeId === 'new' ? null : getChallengeWorkflow(challengeId);
  const [state, setState] = useState<State>(() => { const status = workflow?.status; if (status === 'waiting_for_opponent' || status === 'opponent_invited') return 'waiting'; if (status === 'opponent_joined') return 'opponent_joined'; if (status === 'ready') return 'ready'; if (status === 'live') return 'live'; if (status === 'voting_closed') return 'closed'; if (status === 'result') return 'result'; return initialState; });
  const [copied, setCopied] = useState(false);
  const current = useMemo(() => states.find(item => item.id === state)!, [state]);
  const terminal = ['declined', 'cancelled', 'expired'].includes(state);
  const progress = challengeProgress(state === 'waiting' ? 'waiting_for_opponent' : state === 'closed' ? 'voting_closed' : state);

  const syncState = (nextState: State) => {
    if (workflow) {
      const mapped = nextState === 'waiting' ? 'waiting_for_opponent' : nextState === 'closed' ? 'voting_closed' : nextState;
      setChallengeStatus(challengeId, mapped as import('@/types').ChallengeStatus);
    }
    setState(nextState);
  };

  const advance = () => {
    if (!workflow) return;
    const updated = advanceChallenge(challengeId);
    if (updated) {
      const mapped: State = updated.status === 'waiting_for_opponent' ? 'waiting' : updated.status === 'voting_closed' ? 'closed' : updated.status as State;
      setState(mapped);
    }
  };

  const copyInvite = async () => {
    if (navigator.clipboard) await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="h-full overflow-y-auto bg-[#09090b] pb-10">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/[.06] bg-black/75 px-4 py-3 backdrop-blur-xl">
        <button onClick={() => router.back()} className="grid h-10 w-10 place-items-center rounded-full bg-white/[.06]" aria-label="Back"><ArrowLeft size={18}/></button>
        <div className="text-center"><p className="text-[10px] font-black uppercase tracking-[.18em] text-pop-400">Challenge status</p><p className="text-xs text-white/35">#{challengeId === 'new' ? 'PR-2048' : challengeId.toUpperCase()}</p></div>
        <button onClick={copyInvite} className="grid h-10 w-10 place-items-center rounded-full bg-white/[.06]" aria-label="Share">{copied ? <Check size={17}/> : <Copy size={17}/>}</button>
      </header>

      <main className="mx-auto max-w-xl px-4 py-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/[.035] p-5">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-pop-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.14em] text-pop-300">{current.eyebrow}</span>
            {state === 'live' ? <Zap size={18} className="text-pop-300" fill="currentColor"/> : terminal ? <ShieldAlert size={18} className="text-white/35"/> : <Clock3 size={18} className="text-white/35"/>}
          </div>
          <h1 className="mt-5 text-3xl font-black tracking-[-.045em] text-white">{workflow?.title || current.label}</h1>
          {workflow && <p className="mt-2 text-xs font-bold text-white/30">{workflow.category} · {workflow.visibility === 'direct' ? 'Direct challenge' : 'Open challenge'}</p>}
          <p className="mt-3 text-sm leading-6 text-white/45">{current.description}</p>

          {!terminal && (
            <div className="mt-6">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-[.12em] text-white/30"><span>Challenge lifecycle</span><span>{Math.max(progress + 1, 1)}/6</span></div>
              <div className="mt-2 grid grid-cols-6 gap-1">
                {['waiting','opponent_joined','ready','live','closed','result'].map((id, i) => <div key={id} className={`h-1.5 rounded-full ${i <= progress ? 'bg-pop-500' : 'bg-white/10'}`}/>)}
              </div>
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 gap-2">
            <Side label="Your side" image={workflow?.creatorSide || 'https://picsum.photos/seed/status-a/700/850'} ready={state !== 'waiting'}/>
            <Side label={state === 'waiting' ? 'Opponent' : workflow?.opponent?.name || 'Alex Morgan'} image={workflow?.opponentSide || 'https://picsum.photos/seed/status-b/700/850'} ready={!['waiting','opponent_joined'].includes(state)}/>
          </div>
        </div>

        {!terminal && state === 'waiting' && (
          <div className="mt-4 rounded-2xl border border-neon-400/20 bg-neon-500/5 p-4">
            <div className="flex gap-3"><Link2 size={18} className="mt-0.5 text-neon-300"/><div><p className="text-sm font-bold text-white">Your arena is waiting</p><p className="mt-1 text-xs leading-5 text-white/45">Share the challenge link or let it appear in Open Challenges. No voting happens until a second side exists.</p></div></div>
            <button onClick={copyInvite} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-xs font-black text-black">{copied ? <Check size={15}/> : <Copy size={15}/>} {copied ? 'Link copied' : 'Copy challenge link'}</button>
          </div>
        )}

        {!terminal && state === 'opponent_joined' && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[.035] p-4">
            <div className="flex gap-3"><UserPlus size={18} className="text-pop-300"/><div><p className="text-sm font-bold text-white">Alex joined your challenge</p><p className="mt-1 text-xs leading-5 text-white/45">Their slot is reserved. The opponent must submit their side before the arena becomes ready.</p></div></div>
          </div>
        )}

        {state === 'ready' && <Notice icon={<Check size={18}/>} title="Both sides are locked" text="Everything required for voting is present. The arena can now go live."/>}
        {state === 'live' && <Notice icon={<Zap size={18}/>} title="Community voting is live" text="Votes are being counted in real time. The media is now immutable."/>}
        {state === 'closed' && <Notice icon={<Trophy size={18}/>} title="Voting has ended" text="No more votes can be submitted. The final result is ready to publish."/>}
        {state === 'result' && <Notice icon={<Trophy size={18}/>} title="Arena complete" text="The final result is public. This challenge is now immutable."/>}

        <div className="mt-6 rounded-2xl border border-white/[.06] p-4">
          <p className="text-[10px] font-black uppercase tracking-[.15em] text-white/30">Prototype state controls</p>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {states.slice(0, 6).map(item => <button key={item.id} onClick={() => syncState(item.id)} className={`shrink-0 rounded-full px-3 py-2 text-[10px] font-bold ${state === item.id ? 'bg-white text-black' : 'bg-white/5 text-white/45'}`}>{item.label}</button>)}
          </div>
          <div className="mt-2 flex gap-2">
            {states.slice(6).map(item => <button key={item.id} onClick={() => setState(item.id)} className="rounded-full bg-white/5 px-3 py-2 text-[10px] font-bold text-white/40">{item.label}</button>)}
          </div>
        </div>

        {!terminal && state !== 'result' && state !== 'waiting' && (
          <button onClick={advance} className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-pop-500 text-sm font-black text-white shadow-pop">
            {state === 'ready' ? <><Zap size={16}/> Launch arena</> : state === 'live' ? <><Trophy size={16}/> Close voting</> : <><Trophy size={16}/> Publish result</>}
          </button>
        )}

        <button onClick={() => router.push(state === 'result' ? '/challenge/'+challengeId+'/result' : state === 'live' ? '/challenge/'+challengeId+'/live' : '/challenges')} className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white/[.06] text-sm font-bold text-white/70">
          {state === 'result' ? <><Trophy size={16}/> View final result</> : <><Swords size={16}/> Back to arena</>}
        </button>
      </main>
    </div>
  );
}

function Side({ label, image, ready }: { label: string; image: string; ready: boolean }) {
  return <div className="relative overflow-hidden rounded-2xl bg-black">
    <img src={image} alt="" className="aspect-[4/5] w-full object-cover"/>
    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 pt-12">
      <p className="text-xs font-black text-white">{label}</p>
      <p className={`mt-1 text-[9px] font-bold uppercase tracking-[.12em] ${ready ? 'text-emerald-300' : 'text-white/35'}`}>{ready ? 'Side submitted' : 'Waiting'}</p>
    </div>
  </div>;
}

function Notice({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="mt-4 flex gap-3 rounded-2xl border border-emerald-400/15 bg-emerald-400/5 p-4"><div className="mt-0.5 text-emerald-300">{icon}</div><div><p className="text-sm font-bold text-white">{title}</p><p className="mt-1 text-xs leading-5 text-white/45">{text}</p></div></div>;
}
