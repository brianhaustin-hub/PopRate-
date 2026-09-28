'use client';

import { useSyncExternalStore } from 'react';
import { subscribeChallengeMemories, getChallengeMemory, toggleChallengeMemoryLike, toggleChallengeMemorySave, shareChallengeMemory } from '@/data/challengeMemories';
import { usePostEngagement, toggleLike as togglePostLike, toggleSave as togglePostSave } from '@/data/postEngagement';

export function useUnifiedEngagement(kind: 'post' | 'challenge_memory', id: string) {
  const postEngagement = usePostEngagement(id);
  const memory = useSyncExternalStore(
    subscribeChallengeMemories,
    () => kind === 'challenge_memory' ? getChallengeMemory(id) : null,
    () => null,
  );

  if (kind === 'challenge_memory') {
    return {
      liked: Boolean(memory?.liked),
      saved: Boolean(memory?.saves),
      likes: memory?.likes ?? 0,
      saves: memory?.saves ?? 0,
      shares: memory?.shares ?? 0,
      toggleLike: () => toggleChallengeMemoryLike(memory?.challengeId ?? id),
      toggleSave: () => toggleChallengeMemorySave(memory?.challengeId ?? id),
      share: () => shareChallengeMemory(memory?.challengeId ?? id),
    };
  }

  return {
    liked: Boolean(postEngagement.liked),
    saved: Boolean(postEngagement.saved),
    likes: postEngagement.likes,
    saves: postEngagement.saves,
    shares: 0,
    toggleLike: () => togglePostLike(id),
    toggleSave: () => togglePostSave(id),
    share: () => undefined,
  };
}
