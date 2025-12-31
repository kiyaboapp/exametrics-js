'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useExamContext } from '@/components/providers/exam-context';
import { useExam, useExamDivisions, useCreateExamDivision, useUpdateExamDivision, useDeleteExamDivision } from '@/lib/hooks';
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
import type { ExamDivision, Division } from '@/lib/types';

export default function DivisionsConfigPage() {
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
  const { data: divisions, refetch: refetchDivisions, isLoading: divisionsLoading } = useExamDivisions(examId);
  
  const createDivision = useCreateExamDivision();
  const updateDivision = useUpdateExamDivision();
  const deleteDivision = useDeleteExamDivision();
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<ExamDivision>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState<Partial<ExamDivision>>({
    division: 'I',
    lowest_points: 0,
    highest_points: 0,
    division_points: 1,
  });

  if (!examId) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2 className="text-xl font-semibold">No Exam Selected</h2>
        <p className="text-muted-foreground">Please select an exam from the header first</p>
      </div>
    );
  }

  if (examLoading || divisionsLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Loading divisions...</p>
      </div>
    );
  }

  const handleEdit = (division: ExamDivision) => {
    setEditingId(division.id);
    setEditForm(division);
  };

  const handleSave = async () => {
    if (!examId || !editingId) return;
    
    try {
      await updateDivision.mutateAsync({
        examId: examId,
        divisionId: editingId,
        division: {
          division: editForm.division!,
          lowest_points: editForm.lowest_points!,
          highest_points: editForm.highest_points!,
          division_points: editForm.division_points!,
        },
      });
      setEditingId(null);
      setEditForm({});
      toast.success('Division updated successfully');
    } catch (error: any) {
      console.error('Failed to update division:', error);
      toast.error(error.response?.data?.detail || 'Failed to update division');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleCreate = async () => {
    if (!examId) return;
    
    try {
      await createDivision.mutateAsync({
        examId: examId,
        division: {
          division: createForm.division!,
          lowest_points: createForm.lowest_points!,
          highest_points: createForm.highest_points!,
          division_points: createForm.division_points!,
        },
      });
      setIsCreating(false);
      setCreateForm({
        division: 'I',
        lowest_points: 0,
        highest_points: 0,
        division_points: 1,
      });
      toast.success('Division created successfully');
    } catch (error: any) {
      console.error('Failed to create division:', error);
      toast.error(error.response?.data?.detail || 'Failed to create division');
    }
  };
  
  const handleDelete = async (divisionId: number) => {
    if (!examId) return;
    
    if (confirm('Are you sure you want to delete this division?')) {
      try {
        await deleteDivision.mutateAsync({
          examId: examId,
          divisionId,
        });
        toast.success('Division deleted successfully');
      } catch (error: any) {
        console.error('Failed to delete division:', error);
        toast.error(error.response?.data?.detail || 'Failed to delete division');
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
          <h1 className="text-3xl font-bold">Divisions Configuration</h1>
          <p className="text-muted-foreground">{exam?.exam_name}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Division Ranges</CardTitle>
              <CardDescription>
                Configure point ranges for each division
              </CardDescription>
            </div>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Division
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Division</TableHead>
                <TableHead>Lowest Points</TableHead>
                <TableHead>Highest Points</TableHead>
                <TableHead>Division Points</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isCreating && (
                <TableRow>
                  <TableCell>
                    <Input
                      value={createForm.division}
                      onChange={(e) => setCreateForm({ ...createForm, division: e.target.value as Division })}
                      placeholder="Division (e.g., I, II, III)"
                      maxLength={3}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={createForm.lowest_points}
                      onChange={(e) => setCreateForm({ ...createForm, lowest_points: parseInt(e.target.value) || 0 })}
                      placeholder="Lowest points"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={createForm.highest_points}
                      onChange={(e) => setCreateForm({ ...createForm, highest_points: parseInt(e.target.value) || 0 })}
                      placeholder="Highest points"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={createForm.division_points}
                      onChange={(e) => setCreateForm({ ...createForm, division_points: parseInt(e.target.value) || 0 })}
                      placeholder="Division points"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" onClick={handleCreate} disabled={createDivision.isPending}>
                        {createDivision.isPending ? (
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
              {divisions?.map((division) => (
                <TableRow key={division.id}>
                  <TableCell>
                    {editingId === division.id ? (
                      <Input
                        value={editForm.division}
                        onChange={(e) => setEditForm({ ...editForm, division: e.target.value as Division })}
                        maxLength={3}
                      />
                    ) : (
                      <Badge variant="outline">{division.division}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === division.id ? (
                      <Input
                        type="number"
                        value={editForm.lowest_points}
                        onChange={(e) => setEditForm({ ...editForm, lowest_points: parseInt(e.target.value) || 0 })}
                      />
                    ) : (
                      division.lowest_points
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === division.id ? (
                      <Input
                        type="number"
                        value={editForm.highest_points}
                        onChange={(e) => setEditForm({ ...editForm, highest_points: parseInt(e.target.value) || 0 })}
                      />
                    ) : (
                      division.highest_points
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === division.id ? (
                      <Input
                        type="number"
                        value={editForm.division_points}
                        onChange={(e) => setEditForm({ ...editForm, division_points: parseInt(e.target.value) || 0 })}
                      />
                    ) : (
                      division.division_points
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingId === division.id ? (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" onClick={handleSave} disabled={updateDivision.isPending}>
                          {updateDivision.isPending ? (
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
                        <Button size="sm" variant="outline" onClick={() => handleEdit(division)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDelete(division.id)}
                          disabled={deleteDivision.isPending}
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
