'use client';

import { users, posts } from '@/data/mock';
import { getFollowedUserIds, currentUser, isFollowing, toggleFollow as graphToggleFollow } from '@/data/socialGraph';
import { getCreatorAffinity, getBehaviorEvents } from '@/data/behaviorStore';

export type SuggestedUser = {
  user: (typeof users)[number];
  reason: 'because_you_follow' | 'shared_interest' | 'active_creator' | 'new_to_you';
  mutualCount: number;
  score: number;
  signals: string[];
};

export function getSuggestedPeople(limit = 8): SuggestedUser[] {
  const followed = getFollowedUserIds();
  const followedUsers = users.filter(user => followed.has(user.id));
  const followedCategories = new Map<string, number>();

  for (const post of posts) {
    if (followed.has(post.creator.id)) {
      followedCategories.set(post.category, (followedCategories.get(post.category) ?? 0) + 1);
    }
  }

  const interactedCreators = new Set(
    getBehaviorEvents()
      .filter(event => event.type === 'like' || event.type === 'rate' || event.type === 'comment' || event.type === 'watch')
      .map(event => event.creatorUsername)
      .filter(Boolean)
  );

  return users
    .filter(user => user.id !== currentUser.id && !followed.has(user.id))
    .map(user => {
      const userCategories = new Set(posts.filter(post => post.creator.id === user.id).map(post => post.category));
      const categoryMatch = [...userCategories].reduce((sum, category) => sum + (followedCategories.get(category) ?? 0), 0);
      const mutualCount = followedUsers.filter(other =>
        posts.some(post => post.creator.id === other.id && userCategories.has(post.category))
      ).length;
      const affinity = getCreatorAffinity(user.username);
      const interacted = interactedCreators.has(user.username);
      const creatorActivity = Math.min(user.ratingsCount / 1500, 8);
      const score = categoryMatch * 2.5 + mutualCount * 2 + affinity * 2 + (interacted ? 6 : 0) + creatorActivity + Math.log1p(user.followers) * .35;

      const signals: string[] = [];
      if (interacted) signals.push('You interacted');
      if (categoryMatch > 0) signals.push('Matches your interests');
      if (mutualCount > 0) signals.push(mutualCount + ' shared interest' + (mutualCount === 1 ? '' : 's'));
      if (signals.length === 0 && user.ratingsCount > 3000) signals.push('Active creator');

      const reason = interacted ? 'shared_interest' : categoryMatch > 0 ? 'because_you_follow' : user.ratingsCount > 3000 ? 'active_creator' : 'new_to_you';
      return { user, reason, mutualCount, score, signals: signals.slice(0, 2) };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function followSuggestedPerson(userId: string) {
  if (isFollowing(userId)) return false;
  return Boolean(graphToggleFollow(userId));
}
