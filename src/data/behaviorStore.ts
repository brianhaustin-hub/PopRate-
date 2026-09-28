'use client';

import { useSyncExternalStore } from 'react';
import { recordDailyAction } from '@/data/retentionStore';

export type BehaviorType =
  | 'impression' | 'view_start' | 'view_complete' | 'like' | 'unlike' | 'rate'
  | 'comment' | 'save' | 'unsave' | 'share' | 'follow' | 'unfollow'
  | 'profile_open' | 'challenge_open' | 'search_click' | 'watch';

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

const weights: Record<BehaviorType, number> = {
  impression: .05, view_start: .15, view_complete: 1.8, watch: .25,
  like: 2.5, unlike: -1.5, rate: 2.2, comment: 2.8, save: 3.5, unsave: -2,
  share: 3, follow: 2.5, unfollow: -1.5, profile_open: .8, challenge_open: 1.5, search_click: 1.2,
};

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
  recordDailyAction();
  emit();
}

export function getBehaviorEvents() { return [...events]; }

export function subscribeBehavior(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function decayed(event: BehaviorEvent) {
  const ageHours = Math.max(0, (Date.now() - new Date(event.createdAt).getTime()) / 3600000);
  return Math.max(.15, 1 - ageHours / 168);
}

export function getInterestScore(category: string) {
  return events.reduce((score, event) => {
    if (event.category !== category) return score;
    return score + (weights[event.type] ?? 0) * decayed(event);
  }, 0);
}

export function getCreatorAffinity(username: string) {
  return events.reduce((score, event) => {
    if (event.creatorUsername !== username) return score;
    const action = event.type === 'comment' ? 2.5
      : event.type === 'save' || event.type === 'share' ? 3
      : event.type === 'like' ? 2
      : event.type === 'view_complete' ? 1.5
      : event.type === 'profile_open' ? 1
      : 0;
    return score + action * decayed(event);
  }, 0);
}

export function getContentAffinity(contentId: string) {
  return events.reduce((score, event) => {
    if (event.contentId !== contentId) return score;
    const depth = event.durationMs ? Math.min(event.durationMs / 20000, 3) : 0;
    return score + ((weights[event.type] ?? 0) + depth) * decayed(event);
  }, 0);
}

export function getRecentContentIds(limit = 30) {
  return new Set(events.filter(event => event.contentId).slice(-limit).map(event => event.contentId as string));
}

export function useBehaviorVersion() {
  return useSyncExternalStore(subscribeBehavior, () => events.length, () => 0);
}
