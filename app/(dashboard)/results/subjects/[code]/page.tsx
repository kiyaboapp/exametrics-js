'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useExamContext } from '@/components/providers/exam-context';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatGPA, formatCentreNumber } from '@/lib/utils';
import type { PaginatedResponse, SubjectRankingData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { BookOpen, ArrowLeft } from 'lucide-react';

export default function SubjectRankingsPage() {
  const params = useParams();
  const { selectedExamId } = useExamContext();
  const examId = selectedExamId;
  const subjectCode = params.code as string;

  const [data, setData] = useState<PaginatedResponse<SubjectRankingData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [sortBy, setSortBy] = useState<'gpa_asc' | 'gpa_desc'>('gpa_asc');

  useEffect(() => {
    if (!examId || !subjectCode) return;

    const fetchRankings = async () => {
      setLoading(true);
      try {
        const response = await api.getSubjectRankings(examId, subjectCode, {
          page,
          limit,
          sort_by: sortBy,
          format: 'json',
        });
        setData(response);
      } catch (error) {
        console.error('Failed to fetch subject rankings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [examId, subjectCode, page, limit, sortBy]);

  if (!examId || !subjectCode) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2 className="text-xl font-semibold">Missing Parameters</h2>
        <p className="text-muted-foreground">Please select an exam from the header</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/results">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            Subject Rankings: {subjectCode}
          </h1>
          <p className="text-muted-foreground">Schools ranked by subject GPA</p>
        </div>
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
            <p className="text-muted-foreground">Loading subject rankings...</p>
          </CardContent>
        </Card>
      ) : data && data.data.length > 0 ? (
        <>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Position</TableHead>
                    <TableHead>Centre</TableHead>
                    <TableHead>School Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead className="text-right">Subject GPA</TableHead>
                    <TableHead className="text-center">Ward</TableHead>
                    <TableHead className="text-center">Council</TableHead>
                    <TableHead className="text-center">Region</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.map((school) => (
                    <TableRow key={school.centre_number}>
                      <TableCell className="font-bold">
                        {school.position?.subject_pos ? (
                          <Badge variant={school.position.subject_pos <= 10 ? 'default' : 'outline'}>
                            #{school.position.subject_pos}
                          </Badge>
                        ) : '-'}
                      </TableCell>
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
                        <GPADisplay value={school.subject_gpa} className="font-semibold" />
                      </TableCell>
                      <TableCell className="text-center text-sm text-muted-foreground">
                        {school.position?.ward_pos}/{school.position?.ward_out_of}
                      </TableCell>
                      <TableCell className="text-center text-sm text-muted-foreground">
                        {school.position?.council_pos}/{school.position?.council_out_of}
                      </TableCell>
                      <TableCell className="text-center text-sm text-muted-foreground">
                        {school.position?.region_pos}/{school.position?.region_out_of}
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
            <p className="text-muted-foreground">No rankings found for this subject</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
