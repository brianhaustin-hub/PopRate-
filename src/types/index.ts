export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  isFollowing: boolean;
  averageRating: number;
  ratingsCount: number;
  joinedAt: string;
}

export interface Post {
  id: string;
  creator: User;
  image: string;
  caption: string;
  tags: string[];
  category: string;
  rating: number;
  ratingCount: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
  battleId?: string;
}

export interface Rating {
  id: string;
  userId: string;
  postId: string;
  value: number;
  createdAt: string;
}

export interface Battle {
  id: string;
  a: {
    id: string;
    image: string;
    title: string;
    creator: User;
  };
  b: {
    id: string;
    image: string;
    title: string;
    creator: User;
  };
  votesA: number;
  votesB: number;
  totalVotes: number;
  isActive: boolean;
  createdAt: string;
}

export interface BattleVote {
  id: string;
  userId: string;
  battleId: string;
  votedFor: 'a' | 'b';
  createdAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  image: string;
  participants: number;
  entries: Post[];
  isActive: boolean;
  endsAt: string;
  category: string;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'rating' | 'battle_result' | 'mention' | 'trending' | 'challenge';
  title: string;
  message: string;
  image?: string;
  timestamp: string;
  read: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  user: User;
  postId: string;
  text: string;
  likes: number;
  createdAt: string;
}

export type FeedTab = 'forYou' | 'following' | 'battles' | 'challenges';
export type DiscoverTab = 'trending' | 'rising' | 'creators' | 'categories' | 'challenges';
export type SearchTab = 'people' | 'creators' | 'posts' | 'categories' | 'hashtags';
export type ProfileTab = 'posts' | 'ratings' | 'battles' | 'saved';
