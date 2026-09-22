'use client';

import { useState } from 'react';
import { Post } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { formatNumber } from '@/lib/utils';
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import { cn } from '@/lib/cn';

interface PostCardProps {
  post: Post;
  onPress: () => void;
  index?: number;
}

export function PostCard({ post, onPress, index = 0 }: PostCardProps) {
  const [liked, setLiked] = useState(post.isLiked);
  const [likedCount, setLikedCount] = useState(post.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikedCount(liked ? likedCount - 1 : likedCount + 1);
  };

  return (
    <div
      onClick={onPress}
      className="bg-surface-900 rounded-2xl overflow-hidden border border-white/5 mb-4 cursor-pointer hover:border-white/10 transition-colors"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 pb-2">
        <Avatar src={post.creator.avatar} size="md" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-white truncate">{post.creator.displayName}</p>
          <p className="text-xs text-white/40">{post.creator.username}</p>
        </div>
        <Badge variant="accent">{post.category}</Badge>
      </div>

      {/* Image */}
      <div className="aspect-[3/4] relative overflow-hidden">
        <img
          src={post.image}
          alt={post.caption}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Caption */}
      <div className="px-4 py-3">
        <p className="text-sm text-white/90 leading-relaxed line-clamp-2">{post.caption}</p>
      </div>

      {/* Rating */}
      <div className="px-4 pb-3 flex items-center gap-2">
        <div className="flex items-center gap-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#f0554a" stroke="#f0554a">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="text-sm font-bold text-white">{post.rating}</span>
          <span className="text-xs text-white/40">({formatNumber(post.ratingCount)})</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 pb-4">
        <div className="flex items-center gap-4">
          <button onClick={(e) => { e.stopPropagation(); handleLike(); }}>
            <Heart
              size={22}
              className={cn(liked ? 'text-pop-500 fill-pop-500' : 'text-white/70')}
            />
          </button>
          <MessageCircle size={22} className="text-white/70" />
          <Send size={22} className="text-white/70" />
        </div>
        <button onClick={(e) => e.stopPropagation()}>
          <Bookmark
            size={22}
            className={cn(post.isSaved ? 'text-pop-500 fill-pop-500' : 'text-white/70')}
          />
        </button>
      </div>
    </div>
  );
}
