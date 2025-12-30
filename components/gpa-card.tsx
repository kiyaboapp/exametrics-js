import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GPACardProps {
  value: number;
  label?: string;
}

export function GPACard({ value, label = 'School GPA' }: GPACardProps) {
  const getGPAColor = (gpa: number) => {
    if (gpa <= 2.0) return 'from-green-500 to-green-600';
    if (gpa <= 3.0) return 'from-blue-500 to-blue-600';
    if (gpa <= 4.0) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const getGPALabel = (gpa: number) => {
    if (gpa <= 2.0) return '🏆 Excellent';
    if (gpa <= 3.0) return '✅ Good';
    if (gpa <= 4.0) return '⚠️ Average';
    return '❌ Below Average';
  };

  return (
    <Card className={cn('bg-gradient-to-r', getGPAColor(value), 'text-white border-0')}>
      <CardContent className="p-6">
        <div className="text-sm font-medium opacity-80">{label}</div>
        <div className="text-5xl font-bold mt-2">{value.toFixed(2)}</div>
        <div className="text-sm opacity-80 mt-1">{getGPALabel(value)}</div>
      </CardContent>
    </Card>
  );
}
