'use client';

import { useState, useEffect } from 'react';
import { useExamContext } from '@/components/providers/exam-context';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { ExamSubject } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowLeft } from 'lucide-react';

export default function SubjectsPage() {
  const { selectedExamId } = useExamContext();
  const examId = selectedExamId;
  const [subjects, setSubjects] = useState<ExamSubject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!examId) return;

    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const data = await api.getExamSubjects(examId);
        setSubjects(data);
      } catch (error) {
        console.error('Failed to fetch subjects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [examId]);

  if (!examId) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2 className="text-xl font-semibold">No Exam Selected</h2>
        <p className="text-muted-foreground">Please select an exam from the header to view subjects</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/results">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            Subject Rankings
          </h1>
          <p className="text-muted-foreground">Select a subject to view rankings</p>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <Card key={subject.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {subject.subject_name}
                  <span className="text-sm font-mono text-muted-foreground">
                    {subject.subject_code}
                  </span>
                </CardTitle>
                <CardDescription>
                  {subject.is_compulsory ? 'Compulsory' : 'Optional'} • 
                  {subject.is_olevel ? ' O-Level' : ''}
                  {subject.is_alevel ? ' A-Level' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/results/subjects/${subject.subject_code}?exam=${examId}`}>
                  <Button className="w-full">
                    View Rankings
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
