'use client';

import { challenges } from '@/data/mock';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { formatNumber } from '@/lib/utils';
import { Trophy, Star, Clock } from 'lucide-react';

export function ChallengesScreen() {
  return (
    <div className="h-full flex flex-col">
      <div className="sticky top-0 z-10 bg-surface-950/95 backdrop-blur-xl px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Challenges</h1>
            <p className="text-xs text-white/40">Compete and get featured</p>
          </div>
          <div className="flex items-center gap-1">
            <Trophy size={18} className="text-yellow-500" />
            <span className="text-sm text-yellow-500 font-semibold">Active</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {/* Featured Challenge */}
        <div className="mb-6 rounded-2xl overflow-hidden relative">
          <img
            src={challenges[0].image}
            alt=""
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="warning">Featured</Badge>
              <Badge variant="accent">{challenges[0].category}</Badge>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{challenges[0].title}</h2>
            <p className="text-sm text-white/60 mb-3">{challenges[0].description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-white/40">
                <span className="flex items-center gap-1"><Star size={12} className="text-yellow-500 fill-yellow-500" /> {challenges[0].participants.toLocaleString()} participants</span>
                <span className="flex items-center gap-1"><Clock size={12} /> Ends Dec 31</span>
              </div>
              <Button size="sm">Join Challenge</Button>
            </div>
          </div>
        </div>

        {/* All Challenges */}
        <h3 className="text-lg font-semibold text-white mb-3">All Challenges</h3>
        <div className="space-y-3">
          {challenges.slice(1).map((challenge, i) => (
            <div key={challenge.id} className="overflow-hidden rounded-xl bg-surface-900 border border-white/5 cursor-pointer hover:border-white/10 transition-colors">
              <div className="h-36 relative">
                <img src={challenge.image} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-900 to-transparent" />
                <div className="absolute top-3 right-3">
                  <Badge variant="warning">Active</Badge>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <p className="font-semibold text-sm text-white">{challenge.title}</p>
                </div>
                <p className="text-xs text-white/40 mb-3">{challenge.description.slice(0, 60)}...</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-white/30">{formatNumber(challenge.participants)} participants</p>
                  <Button variant="secondary" size="sm">Join</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
