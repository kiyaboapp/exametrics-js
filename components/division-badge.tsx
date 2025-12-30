import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Division } from '@/lib/types';

interface DivisionBadgeProps {
  division: Division;
}

export function DivisionBadge({ division }: DivisionBadgeProps) {
  const colors: Record<Division, string> = {
    'I': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-400',
    'II': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-400',
    'III': 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400',
    'IV': 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950 dark:text-orange-400',
    '0': 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-400',
    'INC': 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400',
    'ABS': 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-500',
  };

  return (
    <Badge variant="outline" className={cn('font-medium', colors[division])}>
      Division {division}
    </Badge>
  );
}
