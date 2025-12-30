'use client';

import Link from 'next/link';
import { useExamContext } from '@/components/providers/exam-context';
import { useExam, useSchoolTypeComparison } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, School, Building } from 'lucide-react';
import { GPACard } from '@/components/gpa-card';
import { AverageMarksCard } from '@/components/average-marks-card';
import { DivisionPieChart } from '@/components/charts/division-pie-chart';
import { isSecondary } from '@/lib/constants';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function SchoolTypeComparisonPage() {
  const { selectedExamId } = useExamContext();
  const { data: exam } = useExam(selectedExamId || '');
  const { data: comparison, isLoading } = useSchoolTypeComparison(selectedExamId || '');

  if (!selectedExamId) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2 className="text-xl font-semibold">No Exam Selected</h2>
        <p className="text-muted-foreground">Please select an exam to view school type comparison</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  const showGPA = exam && isSecondary(exam.exam_level);
  const government = comparison?.government || {};
  const privateSch = comparison?.private || {};

  const comparisonData = [
    { 
      name: 'Government', 
      students: government.total_students || 0,
      schools: government.total_schools || 0,
      gpa: government.gpa || 0,
      average: government.average_marks || 0,
      fill: '#3b82f6'
    },
    { 
      name: 'Private', 
      students: privateSch.total_students || 0,
      schools: privateSch.total_schools || 0,
      gpa: privateSch.gpa || 0,
      average: privateSch.average_marks || 0,
      fill: '#22c55e'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/analytics">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">School Type Comparison</h1>
          <p className="text-muted-foreground">{exam?.exam_name}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Building className="h-6 w-6 text-blue-500" />
              <div>
                <CardTitle>Government Schools</CardTitle>
                <CardDescription>{government.total_schools || 0} schools</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {showGPA ? (
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{(government.gpa || 0).toFixed(2)}</div>
                  <p className="text-sm text-muted-foreground">Average GPA</p>
                </div>
              ) : (
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{(government.average_marks || 0).toFixed(1)}%</div>
                  <p className="text-sm text-muted-foreground">Average Marks</p>
                </div>
              )}
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{(government.total_students || 0).toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">Students</p>
              </div>
            </div>
            {showGPA && government.division_summary && (
              <DivisionPieChart data={government.division_summary} />
            )}
          </CardContent>
        </Card>

        <Card className="border-green-200 dark:border-green-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <School className="h-6 w-6 text-green-500" />
              <div>
                <CardTitle>Private Schools</CardTitle>
                <CardDescription>{privateSch.total_schools || 0} schools</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {showGPA ? (
                <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{(privateSch.gpa || 0).toFixed(2)}</div>
                  <p className="text-sm text-muted-foreground">Average GPA</p>
                </div>
              ) : (
                <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{(privateSch.average_marks || 0).toFixed(1)}%</div>
                  <p className="text-sm text-muted-foreground">Average Marks</p>
                </div>
              )}
              <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{(privateSch.total_students || 0).toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">Students</p>
              </div>
            </div>
            {showGPA && privateSch.division_summary && (
              <DivisionPieChart data={privateSch.division_summary} />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={comparisonData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="students"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
              >
                {comparisonData.map((entry, index) => (
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
          <CardTitle>Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey={showGPA ? "gpa" : "average"} fill="#3b82f6" name={showGPA ? "GPA" : "Average %"} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
