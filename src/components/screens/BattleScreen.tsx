'use client';

import { useState } from 'react';
import { battles } from '@/data/mock';
import { BattleVote } from '@/components/rating/BattleVote';
import { BattleResult } from '@/components/rating/BattleResult';
import { Button } from '@/components/ui/Button';
import { formatNumber } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export function BattleScreen() {
  const [currentBattleIndex, setCurrentBattleIndex] = useState(0);
  const [voted, setVoted] = useState<'a' | 'b' | null>(null);
  const [showResult, setShowResult] = useState(false);

  const battle = battles[currentBattleIndex];

  const handleVote = (side: 'a' | 'b') => {
    setVoted(side);
    setShowResult(true);
  };

  const handleNext = () => {
    setVoted(null);
    setShowResult(false);
    setCurrentBattleIndex((prev) => (prev + 1) % battles.length);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="sticky top-0 z-10 bg-surface-950/95 backdrop-blur-xl px-4 py-3">
        <h1 className="text-2xl font-bold text-white">Head-to-Head</h1>
        <p className="text-xs text-white/40">Which one wins?</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/40">Battle {currentBattleIndex + 1} of {battles.length}</span>
            <span className="text-xs text-pop-500 font-semibold">{formatNumber(battle.totalVotes)} votes</span>
          </div>
          <div className="h-1.5 bg-surface-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-pop-500 to-neon-500 rounded-full" style={{ width: `${(battle.totalVotes / 10000) * 100}%` }} />
          </div>
        </div>

        {!showResult ? (
          <BattleVote battle={battle} onVote={handleVote} voted={voted ?? undefined} />
        ) : (
          <BattleResult battle={battle} onNext={handleNext} />
        )}

        {/* More battles preview */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-3">More Battles</h3>
          <div className="space-y-3">
            {battles.filter((_, i) => i !== currentBattleIndex).map((b, i) => (
              <div key={b.id} className="flex items-center gap-3 p-3 bg-surface-900 rounded-xl border border-white/5">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-surface-800 border-2 border-surface-900 overflow-hidden">
                    <img src={b.a.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-surface-800 border-2 border-surface-900 overflow-hidden -ml-2">
                    <img src={b.b.image} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">{b.a.title} vs {b.b.title}</p>
                </div>
                <span className="text-xs text-white/40">{formatNumber(b.totalVotes)} votes</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
