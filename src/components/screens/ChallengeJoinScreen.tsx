'use client';

import { useState } from 'react';
import { ArrowLeft, Check, Copy, ImagePlus, Link2, Lock, ShieldCheck, Upload, UserPlus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ChallengeJoinScreen() {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  if (submitted) return (
    <div className="flex h-full items-center justify-center overflow-y-auto px-5 py-10">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-[2rem] bg-pop-500 text-white shadow-pop"><Check size={38} strokeWidth={3}/></div>
        <p className="mt-7 text-xs font-black uppercase tracking-[.18em] text-pop-500">SIDE SUBMITTED</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-.05em]">The arena is ready.</h1>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-white/55">Your side has been added. Once the challenge goes live, people can vote between both sides.</p>
        <button onClick={() => router.push('/challenges')} className="mt-9 h-14 w-full rounded-2xl bg-pop-500 font-bold text-white shadow-pop">View challenges</button>
      </div>
    </div>
  );

  return <div className="h-full overflow-y-auto pb-10">
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/[.06] bg-surface-950/90 px-4 py-4 backdrop-blur-xl">
      <button onClick={() => router.back()} className="grid h-10 w-10 place-items-center rounded-full bg-white/[.06]"><ArrowLeft size={19}/></button>
      <span className="text-sm font-bold">Challenge invite</span><span className="w-10"/>
    </header>
    <main className="mx-auto max-w-xl px-4 py-6">
      <div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-full bg-pop-500 text-sm font-black">A</div><div><p className="text-sm font-bold">Alex Morgan</p><p className="text-xs text-white/40">@alexmorgan · challenged you</p></div></div>
      <div className="mt-7 rounded-[2rem] border border-white/[.08] bg-white/[.035] p-5">
        <p className="text-xs font-black uppercase tracking-[.16em] text-pop-400">HEAD-TO-HEAD</p><h1 className="mt-3 text-3xl font-black leading-tight tracking-[-.04em]">Which look wins the night?</h1><p className="mt-2 text-sm text-white/45">Style · Open challenge</p>
        <div className="mt-5 grid grid-cols-2 gap-2 overflow-hidden rounded-2xl"><img src="https://picsum.photos/seed/poprate-a/600/700" className="h-64 w-full object-cover" alt="Challenge side A"/><div className="grid h-64 place-items-center bg-white/[.04]"><div className="text-center"><UserPlus size={28} className="mx-auto text-white/35"/><p className="mt-2 text-xs font-bold text-white/45">Your side</p></div></div></div>
        <div className="mt-5 flex items-center gap-2 rounded-xl bg-white/[.04] p-3 text-xs text-white/50"><Lock size={15}/> Both sides must be submitted before voting starts.</div>
      </div>
      {!accepted ? <div className="mt-5 space-y-3"><button onClick={()=>setAccepted(true)} className="h-14 w-full rounded-2xl bg-pop-500 font-bold text-white shadow-pop">Accept & add my side</button><button onClick={()=>router.push('/challenges')} className="h-14 w-full rounded-2xl border border-white/10 font-bold text-white/70">Decline</button></div> : <div className="mt-5 rounded-[2rem] border border-pop-500/30 bg-pop-500/5 p-5"><div className="flex items-center gap-3"><ImagePlus className="text-pop-400"/><div><p className="font-bold">Add your side</p><p className="text-xs text-white/45">Choose the photo or video people will compare.</p></div></div><button className="mt-5 flex h-44 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-black/10 text-white/45"><Upload size={24}/><span className="text-sm font-bold">Upload media</span><span className="text-[11px]">Photo or video</span></button><div className="mt-4 flex items-start gap-2 text-xs leading-5 text-white/40"><ShieldCheck size={15} className="mt-0.5 shrink-0"/>You control what you submit. Your media becomes part of this challenge.</div><button onClick={()=>setSubmitted(true)} className="mt-5 h-14 w-full rounded-2xl bg-pop-500 font-bold text-white shadow-pop">Submit my side <Check size={18} className="ml-1 inline"/></button></div>}
      <div className="mt-6 rounded-2xl border border-white/[.06] p-4"><div className="flex items-center gap-3"><Link2 size={17} className="text-white/40"/><div className="flex-1"><p className="text-xs font-bold">Share this challenge</p><p className="mt-1 text-[11px] text-white/35">Invite someone else to view the arena.</p></div><button onClick={()=>{setCopied(true);setTimeout(()=>setCopied(false),1400)}} className="rounded-xl bg-white/[.06] p-2">{copied?<Check size={16}/>:<Copy size={16}/>}</button></div></div>
    </main>
  </div>;
}
