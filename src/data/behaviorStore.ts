'use client';

import { useSyncExternalStore } from 'react';

export type BehaviorType =
  | 'impression'
  | 'view_start'
  | 'view_complete'
  | 'like'
  | 'unlike'
  | 'rate'
  | 'comment'
  | 'save'
  | 'unsave'
  | 'share'
  | 'follow'
  | 'profile_open'
  | 'challenge_open'
  | 'search_click'
  | 'watch';

export type BehaviorEvent = {
  id: string;
  type: BehaviorType;
  contentId?: string;
  kind?: 'post' | 'challenge_memory';
  category?: string;
  creatorUsername?: string;
  score?: number;
  durationMs?: number;
  createdAt: string;
};

const events: BehaviorEvent[] = [];
const seen = new Set<string>();
const listeners = new Set<() => void>();

function emit() { listeners.forEach(listener => listener()); }

export function recordBehavior(input: Omit<BehaviorEvent, 'id' | 'createdAt'> & { dedupeKey?: string }) {
  const key = input.dedupeKey;
  if (key && seen.has(key)) return;
  if (key) seen.add(key);

  events.push({
    id: 'behavior-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    type: input.type,
    contentId: input.contentId,
    kind: input.kind,
    category: input.category,
    creatorUsername: input.creatorUsername,
    score: input.score,
    durationMs: input.durationMs,
    createdAt: new Date().toISOString(),
  });
  if (events.length > 1500) events.splice(0, events.length - 1500);
  emit();
}

export function getBehaviorEvents() { return [...events]; }

export function subscribeBehavior(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getInterestScore(category: string) {
  let score = 0;
  for (const event of events) {
    if (event.category !== category) continue;
    const ageHours = Math.max(0, (Date.now() - new Date(event.createdAt).getTime()) / 3600000);
    const decay = Math.max(0.15, 1 - ageHours / 168);
    const weights: Record<BehaviorType, number> = {
      impression: 0.05, view_start: 0.15, view_complete: 1.8, watch: 0.25,
      like: 2.5, unlike: -1.5, rate: 2.2, comment: 2.8, save: 3.5, unsave: -2,
      share: 3, follow: 2.5, unlike: -1.5, profile_open: 0.8, challenge_open: 1.5, search_click: 1.2,
    };
    score += (weights[event.type] ?? 0) * decay;
    if (event.durationMs) score += Math.min(event.durationMs / 30000, 3) * decay;
    if (event.score) score += (event.score / 10) * 1.2 * decay;
  }
  return score;
}

export function getCreatorAffinity(username: string) {
  let score = 0;
  for (const event of events) {
    if (event.creatorUsername !== username) continue;
    const ageHours = Math.max(0, (Date.now() - new Date(event.createdAt).getTime()) / 3600000);
    const decay = Math.max(0.15, 1 - ageHours / 168);
    if (event.type === 'profile_open') score += 1 * decay;
    if (event.type === 'like') score += 2 * decay;
    if (event.type === 'comment') score += 2.5 * decay;
    if (event.type === 'save') score += 3 * decay;
    if (event.type === 'share') score += 3 * decay;
    if (event.type === 'view_complete') score += 1.5 * decay;
  }
  return score;
}

export function getRecentContentIds(limit = 30) {
  return new Set(events.filter(event => event.contentId).slice(-limit).map(event => event.contentId as string));
}

export function useBehaviorVersion() {
  return useSyncExternalStore(subscribeBehavior, () => events.length, () => 0);
}
