'use client';

import { useState, useEffect } from 'react';
import { useExamContext } from '@/components/providers/exam-context';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatGPA, formatCentreNumber } from '@/lib/utils';
import type { PaginatedResponse, SchoolOverview } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Pagination } from '@/components/pagination';
import { GPADisplay } from '@/components/gpa-display';
import { BarChart3 } from 'lucide-react';

export default function SchoolOverviewsPage() {
  const { selectedExamId } = useExamContext();
  const examId = selectedExamId;

  const [data, setData] = useState<PaginatedResponse<SchoolOverview> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [sortBy, setSortBy] = useState<'gpa_asc' | 'gpa_desc'>('gpa_asc');

  useEffect(() => {
    if (!examId) return;

    const fetchOverviews = async () => {
      setLoading(true);
      try {
        const response = await api.getSchoolOverviews(examId, {
          page,
          limit,
          sort_by: sortBy,
          format: 'json',
        });
        setData(response);
      } catch (error) {
        console.error('Failed to fetch overviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverviews();
  }, [examId, page, limit, sortBy]);

  if (!examId) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2 className="text-xl font-semibold">No Exam Selected</h2>
        <p className="text-muted-foreground">Please select an exam from the header to view overviews</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="h-8 w-8" />
          School Overviews
        </h1>
        <p className="text-muted-foreground">GPA breakdown: School, Subjects, Divisions</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Filters</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={limit.toString()} onValueChange={(v) => { setLimit(Number(v)); setPage(1); }}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                  <SelectItem value="100">100 per page</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpa_asc">Best First</SelectItem>
                  <SelectItem value="gpa_desc">Worst First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Loading overviews...</p>
          </CardContent>
        </Card>
      ) : data && data.data.length > 0 ? (
        <>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Centre</TableHead>
                    <TableHead>School Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead className="text-right">School GPA</TableHead>
                    <TableHead className="text-right">Subjects GPA</TableHead>
                    <TableHead className="text-right">Divisions GPA</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.map((school) => (
                    <TableRow key={school.centre_number}>
                      <TableCell className="font-mono text-sm">
                        {formatCentreNumber(school.centre_number)}
                      </TableCell>
                      <TableCell className="font-medium">
                        <Link 
                          href={`/results/school?exam=${examId}&centre=${school.centre_number}`}
                          className="hover:underline"
                        >
                          {school.school_name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant={school.school_type === 'GOVERNMENT' ? 'secondary' : 'outline'}>
                          {school.school_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{school.region_name}</TableCell>
                      <TableCell className="text-right">
                        <GPADisplay value={school.school_gpa} className="font-semibold" />
                      </TableCell>
                      <TableCell className="text-right">
                        <GPADisplay value={school.subjects_gpa} />
                      </TableCell>
                      <TableCell className="text-right">
                        <GPADisplay value={school.divisions_gpa} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Pagination
            currentPage={data.pagination.current}
            totalPages={data.pagination.total_pages}
            totalItems={data.pagination.total_items}
            onPageChange={setPage}
          />
        </>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No overviews found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
