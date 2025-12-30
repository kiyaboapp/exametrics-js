import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AverageMarksCardProps {
  value: number;
  label?: string;
}

export function AverageMarksCard({ value, label = 'Average Marks' }: AverageMarksCardProps) {
  const getColor = (avg: number) => {
    if (avg >= 70) return 'from-green-500 to-green-600';
    if (avg >= 50) return 'from-blue-500 to-blue-600';
    if (avg >= 35) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const getLabel = (avg: number) => {
    if (avg >= 70) return '🏆 Excellent';
    if (avg >= 50) return '✅ Good';
    if (avg >= 35) return '⚠️ Pass';
    return '❌ Fail';
  };

  return (
    <Card className={cn('bg-gradient-to-r', getColor(value), 'text-white border-0')}>
      <CardContent className="p-6">
        <div className="text-sm font-medium opacity-80">{label}</div>
        <div className="text-5xl font-bold mt-2">{value.toFixed(1)}%</div>
        <div className="text-sm opacity-80 mt-1">{getLabel(value)}</div>
      </CardContent>
    </Card>
  );
}
