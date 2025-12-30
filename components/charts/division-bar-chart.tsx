'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DIVISION_COLORS, DIVISION_ORDER } from '@/lib/constants';
import type { Division } from '@/lib/types';

interface DivisionBarChartProps {
  data: Record<Division, number> | Record<Division, { count: number; percentage: number }>;
}

export function DivisionBarChart({ data }: DivisionBarChartProps) {
  const chartData = DIVISION_ORDER.filter(div => div !== 'INC' && div !== 'ABS')
    .map((division) => {
      const item = data[division];
      const count = typeof item === 'number' ? item : item?.count || 0;
      const percentage = typeof item === 'object' ? item?.percentage || 0 : 0;
      
      return {
        division,
        count,
        percentage,
      };
    });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="division" />
        <YAxis />
        <Tooltip
          formatter={(value: any, name: any, props: any) => [
            `${value} students${props.payload.percentage ? ` (${props.payload.percentage.toFixed(1)}%)` : ''}`,
            `Division ${props.payload.division}`,
          ]}
        />
        <Bar dataKey="count">
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={DIVISION_COLORS[entry.division]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
