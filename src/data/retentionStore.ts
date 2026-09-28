'use client';

import { useSyncExternalStore } from 'react';

type Day = { key: string; actions: number };
const days: Day[] = [];
const listeners = new Set<() => void>();

function dayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
}

function emit() {
  listeners.forEach(listener => listener());
}

function ensureToday() {
  const key = dayKey();
  const existing = days.find(day => day.key === key);
  if (existing) return existing;
  const created = { key, actions: 0 };
  days.push(created);
  return created;
}

export function recordDailyAction() {
  ensureToday().actions += 1;
  emit();
}

export function getMomentum() {
  ensureToday();
  const todayKey = dayKey();
  let streak = 0;
  let streakCursor = new Date();

  while (true) {
    const key = dayKey(streakCursor);
    const day = days.find(item => item.key === key);
    if (!day || day.actions === 0) break;
    streak += 1;
    streakCursor.setDate(streakCursor.getDate() - 1);
  }

  const today = days.find(day => day.key === todayKey);
  return { streak, todayActions: today?.actions ?? 0 };
}

export function subscribeMomentum(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useMomentumVersion() {
  return useSyncExternalStore(
    subscribeMomentum,
    () => days.reduce((sum, day) => sum + day.actions, 0),
    () => 0,
  );
}
