'use client';

import { useSyncExternalStore } from 'react';

type Day = { key: string; actions: number };
const days: Day[] = [];
const listeners = new Set<() => void>();

function dayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}
function emit() { listeners.forEach(listener => listener()); }

function ensureToday() {
  const key = dayKey();
  if (!days.some(day => day.key === key)) days.push({ key, actions: 0 });
  return days.find(day => day.key === key)!;
}

export function recordDailyAction() {
  ensureToday().actions += 1;
  emit();
}

export function getMomentum() {
  ensureToday();
  const sorted = [...days].sort((a, b) => a.key.localeCompare(b.key));
  let streak = 0;
  let cursor = new Date();
  for (let i = sorted.length - 1; i >= 0; i--) {
    const expected = dayKey(cursor);
    if (sorted[i].key !== expected || sorted[i].actions === 0) break;
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  const today = days.find(day => day.key === dayKey());
  return { streak, todayActions: today?.actions ?? 0 };
}

export function subscribeMomentum(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useMomentumVersion() {
  return useSyncExternalStore(subscribeMomentum, () => days.reduce((sum, day) => sum + day.actions, 0), () => 0);
}
