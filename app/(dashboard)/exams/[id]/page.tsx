'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useExam, useExamSchools, useExamSubjects, useExamDivisions, useExamGrades } from '@/lib/hooks';
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
import { ArrowLeft, Edit, PlayCircle, Users, BookOpen, School, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { isSecondary, isPrimary, DIVISION_COLORS, GRADE_COLORS } from '@/lib/constants';

export default function ExamDetailsPage() {
  const params = useParams();
  const examId = params.id as string;
  
  const { data: exam, isLoading: examLoading } = useExam(examId);
  const { data: schools } = useExamSchools(examId);
  const { data: subjects } = useExamSubjects(examId);
  const { data: divisions } = useExamDivisions(examId);
  const { data: grades } = useExamGrades(examId);

  if (examLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  if (!exam) {
    return <div className="flex items-center justify-center h-full">Exam not found</div>;
  }

  const totalStudents = schools?.reduce((sum, s) => sum + s.student_count, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/exams">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{exam.exam_name}</h1>
            {exam.exam_name_swahili && (
              <p className="text-muted-foreground">{exam.exam_name_swahili}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/exams/${examId}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Link href={`/results/process?exam=${examId}`}>
            <Button>
              <PlayCircle className="mr-2 h-4 w-4" />
              Process Results
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Badge className={isSecondary(exam.exam_level) ? 'bg-orange-500' : 'bg-blue-500'}>
                {exam.exam_level}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {isPrimary(exam.exam_level) ? 'Primary' : 'Secondary'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Exam Level</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{schools?.length || 0}</div>
            <p className="text-sm text-muted-foreground">Schools</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{totalStudents.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Students</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Badge variant={exam.is_active ? 'default' : 'secondary'} className="text-base">
              {exam.is_active ? '✅ Active' : '⏸️ Inactive'}
            </Badge>
            <p className="text-sm text-muted-foreground mt-2">Status</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exam Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Start Date</p>
              <p className="font-medium">{format(new Date(exam.start_date), 'dd MMM yyyy')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">End Date</p>
              <p className="font-medium">{format(new Date(exam.end_date), 'dd MMM yyyy')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Style</p>
              <p className="font-medium">{exam.avg_style}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ranking Style</p>
              <p className="font-medium">{exam.ranking_style}</p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Badge variant={exam.has_students_registered ? 'default' : 'outline'}>
              {exam.has_students_registered ? '✅ Students Registered' : '⚪ No Students'}
            </Badge>
            <Badge variant={exam.has_marks_uploaded ? 'default' : 'outline'}>
              {exam.has_marks_uploaded ? '✅ Marks Uploaded' : '⚪ No Marks'}
            </Badge>
            <Badge variant={exam.results_processed ? 'default' : 'outline'}>
              {exam.results_processed ? '✅ Results Processed' : '⚪ Not Processed'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="schools">
        <TabsList>
          <TabsTrigger value="schools">
            <School className="mr-2 h-4 w-4" />
            Schools ({schools?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="subjects">
            <BookOpen className="mr-2 h-4 w-4" />
            Subjects ({subjects?.length || 0})
          </TabsTrigger>
          {isSecondary(exam.exam_level) && (
            <TabsTrigger value="divisions">
              <Settings className="mr-2 h-4 w-4" />
              Divisions
            </TabsTrigger>
          )}
          <TabsTrigger value="grades">
            <Settings className="mr-2 h-4 w-4" />
            Grades
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schools" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Centre Number</TableHead>
                    <TableHead>School Name</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Council</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Students</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schools?.slice(0, 20).map((school) => (
                    <TableRow key={school.centre_number}>
                      <TableCell className="font-mono">{school.centre_number}</TableCell>
                      <TableCell className="font-medium">{school.school_name}</TableCell>
                      <TableCell>{school.region_name}</TableCell>
                      <TableCell>{school.council_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{school.school_type}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{school.student_count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {schools && schools.length > 20 && (
                <p className="p-4 text-center text-muted-foreground">
                  Showing 20 of {schools.length} schools
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Exam Subjects</CardTitle>
                <CardDescription>Subjects configured for this exam</CardDescription>
              </div>
              <Link href={`/exams/subjects?exam=${examId}`}>
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Configure
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Subject Name</TableHead>
                    <TableHead>Short</TableHead>
                    <TableHead>Practical</TableHead>
                    <TableHead>Exclude GPA</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjects?.map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell className="font-mono">{subject.subject_code}</TableCell>
                      <TableCell className="font-medium">{subject.subject_name}</TableCell>
                      <TableCell>{subject.subject_short}</TableCell>
                      <TableCell>
                        {subject.has_practical ? <Badge>Yes</Badge> : <Badge variant="outline">No</Badge>}
                      </TableCell>
                      <TableCell>
                        {subject.exclude_from_gpa ? <Badge variant="destructive">Excluded</Badge> : <Badge variant="outline">Included</Badge>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {isSecondary(exam.exam_level) && (
          <TabsContent value="divisions" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Division Configuration</CardTitle>
                  <CardDescription>Point ranges for each division</CardDescription>
                </div>
                <Link href={`/exams/divisions?exam=${examId}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Configure
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Division</TableHead>
                      <TableHead>Lowest Points</TableHead>
                      <TableHead>Highest Points</TableHead>
                      <TableHead>Division Points</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {divisions?.map((div) => (
                      <TableRow key={div.id}>
                        <TableCell>
                          <Badge style={{ backgroundColor: DIVISION_COLORS[div.division] }}>
                            Division {div.division}
                          </Badge>
                        </TableCell>
                        <TableCell>{div.lowest_points}</TableCell>
                        <TableCell>{div.highest_points}</TableCell>
                        <TableCell>{div.division_points}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="grades" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Grade Configuration</CardTitle>
                <CardDescription>Mark ranges for each grade</CardDescription>
              </div>
              <Link href={`/exams/grades?exam=${examId}`}>
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Configure
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Grade</TableHead>
                    <TableHead>Lowest Value</TableHead>
                    <TableHead>Highest Value</TableHead>
                    <TableHead>Grade Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grades?.map((grade) => (
                    <TableRow key={grade.id}>
                      <TableCell>
                        <Badge style={{ backgroundColor: GRADE_COLORS[grade.grade], color: 'white' }}>
                          {grade.grade}
                        </Badge>
                      </TableCell>
                      <TableCell>{grade.lowest_value}</TableCell>
                      <TableCell>{grade.highest_value}</TableCell>
                      <TableCell>{grade.grade_points}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
