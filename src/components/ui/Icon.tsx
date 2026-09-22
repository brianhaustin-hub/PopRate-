'use client';

import { cn } from '@/lib/cn';
import { LucideIcon } from 'lucide-react';

interface IconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
  color?: string;
}

export function Icon({ icon: Icon, size = 20, className, color }: IconProps) {
  return <Icon size={size} className={cn(className)} color={color} />;
}
