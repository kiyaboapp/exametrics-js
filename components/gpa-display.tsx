'use client';

import { formatGPA } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface GPADisplayProps {
  value: number | null | undefined;
  className?: string;
  decimals?: number;
}

export function GPADisplay({ value, className, decimals = 4 }: GPADisplayProps) {
  const formatted = formatGPA(value, decimals);
  
  return (
    <span className={cn('font-mono', className)}>
      {formatted}
    </span>
  );
}
