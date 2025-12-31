'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useExamContext } from '@/components/providers/exam-context';
import { useExam, useExamGrades, useCreateExamGrade, useUpdateExamGrade, useDeleteExamGrade } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { ExamGrade, Grade } from '@/lib/types';

export default function GradesConfigPage() {
  const searchParams = useSearchParams();
  const examIdFromUrl = searchParams.get('exam');
  const { selectedExamId, setSelectedExamId } = useExamContext();
  
  // Use URL param if provided, otherwise use context
  const examId = examIdFromUrl || selectedExamId;
  
  // Sync URL param to context
  useEffect(() => {
    if (examIdFromUrl && examIdFromUrl !== selectedExamId) {
      setSelectedExamId(examIdFromUrl);
    }
  }, [examIdFromUrl, selectedExamId, setSelectedExamId]);
  
  const { data: exam, isLoading: examLoading } = useExam(examId);
  const { data: grades, refetch: refetchGrades, isLoading: gradesLoading } = useExamGrades(examId);
  
  const createGrade = useCreateExamGrade();
  const updateGrade = useUpdateExamGrade();
  const deleteGrade = useDeleteExamGrade();
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<ExamGrade>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState<Partial<ExamGrade>>({
    grade: 'A',
    lowest_marks: 0,
    highest_marks: 0,
    grade_points: 1,
  });

  if (!examId) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2 className="text-xl font-semibold">No Exam Selected</h2>
        <p className="text-muted-foreground">Please select an exam from the header first</p>
      </div>
    );
  }

  if (examLoading || gradesLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Loading grades...</p>
      </div>
    );
  }

  const handleEdit = (grade: ExamGrade) => {
    setEditingId(grade.id);
    setEditForm(grade);
  };

  const handleSave = async () => {
    if (!examId || !editingId) return;
    
    try {
      await updateGrade.mutateAsync({
        examId: examId,
        gradeId: editingId,
        grade: {
          grade: editForm.grade!,
          lowest_marks: editForm.lowest_marks!,
          highest_marks: editForm.highest_marks!,
          grade_points: editForm.grade_points!,
        },
      });
      setEditingId(null);
      setEditForm({});
      toast.success('Grade updated successfully');
    } catch (error: any) {
      console.error('Failed to update grade:', error);
      toast.error(error.response?.data?.detail || 'Failed to update grade');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleCreate = async () => {
    if (!examId) return;
    
    try {
      await createGrade.mutateAsync({
        examId: examId,
        grade: {
          grade: createForm.grade!,
          lowest_marks: createForm.lowest_marks!,
          highest_marks: createForm.highest_marks!,
          grade_points: createForm.grade_points!,
        },
      });
      setIsCreating(false);
      setCreateForm({
        grade: 'A',
        lowest_marks: 0,
        highest_marks: 0,
        grade_points: 1,
      });
      toast.success('Grade created successfully');
    } catch (error: any) {
      console.error('Failed to create grade:', error);
      toast.error(error.response?.data?.detail || 'Failed to create grade');
    }
  };
  
  const handleDelete = async (gradeId: number) => {
    if (!examId) return;
    
    if (confirm('Are you sure you want to delete this grade?')) {
      try {
        await deleteGrade.mutateAsync({
          examId: examId,
          gradeId,
        });
        toast.success('Grade deleted successfully');
      } catch (error: any) {
        console.error('Failed to delete grade:', error);
        toast.error(error.response?.data?.detail || 'Failed to delete grade');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/exams">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Grades Configuration</h1>
          <p className="text-muted-foreground">{exam?.exam_name}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Grade Ranges</CardTitle>
              <CardDescription>
                Configure point ranges for each grade
              </CardDescription>
            </div>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Grade
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Grade</TableHead>
                <TableHead>Lowest Marks</TableHead>
                <TableHead>Highest Marks</TableHead>
                <TableHead>Grade Points</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isCreating && (
                <TableRow>
                  <TableCell>
                    <Input
                      value={createForm.grade}
                      onChange={(e) => setCreateForm({ ...createForm, grade: e.target.value as Grade })}
                      placeholder="Grade (e.g., A, B, C)"
                      maxLength={2}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={createForm.lowest_marks}
                      onChange={(e) => setCreateForm({ ...createForm, lowest_marks: parseInt(e.target.value) || 0 })}
                      placeholder="Lowest marks"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={createForm.highest_marks}
                      onChange={(e) => setCreateForm({ ...createForm, highest_marks: parseInt(e.target.value) || 0 })}
                      placeholder="Highest marks"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={createForm.grade_points}
                      onChange={(e) => setCreateForm({ ...createForm, grade_points: parseInt(e.target.value) || 0 })}
                      placeholder="Grade points"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" onClick={handleCreate} disabled={createGrade.isPending}>
                        {createGrade.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setIsCreating(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {grades?.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell>
                    {editingId === grade.id ? (
                      <Input
                        value={editForm.grade}
                        onChange={(e) => setEditForm({ ...editForm, grade: e.target.value as Grade })}
                        maxLength={2}
                      />
                    ) : (
                      <Badge variant="outline">{grade.grade}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === grade.id ? (
                      <Input
                        type="number"
                        value={editForm.lowest_marks}
                        onChange={(e) => setEditForm({ ...editForm, lowest_marks: parseInt(e.target.value) || 0 })}
                      />
                    ) : (
                      grade.lowest_marks
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === grade.id ? (
                      <Input
                        type="number"
                        value={editForm.highest_marks}
                        onChange={(e) => setEditForm({ ...editForm, highest_marks: parseInt(e.target.value) || 0 })}
                      />
                    ) : (
                      grade.highest_marks
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === grade.id ? (
                      <Input
                        type="number"
                        value={editForm.grade_points}
                        onChange={(e) => setEditForm({ ...editForm, grade_points: parseInt(e.target.value) || 0 })}
                      />
                    ) : (
                      grade.grade_points
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingId === grade.id ? (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" onClick={handleSave} disabled={updateGrade.isPending}>
                          {updateGrade.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(grade)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDelete(grade.id)}
                          disabled={deleteGrade.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
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
