'use client';

import { useState } from 'react';
import { useMasterSubjects, useCreateMasterSubject, useUpdateMasterSubject, useDeleteMasterSubject } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { ArrowLeft, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import type { MasterSubject, ExamLevel } from '@/lib/types';

export default function MasterSubjectsPage() {
  const [selectedLevel, setSelectedLevel] = useState<ExamLevel>('FTNA');
  const { data: subjects, refetch } = useMasterSubjects(selectedLevel);
  const createSubject = useCreateMasterSubject();
  const updateSubject = useUpdateMasterSubject();
  const deleteSubject = useDeleteMasterSubject();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<MasterSubject>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    subject_code: '',
    subject_name: '',
    subject_short: '',
    exam_level: selectedLevel,
    has_practical: false,
  });

  const handleEdit = (subject: MasterSubject) => {
    setEditingId(subject.id);
    setEditForm(subject);
  };

  const handleSave = async () => {
    if (!editingId) return;

    try {
      await updateSubject.mutateAsync({
        subjectId: editingId,
        subject: {
          subject_code: editForm.subject_code!,
          subject_name: editForm.subject_name!,
          subject_short: editForm.subject_short!,
          exam_level: editForm.exam_level!,
          has_practical: editForm.has_practical || false,
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
    if (!createForm.subject_code || !createForm.subject_name || !createForm.subject_short) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createSubject.mutateAsync(createForm);
      setIsCreating(false);
      setCreateForm({
        subject_code: '',
        subject_name: '',
        subject_short: '',
        exam_level: selectedLevel,
        has_practical: false,
      });
      toast.success('Subject created successfully');
    } catch (error: any) {
      console.error('Failed to create subject:', error);
      toast.error(error.response?.data?.detail || 'Failed to create subject');
    }
  };

  const handleDelete = async (subjectId: number) => {
    if (!confirm('Are you sure you want to delete this subject?')) return;

    try {
      await deleteSubject.mutateAsync(subjectId);
      toast.success('Subject deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete subject:', error);
      toast.error(error.response?.data?.detail || 'Failed to delete subject');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/settings">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Master Subjects</h1>
            <p className="text-muted-foreground">Manage subject templates</p>
          </div>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Subject
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Master Subjects</CardTitle>
              <CardDescription>
                Configure subject templates for different exam levels
              </CardDescription>
            </div>
            <Select value={selectedLevel} onValueChange={(value) => setSelectedLevel(value as ExamLevel)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FTNA">FTNA (Primary)</SelectItem>
                <SelectItem value="CSEE">CSEE (O-Level)</SelectItem>
                <SelectItem value="ACSEE">ACSEE (A-Level)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Subject Name</TableHead>
                <TableHead>Short</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Practical</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isCreating && (
                <TableRow>
                  <TableCell>
                    <Input
                      value={createForm.subject_code}
                      onChange={(e) => setCreateForm({ ...createForm, subject_code: e.target.value })}
                      placeholder="021"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={createForm.subject_name}
                      onChange={(e) => setCreateForm({ ...createForm, subject_name: e.target.value })}
                      placeholder="MATHEMATICS"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={createForm.subject_short}
                      onChange={(e) => setCreateForm({ ...createForm, subject_short: e.target.value })}
                      placeholder="MATH"
                    />
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{selectedLevel}</Badge>
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={createForm.has_practical}
                      onCheckedChange={(checked) => setCreateForm({ ...createForm, has_practical: checked as boolean })}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" onClick={handleCreate}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setIsCreating(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {subjects?.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell>
                    {editingId === subject.id ? (
                      <Input
                        value={editForm.subject_code}
                        onChange={(e) => setEditForm({ ...editForm, subject_code: e.target.value })}
                      />
                    ) : (
                      <Badge variant="outline">{subject.subject_code}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === subject.id ? (
                      <Input
                        value={editForm.subject_name}
                        onChange={(e) => setEditForm({ ...editForm, subject_name: e.target.value })}
                      />
                    ) : (
                      <span className="font-medium">{subject.subject_name}</span>
                    )}
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
                    <Badge variant="secondary">{subject.exam_level}</Badge>
                  </TableCell>
                  <TableCell>
                    {editingId === subject.id ? (
                      <Checkbox
                        checked={editForm.has_practical}
                        onCheckedChange={(checked) => setEditForm({ ...editForm, has_practical: checked as boolean })}
                      />
                    ) : (
                      subject.has_practical ? <Badge>Yes</Badge> : <Badge variant="outline">No</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingId === subject.id ? (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" onClick={handleSave}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleCancel}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(subject)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(subject.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
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
