'use client';

import { cn } from '@/lib/cn';
import Image from 'next/image';

interface AvatarProps {
  src: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBadge?: boolean;
}

const sizeMap = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
  xl: 'w-20 h-20',
};

export function Avatar({ src, alt = '', size = 'md', className, showBadge }: AvatarProps) {
  return (
    <div className={cn('relative flex-shrink-0', sizeMap[size], className)}>
      <div className={cn('rounded-full overflow-hidden border border-white/20', sizeMap[size])}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={`${sizeMap[size].replace('w-', '').replace('h-', '')}px`}
        />
      </div>
      {showBadge && (
        <div className="absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-surface-950 bg-pop-500" style={{ width: size === 'xs' ? 10 : size === 'sm' ? 12 : size === 'md' ? 14 : size === 'lg' ? 18 : 22, height: size === 'xs' ? 10 : size === 'sm' ? 12 : size === 'md' ? 14 : size === 'lg' ? 18 : 22 }} />
      )}
    </div>
  );
}
