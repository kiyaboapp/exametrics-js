'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DIVISION_COLORS, DIVISION_ORDER } from '@/lib/constants';
import type { Division } from '@/lib/types';

interface DivisionPieChartProps {
  data: Record<Division, number> | Record<Division, { count: number; percentage: number }>;
}

export function DivisionPieChart({ data }: DivisionPieChartProps) {
  const chartData = DIVISION_ORDER.filter(div => div !== 'INC' && div !== 'ABS')
    .map((division) => {
      const value = typeof data[division] === 'number' 
        ? data[division] 
        : (data[division] as { count: number })?.count || 0;
      
      return {
        name: `Division ${division}`,
        value,
        fill: DIVISION_COLORS[division],
      };
    })
    .filter(item => item.value > 0);

  if (chartData.length === 0) {
    return <div className="flex items-center justify-center h-[300px] text-muted-foreground">No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          dataKey="value"
          label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(1)}%)`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
