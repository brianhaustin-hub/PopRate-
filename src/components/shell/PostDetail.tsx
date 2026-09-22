'use client';

import { useState } from 'react';
import { Post } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RatingSlider } from '@/components/rating/RatingSlider';
import { RatingResult } from '@/components/rating/RatingResult';
import { formatNumber } from '@/lib/utils';
import { Heart, MessageCircle, Send, Bookmark, Star, ArrowRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/cn';

interface PostDetailProps {
  post: Post;
  onClose: () => void;
  onRate: (value: number) => void;
}

export function PostDetail({ post, onClose, onRate }: PostDetailProps) {
  const [rated, setRated] = useState(false);
  const [liked, setLiked] = useState(post.isLiked);
  const [likedCount, setLikedCount] = useState(post.likes);
  const [saved, setSaved] = useState(post.isSaved);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikedCount(liked ? likedCount - 1 : likedCount + 1);
  };

  const handleRate = (value: number) => {
    setRated(true);
    onRate(value);
  };

  return (
    <div className="fixed inset-0 z-50 bg-surface-950 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-3 p-4 bg-surface-950/95 backdrop-blur-xl">
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-surface-800 flex items-center justify-center">
          <ChevronLeft size={20} className="text-white" />
        </button>
        <Avatar src={post.creator.avatar} size="md" />
        <div className="flex-1">
          <p className="font-semibold text-sm text-white">{post.creator.displayName}</p>
          <p className="text-xs text-white/40">{post.creator.username}</p>
        </div>
        <Badge variant="accent">{post.category}</Badge>
      </div>

      {/* Image */}
      <div className="aspect-[3/4] relative">
        <img src={post.image} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Caption */}
        <div>
          <p className="font-semibold text-white text-sm mb-1">{post.creator.displayName}</p>
          <p className="text-sm text-white/80 leading-relaxed">{post.caption}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button onClick={handleLike}>
            <Heart size={24} className={cn(liked ? 'text-pop-500 fill-pop-500' : 'text-white/70')} />
          </button>
          <button onClick={() => setShowComments(!showComments)}>
            <MessageCircle size={24} className="text-white/70" />
          </button>
          <Send size={24} className="text-white/70" />
          <button onClick={() => setSaved(!saved)}>
            <Bookmark size={24} className={cn(saved ? 'text-pop-500 fill-pop-500' : 'text-white/70')} />
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-white/60">
          <span>{formatNumber(likedCount)} likes</span>
          <span>{formatNumber(post.comments)} comments</span>
          <span>{formatNumber(post.shares)} shares</span>
        </div>

        {/* Rating Section */}
        {!rated ? (
          <div className="bg-surface-900 rounded-2xl p-6 border border-white/5">
            <h3 className="text-lg font-semibold text-white mb-4">Rate this post</h3>
            <RatingSlider onRate={handleRate} />
            <p className="text-xs text-white/30 text-center mt-3">Tap a number to rate</p>
          </div>
        ) : (
          <div>
            <RatingResult
              yourRating={post.rating}
              communityRating={post.rating}
              ratingCount={post.ratingCount}
            />
            <div className="mt-4 flex gap-3">
              <Button variant="primary" className="flex-1" onClick={() => {}}>
                React
              </Button>
              <Button variant="secondary" className="flex-1" onClick={() => setShowComments(!showComments)}>
                Comment
              </Button>
              <Button variant="secondary" onClick={() => {}}>
                <Send size={20} />
              </Button>
            </div>
            <Button variant="ghost" className="w-full mt-3" onClick={() => {}}>
              Next Post <ArrowRight size={16} className="ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
