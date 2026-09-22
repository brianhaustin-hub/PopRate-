'use client';

import { Battle } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { formatNumber } from '@/lib/utils';
import { cn } from '@/lib/cn';

interface BattleVoteProps {
  battle: Battle;
  onVote: (side: 'a' | 'b') => void;
  voted?: 'a' | 'b';
}

export function BattleVote({ battle, onVote, voted }: BattleVoteProps) {
  const percentA = Math.round((battle.votesA / battle.totalVotes) * 100);
  const percentB = Math.round((battle.votesB / battle.totalVotes) * 100);

  return (
    <div className="relative w-full">
      {/* Vote bars */}
      <div className="flex h-4 rounded-full overflow-hidden mb-4 bg-white/5">
        <div className="bg-pop-500 rounded-l-full transition-all duration-500" style={{ width: `${percentA}%` }} />
        <div className="bg-neon-500 rounded-r-full transition-all duration-500" style={{ width: `${percentB}%` }} />
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onVote('a')}
          className={cn(
            'relative rounded-2xl overflow-hidden border-2 p-3 text-left',
            voted === 'a' ? 'border-pop-500' : 'border-white/10 hover:border-white/20',
            voted && 'bg-white/5'
          )}
        >
          {voted === 'a' && <div className="absolute inset-0 bg-pop-500/10" />}
          <div className="relative">
            <div className="aspect-[3/4] rounded-xl overflow-hidden mb-2">
              <img src={battle.a.image} alt={battle.a.title} className="w-full h-full object-cover" />
            </div>
            <p className="font-semibold text-sm text-white">{battle.a.title}</p>
            <p className="text-xs text-white/40">{battle.a.creator.displayName}</p>
            {voted === 'a' && (
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-pop-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
            )}
          </div>
        </button>

        <button
          onClick={() => onVote('b')}
          className={cn(
            'relative rounded-2xl overflow-hidden border-2 p-3 text-left',
            voted === 'b' ? 'border-neon-500' : 'border-white/10 hover:border-white/20',
            voted && 'bg-white/5'
          )}
        >
          {voted === 'b' && <div className="absolute inset-0 bg-neon-500/10" />}
          <div className="relative">
            <div className="aspect-[3/4] rounded-xl overflow-hidden mb-2">
              <img src={battle.b.image} alt={battle.b.title} className="w-full h-full object-cover" />
            </div>
            <p className="font-semibold text-sm text-white">{battle.b.title}</p>
            <p className="text-xs text-white/40">{battle.b.creator.displayName}</p>
            {voted === 'b' && (
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-neon-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
            )}
          </div>
        </button>
      </div>

      <p className="text-center text-xs text-white/30 mt-3">
        {formatNumber(battle.totalVotes)} votes
      </p>
    </div>
  );
}
