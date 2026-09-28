'use client';

import { users, posts } from '@/data/mock';
import { getFollowedUserIds, currentUser, isFollowing, toggleFollow as graphToggleFollow } from '@/data/socialGraph';
import { getCreatorAffinity } from '@/data/behaviorStore';

export type SuggestedUser = {
  user: (typeof users)[number];
  reason: 'because_you_follow' | 'popular_in_interest' | 'active_creator' | 'new_to_you';
  mutualCount: number;
  score: number;
};

export function getSuggestedPeople(limit = 8): SuggestedUser[] {
  const followed = getFollowedUserIds();
  const followedUsers = users.filter(user => followed.has(user.id));
  const followedCategories = new Map<string, number>();

  for (const post of posts) {
    if (followed.has(post.creator.id)) followedCategories.set(post.category, (followedCategories.get(post.category) ?? 0) + 1);
  }

  return users
    .filter(user => user.id !== currentUser.id && !followed.has(user.id))
    .map(user => {
      const userCategories = new Set(posts.filter(post => post.creator.id === user.id).map(post => post.category));
      const categoryMatch = [...userCategories].reduce((sum, category) => sum + (followedCategories.get(category) ?? 0), 0);
      const mutualCount = followedUsers.filter(other =>
        posts.some(post => post.creator.id === other.id && userCategories.has(post.category))
      ).length;
      const affinity = getCreatorAffinity(user.username);
      const score = categoryMatch * 2 + mutualCount * 1.5 + Math.log1p(user.followers) + affinity;
      const reason = categoryMatch > 0 ? 'because_you_follow' : affinity > 0 ? 'popular_in_interest' : user.ratingsCount > 3000 ? 'active_creator' : 'new_to_you';
      return { user, reason, mutualCount, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function followSuggestedPerson(userId: string) {
  if (isFollowing(userId)) return false;
  const user = users.find(item => item.id === userId);
  if (!user) return false;
  return graphToggleFollow(userId);
}
