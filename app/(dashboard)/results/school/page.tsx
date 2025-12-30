'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSchoolAnalysis, useExam } from '@/lib/hooks';
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
import { ArrowLeft, Download, TrendingUp, Users, Award, BookOpen } from 'lucide-react';
import { GPACard } from '@/components/gpa-card';
import { AverageMarksCard } from '@/components/average-marks-card';
import { RankingCard } from '@/components/ranking-card';
import { DivisionPieChart } from '@/components/charts/division-pie-chart';
import { GradeBarChart } from '@/components/charts/grade-bar-chart';
import { SubjectPerformanceChart } from '@/components/charts/subject-performance-chart';
import { DivisionBadge } from '@/components/division-badge';
import { GradeBadge } from '@/components/grade-badge';
import { isSecondary, isPrimary } from '@/lib/constants';

export default function SchoolAnalysisPage() {
  const searchParams = useSearchParams();
  const examId = searchParams.get('exam');
  const centreNumber = searchParams.get('centre');

  const { data: exam } = useExam(examId || '');
  const { data: analysis, isLoading } = useSchoolAnalysis(examId || '', centreNumber || '');

  if (!examId || !centreNumber) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2 className="text-xl font-semibold">Missing Parameters</h2>
        <p className="text-muted-foreground">Please select an exam and school to view analysis</p>
        <Link href="/results">
          <Button>Go to Results</Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading school analysis...</div>;
  }

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2 className="text-xl font-semibold">No Analysis Found</h2>
        <p className="text-muted-foreground">Results may not have been processed for this school</p>
        <Link href="/results">
          <Button>Go to Results</Button>
        </Link>
      </div>
    );
  }

  const examLevel = exam?.exam_level;
  const showDivisions = examLevel && isSecondary(examLevel);
  const showGPA = examLevel && isSecondary(examLevel);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/results">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">School Analysis</h1>
            <p className="text-muted-foreground">
              Centre: {centreNumber} • {exam?.exam_name}
            </p>
          </div>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        {showGPA ? (
          <GPACard value={analysis.school_gpa || 0} label="School GPA" />
        ) : (
          <AverageMarksCard value={analysis.average_marks || 0} label="Average Marks" />
        )}
        
        {analysis.school_ranking && (
          <>
            <RankingCard
              position={analysis.school_ranking.national_position || 0}
              outOf={analysis.school_ranking.national_total || 1}
              label="National Ranking"
              icon="🏆"
            />
            <RankingCard
              position={analysis.school_ranking.regional_position || 0}
              outOf={analysis.school_ranking.regional_total || 1}
              label="Regional Ranking"
              icon="📍"
            />
            <RankingCard
              position={analysis.school_ranking.council_position || 0}
              outOf={analysis.school_ranking.council_total || 1}
              label="Council Ranking"
              icon="🏛️"
            />
          </>
        )}
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">
            <TrendingUp className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          {showDivisions && (
            <TabsTrigger value="divisions">
              <Award className="mr-2 h-4 w-4" />
              Divisions
            </TabsTrigger>
          )}
          <TabsTrigger value="grades">
            <Award className="mr-2 h-4 w-4" />
            Grades
          </TabsTrigger>
          <TabsTrigger value="subjects">
            <BookOpen className="mr-2 h-4 w-4" />
            Subjects
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {showDivisions && analysis.division_summary && (
              <Card>
                <CardHeader>
                  <CardTitle>Division Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <DivisionPieChart data={analysis.division_summary} />
                </CardContent>
              </Card>
            )}
            
            {analysis.grades_summary && (
              <Card>
                <CardHeader>
                  <CardTitle>Grade Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <GradeBarChart data={analysis.grades_summary} />
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {showDivisions && (
          <TabsContent value="divisions" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Division Summary</CardTitle>
                <CardDescription>Student distribution by division</CardDescription>
              </CardHeader>
              <CardContent>
                {analysis.division_summary && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Division</TableHead>
                        <TableHead className="text-right">Count</TableHead>
                        <TableHead className="text-right">Percentage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(analysis.division_summary).map(([div, data]) => (
                        <TableRow key={div}>
                          <TableCell>
                            <DivisionBadge division={div as any} />
                          </TableCell>
                          <TableCell className="text-right">
                            {typeof data === 'object' ? data.count : data}
                          </TableCell>
                          <TableCell className="text-right">
                            {typeof data === 'object' && data.percentage 
                              ? `${data.percentage.toFixed(1)}%` 
                              : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="grades" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Grade Summary</CardTitle>
              <CardDescription>Total grades awarded across all subjects</CardDescription>
            </CardHeader>
            <CardContent>
              {analysis.grades_summary && (
                <div className="grid gap-4 grid-cols-7">
                  {Object.entries(analysis.grades_summary).map(([grade, count]) => (
                    <Card key={grade}>
                      <CardContent className="p-4 text-center">
                        <GradeBadge grade={grade as any} />
                        <div className="text-2xl font-bold mt-2">{count as number}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
              <CardDescription>
                {showGPA ? 'Subjects ranked by GPA (lower is better)' : 'Subjects ranked by average marks'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analysis.subjects_gpa && (
                <SubjectPerformanceChart 
                  subjects={analysis.subjects_gpa} 
                  metric={showGPA ? 'gpa' : 'average'} 
                />
              )}
            </CardContent>
          </Card>

          {analysis.subjects_gpa && (
            <Card className="mt-4">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      {showGPA && <TableHead className="text-right">GPA</TableHead>}
                      <TableHead className="text-right">Average</TableHead>
                      <TableHead className="text-right">Students</TableHead>
                      <TableHead className="text-right">Position</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analysis.subjects_gpa.map((subject: any) => (
                      <TableRow key={subject.subject_code || subject.subject_name}>
                        <TableCell className="font-medium">{subject.subject_name}</TableCell>
                        {showGPA && (
                          <TableCell className="text-right font-mono">
                            {subject.gpa?.toFixed(2) || '-'}
                          </TableCell>
                        )}
                        <TableCell className="text-right">
                          {subject.average?.toFixed(1) || '-'}%
                        </TableCell>
                        <TableCell className="text-right">
                          {subject.student_count || '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {subject.position ? (
                            <Badge variant="outline">#{subject.position}</Badge>
                          ) : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
