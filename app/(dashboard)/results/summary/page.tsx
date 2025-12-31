'use client';

import { useState, useEffect } from 'react';
import { useExamContext } from '@/components/providers/exam-context';
import { api } from '@/lib/api';
import { formatGPA } from '@/lib/utils';
import type { ExamStatsDetailed } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BarChart3, Trophy, Users, TrendingUp } from 'lucide-react';

export default function SummaryPage() {
  const { selectedExamId } = useExamContext();
  const examId = selectedExamId;

  const [stats, setStats] = useState<ExamStatsDetailed | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!examId) return;

    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await api.getExamStatsDetailed(examId);
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [examId]);

  if (!examId) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2 className="text-xl font-semibold">No Exam Selected</h2>
        <p className="text-muted-foreground">Please select an exam from the header to view summary</p>
      </div>
    );
  }

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="h-8 w-8" />
          Exam Summary
        </h1>
        <p className="text-muted-foreground">Overall examination statistics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Schools</p>
                <p className="text-3xl font-bold">{stats?.total_schools || 0}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average GPA</p>
                <p className="text-3xl font-bold font-mono">
                  {formatGPA(stats?.average_school_gpa)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Best GPA</p>
                <p className="text-3xl font-bold font-mono">
                  {formatGPA(stats?.top_schools?.[0]?.school_gpa)}
                </p>
              </div>
              <Trophy className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-3xl font-bold">
                  {stats?.grade_totals?.A?.T || 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Schools */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Schools</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Centre</TableHead>
                <TableHead className="text-right">GPA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats?.top_schools?.slice(0, 10).map((school, index) => (
                <TableRow key={school.centre_number}>
                  <TableCell>
                    <Badge variant={index < 3 ? 'default' : 'outline'}>
                      #{index + 1}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{school.school_name}</TableCell>
                  <TableCell className="font-mono">{school.centre_number}</TableCell>
                  <TableCell className="text-right font-mono font-semibold">
                    {formatGPA(school.school_gpa)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Grade Distribution */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats?.grade_totals && Object.entries(stats.grade_totals).map(([grade, data]) => (
                <div key={grade} className="flex items-center justify-between">
                  <Badge variant="outline">{grade}</Badge>
                  <span className="font-semibold">{data.T}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Division Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats?.division_totals && Object.entries(stats.division_totals).map(([division, data]) => (
                <div key={division} className="flex items-center justify-between">
                  <Badge variant="outline">{division}</Badge>
                  <span className="font-semibold">{data.T}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
