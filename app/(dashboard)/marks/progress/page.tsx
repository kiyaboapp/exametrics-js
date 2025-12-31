'use client';

import { useState, useEffect } from 'react';
import { useExamContext } from '@/components/providers/exam-context';
import { api } from '@/lib/api';
import type { ResultsProgress } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function ProgressPage() {
  const { selectedExamId } = useExamContext();
  const [progress, setProgress] = useState<ResultsProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCentre, setSearchCentre] = useState('');

  useEffect(() => {
    if (!selectedExamId) return;

    const fetchProgress = async () => {
      setLoading(true);
      try {
        const data = await api.getResultsProgress(selectedExamId, searchCentre || undefined);
        setProgress(data);
      } catch (error) {
        console.error('Failed to fetch progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [selectedExamId, searchCentre]);

  if (!selectedExamId) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2 className="text-xl font-semibold">No Exam Selected</h2>
        <p className="text-muted-foreground">Please select an exam from the header</p>
      </div>
    );
  }

  const getCompletionPercentage = (item: ResultsProgress) => {
    if (item.registered === 0) return 0;
    return Math.round((item.with_marks / item.registered) * 100);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Results Upload Progress</h1>
        <p className="text-muted-foreground">Track marks upload status by school</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter by School</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter centre number (e.g., S0330)"
                value={searchCentre}
                onChange={(e) => setSearchCentre(e.target.value.toUpperCase())}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setSearchCentre('')} variant="outline">
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Loading progress...</p>
          </CardContent>
        </Card>
      ) : progress.length > 0 ? (
        <div className="space-y-4">
          {progress.map((item) => {
            const completionPercentage = getCompletionPercentage(item);
            
            return (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {item.centre_number}
                        {item.is_finished ? (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Complete
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <Clock className="h-3 w-3" />
                            In Progress
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {item.region_name} → {item.council_name} → {item.ward_name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{completionPercentage}%</p>
                      <p className="text-sm text-muted-foreground">
                        {item.with_marks} / {item.registered} students
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={completionPercentage} className="mb-4" />
                  
                  <div className="grid gap-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Students with marks:</span>
                      <span className="font-semibold">{item.with_marks}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Absent students:</span>
                      <span className="font-semibold">{item.absents}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Subject Progress</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subject</TableHead>
                          <TableHead className="text-center">Theory</TableHead>
                          <TableHead className="text-center">Practical</TableHead>
                          <TableHead className="text-center">Complete</TableHead>
                          <TableHead className="text-center">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {item.subjects.map((subject) => (
                          <TableRow key={subject.subject_code}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{subject.subject_name}</p>
                                <p className="text-xs text-muted-foreground">{subject.subject_code}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              {subject.filled_theory}/{subject.registered}
                            </TableCell>
                            <TableCell className="text-center">
                              {subject.has_practical ? `${subject.filled_practical}/${subject.registered}` : 'N/A'}
                            </TableCell>
                            <TableCell className="text-center">
                              {subject.filled_complete}/{subject.registered}
                            </TableCell>
                            <TableCell className="text-center">
                              {item.subject_completion[subject.subject_code] ? (
                                <Badge variant="default" className="gap-1">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Done
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="gap-1">
                                  <AlertCircle className="h-3 w-3" />
                                  Pending
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No progress data found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
