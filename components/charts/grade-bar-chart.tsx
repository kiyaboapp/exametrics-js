'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { GRADE_COLORS, GRADE_ORDER } from '@/lib/constants';
import type { Grade } from '@/lib/types';

interface GradeBarChartProps {
  data: Record<Grade, number>;
}

export function GradeBarChart({ data }: GradeBarChartProps) {
  const chartData = GRADE_ORDER.map((grade) => ({
    grade,
    count: data[grade] || 0,
    fill: GRADE_COLORS[grade],
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="grade" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count">
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
