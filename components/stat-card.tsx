import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  trend?: number;
  iconColor?: string;
}

export function StatCard({ icon: Icon, value, label, trend, iconColor = 'text-primary' }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className={`text-2xl sm:text-3xl ${iconColor}`}>
            <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
          </div>
          {trend !== undefined && (
            <span className={`text-xs sm:text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
        </div>
        <div className="text-2xl sm:text-3xl font-bold mt-2 sm:mt-4">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div className="text-xs sm:text-sm text-muted-foreground mt-1">{label}</div>
      </CardContent>
    </Card>
  );
}
