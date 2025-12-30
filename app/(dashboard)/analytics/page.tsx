'use client';

import Link from 'next/link';
import { useExamContext } from '@/components/providers/exam-context';
import { useExam } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, School, BookOpen, Trophy } from 'lucide-react';

export default function AnalyticsPage() {
  const { selectedExamId } = useExamContext();
  const { data: exam } = useExam(selectedExamId || '');

  if (!selectedExamId) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2 className="text-xl font-semibold">No Exam Selected</h2>
        <p className="text-muted-foreground">Please select an exam to view analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">{exam?.exam_name}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Link href="/analytics/gender">
          <Card className="hover:border-primary transition-colors cursor-pointer h-full">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-pink-100 dark:bg-pink-900 rounded-lg">
                  <Users className="h-6 w-6 text-pink-600 dark:text-pink-300" />
                </div>
                <div>
                  <CardTitle>Gender Breakdown</CardTitle>
                  <CardDescription>Male vs Female performance analysis</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Compare performance metrics between male and female students across divisions, 
                grades, subjects, and regions.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/analytics/school-type">
          <Card className="hover:border-primary transition-colors cursor-pointer h-full">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <School className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <CardTitle>School Type Comparison</CardTitle>
                  <CardDescription>Government vs Private analysis</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Compare performance between government and private schools including 
                division distribution, GPA, and subject performance.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/analytics/subjects">
          <Card className="hover:border-primary transition-colors cursor-pointer h-full">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <BookOpen className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <CardTitle>Subject Deep Dive</CardTitle>
                  <CardDescription>Detailed subject analysis</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Analyze individual subject performance with grade distribution, 
                pass rates, and comparison across schools and regions.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/analytics/top-performers">
          <Card className="hover:border-primary transition-colors cursor-pointer h-full">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <Trophy className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
                </div>
                <div>
                  <CardTitle>Top Performers</CardTitle>
                  <CardDescription>Best students and schools</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View top performing students nationally and by region, along with 
                top schools by division and GPA.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
