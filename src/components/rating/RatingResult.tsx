'use client';

import { cn } from '@/lib/cn';
import { getRatingColor, getRatingLabel } from '@/lib/utils';

interface RatingResultProps {
  yourRating: number;
  communityRating: number;
  ratingCount: number;
}

export function RatingResult({ yourRating, communityRating, ratingCount }: RatingResultProps) {
  return (
    <div className="bg-surface-900 border border-white/10 rounded-2xl p-6 text-center">
      <div
        className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-4"
        style={{
          background: `linear-gradient(135deg, ${getRatingColor(yourRating)}, ${getRatingColor(yourRating)}80)`,
          boxShadow: `0 8px 32px ${getRatingColor(yourRating)}40`,
        }}
      >
        <span className="text-4xl font-bold text-white">{yourRating.toFixed(1)}</span>
      </div>

      <h3 className="text-lg font-semibold text-white mb-1">Your Rating</h3>

      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="text-center">
          <p className="text-xs text-white/40 mb-1">Community</p>
          <p className="text-xl font-bold text-white" style={{ color: getRatingColor(communityRating) }}>
            {communityRating.toFixed(1)}
          </p>
        </div>
        <div className="w-px h-8 bg-white/10" />
        <div className="text-center">
          <p className="text-xs text-white/40 mb-1">Ratings</p>
          <p className="text-xl font-bold text-white">{ratingCount.toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-4">
        <span
          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: `${getRatingColor(yourRating)}20`,
            color: getRatingColor(yourRating),
          }}
        >
          {getRatingLabel(yourRating)}
        </span>
      </div>
    </div>
  );
}
