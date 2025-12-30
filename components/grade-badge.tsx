import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Grade } from '@/lib/types';

interface GradeBadgeProps {
  grade: Grade;
}

export function GradeBadge({ grade }: GradeBadgeProps) {
  const colors: Record<Grade, string> = {
    'A': 'bg-green-500 hover:bg-green-600',
    'B': 'bg-lime-500 hover:bg-lime-600',
    'C': 'bg-yellow-500 hover:bg-yellow-600',
    'D': 'bg-orange-500 hover:bg-orange-600',
    'E': 'bg-red-500 hover:bg-red-600',
    'F': 'bg-red-700 hover:bg-red-800',
    'S': 'bg-gray-500 hover:bg-gray-600',
  };

  return (
    <Badge className={cn('text-white font-bold', colors[grade])}>
      {grade}
    </Badge>
  );
}
