export interface User {
  id: string; username: string; displayName: string; avatar: string; bio: string;
  followers: number; following: number; isFollowing: boolean; averageRating: number;
  ratingsCount: number; joinedAt: string;
}
export type ChallengeStatus = 'draft'|'waiting_for_opponent'|'opponent_invited'|'opponent_joined'|'ready'|'live'|'voting_closed'|'result'|'declined'|'cancelled'|'expired';
export type ChallengeVisibility = 'direct'|'open';
export interface ChallengeSide { user: User; image: string; mediaType?: 'image' | 'video'; mediaUrl?: string; thumbnail?: string; caption?: string; }
export interface Challenge {
  id: string; title: string; description: string; image: string; participants: number; entries: Post[];
  isActive: boolean; endsAt: string; category: string; status?: ChallengeStatus;
  visibility?: ChallengeVisibility; creator?: User; opponent?: User | null;
  creatorSide?: ChallengeSide; opponentSide?: ChallengeSide | null; shareCode?: string;
  votesA?: number; votesB?: number; totalVotes?: number;
}
export interface PostMedia { type: 'image' | 'video'; url: string; thumbnail?: string; duration?: number; }
export interface Post {
  id: string; creator: User; image: string; mediaType?: 'image' | 'video'; mediaUrl?: string; thumbnail?: string; media?: PostMedia[]; caption: string; tags: string[]; category: string;
  rating: number; ratingCount: number; likes: number; comments: number; shares: number; saves: number;
  isLiked: boolean; isSaved: boolean; createdAt: string; battleId?: string; challengeId?: string;
}
export interface Rating { id:string; userId:string; postId:string; value:number; createdAt:string; }
export interface Battle {
  id:string; a:{id:string;image:string;title:string;creator:User}; b:{id:string;image:string;title:string;creator:User};
  votesA:number; votesB:number; totalVotes:number; isActive:boolean; createdAt:string;
}
export interface BattleVote { id:string; userId:string; battleId:string; votedFor:'a'|'b'; createdAt:string; }
export interface Notification {
  id:string; type:'like'|'comment'|'follow'|'rating'|'battle_result'|'mention'|'trending'|'challenge';
  title:string; message:string; image?:string; timestamp:string; read:boolean;
}
export interface Comment { id:string; userId:string; user:User; postId:string; text:string; likes:number; createdAt:string; }
export type FeedTab='forYou'|'following'|'battles'|'challenges';
export type DiscoverTab='trending'|'rising'|'creators'|'categories'|'challenges';
export type SearchTab='people'|'creators'|'posts'|'categories'|'hashtags';
export type ProfileTab='posts'|'ratings'|'battles'|'saved';
