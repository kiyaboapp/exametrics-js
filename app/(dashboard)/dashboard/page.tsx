'use client';

import { useExamStats } from '@/lib/hooks';
import { StatCard } from '@/components/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, CheckCircle, Calendar, Clock, FileCheck } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { EXAM_LEVELS } from '@/lib/constants';

export default function DashboardPage() {
  const { data: stats, isLoading } = useExamStats();

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  if (!stats) {
    return <div className="flex items-center justify-center h-full">No data available</div>;
  }

  const activeInactiveData = [
    { name: 'Active', value: stats.active_exams, fill: '#22c55e' },
    { name: 'Inactive', value: stats.total_exams - stats.active_exams, fill: '#ef4444' },
  ];

  const processingStatusData = [
    { name: 'Processed', value: stats.processed_exams, fill: '#22c55e' },
    { name: 'Pending', value: stats.pending_exams, fill: '#eab308' },
    { name: 'No Students', value: stats.no_students_exams, fill: '#6b7280' },
    { name: 'No Marks', value: stats.no_marks_exams, fill: '#3b82f6' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of examination management system</p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={BookOpen}
          value={stats.total_exams}
          label="Total Exams"
          iconColor="text-blue-500"
        />
        <StatCard
          icon={CheckCircle}
          value={stats.active_exams}
          label="Active Exams"
          iconColor="text-green-500"
        />
        <StatCard
          icon={Calendar}
          value={stats.this_month_exams}
          label="This Month"
          iconColor="text-purple-500"
        />
        <StatCard
          icon={Clock}
          value={stats.pending_exams}
          label="Pending Process"
          iconColor="text-yellow-500"
        />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Active vs Inactive Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={activeInactiveData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(1)}%)`}
                >
                  {activeInactiveData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Processing Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={processingStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(1)}%)`}
                >
                  {processingStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="cursor-pointer hover:bg-accent transition-colors">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-2 text-blue-500" />
                <h3 className="font-semibold">Create New Exam</h3>
                <p className="text-sm text-muted-foreground">Set up a new examination</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:bg-accent transition-colors">
              <CardContent className="p-6 text-center">
                <FileCheck className="h-12 w-12 mx-auto mb-2 text-green-500" />
                <h3 className="font-semibold">Process Results</h3>
                <p className="text-sm text-muted-foreground">Run results processing</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:bg-accent transition-colors">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 text-purple-500" />
                <h3 className="font-semibold">View Analytics</h3>
                <p className="text-sm text-muted-foreground">Explore exam analytics</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
