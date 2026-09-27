
'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Camera,
  Check,
  ChevronRight,
  Eye,
  Flame,
  Globe2,
  Lock,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  X,
} from 'lucide-react';

export type AuthFlowProps = { onComplete: () => void };
type Step = 'splash' | 'welcome' | 'signin' | 'signup' | 'verify' | 'profile' | 'interests' | 'permissions' | 'ready';

const interests = ['Style', 'Sports', 'Music', 'Gaming', 'Food', 'Travel', 'Fitness', 'Cars', 'Art', 'Tech', 'Campus', 'Culture'];

const slide = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.24 },
};

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${compact ? '' : 'justify-center'}`}>
      <div className="relative grid h-11 w-11 place-items-center rounded-2xl bg-pop-500 shadow-pop">
        <span className="text-xl font-black tracking-tighter text-white">P</span>
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-neon-500 ring-4 ring-white" />
      </div>
      <span className="text-2xl font-black tracking-[-0.07em] text-surface-950">POPRATE</span>
    </div>
  );
}

function AuthShell({ children, back, onBack }: { children: React.ReactNode; back?: boolean; onBack?: () => void }) {
  return (
    <main className="min-h-screen bg-white text-surface-950">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-8 pt-5 sm:max-w-lg">
        <div className="flex min-h-10 items-center">
          {back && onBack && (
            <button onClick={onBack} aria-label="Go back" className="grid h-10 w-10 place-items-center rounded-full bg-surface-100 text-surface-950 transition hover:bg-surface-200">
              <ArrowLeft size={19} />
            </button>
          )}
        </div>
        {children}
      </div>
    </main>
  );
}

function PrimaryButton({ children, onClick, disabled = false }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  return <button disabled={disabled} onClick={onClick} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-pop-500 px-5 text-[15px] font-bold text-white shadow-pop transition hover:bg-pop-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40">{children}</button>;
}

function SecondaryButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return <button onClick={onClick} className="flex h-14 w-full items-center justify-center rounded-2xl border border-surface-200 bg-white px-5 text-[15px] font-bold text-surface-950 transition hover:bg-surface-50">{children}</button>;
}

function Field({ label, type = 'text', placeholder, icon: Icon, value, onChange }: { label: string; type?: string; placeholder: string; icon: React.ElementType; value?: string; onChange?: (v: string) => void }) {
  return <label className="block space-y-2"><span className="text-xs font-bold uppercase tracking-[0.12em] text-surface-700">{label}</span><div className="flex h-14 items-center gap-3 rounded-2xl border border-surface-200 bg-surface-50 px-4 focus-within:border-pop-400 focus-within:bg-white"><Icon size={19} className="shrink-0 text-surface-700" /><input type={type} value={value} onChange={e => onChange?.(e.target.value)} placeholder={placeholder} className="w-full bg-transparent text-[15px] outline-none placeholder:text-surface-700/60" /></div></label>;
}

export function AuthFlow({ onComplete }: AuthFlowProps) {
  const [step, setStep] = useState<Step>('splash');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [notifications, setNotifications] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setStep('welcome'), 1700);
    return () => window.clearTimeout(timer);
  }, []);

  const canProfile = name.trim().length > 1 && username.trim().length > 2;
  const canInterests = selected.length >= 3;
  const progress = useMemo(() => ({ profile: 1, interests: 2, permissions: 3, ready: 4 } as Record<string, number>), []);

  if (step === 'splash') {
    return <main className="grid min-h-screen place-items-center bg-white"><motion.div initial={{ opacity: 0, scale: .88 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .55, ease: 'easeOut' }} className="text-center"><Logo /><motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .35 }} className="mt-5 text-xs font-bold uppercase tracking-[0.28em] text-surface-700">Rate. Challenge. Discover.</motion.p></motion.div></main>;
  }

  if (step === 'welcome') return <AuthShell><motion.div {...slide} className="flex flex-1 flex-col justify-between py-10"><div><Logo /><div className="mt-14"><p className="mb-3 text-sm font-bold text-pop-500">YOUR WORLD. YOUR TAKE.</p><h1 className="text-5xl font-black leading-[0.98] tracking-[-0.055em]">See it.<br />Rate it.<br /><span className="text-pop-500">Pop it.</span></h1><p className="mt-6 max-w-sm text-base leading-7 text-surface-700">A social arena where people put things head-to-head and the crowd decides.</p></div></div><div className="space-y-3"><PrimaryButton onClick={() => setStep('signup')}>Create account <ArrowRight size={18} /></PrimaryButton><SecondaryButton onClick={() => setStep('signin')}>I already have an account</SecondaryButton><p className="px-4 text-center text-[11px] leading-5 text-surface-700">By continuing, you agree to PopRate's Terms and acknowledge the Privacy Policy.</p></div></motion.div></AuthShell>;

  if (step === 'signin') return <AuthShell back onBack={() => setStep('welcome')}><motion.div {...slide} className="flex flex-1 flex-col py-9"><div><p className="text-sm font-bold text-pop-500">WELCOME BACK</p><h1 className="mt-2 text-4xl font-black tracking-[-0.045em]">Back to the arena.</h1><p className="mt-3 text-sm leading-6 text-surface-700">Sign in and pick up where you left off.</p></div><div className="mt-9 space-y-5"><Field label="Email" placeholder="you@example.com" icon={Mail} value={email} onChange={setEmail} /><Field label="Password" type="password" placeholder="Your password" icon={Lock} /><button className="ml-auto block text-sm font-bold text-pop-500">Forgot password?</button><PrimaryButton onClick={() => setStep('profile')}>Sign in <ArrowRight size={18} /></PrimaryButton><div className="relative py-2 text-center text-xs font-semibold text-surface-700"><span className="bg-white px-3">or</span><div className="absolute left-0 right-0 top-1/2 -z-0 h-px bg-surface-200" /></div><SecondaryButton onClick={() => setStep('signup')}>Create a new account</SecondaryButton></div></motion.div></AuthShell>;

  if (step === 'signup') return <AuthShell back onBack={() => setStep('welcome')}><motion.div {...slide} className="flex flex-1 flex-col py-9"><div><p className="text-sm font-bold text-pop-500">JOIN POPRATE</p><h1 className="mt-2 text-4xl font-black tracking-[-0.045em]">Create your account.</h1><p className="mt-3 text-sm leading-6 text-surface-700">One account. Your identity. Your votes.</p></div><div className="mt-9 space-y-5"><Field label="Email" placeholder="you@example.com" icon={Mail} value={email} onChange={setEmail} /><Field label="Password" type="password" placeholder="At least 8 characters" icon={Lock} /><PrimaryButton onClick={() => setStep('verify')}>Continue <ArrowRight size={18} /></PrimaryButton><p className="text-center text-xs leading-5 text-surface-700">We'll send a verification code to confirm your email.</p></div></motion.div></AuthShell>;

  if (step === 'verify') return <AuthShell back onBack={() => setStep('signup')}><motion.div {...slide} className="flex flex-1 flex-col py-9"><div className="grid h-16 w-16 place-items-center rounded-2xl bg-pop-50 text-pop-500"><ShieldCheck size={30} /></div><h1 className="mt-7 text-4xl font-black tracking-[-0.045em]">Verify it's you.</h1><p className="mt-3 text-sm leading-6 text-surface-700">Enter the 6-digit code we sent to <span className="font-bold text-surface-950">{email || 'your email'}</span>.</p><div className="mt-9 grid grid-cols-6 gap-2">{[0,1,2,3,4,5].map(i => <input key={i} maxLength={1} inputMode="numeric" className="h-14 min-w-0 rounded-xl border border-surface-200 bg-surface-50 text-center text-xl font-black outline-none focus:border-pop-400" />)}</div><PrimaryButton onClick={() => setStep('profile')}><Check size={18} /> Verify email</PrimaryButton><button className="mt-5 text-sm font-bold text-pop-500">Resend code</button></motion.div></AuthShell>;

  if (step === 'profile') return <AuthShell back onBack={() => setStep('verify')}><motion.div {...slide} className="flex flex-1 flex-col py-8"><StepHeader current={progress.profile} /><div className="mt-9"><h1 className="text-4xl font-black tracking-[-0.045em]">Make it yours.</h1><p className="mt-3 text-sm leading-6 text-surface-700">Choose the name people will know you by.</p></div><div className="mt-8 space-y-5"><div className="mx-auto grid h-24 w-24 place-items-center rounded-full border-2 border-dashed border-surface-200 bg-surface-50 text-surface-700"><Camera size={24} /><span className="sr-only">Add profile photo</span></div><button className="mx-auto block text-sm font-bold text-pop-500">Add profile photo</button><Field label="Display name" placeholder="Your name" icon={UserRound} value={name} onChange={setName} /><Field label="Username" placeholder="@yourhandle" icon={Globe2} value={username} onChange={setUsername} /></div><div className="mt-auto pt-8"><PrimaryButton disabled={!canProfile} onClick={() => setStep('interests')}>Continue <ArrowRight size={18} /></PrimaryButton></div></motion.div></AuthShell>;

  if (step === 'interests') return <AuthShell back onBack={() => setStep('profile')}><motion.div {...slide} className="flex flex-1 flex-col py-8"><StepHeader current={progress.interests} /><h1 className="mt-9 text-4xl font-black tracking-[-0.045em]">What are you into?</h1><p className="mt-3 text-sm leading-6 text-surface-700">Pick at least 3. We'll use these to shape your first PopRate experience.</p><div className="mt-7 grid grid-cols-2 gap-3">{interests.map(item => { const active = selected.includes(item); return <button key={item} onClick={() => setSelected(s => active ? s.filter(x => x !== item) : [...s, item])} className={`flex h-14 items-center justify-between rounded-2xl border px-4 text-sm font-bold transition ${active ? 'border-pop-500 bg-pop-50 text-pop-600' : 'border-surface-200 bg-white text-surface-950 hover:bg-surface-50'}`}><span>{item}</span>{active ? <Check size={17} /> : <ChevronRight size={16} className="text-surface-700" />}</button>; })}</div><div className="mt-auto pt-8"><PrimaryButton disabled={!canInterests} onClick={() => setStep('permissions')}>Continue <ArrowRight size={18} /></PrimaryButton></div></motion.div></AuthShell>;

  if (step === 'permissions') return <AuthShell back onBack={() => setStep('interests')}><motion.div {...slide} className="flex flex-1 flex-col py-8"><StepHeader current={progress.permissions} /><div className="mt-10 grid h-20 w-20 place-items-center rounded-3xl bg-pop-50 text-pop-500"><Bell size={34} /></div><h1 className="mt-7 text-4xl font-black tracking-[-0.045em]">Don't miss the pop.</h1><p className="mt-3 text-sm leading-6 text-surface-700">Get notified when someone challenges you, votes on your post, or interacts with you.</p><div className="mt-8 space-y-3"><button onClick={() => setNotifications(true)} className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left ${notifications ? 'border-pop-500 bg-pop-50' : 'border-surface-200 bg-white'}`}><div className="grid h-11 w-11 place-items-center rounded-xl bg-surface-100"><Bell size={20} /></div><div className="flex-1"><p className="text-sm font-bold">Push notifications</p><p className="mt-1 text-xs leading-5 text-surface-700">Challenges, votes and activity</p></div><div className={`h-6 w-11 rounded-full p-1 transition ${notifications ? 'bg-pop-500' : 'bg-surface-200'}`}><div className={`h-4 w-4 rounded-full bg-white transition ${notifications ? 'translate-x-5' : ''}`} /></div></button><div className="rounded-2xl border border-surface-200 bg-surface-50 p-4"><div className="flex items-center gap-3"><Lock size={18} className="text-surface-700" /><p className="text-sm font-bold">Your privacy stays yours.</p></div><p className="mt-2 pl-7 text-xs leading-5 text-surface-700">You control what you share. Notifications can always be changed later.</p></div></div><div className="mt-auto pt-8 space-y-3"><PrimaryButton onClick={() => setStep('ready')}>Continue <ArrowRight size={18} /></PrimaryButton><button onClick={() => setStep('ready')} className="w-full py-2 text-sm font-bold text-surface-700">Maybe later</button></div></motion.div></AuthShell>;

  return <AuthShell><motion.div {...slide} className="flex flex-1 flex-col justify-between py-10"><div><div className="mx-auto grid h-24 w-24 place-items-center rounded-[2rem] bg-pop-500 text-white shadow-pop"><Check size={45} strokeWidth={3} /></div><div className="mt-9 text-center"><p className="text-sm font-bold uppercase tracking-[0.16em] text-pop-500">YOU'RE IN</p><h1 className="mt-3 text-5xl font-black tracking-[-0.06em]">Welcome to<br /><span className="text-pop-500">PopRate.</span></h1><p className="mx-auto mt-5 max-w-sm text-sm leading-6 text-surface-700">Your arena is ready. Discover people, make your first challenge, and let the crowd decide.</p></div><div className="mt-9 grid grid-cols-3 gap-2"><MiniStat icon={Users} label="People" /><MiniStat icon={Flame} label="Challenges" /><MiniStat icon={Sparkles} label="Discover" /></div></div><PrimaryButton onClick={() => { localStorage.setItem('poprate-onboarded', '1'); onComplete(); }}>Enter PopRate <ArrowRight size={18} /></PrimaryButton></motion.div></AuthShell>;
}

function StepHeader({ current }: { current: number }) {
  return <div className="flex items-center gap-2"><span className="text-xs font-black uppercase tracking-[0.14em] text-surface-700">Set up</span>{[1,2,3,4].map(i => <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= current ? 'bg-pop-500' : 'bg-surface-200'}`} />)}</div>;
}

function MiniStat({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return <div className="rounded-2xl border border-surface-200 bg-surface-50 p-4 text-center"><Icon size={18} className="mx-auto text-pop-500" /><p className="mt-2 text-[11px] font-bold text-surface-700">{label}</p></div>;
}
