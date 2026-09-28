'use client';

import { posts } from '@/data/mock';
import type { Post } from '@/types';

const listeners = new Set<() => void>();

export function publishPost(input: {
  caption: string;
  category: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  thumbnail?: string;
  tags: string[];
}) {
  const post: Post = {
    id: 'post-' + Date.now().toString(36),
    creator: {
      id: '1',
      username: 'you',
      displayName: 'You',
      avatar: 'https://picsum.photos/seed/you/200/200',
      bio: '',
      followers: 0,
      following: 0,
      isFollowing: false,
      averageRating: 0,
      ratingsCount: 0,
      joinedAt: new Date().toISOString(),
    },
    image: input.mediaType === 'image' ? input.mediaUrl : (input.thumbnail ?? input.mediaUrl),
    mediaType: input.mediaType,
    mediaUrl: input.mediaUrl,
    thumbnail: input.thumbnail,
    media: [{ type: input.mediaType, url: input.mediaUrl, thumbnail: input.thumbnail }],
    caption: input.caption,
    tags: input.tags,
    category: input.category,
    rating: 0,
    ratingCount: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    saves: 0,
    isLiked: false,
    isSaved: false,
    createdAt: new Date().toISOString(),
  };

  posts.unshift(post);
  listeners.forEach(listener => listener());
  return post;
}

export function subscribePublishedContent(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
