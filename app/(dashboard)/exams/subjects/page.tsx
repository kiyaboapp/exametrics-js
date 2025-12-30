'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useExamContext } from '@/components/providers/exam-context';
import { useExam, useExamSubjects, useCreateExamSubject, useUpdateExamSubject, useDeleteExamSubject, useMasterSubjects } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import type { ExamSubject, MasterSubject } from '@/lib/types';

export default function SubjectsConfigPage() {
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
  
  const { data: exam } = useExam(examId);
  const { data: subjects, refetch: refetchSubjects } = useExamSubjects(examId);
  const { data: masterSubjects } = useMasterSubjects(exam?.exam_level);
  
  const createSubject = useCreateExamSubject();
  const updateSubject = useUpdateExamSubject();
  const deleteSubject = useDeleteExamSubject();
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<ExamSubject>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState<Partial<ExamSubject>>({
    subject_code: '',
    subject_name: '',
    subject_short: '',
    has_practical: false,
    exclude_from_gpa: false,
    is_primary: false,
    is_olevel: false,
    is_alevel: false,
  });
  
  const [selectedMasterSubject, setSelectedMasterSubject] = useState<string>('');

  if (!examId) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2 className="text-xl font-semibold">No Exam Selected</h2>
        <p className="text-muted-foreground">Please select an exam from the header first</p>
      </div>
    );
  }

  const handleEdit = (subject: ExamSubject) => {
    setEditingId(subject.id);
    setEditForm(subject);
  };

  const handleSave = async () => {
    if (!examId || !editingId) return;
    
    try {
      await updateSubject.mutateAsync({
        examId: examId,
        subjectId: editingId,
        subject: {
          subject_code: editForm.subject_code!,
          subject_name: editForm.subject_name!,
          subject_short: editForm.subject_short!,
          has_practical: editForm.has_practical || false,
          exclude_from_gpa: editForm.exclude_from_gpa || false,
          is_primary: editForm.is_primary || false,
          is_olevel: editForm.is_olevel || false,
          is_alevel: editForm.is_alevel || false,
        },
      });
      setEditingId(null);
      setEditForm({});
      toast.success('Subject updated successfully');
    } catch (error: any) {
      console.error('Failed to update subject:', error);
      toast.error(error.response?.data?.detail || 'Failed to update subject');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleCreate = async () => {
    if (!examId || !selectedMasterSubject) return;
    
    const masterSubject = masterSubjects?.find(s => s.subject_code === selectedMasterSubject);
    if (!masterSubject) return;
    
    try {
      await createSubject.mutateAsync({
        examId: examId,
        subject: {
          subject_code: masterSubject.subject_code,
          subject_name: masterSubject.subject_name,
          subject_short: createForm.subject_short || masterSubject.subject_short,
          has_practical: createForm.has_practical || false,
          exclude_from_gpa: createForm.exclude_from_gpa || false,
          is_primary: createForm.is_primary || false,
          is_olevel: createForm.is_olevel || false,
          is_alevel: createForm.is_alevel || false,
        },
      });
      setIsCreating(false);
      setSelectedMasterSubject('');
      setCreateForm({
        subject_code: '',
        subject_name: '',
        subject_short: '',
        has_practical: false,
        exclude_from_gpa: false,
        is_primary: false,
        is_olevel: false,
        is_alevel: false,
      });
      toast.success('Subject added successfully');
    } catch (error: any) {
      console.error('Failed to create subject:', error);
      toast.error(error.response?.data?.detail || 'Failed to add subject');
    }
  };
  
  const handleDelete = async (subjectId: number) => {
    if (!examId) return;
    
    if (confirm('Are you sure you want to delete this subject?')) {
      try {
        await deleteSubject.mutateAsync({
          examId: examId,
          subjectId,
        });
        toast.success('Subject deleted successfully');
      } catch (error: any) {
        console.error('Failed to delete subject:', error);
        toast.error(error.response?.data?.detail || 'Failed to delete subject');
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
          <h1 className="text-3xl font-bold">Subjects Configuration</h1>
          <p className="text-muted-foreground">{exam?.exam_name}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Exam Subjects</CardTitle>
              <CardDescription>
                Configure subjects for this examination
              </CardDescription>
            </div>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Subject
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Short</TableHead>
                  <TableHead>Practical</TableHead>
                  <TableHead>Exclude from GPA</TableHead>
                  <TableHead>Primary</TableHead>
                  <TableHead>O-Level</TableHead>
                  <TableHead>A-Level</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isCreating && (
                  <TableRow>
                    <TableCell>
                      <Select
                        value={selectedMasterSubject}
                        onValueChange={setSelectedMasterSubject}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {masterSubjects?.filter(ms => !subjects?.some(s => s.subject_code === ms.subject_code)).map((subject) => (
                            <SelectItem key={subject.id} value={subject.subject_code}>
                              {subject.subject_code} - {subject.subject_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {masterSubjects?.find(s => s.subject_code === selectedMasterSubject)?.subject_name || '-'}
                    </TableCell>
                    <TableCell>
                      <Input
                        value={createForm.subject_short}
                        onChange={(e) => setCreateForm({ ...createForm, subject_short: e.target.value })}
                        placeholder="Short"
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={createForm.has_practical || false}
                        onCheckedChange={(checked) => setCreateForm({ ...createForm, has_practical: checked as boolean })}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={createForm.exclude_from_gpa || false}
                        onCheckedChange={(checked) => setCreateForm({ ...createForm, exclude_from_gpa: checked as boolean })}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={createForm.is_primary || false}
                        onCheckedChange={(checked) => setCreateForm({ ...createForm, is_primary: checked as boolean })}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={createForm.is_olevel || false}
                        onCheckedChange={(checked) => setCreateForm({ ...createForm, is_olevel: checked as boolean })}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={createForm.is_alevel || false}
                        onCheckedChange={(checked) => setCreateForm({ ...createForm, is_alevel: checked as boolean })}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" onClick={handleCreate} disabled={createSubject.isPending}>
                          {createSubject.isPending ? (
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
                {subjects?.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell>
                      {subject.subject_code}
                    </TableCell>
                    <TableCell>
                      {subject.subject_name}
                    </TableCell>
                    <TableCell>
                      {editingId === subject.id ? (
                        <Input
                          value={editForm.subject_short}
                          onChange={(e) => setEditForm({ ...editForm, subject_short: e.target.value })}
                        />
                      ) : (
                        subject.subject_short
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === subject.id ? (
                        <Checkbox
                          checked={editForm.has_practical || false}
                          onCheckedChange={(checked) => setEditForm({ ...editForm, has_practical: checked as boolean })}
                        />
                      ) : (
                        <Checkbox checked={subject.has_practical} disabled />
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === subject.id ? (
                        <Checkbox
                          checked={editForm.exclude_from_gpa || false}
                          onCheckedChange={(checked) => setEditForm({ ...editForm, exclude_from_gpa: checked as boolean })}
                        />
                      ) : (
                        <Checkbox checked={subject.exclude_from_gpa} disabled />
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === subject.id ? (
                        <Checkbox
                          checked={editForm.is_primary || false}
                          onCheckedChange={(checked) => setEditForm({ ...editForm, is_primary: checked as boolean })}
                        />
                      ) : (
                        <Checkbox checked={subject.is_primary} disabled />
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === subject.id ? (
                        <Checkbox
                          checked={editForm.is_olevel || false}
                          onCheckedChange={(checked) => setEditForm({ ...editForm, is_olevel: checked as boolean })}
                        />
                      ) : (
                        <Checkbox checked={subject.is_olevel} disabled />
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === subject.id ? (
                        <Checkbox
                          checked={editForm.is_alevel || false}
                          onCheckedChange={(checked) => setEditForm({ ...editForm, is_alevel: checked as boolean })}
                        />
                      ) : (
                        <Checkbox checked={subject.is_alevel} disabled />
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingId === subject.id ? (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" onClick={handleSave} disabled={updateSubject.isPending}>
                            {updateSubject.isPending ? (
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
                          <Button size="sm" variant="outline" onClick={() => handleEdit(subject)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleDelete(subject.id)}
                            disabled={deleteSubject.isPending}
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
