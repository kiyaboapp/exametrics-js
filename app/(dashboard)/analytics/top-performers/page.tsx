'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useExamContext } from '@/components/providers/exam-context';
import { useExam, useTopPerformers } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Trophy, Users, School, Medal } from 'lucide-react';
import { isSecondary } from '@/lib/constants';
import { DivisionBadge } from '@/components/division-badge';

export default function TopPerformersPage() {
  const { selectedExamId } = useExamContext();
  const { data: exam } = useExam(selectedExamId || '');
  const { data: performers, isLoading } = useTopPerformers(selectedExamId || '');
  
  const [limit, setLimit] = useState<string>('20');

  if (!selectedExamId) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2 className="text-xl font-semibold">No Exam Selected</h2>
        <p className="text-muted-foreground">Please select an exam to view top performers</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  const showGPA = exam && isSecondary(exam.exam_level);
  const topStudents = performers?.top_students || [];
  const topSchools = performers?.top_schools || [];

  const getMedalIcon = (position: number) => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return `#${position}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/analytics">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Top Performers</h1>
          <p className="text-muted-foreground">{exam?.exam_name}</p>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <span className="text-sm text-muted-foreground">Show top:</span>
        <Select value={limit} onValueChange={setLimit}>
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="students">
        <TabsList>
          <TabsTrigger value="students">
            <Users className="mr-2 h-4 w-4" />
            Top Students
          </TabsTrigger>
          <TabsTrigger value="schools">
            <School className="mr-2 h-4 w-4" />
            Top Schools
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Trophy className="h-6 w-6 text-yellow-500" />
                <div>
                  <CardTitle>Top Students</CardTitle>
                  <CardDescription>
                    {showGPA ? 'Ranked by GPA (lower is better)' : 'Ranked by average marks'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Centre Number</TableHead>
                    <TableHead>School</TableHead>
                    <TableHead>Sex</TableHead>
                    {showGPA && <TableHead className="text-right">GPA</TableHead>}
                    {showGPA && <TableHead>Division</TableHead>}
                    <TableHead className="text-right">Average</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topStudents.slice(0, parseInt(limit)).map((student: any, index: number) => (
                    <TableRow key={student.student_id || index}>
                      <TableCell>
                        <span className="text-lg">{getMedalIcon(index + 1)}</span>
                      </TableCell>
                      <TableCell className="font-medium">
                        {student.first_name} {student.middle_name || ''} {student.surname}
                      </TableCell>
                      <TableCell className="font-mono">{student.centre_number}</TableCell>
                      <TableCell>{student.school_name}</TableCell>
                      <TableCell>
                        <Badge variant={student.sex === 'M' ? 'default' : 'secondary'}>
                          {student.sex === 'M' ? 'Male' : 'Female'}
                        </Badge>
                      </TableCell>
                      {showGPA && (
                        <TableCell className="text-right font-mono font-bold">
                          {(student.gpa || 0).toFixed(2)}
                        </TableCell>
                      )}
                      {showGPA && (
                        <TableCell>
                          <DivisionBadge division={student.division} />
                        </TableCell>
                      )}
                      <TableCell className="text-right">
                        {(student.average_marks || 0).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                  {topStudents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={showGPA ? 8 : 6} className="text-center py-8 text-muted-foreground">
                        No student data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schools" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Medal className="h-6 w-6 text-yellow-500" />
                <div>
                  <CardTitle>Top Schools</CardTitle>
                  <CardDescription>
                    {showGPA ? 'Ranked by school GPA (lower is better)' : 'Ranked by average marks'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>School Name</TableHead>
                    <TableHead>Centre Number</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Type</TableHead>
                    {showGPA && <TableHead className="text-right">GPA</TableHead>}
                    <TableHead className="text-right">Average</TableHead>
                    <TableHead className="text-right">Students</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topSchools.slice(0, parseInt(limit)).map((school: any, index: number) => (
                    <TableRow key={school.centre_number}>
                      <TableCell>
                        <span className="text-lg">{getMedalIcon(index + 1)}</span>
                      </TableCell>
                      <TableCell className="font-medium">
                        <Link 
                          href={`/results/school?exam=${selectedExamId}&centre=${school.centre_number}`}
                          className="hover:underline"
                        >
                          {school.school_name}
                        </Link>
                      </TableCell>
                      <TableCell className="font-mono">{school.centre_number}</TableCell>
                      <TableCell>{school.region_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{school.school_type}</Badge>
                      </TableCell>
                      {showGPA && (
                        <TableCell className="text-right font-mono font-bold">
                          {(school.gpa || 0).toFixed(2)}
                        </TableCell>
                      )}
                      <TableCell className="text-right">
                        {(school.average_marks || 0).toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-right">
                        {school.total_students || 0}
                      </TableCell>
                    </TableRow>
                  ))}
                  {topSchools.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={showGPA ? 8 : 7} className="text-center py-8 text-muted-foreground">
                        No school data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
