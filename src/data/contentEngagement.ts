'use client';

import { useSyncExternalStore } from 'react';
import {
  subscribeChallengeMemories,
  getChallengeMemory,
  toggleChallengeMemoryLike,
  toggleChallengeMemorySave,
  shareChallengeMemory,
} from '@/data/challengeMemories';
import {
  usePostEngagement,
  toggleLike as togglePostLike,
  toggleSave as togglePostSave,
  ratePost,
} from '@/data/postEngagement';

type MemoryRating = {
  rating?: number;
  count: number;
  average: number;
};

const memoryRatings = new Map<string, MemoryRating>();
const ratingListeners = new Set<() => void>();
const EMPTY_MEMORY_RATING: MemoryRating = { count: 0, average: 0 };

function emitRating() {
  ratingListeners.forEach((listener) => listener());
}

function getMemoryRating(challengeId: string): MemoryRating {
  const existing = memoryRatings.get(challengeId);
  if (existing) return existing;

  const memory = getChallengeMemory(challengeId);
  const totalVotes = (memory?.votesA ?? 0) + (memory?.votesB ?? 0);
  const average = totalVotes
    ? Number((((memory?.votesA ?? 0) / totalVotes) * 10).toFixed(1))
    : 0;
  const value = { count: totalVotes, average };
  memoryRatings.set(challengeId, value);
  return value;
}

export function rateUnifiedContent(kind: 'post' | 'challenge_memory', id: string, score: number) {
  if (kind === 'post') {
    ratePost(id, score);
    return;
  }
  const current = getMemoryRating(id);
  const previous = current.rating;
  const nextCount = previous == null ? current.count + 1 : current.count;
  const nextAverage = previous == null
    ? ((current.average * current.count) + score) / Math.max(nextCount, 1)
    : ((current.average * current.count) - previous + score) / Math.max(current.count, 1);
  memoryRatings.set(id, {
    rating: score,
    count: nextCount,
    average: Number(nextAverage.toFixed(1)),
  });
  emitRating();
}

export function useUnifiedEngagement(kind: 'post' | 'challenge_memory', id: string) {
  const postEngagement = usePostEngagement(id);
  const memory = useSyncExternalStore(
    subscribeChallengeMemories,
    () => kind === 'challenge_memory' ? getChallengeMemory(id) : null,
    () => null,
  );
  const memoryRating = useSyncExternalStore(
    (listener) => {
      ratingListeners.add(listener);
      return () => ratingListeners.delete(listener);
    },
    () => kind === 'challenge_memory' ? getMemoryRating(id) : EMPTY_MEMORY_RATING,
    () => kind === 'challenge_memory' ? getMemoryRating(id) : EMPTY_MEMORY_RATING,
  );

  if (kind === 'challenge_memory') {
    return {
      liked: Boolean(memory?.liked),
      saved: Boolean(memory?.saves),
      likes: memory?.likes ?? 0,
      saves: memory?.saves ?? 0,
      shares: memory?.shares ?? 0,
      rating: memoryRating.rating,
      ratingCount: memoryRating.count,
      ratingAverage: memoryRating.average,
      toggleLike: () => toggleChallengeMemoryLike(memory?.challengeId ?? id),
      toggleSave: () => toggleChallengeMemorySave(memory?.challengeId ?? id),
      share: () => shareChallengeMemory(memory?.challengeId ?? id),
      rate: (score: number) => {
        const current = getMemoryRating(memory?.challengeId ?? id);
        const previous = current.rating;
        const nextCount = previous == null ? current.count + 1 : current.count;
        const nextAverage = previous == null
          ? ((current.average * current.count) + score) / Math.max(nextCount, 1)
          : ((current.average * current.count) - previous + score) / Math.max(current.count, 1);
        memoryRatings.set(memory?.challengeId ?? id, {
          rating: score,
          count: nextCount,
          average: Number(nextAverage.toFixed(1)),
        });
        emitRating();
      },
    };
  }

  return {
    liked: Boolean(postEngagement.liked),
    saved: Boolean(postEngagement.saved),
    likes: postEngagement.likes,
    saves: postEngagement.saves,
    shares: 0,
    rating: postEngagement.rating,
    ratingCount: postEngagement.ratingCount,
    ratingAverage: postEngagement.ratingAverage,
    toggleLike: () => togglePostLike(id),
    toggleSave: () => togglePostSave(id),
    share: () => undefined,
    rate: (score: number) => ratePost(id, score),
  };
}
