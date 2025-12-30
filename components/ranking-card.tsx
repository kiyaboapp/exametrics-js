import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface RankingCardProps {
  position: number;
  outOf: number;
  label: string;
  icon?: string;
}

export function RankingCard({ position, outOf, label, icon = '🏆' }: RankingCardProps) {
  const percentage = ((position / outOf) * 100).toFixed(0);
  const isTopTen = position / outOf <= 0.1;

  return (
    <Card className={cn(isTopTen ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800' : '')}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{icon}</span>
          <span>{label}</span>
        </div>
        <div className="text-2xl font-bold mt-2">
          {position}
          <span className="text-lg text-muted-foreground">/{outOf}</span>
        </div>
        <div className="text-sm text-muted-foreground">Top {percentage}%</div>
      </CardContent>
    </Card>
  );
}
