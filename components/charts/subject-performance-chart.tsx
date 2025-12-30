'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface SubjectPerformanceChartProps {
  subjects: Array<{
    subject_name: string;
    gpa?: number;
    average: number;
    position?: number;
  }>;
  metric?: 'gpa' | 'average';
}

export function SubjectPerformanceChart({ subjects, metric = 'average' }: SubjectPerformanceChartProps) {
  const data = subjects
    .map((s) => ({
      name: s.subject_name,
      value: metric === 'gpa' ? (s.gpa || 0) : s.average,
      rank: s.position,
    }))
    .sort((a, b) => (metric === 'gpa' ? a.value - b.value : b.value - a.value));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart layout="vertical" data={data}>
        <XAxis type="number" domain={metric === 'gpa' ? [0, 5] : [0, 100]} />
        <YAxis type="category" dataKey="name" width={120} />
        <Tooltip
          formatter={(value: any) => [
            metric === 'gpa' ? value.toFixed(2) : `${value.toFixed(1)}%`,
            metric === 'gpa' ? 'GPA' : 'Average',
          ]}
        />
        <Bar dataKey="value" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
}
