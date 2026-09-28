'use client';

import { useSyncExternalStore } from 'react';
import { comments } from '@/data/mock';
import { addChallengeMemoryComment, getChallengeMemory, subscribeChallengeMemories } from '@/data/challengeMemories';
import { posts } from '@/data/mock';
import { recordBehavior } from '@/data/behaviorStore';
import { addActivity } from '@/data/activityStore';

export type ContentComment = {
  id: string;
  author: { displayName: string; username: string; avatar: string };
  text: string;
  createdAt: string;
  likes: number;
  sticker?: string;
  liked?: boolean;
  parentId?: string;
  replies?: number;
};

const state = new Map<string, ContentComment[]>();
const listeners = new Set<() => void>();
const commentLikes = new Map<string, boolean>();
const replyCounts = new Map<string, number>();

for (const comment of comments) {
  const list = state.get(comment.postId) ?? [];
  list.push({
    id: comment.id,
    author: {
      displayName: comment.user.displayName,
      username: comment.user.username,
      avatar: comment.user.avatar,
    },
    text: comment.text,
    createdAt: comment.createdAt,
    likes: comment.likes,
  });
  state.set(comment.postId, list);
}

function emit() {
  listeners.forEach((listener) => listener());
}

const STICKERS = ['😂','🔥','😭','😍','👏','💀','❤️','😮','🤯','🫶','✨','👀'];

function decorate(comment: ContentComment): ContentComment {
  return { ...comment, liked: Boolean(commentLikes.get(comment.id)), replies: replyCounts.get(comment.id) ?? comment.replies ?? 0 };
}

function getList(contentId: string, kind: 'post' | 'challenge_memory') {
  if (kind === 'challenge_memory') {
    const memory = getChallengeMemory(contentId);
    return memory?.comments.map((raw, index) => {
      const sticker = STICKERS.find((candidate) => raw.startsWith(candidate + ' '));
      return decorate({
        id: `memory-comment-${contentId}-${index}`,
        author: { displayName: 'PopRate user', username: 'poprate_user', avatar: 'https://picsum.photos/seed/poprate-user/100/100' },
        text: sticker ? raw.slice(sticker.length + 1) : raw,
        sticker,
        createdAt: new Date().toISOString(),
        likes: 0,
      });
    }) ?? [];
  }
  return (state.get(contentId) ?? []).map(decorate);
}

export function subscribeContentComments(listener: () => void) {
  listeners.add(listener);
  const unsubscribeMemory = subscribeChallengeMemories(listener);
  return () => {
    listeners.delete(listener);
    unsubscribeMemory();
  };
}

export function useContentComments(contentId: string, kind: 'post' | 'challenge_memory' = 'post') {
  return useSyncExternalStore(
    subscribeContentComments,
    () => getList(contentId, kind),
    () => getList(contentId, kind),
  );
}

export function addPostComment(postId: string, text: string, sticker?: string, parentId?: string) {
  const value = text.trim();
  if (!value) return;
  const list = state.get(postId) ?? [];
  list.push({
    id: `comment-${postId}-${Date.now()}`,
    author: { displayName: 'You', username: 'you', avatar: 'https://picsum.photos/seed/me/100/100' },
    text: value,
    sticker,
    createdAt: new Date().toISOString(),
    likes: 0,
    parentId,
  });
  state.set(postId, list);
  if (parentId) replyCounts.set(parentId, (replyCounts.get(parentId) ?? 0) + 1);
  const post = posts.find((item) => item.id === postId);
  if (post) post.comments = list.length;
  recordBehavior({
    type: 'comment',
    contentId: postId,
    kind: 'post',
    category: post?.category,
    creatorUsername: post?.creator.username,
  });
  if (post) {
    addActivity({
      type: 'comment',
      title: 'You commented on ' + post.creator.displayName + "'s PopRate",
      message: value,
      image: post.creator.avatar,
      href: '/post/' + postId,
    });
  }
  emit();
  return list[list.length - 1];
}

export function toggleCommentLike(contentId: string, kind: 'post' | 'challenge_memory', commentId: string) {
  const next = !commentLikes.get(commentId);
  commentLikes.set(commentId, next);
  if (kind === 'post') {
    const list = state.get(contentId) ?? [];
    const item = list.find((comment) => comment.id === commentId);
    if (item) item.likes = Math.max(0, item.likes + (next ? 1 : -1));
  }
  emit();
  return next;
}

export function addUnifiedComment(
  contentId: string,
  kind: 'post' | 'challenge_memory',
  text: string,
  sticker?: string,
  parentId?: string,
) {
  const value = text.trim();
  if (!value) return null;

  if (kind === 'challenge_memory') {
    const memory = getChallengeMemory(contentId);
    if (!memory) return null;
    const updated = addChallengeMemoryComment(contentId, sticker ? sticker + ' ' + value : value);
    if (!updated) return null;
    recordBehavior({
      type: 'comment',
      contentId: updated.id,
      kind: 'challenge_memory',
      category: updated.category,
      creatorUsername: updated.creatorUsername,
    });
    addActivity({
      type: 'comment',
      title: 'You commented on a challenge memory',
      message: value,
      image: updated.creatorImage,
      href: '/post/' + updated.id,
    });
    return updated;
  }

  return addPostComment(contentId, value, sticker, parentId);
}
