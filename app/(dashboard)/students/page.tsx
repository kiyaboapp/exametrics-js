'use client';

import { useState } from 'react';
import { useExamContext } from '@/components/providers/exam-context';
import { useExamSchools, useExam } from '@/lib/hooks';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Plus, Upload, Users, School } from 'lucide-react';
import Link from 'next/link';

export default function StudentsPage() {
  const { selectedExamId } = useExamContext();
  const { data: exam } = useExam(selectedExamId || '');
  const { data: schools, isLoading } = useExamSchools(selectedExamId || '');
  
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('all');

  if (!selectedExamId) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2 className="text-xl font-semibold">No Exam Selected</h2>
        <p className="text-muted-foreground">Please select an exam from the header to view students</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  const regions = [...new Set(schools?.map(s => s.region_name).filter(Boolean))].sort();
  const totalStudents = schools?.reduce((sum, s) => sum + s.student_count, 0) || 0;
  
  const filteredSchools = schools?.filter((school) => {
    const matchesSearch = school.school_name.toLowerCase().includes(search.toLowerCase()) ||
      school.centre_number.includes(search);
    const matchesRegion = regionFilter === 'all' || school.region_name === regionFilter;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground">
            {exam?.exam_name} - {totalStudents.toLocaleString()} students
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/students/register">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Register Student
            </Button>
          </Link>
          <Link href="/students/upload">
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload PDFs
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{totalStudents.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <School className="h-8 w-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{schools?.length || 0}</div>
                <p className="text-sm text-muted-foreground">Schools</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Badge variant={exam?.has_students_registered ? 'default' : 'secondary'} className="text-lg px-4 py-2">
                {exam?.has_students_registered ? '✅ Students Registered' : '⚪ No Students'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Students by School</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by school name or centre number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {regions.map((region) => (
                  <SelectItem key={region} value={region!}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Centre Number</TableHead>
                <TableHead>School Name</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Students</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchools?.map((school) => (
                <TableRow key={school.centre_number}>
                  <TableCell className="font-mono">{school.centre_number}</TableCell>
                  <TableCell className="font-medium">{school.school_name}</TableCell>
                  <TableCell>{school.region_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{school.school_type}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold">{school.student_count}</TableCell>
                </TableRow>
              ))}
              {filteredSchools?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No schools found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
