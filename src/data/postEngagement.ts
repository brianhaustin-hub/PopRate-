import { useSyncExternalStore } from 'react';
import { posts } from '@/data/mock';

type PostEngagement = {
  liked?: boolean;
  saved?: boolean;
  rating?: number;
  likes: number;
  saves: number;
  ratingCount: number;
  ratingAverage: number;
};

const state = new Map<string, PostEngagement>();
const listeners = new Set<() => void>();

for (const post of posts) {
  state.set(post.id, {
    liked: post.isLiked,
    saved: post.isSaved,
    likes: post.likes,
    saves: post.saves,
    ratingCount: post.ratingCount,
    ratingAverage: post.rating,
  });
}

function emit() { listeners.forEach((listener) => listener()); }

export function getPostEngagement(postId: string): PostEngagement {
  return state.get(postId) ?? {
    likes: 0, saves: 0, ratingCount: 0, ratingAverage: 0,
  };
}

export function usePostEngagement(postId: string) {
  return useSyncExternalStore(
    (listener) => { listeners.add(listener); return () => listeners.delete(listener); },
    () => getPostEngagement(postId),
    () => getPostEngagement(postId),
  );
}

export function toggleLike(postId: string) {
  const current = getPostEngagement(postId);
  const liked = !current.liked;
  state.set(postId, { ...current, liked, likes: Math.max(0, current.likes + (liked ? 1 : -1)) });
  emit();
}

export function toggleSave(postId: string) {
  const current = getPostEngagement(postId);
  const saved = !current.saved;
  state.set(postId, { ...current, saved, saves: Math.max(0, current.saves + (saved ? 1 : -1)) });
  emit();
}

export function ratePost(postId: string, score: number) {
  const current = getPostEngagement(postId);
  const previous = current.rating;
  const count = current.ratingCount;
  const nextCount = previous == null ? count + 1 : count;
  const nextAverage = previous == null
    ? ((current.ratingAverage * count) + score) / Math.max(nextCount, 1)
    : ((current.ratingAverage * count) - previous + score) / Math.max(count, 1);

  state.set(postId, {
    ...current,
    rating: score,
    ratingCount: nextCount,
    ratingAverage: Number(nextAverage.toFixed(1)),
  });
  emit();
}
