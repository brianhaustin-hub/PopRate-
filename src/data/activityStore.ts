'use client';

import { notifications as seedNotifications, users } from '@/data/mock';
import type { Notification } from '@/types';

const listeners = new Set<() => void>();
const events: Notification[] = [];

function emit() { listeners.forEach(listener => listener()); }

export function getActivity() {
  return [...events, ...seedNotifications].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
}

export function subscribeActivity(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function markActivityRead(id: string) {
  const item = events.find(event => event.id === id);
  if (!item) return;
  item.read = true;
  emit();
}

export function markAllActivityRead() {
  for (const item of events) item.read = true;
  emit();
}

export function addActivity(input: {
  type: Notification['type'];
  title: string;
  message: string;
  image?: string;
  href?: string;
}) {
  const item: Notification = {
    id: 'activity-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    type: input.type,
    title: input.title,
    message: input.message,
    image: input.image ?? users[0].avatar,
    href: input.href,
    timestamp: new Date().toISOString(),
    read: false,
  };
  events.unshift(item);
  emit();
  return item;
}
