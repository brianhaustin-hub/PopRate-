'use client';

import { useState } from 'react';
import { ArrowLeft, Check, ChevronRight, Clock3, Heart, MessageCircle, MoreHorizontal, Share2, ShieldAlert, Trophy, UserX, Users, Zap } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

type Mode = 'live' | 'result';

export function ChallengeDetailScreen({ mode = 'live' }: { mode?: Mode }) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const challengeId = params?.id || 'c1';
  const [selected, setSelected] = useState<'a' | 'b' | null>(null);
  const [voted, setVoted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [shared, setShared] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(['Clean matchup 👏', 'Both sides came prepared.', 'This one is close.']);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reported, setReported] = useState(false);
  const [blocked, setBlocked] = useState(false);

  const isResult = mode === 'result';
  const votesA = isResult ? 642 : 418;
  const votesB = isResult ? 538 : 392;
  const total = votesA + votesB;
  const percentA = Math.round((votesA / total) * 100);
  const percentB = 100 - percentA;

  const submitComment = () => { if (!comment.trim()) return; setComments((items) => [...items, comment.trim()]); setComment(''); };

  const submitVote = () => {
    if (!selected || voted || isResult) return;
    setVoted(true);
  };

  return (
    <div className="h-full overflow-y-auto pb-10">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/[.06] bg-surface-950/90 px-4 py-3 backdrop-blur-xl">
        <button onClick={() => router.back()} className="grid h-10 w-10 place-items-center rounded-full bg-white/[.06]">
          <ArrowLeft size={19} />
        </button>
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[.18em] text-pop-400">{isResult ? 'FINAL RESULT' : 'LIVE ARENA'}</p>
          <p className="text-xs font-semibold text-white/45">Challenge #{challengeId.toUpperCase()}</p>
        </div>
        <button onClick={()=>{if(navigator.clipboard) navigator.clipboard.writeText(window.location.href);setShared(true);setTimeout(()=>setShared(false),1400)}} className="grid h-10 w-10 place-items-center rounded-full bg-white/[.06]">{shared?<Check size={17}/>:<Share2 size={17}/>}</button>
      </header>

      <main className="mx-auto max-w-xl px-4 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-pop-500 to-neon-500 text-xs font-black">A</div>
            <div><p className="text-sm font-bold">Alex Morgan</p><p className="text-xs text-white/40">@alexmorgan · Style</p></div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-white/[.05] px-3 py-1.5 text-[11px] font-bold text-white/55">
            {isResult ? <Trophy size={13} className="text-pop-400" /> : <Clock3 size={13} className="text-pop-400" />}
            {isResult ? 'Closed' : '2h 14m left'}
          </div>
        </div>

        <section className="mt-6">
          <h1 className="text-[2rem] font-black leading-[1.05] tracking-[-.045em]">Which look wins the night?</h1>
          <p className="mt-2 text-sm leading-6 text-white/45">Pick one side. Every vote moves the arena.</p>
        </section>

        <section className="mt-6 grid grid-cols-2 gap-2">
          <VoteSide label="ALEX" image="https://picsum.photos/seed/poprate-live-a/700/900" percent={percentA} votes={votesA} selected={selected === 'a'} disabled={voted || isResult} winner={isResult && votesA > votesB} onSelect={() => setSelected('a')} />
          <VoteSide label="YOU" image="https://picsum.photos/seed/poprate-live-b/700/900" percent={percentB} votes={votesB} selected={selected === 'b'} disabled={voted || isResult} winner={isResult && votesB > votesA} onSelect={() => setSelected('b')} />
        </section>

        {!isResult && !voted && (
          <button disabled={!selected} onClick={submitVote} className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-pop-500 font-black text-white shadow-pop disabled:cursor-not-allowed disabled:opacity-35">
            <Zap size={18} fill="currentColor" /> Cast my vote
          </button>
        )}

        {!isResult && voted && (
          <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-emerald-400 text-black"><Check size={18} strokeWidth={3} /></div>
              <div><p className="text-sm font-bold">Vote locked in</p><p className="text-xs text-white/45">You can see the live split below.</p></div>
            </div>
          </div>
        )}

        <div className="mt-5 rounded-[1.5rem] border border-white/[.07] bg-white/[.025] p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white/65">{total.toLocaleString()} votes</span>
            <span className="flex items-center gap-1 text-white/35"><Users size={14} /> community</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[.07]">
            <div className="h-full rounded-full bg-pop-500 transition-all" style={{ width: `${percentA}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-[11px] font-bold"><span className="text-pop-400">A {percentA}%</span><span className="text-white/40">B {percentB}%</span></div>
        </div>

        <div className="mt-5 flex items-center justify-between border-y border-white/[.06] py-4">
          <button onClick={() => setLiked(!liked)} className={`flex items-center gap-2 text-sm font-semibold ${liked ? 'text-pop-400' : 'text-white/50'}`}><Heart size={19} fill={liked ? 'currentColor' : 'none'} /> {liked ? 'Liked' : 'Like'}</button>
          <button onClick={() => setCommentsOpen(!commentsOpen)} className={`flex items-center gap-2 text-sm font-semibold ${commentsOpen ? 'text-pop-400' : 'text-white/50'}`}><MessageCircle size={19} /> {comments.length} comments</button>
          <div className="relative"><button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 text-sm font-semibold text-white/50"><MoreHorizontal size={19} /> More</button>{menuOpen && <div className="absolute bottom-12 right-0 z-20 w-48 overflow-hidden rounded-2xl border border-white/10 bg-surface-900 p-1 shadow-2xl"><button onClick={() => { setReported(true); setMenuOpen(false); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold"><ShieldAlert size={17}/> Report challenge</button><button onClick={() => { setBlocked(true); setMenuOpen(false); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-300"><UserX size={17}/> Block creator</button></div>}</div>
        </div>

        {reported && <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-xs font-semibold text-emerald-300">Thanks. This challenge has been reported for review.</div>}
        {blocked && <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 p-3 text-xs font-semibold text-red-300">Alex Morgan is blocked. Their challenges can be hidden from your feed.</div>}

        {commentsOpen && <section className="mt-5 rounded-[1.5rem] border border-white/[.07] bg-white/[.025] p-4">
          <div className="flex items-center justify-between"><p className="text-sm font-black">Comments</p><button onClick={() => setCommentsOpen(false)} className="text-xs text-white/35">Close</button></div>
          <div className="mt-4 space-y-3">{comments.map((item, index) => <div key={index} className="rounded-xl bg-white/[.04] px-3 py-2.5 text-sm text-white/70">{item}</div>)}</div>
          <div className="mt-4 flex gap-2"><input value={comment} onChange={(e) => setComment(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submitComment()} placeholder="Add a comment…" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/10 px-3 text-sm outline-none placeholder:text-white/25"/><button onClick={submitComment} className="rounded-xl bg-pop-500 px-4 text-sm font-bold">Post</button></div>
        </section>}

        {isResult && votesA === votesB && (
          <div className="mt-5 rounded-[1.5rem] border border-amber-400/20 bg-amber-400/5 p-5"><div className="flex items-center gap-3"><Trophy className="text-amber-300" size={22}/><div><p className="text-xs font-black uppercase tracking-[.15em] text-amber-300">TIE</p><p className="mt-1 text-xl font-black">The arena ended level.</p></div></div><p className="mt-3 text-sm leading-6 text-white/45">Both sides received the same number of votes. No winner is declared.</p></div>
        )}

        {isResult && votesA !== votesB && (
          <div className="mt-5 rounded-[1.5rem] border border-pop-500/20 bg-gradient-to-br from-pop-500/10 to-transparent p-5">
            <div className="flex items-center gap-3"><Trophy className="text-pop-400" size={22} /><div><p className="text-xs font-black uppercase tracking-[.15em] text-pop-400">WINNER</p><p className="mt-1 text-xl font-black">{votesA > votesB ? 'Alex Morgan' : 'Your side'} takes the arena.</p></div></div>
            <p className="mt-3 text-sm leading-6 text-white/45">The challenge is closed. Results are final and the vote split is now public.</p>
          </div>
        )}

        <button onClick={() => router.push('/challenges')} className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white/[.06] text-sm font-bold text-white/70">
          Find another challenge <ChevronRight size={16} />
        </button>
      </main>
    </div>
  );
}

function VoteSide({ label, image, percent, votes, selected, disabled, winner, onSelect }: { label: string; image: string; percent: number; votes: number; selected: boolean; disabled: boolean; winner: boolean; onSelect: () => void }) {
  return (
    <button disabled={disabled} onClick={onSelect} className={`group relative overflow-hidden rounded-[1.5rem] border text-left transition-all ${selected ? 'border-pop-500 ring-2 ring-pop-500/30' : winner ? 'border-pop-500/60' : 'border-white/[.08]'} ${disabled ? '' : 'active:scale-[.98]'}`}>
      <img src={image} alt={`${label} challenge side`} className="h-[23rem] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-3 pt-16">
        <div className="flex items-end justify-between gap-2"><div><p className="text-[10px] font-black tracking-[.16em] text-white/60">{label}</p><p className="mt-1 text-xl font-black">{percent}%</p></div>{winner && <span className="rounded-full bg-pop-500 px-2 py-1 text-[9px] font-black">WINNER</span>}</div>
        <p className="mt-1 text-[10px] text-white/45">{votes.toLocaleString()} votes</p>
      </div>
      {selected && <div className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-pop-500 text-white shadow-pop"><Check size={16} strokeWidth={3} /></div>}
    </button>
  );
}
