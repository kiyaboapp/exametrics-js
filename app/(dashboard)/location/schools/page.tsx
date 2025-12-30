'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useExamContext } from '@/components/providers/exam-context';
import { useExam, useExamSchools } from '@/lib/hooks';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Search, Eye } from 'lucide-react';

export default function SchoolRankingsPage() {
  const { selectedExamId } = useExamContext();
  const { data: exam } = useExam(selectedExamId || '');
  const { data: schools, isLoading } = useExamSchools(selectedExamId || '');
  
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('all');

  if (!selectedExamId) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2 className="text-xl font-semibold">No Exam Selected</h2>
        <p className="text-muted-foreground">Please select an exam first</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  const regions = [...new Set(schools?.map(s => s.region_name).filter(Boolean))].sort();
  
  const filteredSchools = schools?.filter((school) => {
    const matchesSearch = school.school_name.toLowerCase().includes(search.toLowerCase()) ||
      school.centre_number.includes(search);
    const matchesRegion = regionFilter === 'all' || school.region_name === regionFilter;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/location">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">School Rankings</h1>
          <p className="text-muted-foreground">
            {exam?.exam_name} • {schools?.length || 0} Schools
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Schools</CardTitle>
          <CardDescription>
            Click on a school to view detailed analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Centre Number</TableHead>
                <TableHead>School Name</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Council</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Students</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchools?.map((school) => (
                <TableRow key={school.centre_number}>
                  <TableCell className="font-mono">{school.centre_number}</TableCell>
                  <TableCell className="font-medium">{school.school_name}</TableCell>
                  <TableCell>{school.region_name}</TableCell>
                  <TableCell>{school.council_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{school.school_type}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{school.student_count}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/results/school?exam=${selectedExamId}&centre=${school.centre_number}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {filteredSchools?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
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
