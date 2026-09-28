import { posts } from '@/data/mock';
import { getChallengeMemories, type ChallengeMemory } from '@/data/challengeMemories';
import type { Post } from '@/types';
import { getFollowedUserIds } from '@/data/socialGraph';
import { getCreatorAffinity, getInterestScore, getRecentContentIds } from '@/data/behaviorStore';

export type ContentKind = 'post' | 'challenge_memory';

export type UnifiedContent = {
  id: string;
  kind: ContentKind;
  createdAt: string;
  category: string;
  title: string;
  caption: string;
  image: string;
  media: {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
  }[];
  creator: {
    name: string;
    username: string;
    avatar: string;
  };
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  rating: number;
  ratingCount: number;
  expiresAt?: string;
  challengeId?: string;
};

function postToContent(post: Post): UnifiedContent {
  const media = post.media?.length
    ? post.media
    : [{
        type: post.mediaType ?? 'image',
        url: post.mediaUrl ?? post.image,
        thumbnail: post.thumbnail,
      }];

  return {
    id: post.id,
    kind: 'post',
    createdAt: post.createdAt,
    category: post.category,
    title: post.creator.displayName,
    caption: post.caption,
    image: post.image,
    media,
    creator: {
      name: post.creator.displayName,
      username: post.creator.username,
      avatar: post.creator.avatar,
    },
    likes: post.likes,
    comments: post.comments,
    shares: post.shares,
    saves: post.saves,
    rating: post.rating,
    ratingCount: post.ratingCount,
    challengeId: post.challengeId,
  };
}

function memoryToContent(memory: ChallengeMemory): UnifiedContent {
  const totalVotes = memory.votesA + memory.votesB;
  return {
    id: memory.id,
    kind: 'challenge_memory',
    createdAt: memory.publishedAt,
    category: memory.category,
    title: memory.title,
    caption: 'Finished challenge memory · the crowd has decided.',
    image: memory.creatorMedia.url,
    media: [memory.creatorMedia, memory.opponentMedia],
    creator: {
      name: memory.creatorName,
      username: memory.creatorUsername,
      avatar: memory.creatorImage,
    },
    likes: memory.likes,
    comments: memory.comments.length,
    shares: memory.shares,
    saves: memory.saves,
    rating: totalVotes ? Number(((memory.votesA / totalVotes) * 10).toFixed(1)) : 0,
    ratingCount: totalVotes,
    expiresAt: memory.expiresAt,
    challengeId: memory.challengeId,
  };
}

export function getUnifiedContent(id: string): UnifiedContent | null {
  const memory = getChallengeMemories().find((item) => item.id === id);
  if (memory) return memoryToContent(memory);

  const post = posts.find((item) => item.id === id);
  return post ? postToContent(post) : null;
}

export function getUnifiedFeed(): UnifiedContent[] {
  const normalPosts = posts.map(postToContent);
  const memories = getChallengeMemories()
    .filter((memory) => memory.placement === 'profile_and_feed')
    .map(memoryToContent);

  const followed = getFollowedUserIds();
  const recent = getRecentContentIds(24);
  const score = (content: UnifiedContent) => {
    const creatorId = posts.find(post => post.id === content.id)?.creator.id;
    const ageHours = Math.max(0, (Date.now() - new Date(content.createdAt).getTime()) / 3600000);
    const engagement = content.likes + content.comments * 2 + content.saves * 3 + content.shares * 2;
    const freshness = Math.max(0, 48 - ageHours) / 48;
    const relationship = creatorId && followed.has(creatorId) ? 7 : 0;
    const interest = Math.min(Math.max(getInterestScore(content.category), -3), 8);
    const creatorAffinity = Math.min(getCreatorAffinity(content.creator.username), 5);
    const ratingSignal = content.ratingCount ? Math.min(content.rating / 10, 1) * 3 : 0;
    const seenPenalty = recent.has(content.id) ? -2.5 : 0;
    const exploration = content.ratingCount === 0 ? 0.8 : 0;
    return relationship + interest + creatorAffinity + freshness * 5 + Math.log1p(engagement) * 1.5 + ratingSignal + seenPenalty + exploration;
  };
  return [...memories, ...normalPosts].sort((a, b) => score(b) - score(a));
}

export function getUnifiedProfileContent(): UnifiedContent[] {
  const normalPosts = posts.map(postToContent);
  const memories = getChallengeMemories().map(memoryToContent);

  return [...memories, ...normalPosts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function getUnifiedVideos(): UnifiedContent[] {
  return getUnifiedFeed().filter((content) =>
    content.media.some((media) => media.type === 'video'),
  );
}
