'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useExamContext } from '@/components/providers/exam-context';
import { useExam, useSubjectDetailed } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { ArrowLeft, BookOpen } from 'lucide-react';
import { isSecondary } from '@/lib/constants';
import { GradeBarChart } from '@/components/charts/grade-bar-chart';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function SubjectDeepDivePage() {
  const { selectedExamId } = useExamContext();
  const { data: exam } = useExam(selectedExamId || '');
  const { data: subjectData, isLoading } = useSubjectDetailed(selectedExamId || '');
  
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  if (!selectedExamId) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2 className="text-xl font-semibold">No Exam Selected</h2>
        <p className="text-muted-foreground">Please select an exam to view subject analysis</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  const showGPA = exam && isSecondary(exam.exam_level);
  const subjects = subjectData?.subjects || [];
  const selectedSubjectData = subjects.find((s: any) => s.subject_code === selectedSubject);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/analytics">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Subject Deep Dive</h1>
          <p className="text-muted-foreground">{exam?.exam_name}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Subject</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-[400px]">
              <SelectValue placeholder="Select a subject to view details" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject: any) => (
                <SelectItem key={subject.subject_code} value={subject.subject_code}>
                  {subject.subject_code} - {subject.subject_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedSubjectData && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-6 text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">{selectedSubjectData.subject_name}</div>
                <p className="text-sm text-muted-foreground">{selectedSubjectData.subject_code}</p>
              </CardContent>
            </Card>
            {showGPA && (
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {(selectedSubjectData.gpa || 0).toFixed(2)}
                  </div>
                  <p className="text-sm text-muted-foreground">Subject GPA</p>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600">
                  {(selectedSubjectData.average_marks || 0).toFixed(1)}%
                </div>
                <p className="text-sm text-muted-foreground">Average Marks</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold">
                  {(selectedSubjectData.total_students || 0).toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">Students</p>
              </CardContent>
            </Card>
          </div>

          {selectedSubjectData.grades_summary && (
            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <GradeBarChart data={selectedSubjectData.grades_summary} />
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Subjects Overview</CardTitle>
          <CardDescription>
            {showGPA ? 'Sorted by GPA (lower is better)' : 'Sorted by average marks (higher is better)'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Subject Code</TableHead>
                <TableHead>Subject Name</TableHead>
                {showGPA && <TableHead className="text-right">GPA</TableHead>}
                <TableHead className="text-right">Average</TableHead>
                <TableHead className="text-right">Pass Rate</TableHead>
                <TableHead className="text-right">Students</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects
                .sort((a: any, b: any) => showGPA 
                  ? (a.gpa || 99) - (b.gpa || 99)
                  : (b.average_marks || 0) - (a.average_marks || 0)
                )
                .map((subject: any, index: number) => (
                  <TableRow 
                    key={subject.subject_code}
                    className={subject.subject_code === selectedSubject ? 'bg-accent' : 'cursor-pointer hover:bg-accent/50'}
                    onClick={() => setSelectedSubject(subject.subject_code)}
                  >
                    <TableCell>
                      <Badge variant={index < 3 ? 'default' : 'outline'}>
                        #{index + 1}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">{subject.subject_code}</TableCell>
                    <TableCell className="font-medium">{subject.subject_name}</TableCell>
                    {showGPA && (
                      <TableCell className="text-right font-mono">
                        {(subject.gpa || 0).toFixed(2)}
                      </TableCell>
                    )}
                    <TableCell className="text-right">
                      {(subject.average_marks || 0).toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-right">
                      {(subject.pass_rate || 0).toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-right">
                      {(subject.total_students || 0).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
