'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useExams } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, MoreHorizontal, Eye, Edit, Trash2, PlayCircle, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';
import { EXAM_LEVELS } from '@/lib/constants';
import type { Exam, ExamLevel } from '@/lib/types';

export default function ExamsPage() {
  const { data: exams, isLoading } = useExams();
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredExams = exams?.filter((exam) => {
    const matchesSearch = exam.exam_name.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = levelFilter === 'all' || exam.exam_level === levelFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && exam.is_active) ||
      (statusFilter === 'inactive' && !exam.is_active);
    return matchesSearch && matchesLevel && matchesStatus;
  });

  const getStatusBadge = (exam: Exam) => {
    if (exam.results_processed) {
      return <Badge className="bg-green-500">Processed</Badge>;
    }
    if (exam.has_marks_uploaded) {
      return <Badge className="bg-yellow-500">Ready to Process</Badge>;
    }
    if (exam.has_students_registered) {
      return <Badge className="bg-blue-500">Awaiting Marks</Badge>;
    }
    return <Badge variant="secondary">Empty</Badge>;
  };

  const getLevelBadge = (level: ExamLevel) => {
    const colors: Record<ExamLevel, string> = {
      'STNA': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'SFNA': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      'PSLE': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'FTNA': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
      'CSEE': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'ACSEE': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    return <Badge className={colors[level]}>{level}</Badge>;
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Exams</h1>
          <p className="text-muted-foreground">Manage examinations</p>
        </div>
        <Link href="/exams/create">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Create Exam
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search exams..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {EXAM_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Processing</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExams?.map((exam) => (
                <TableRow key={`exam-${exam.id}`}>
                  <TableCell className="font-medium">
                    {exam.exam_name}
                    {exam.exam_name_swahili && (
                      <span className="block text-sm text-muted-foreground">
                        {exam.exam_name_swahili}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{getLevelBadge(exam.exam_level)}</TableCell>
                  <TableCell>
                    {format(new Date(exam.start_date), 'dd MMM')} - {format(new Date(exam.end_date), 'dd MMM yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={exam.is_active ? 'default' : 'secondary'}>
                      {exam.is_active ? '✅ Active' : '⏸️ Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(exam)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/exams/${exam.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/exams/${exam.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/results/process?exam=${exam.id}`}>
                            <PlayCircle className="mr-2 h-4 w-4" />
                            Process Results
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/results?exam=${exam.id}`}>
                            <BarChart3 className="mr-2 h-4 w-4" />
                            View Results
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredExams?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No exams found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
