'use client';

import { useState } from 'react';
import { useExaminationBoards, useCreateExaminationBoard, useUpdateExaminationBoard, useDeleteExaminationBoard } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import type { ExaminationBoard } from '@/lib/types';

export default function ExaminationBoardsPage() {
  const { data: boards, refetch } = useExaminationBoards();
  const createBoard = useCreateExaminationBoard();
  const updateBoard = useUpdateExaminationBoard();
  const deleteBoard = useDeleteExaminationBoard();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ExaminationBoard>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    board_code: '',
    board_name: '',
    country: '',
  });

  const handleEdit = (board: ExaminationBoard) => {
    setEditingId(board.id);
    setEditForm(board);
  };

  const handleSave = async () => {
    if (!editingId) return;

    try {
      await updateBoard.mutateAsync({
        boardId: editingId,
        board: {
          board_code: editForm.board_code!,
          board_name: editForm.board_name!,
          country: editForm.country!,
        },
      });
      setEditingId(null);
      setEditForm({});
      toast.success('Board updated successfully');
    } catch (error: any) {
      console.error('Failed to update board:', error);
      toast.error(error.response?.data?.detail || 'Failed to update board');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleCreate = async () => {
    if (!createForm.board_code || !createForm.board_name || !createForm.country) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await createBoard.mutateAsync(createForm);
      setIsCreating(false);
      setCreateForm({ board_code: '', board_name: '', country: '' });
      toast.success('Board created successfully');
    } catch (error: any) {
      console.error('Failed to create board:', error);
      toast.error(error.response?.data?.detail || 'Failed to create board');
    }
  };

  const handleDelete = async (boardId: string) => {
    if (!confirm('Are you sure you want to delete this examination board?')) return;

    try {
      await deleteBoard.mutateAsync(boardId);
      toast.success('Board deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete board:', error);
      toast.error(error.response?.data?.detail || 'Failed to delete board');
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
            <h1 className="text-3xl font-bold">Examination Boards</h1>
            <p className="text-muted-foreground">Manage examination boards</p>
          </div>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Board
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Examination Boards</CardTitle>
          <CardDescription>
            Configure examination boards for different countries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Board Code</TableHead>
                <TableHead>Board Name</TableHead>
                <TableHead>Country</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isCreating && (
                <TableRow>
                  <TableCell>
                    <Input
                      value={createForm.board_code}
                      onChange={(e) => setCreateForm({ ...createForm, board_code: e.target.value })}
                      placeholder="NECTA"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={createForm.board_name}
                      onChange={(e) => setCreateForm({ ...createForm, board_name: e.target.value })}
                      placeholder="National Examinations Council"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={createForm.country}
                      onChange={(e) => setCreateForm({ ...createForm, country: e.target.value })}
                      placeholder="Tanzania"
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
              {boards?.map((board) => (
                <TableRow key={board.id}>
                  <TableCell>
                    {editingId === board.id ? (
                      <Input
                        value={editForm.board_code}
                        onChange={(e) => setEditForm({ ...editForm, board_code: e.target.value })}
                      />
                    ) : (
                      <Badge variant="outline">{board.board_code}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === board.id ? (
                      <Input
                        value={editForm.board_name}
                        onChange={(e) => setEditForm({ ...editForm, board_name: e.target.value })}
                      />
                    ) : (
                      <span className="font-medium">{board.board_name}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === board.id ? (
                      <Input
                        value={editForm.country}
                        onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                      />
                    ) : (
                      board.country
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingId === board.id ? (
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
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(board)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(board.id)}>
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
