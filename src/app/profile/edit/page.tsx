'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Camera, Check } from 'lucide-react';
import { users } from '@/data/mock';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';

export default function EditProfilePage() {
  const router=useRouter();
  const user=users[0];
  const [name,setName]=useState(user.displayName);
  const [username,setUsername]=useState(user.username);
  const [bio,setBio]=useState(user.bio);
  const [saved,setSaved]=useState(false);

  const save=()=>{setSaved(true); window.setTimeout(()=>router.back(),700);};

  return <div className="min-h-full bg-surface-950 text-white">
    <header className="sticky top-0 z-20 bg-surface-950/95 backdrop-blur-xl border-b border-white/5">
      <div className="px-4 py-3 flex items-center justify-between">
        <button onClick={()=>router.back()} className="w-9 h-9 rounded-full bg-surface-800 flex items-center justify-center"><ChevronLeft size={18}/></button>
        <h1 className="font-black">Edit profile</h1>
        <button onClick={save} className="text-pop-400 text-sm font-bold">{saved?<Check size={18}/>: 'Save'}</button>
      </div>
    </header>
    <main className="px-4 py-6 space-y-6">
      <div className="flex justify-center">
        <div className="relative"><Avatar src={user.avatar} alt={user.displayName} size="xl"/><button className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-pop-500 border-2 border-surface-950 flex items-center justify-center"><Camera size={15}/></button></div>
      </div>
      <div className="space-y-4">
        {[['Display name',name,setName],['Username',username,setUsername],['Bio',bio,setBio]].map(([label,value,setter])=><label key={label} className="block"><span className="text-xs font-bold text-white/50">{label}</span><input value={value as string} onChange={e=>(setter as (v:string)=>void)(e.target.value)} className="mt-2 w-full bg-surface-900 border border-white/10 rounded-2xl px-4 py-3.5 text-sm outline-none focus:border-pop-500/60"/></label>)}
      </div>
      <Button onClick={save} className="w-full">Save changes</Button>
      <p className="text-center text-xs text-white/25">Profile changes are stored locally in this prototype.</p>
    </main>
  </div>;
}
