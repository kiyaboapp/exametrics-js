'use client';

import { useState } from 'react';
import { useUsers, useExams, useUserExams, useCreateUserExam, useDeleteUserExam } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { ArrowLeft, UserPlus, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function UserAssignmentsPage() {
  const { data: users } = useUsers();
  const { data: exams } = useExams();
  const { data: userExams, refetch } = useUserExams();
  const createUserExam = useCreateUserExam();
  const deleteUserExam = useDeleteUserExam();

  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('USER');

  const handleAssign = async () => {
    if (!selectedUser || !selectedExam) {
      toast.error('Please select both user and exam');
      return;
    }

    try {
      await createUserExam.mutateAsync({
        user_id: selectedUser,
        exam_id: selectedExam,
        role: selectedRole,
        permissions: [],
      });
      toast.success('User assigned to exam successfully');
      setSelectedUser('');
      setSelectedExam('');
      refetch();
    } catch (error: any) {
      console.error('Failed to assign user:', error);
      toast.error(error.response?.data?.detail || 'Failed to assign user');
    }
  };

  const handleRemove = async (userExamId: string) => {
    if (!confirm('Are you sure you want to remove this assignment?')) return;

    try {
      await deleteUserExam.mutateAsync(userExamId);
      toast.success('Assignment removed successfully');
      refetch();
    } catch (error: any) {
      console.error('Failed to remove assignment:', error);
      toast.error(error.response?.data?.detail || 'Failed to remove assignment');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/users">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Exam Assignments</h1>
          <p className="text-muted-foreground">Assign users to exams</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assign User to Exam</CardTitle>
          <CardDescription>
            Grant users access to specific exams
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">User</label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {users?.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.username} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Exam</label>
              <Select value={selectedExam} onValueChange={setSelectedExam}>
                <SelectTrigger>
                  <SelectValue placeholder="Select exam" />
                </SelectTrigger>
                <SelectContent>
                  {exams?.map((exam) => (
                    <SelectItem key={exam.exam_id} value={exam.exam_id}>
                      {exam.exam_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleAssign} 
            disabled={createUserExam.isPending || !selectedUser || !selectedExam}
          >
            {createUserExam.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Assigning...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Assign User
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Assignments</CardTitle>
          <CardDescription>
            View and manage user-exam assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!userExams || userExams.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No assignments found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Exam</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userExams.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">
                      {assignment.user?.username || 'Unknown'}
                    </TableCell>
                    <TableCell>{assignment.user?.email || 'N/A'}</TableCell>
                    <TableCell>{assignment.exam?.exam_name || 'Unknown'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{assignment.role}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(assignment.id)}
                        disabled={deleteUserExam.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
