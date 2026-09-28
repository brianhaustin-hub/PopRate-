'use client';

import { useSyncExternalStore } from 'react';
import { users } from '@/data/mock';
import { recordBehavior } from '@/data/behaviorStore';
import { addActivity } from '@/data/activityStore';

const currentUserId = '1';
const followed = new Set<string>(users.filter(user => user.isFollowing).map(user => user.id));
const listeners = new Set<() => void>();
let version = 0;

function emit() {
  version += 1;
  listeners.forEach(listener => listener());
}

export function isFollowing(userId: string) {
  return userId !== currentUserId && followed.has(userId);
}

export function getFollowingCount() {
  return followed.size;
}

export function getFollowerCount(userId = currentUserId) {
  return users.find(user => user.id === userId)?.followers ?? 0;
}

export function getFollowedUserIds() {
  return new Set(followed);
}

export function getFollowedUsernames() {
  return new Set(users.filter(user => followed.has(user.id)).map(user => user.username));
}

export function toggleFollow(userId: string) {
  if (userId === currentUserId) return false;

  const user = users.find(item => item.id === userId);
  if (!user) return false;

  const wasFollowing = followed.has(userId);
  if (wasFollowing) followed.delete(userId);
  else followed.add(userId);

  const next = followed.has(userId);
  recordBehavior({
    type: next ? 'follow' : 'unfollow',
    contentId: user.id,
    creatorUsername: user.username,
  });

  if (next) {
    addActivity({
      type: 'follow',
      title: 'You followed ' + user.displayName,
      message: 'Their PopRates will shape your feed.',
      image: user.avatar,
      href: '/user/' + user.username,
    });
  }

  emit();
  return next;
}

export function subscribeSocialGraph(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSocialGraphVersion() {
  return useSyncExternalStore(subscribeSocialGraph, () => version, () => 0);
}

export const currentUser = users.find(user => user.id === currentUserId) ?? users[0];
