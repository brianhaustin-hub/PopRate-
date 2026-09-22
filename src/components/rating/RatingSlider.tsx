'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/cn';
import { getRatingColor } from '@/lib/utils';

interface RatingSliderProps {
  onRate: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export function RatingSlider({ onRate, size = 'lg' }: RatingSliderProps) {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const activeValue = hoveredValue ?? selectedValue;

  const handleSelect = useCallback((value: number) => {
    setSelectedValue(value);
    onRate(value);
  }, [onRate]);

  return (
    <div className="flex items-center gap-1">
      {values.map((value) => {
        const isActive = activeValue === value;
        const color = getRatingColor(value);
        const isHigh = value >= 8;
        const isMid = value >= 5 && value < 8;
        const isLow = value < 5;

        let barColor = 'rgba(255,255,255,0.1)';
        if (isActive) {
          barColor = color;
        } else if (isHigh) {
          barColor = 'rgba(240, 85, 74, 0.2)';
        } else if (isMid) {
          barColor = 'rgba(245, 158, 11, 0.15)';
        } else {
          barColor = 'rgba(255,255,255,0.05)';
        }

        const height = size === 'sm' ? 24 : size === 'md' ? 36 : 48;

        return (
          <button
            key={value}
            className="flex flex-col items-center gap-1 cursor-pointer"
            onMouseEnter={() => setHoveredValue(value)}
            onMouseLeave={() => setHoveredValue(null)}
            onClick={() => handleSelect(value)}
          >
            <div
              className="w-full rounded-t-md transition-all duration-200"
              style={{
                height: isActive ? height : height * 0.5,
                backgroundColor: barColor,
                boxShadow: isActive ? `0 0 12px ${color}40` : 'none',
              }}
            />
            <span
              className={cn(
                'text-[10px] font-bold',
                isActive ? 'text-white' : 'text-white/30'
              )}
            >
              {value}
            </span>
          </button>
        );
      })}
    </div>
  );
}
