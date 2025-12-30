'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateExam, useExaminationBoards } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/error-utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { EXAM_LEVELS, isPrimary, isSecondary } from '@/lib/constants';
import type { ExamLevel, AverageStyle, RankingStyle, SubjectRankingStyle } from '@/lib/types';

export default function CreateExamPage() {
  const router = useRouter();
  const { data: boards, isLoading: boardsLoading } = useExaminationBoards();
  const createExam = useCreateExam();

  const [formData, setFormData] = useState({
    board_id: '',
    exam_name: '',
    exam_name_swahili: '',
    start_date: '',
    end_date: '',
    exam_level: '' as ExamLevel | '',
    avg_style: 'AUTO' as AverageStyle,
    ranking_style: 'AVERAGE_ONLY' as RankingStyle,
    subject_ranking_style: 'SUBJECT_GPA_THEN_SUBJECT_AVERAGE' as SubjectRankingStyle,
    is_active: true,
  });

  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.board_id || !formData.exam_name || !formData.start_date || !formData.end_date || !formData.exam_level) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      await createExam.mutateAsync(formData);
      router.push('/exams');
    } catch (err: any) {
      setError(getErrorMessage(err) || 'Failed to create exam');
    }
  };

  const selectedLevel = formData.exam_level as ExamLevel;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/exams">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create New Exam</h1>
          <p className="text-muted-foreground">Set up a new examination</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter the exam details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="board_id">Examination Board *</Label>
              <Select
                value={formData.board_id}
                onValueChange={(value) => setFormData({ ...formData, board_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select examination board" />
                </SelectTrigger>
                <SelectContent>
                  {boards?.map((board) => (
                    <SelectItem key={board.id} value={board.id}>
                      {board.board_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="exam_name">Exam Name (English) *</Label>
              <Input
                id="exam_name"
                value={formData.exam_name}
                onChange={(e) => setFormData({ ...formData, exam_name: e.target.value })}
                placeholder="e.g., MOCK EXAMINATION 2025"
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="exam_name_swahili">Exam Name (Swahili)</Label>
              <Input
                id="exam_name_swahili"
                value={formData.exam_name_swahili}
                onChange={(e) => setFormData({ ...formData, exam_name_swahili: e.target.value })}
                placeholder="e.g., MTIHANI WA MAJARIBIO 2025"
                maxLength={100}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date *</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date *</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exam Configuration</CardTitle>
            <CardDescription>Configure exam type and calculation methods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Exam Level *</Label>
              <div className="grid grid-cols-3 gap-2">
                {EXAM_LEVELS.map((level) => (
                  <Button
                    key={level}
                    type="button"
                    variant={formData.exam_level === level ? 'default' : 'outline'}
                    onClick={() => setFormData({ ...formData, exam_level: level })}
                    className="w-full"
                  >
                    {level}
                    <span className="ml-1 text-xs opacity-70">
                      {isPrimary(level) ? '(Primary)' : '(Secondary)'}
                    </span>
                  </Button>
                ))}
              </div>
              {selectedLevel && (
                <p className="text-sm text-muted-foreground mt-2">
                  {isPrimary(selectedLevel) 
                    ? 'ℹ️ Primary exams: No divisions, grades only. Key metric: Average Marks'
                    : '✅ Secondary exams: Has divisions (I-IV, 0) and GPA. Key metric: GPA'}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Average Calculation Style *</Label>
              <Select
                value={formData.avg_style}
                onValueChange={(value: AverageStyle) => setFormData({ ...formData, avg_style: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AUTO">AUTO (All subjects)</SelectItem>
                  <SelectItem value="SEVEN_BEST">SEVEN_BEST (Best 7 subjects)</SelectItem>
                  <SelectItem value="EIGHT_BEST">EIGHT_BEST (Best 8 subjects)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Ranking Style</Label>
              <Select
                value={formData.ranking_style}
                onValueChange={(value: RankingStyle) => setFormData({ ...formData, ranking_style: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AVERAGE_ONLY">Average Only</SelectItem>
                  <SelectItem value="GPA_THEN_AVERAGE">GPA then Average</SelectItem>
                  <SelectItem value="AVERAGE_THEN_GPA">Average then GPA</SelectItem>
                  <SelectItem value="TOTAL_ONLY">Total Only</SelectItem>
                  <SelectItem value="TOTAL_THEN_AVERAGE">Total then Average</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Subject Ranking Style</Label>
              <Select
                value={formData.subject_ranking_style}
                onValueChange={(value: SubjectRankingStyle) => setFormData({ ...formData, subject_ranking_style: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUBJECT_GPA_THEN_SUBJECT_AVERAGE">GPA then Average</SelectItem>
                  <SelectItem value="SUBJECT_AVERAGE_THEN_SUBJECT_GPA">Average then GPA</SelectItem>
                  <SelectItem value="SUBJECT_AVERAGE_ONLY">Average Only</SelectItem>
                  <SelectItem value="SUBJECT_GPA_ONLY">GPA Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="is_active">Active (Exam is visible to users)</Label>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950 p-3 rounded">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={createExam.isPending}>
            {createExam.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Exam'
            )}
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          ℹ️ After creation, divisions and grades will be auto-created for secondary exams (FTNA/CSEE/ACSEE)
        </p>
      </form>
    </div>
  );
}
