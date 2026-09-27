'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Lock, Bell, Shield, Eye, UserX, LogOut, Info } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);

  const rows = [
    { icon: Bell, label: 'Notifications', hint: notifications ? 'On' : 'Off', action: () => setNotifications(v => !v), toggle: true, value: notifications },
    { icon: Lock, label: 'Privacy', hint: privateAccount ? 'Private account' : 'Public account', action: () => setPrivateAccount(v => !v), toggle: true, value: privateAccount },
    { icon: Shield, label: 'Safety & moderation', hint: 'Blocks, reports and controls', action: () => {}, toggle: false },
    { icon: Eye, label: 'Content preferences', hint: 'Shape what you discover', action: () => {}, toggle: false },
  ];

  return (
    <div className="min-h-full bg-surface-950 text-white">
      <header className="sticky top-0 z-20 bg-surface-950/95 backdrop-blur-xl border-b border-white/5">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-surface-800 flex items-center justify-center">
            <ChevronLeft size={18} />
          </button>
          <div><p className="text-[10px] uppercase tracking-[0.18em] text-white/30 font-bold">Account</p><h1 className="text-lg font-black">Settings</h1></div>
        </div>
      </header>
      <main className="px-4 py-5 space-y-5 pb-10">
        <section>
          <p className="px-1 mb-2 text-[10px] uppercase tracking-[0.18em] text-white/30 font-bold">Preferences</p>
          <div className="rounded-2xl overflow-hidden border border-white/5 bg-surface-900">
            {rows.map(({icon: Icon,label,hint,action,toggle,value},i)=>(
              <button key={label} onClick={action} className={'w-full flex items-center gap-3 p-4 text-left hover:bg-surface-800/70 '+(i?'border-t border-white/5':'')}>
                <span className="w-9 h-9 rounded-xl bg-surface-800 flex items-center justify-center"><Icon size={17} className="text-white/65"/></span>
                <span className="flex-1"><span className="block text-sm font-bold">{label}</span><span className="block text-xs text-white/35 mt-0.5">{hint}</span></span>
                {toggle ? <span className={'w-11 h-6 rounded-full p-1 transition '+(value?'bg-pop-500':'bg-surface-700')}><span className={'block w-4 h-4 rounded-full bg-white transition '+(value?'translate-x-5':'translate-x-0')}/></span> : <ChevronRight size={17} className="text-white/20"/>}
              </button>
            ))}
          </div>
        </section>
        <section>
          <p className="px-1 mb-2 text-[10px] uppercase tracking-[0.18em] text-white/30 font-bold">Account</p>
          <div className="rounded-2xl overflow-hidden border border-white/5 bg-surface-900">
            <button onClick={()=>{}} className="w-full flex items-center gap-3 p-4 text-left hover:bg-surface-800/70"><UserX size={18} className="text-white/50"/><span className="flex-1"><span className="block text-sm font-bold">Blocked accounts</span><span className="text-xs text-white/35">Manage people you have blocked</span></span><ChevronRight size={17} className="text-white/20"/></button>
            <button onClick={()=>router.push('/')} className="w-full flex items-center gap-3 p-4 text-left border-t border-white/5 text-red-400"><LogOut size={18}/><span className="font-bold text-sm">Sign out</span></button>
          </div>
        </section>
        <div className="flex items-center justify-center gap-2 text-white/20 text-[11px]"><Info size={13}/> PopRate prototype · Settings are local for now</div>
      </main>
    </div>
  );
}
