'use client';

import { Battle } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { formatNumber } from '@/lib/utils';
import { cn } from '@/lib/cn';

interface BattleResultProps {
  battle: Battle;
  onNext: () => void;
}

export function BattleResult({ battle, onNext }: BattleResultProps) {
  const percentA = Math.round((battle.votesA / battle.totalVotes) * 100);
  const percentB = Math.round((battle.votesB / battle.totalVotes) * 100);
  const winner = percentA > percentB ? 'A' : 'B';

  return (
    <div className="bg-surface-900 border border-white/10 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white text-center mb-6">Battle Results</h3>

      <div className="space-y-4">
        {[
          { side: 'a', title: battle.a.title, creator: battle.a.creator, image: battle.a.image, percent: percentA, votes: battle.votesA, color: '#f0554a' },
          { side: 'b', title: battle.b.title, creator: battle.b.creator, image: battle.b.image, percent: percentB, votes: battle.votesB, color: '#8b5cf6' },
        ].map((item, index) => (
          <div
            key={item.side}
            className={cn(
              'flex items-center gap-4 p-4 rounded-xl border',
              winner === item.side ? 'border-white/20 bg-white/5' : 'border-white/5 bg-white/[0.02]'
            )}
          >
            <div className="relative">
              <Avatar src={item.image} size="lg" />
              {winner === item.side && (
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: item.color }}>
                  <span className="text-white text-xs">🏆</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white text-sm">{item.title}</p>
              <p className="text-xs text-white/40">{item.creator.displayName}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold" style={{ color: item.color }}>{item.percent}%</p>
              <p className="text-xs text-white/30">{formatNumber(item.votes)} votes</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        className="w-full mt-6 py-3 bg-pop-500 text-white font-semibold rounded-full hover:bg-pop-600 active:scale-95 transition-all"
      >
        Next Battle →
      </button>
    </div>
  );
}
