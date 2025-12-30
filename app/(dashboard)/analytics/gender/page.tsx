'use client';

import Link from 'next/link';
import { useExamContext } from '@/components/providers/exam-context';
import { useExam, useGenderBreakdown } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Users } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { isSecondary } from '@/lib/constants';

const GENDER_COLORS = { M: '#3b82f6', F: '#ec4899' };

export default function GenderBreakdownPage() {
  const { selectedExamId } = useExamContext();
  const { data: exam } = useExam(selectedExamId || '');
  const { data: genderData, isLoading } = useGenderBreakdown(selectedExamId || '');

  if (!selectedExamId) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2 className="text-xl font-semibold">No Exam Selected</h2>
        <p className="text-muted-foreground">Please select an exam first</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  const showDivisions = exam && isSecondary(exam.exam_level);
  
  const totalByGender = genderData?.total_by_gender || {};
  const totalStudents = Object.values(totalByGender).reduce((a: number, b: any) => a + (b as number), 0);
  
  const genderPieData = Object.entries(totalByGender).map(([gender, count]) => ({
    name: gender === 'M' ? 'Male' : 'Female',
    value: count as number,
    fill: GENDER_COLORS[gender as keyof typeof GENDER_COLORS],
  }));

  const averageByGender = genderData?.average_by_gender || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/analytics">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Gender Breakdown</h1>
          <p className="text-muted-foreground">{exam?.exam_name}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {(totalByGender.M || 0).toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">Male Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-pink-100 dark:bg-pink-900 rounded-lg">
                <Users className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {(totalByGender.F || 0).toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">Female Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{totalStudents.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Total Students</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genderPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(1)}%)`}
                >
                  {genderPieData.map((entry, index) => (
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
            <CardTitle>Average Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Gender</TableHead>
                  <TableHead className="text-right">Average Marks</TableHead>
                  <TableHead className="text-right">Average Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(averageByGender).map(([gender, data]: [string, any]) => (
                  <TableRow key={gender}>
                    <TableCell className="font-medium">
                      {gender === 'M' ? '👨 Male' : '👩 Female'}
                    </TableCell>
                    <TableCell className="text-right">
                      {data.avg_marks?.toFixed(1) || '-'}%
                    </TableCell>
                    <TableCell className="text-right">
                      {data.avg_points?.toFixed(2) || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {showDivisions && genderData?.division_by_gender && (
        <Card>
          <CardHeader>
            <CardTitle>Division Distribution by Gender</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Division</TableHead>
                  <TableHead className="text-right">Male</TableHead>
                  <TableHead className="text-right">Female</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {['I', 'II', 'III', 'IV', '0'].map((div) => (
                  <TableRow key={div}>
                    <TableCell className="font-medium">Division {div}</TableCell>
                    <TableCell className="text-right">
                      {genderData.division_by_gender.M?.[div] || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      {genderData.division_by_gender.F?.[div] || 0}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {genderData?.subject_by_gender && (
        <Card>
          <CardHeader>
            <CardTitle>Subject Performance by Gender</CardTitle>
            <CardDescription>Average marks per subject</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead className="text-right">Male Avg</TableHead>
                  <TableHead className="text-right">Female Avg</TableHead>
                  <TableHead className="text-right">Difference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(() => {
                  const maleSubjects = genderData.subject_by_gender.M || [];
                  const femaleSubjects = genderData.subject_by_gender.F || [];
                  const allSubjects = [...new Set([
                    ...maleSubjects.map((s: any) => s.subject_name),
                    ...femaleSubjects.map((s: any) => s.subject_name)
                  ])];

                  return allSubjects.sort().map((subjectName) => {
                    const maleData = maleSubjects.find((s: any) => s.subject_name === subjectName);
                    const femaleData = femaleSubjects.find((s: any) => s.subject_name === subjectName);
                    const maleAvg = maleData?.average_marks || 0;
                    const femaleAvg = femaleData?.average_marks || 0;
                    const diff = maleAvg - femaleAvg;

                    return (
                      <TableRow key={subjectName as string}>
                        <TableCell className="font-medium">{subjectName as string}</TableCell>
                        <TableCell className="text-right">{maleAvg.toFixed(1)}%</TableCell>
                        <TableCell className="text-right">{femaleAvg.toFixed(1)}%</TableCell>
                        <TableCell className={`text-right ${diff > 0 ? 'text-blue-600' : diff < 0 ? 'text-pink-600' : ''}`}>
                          {diff > 0 ? '+' : ''}{diff.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    );
                  });
                })()}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
