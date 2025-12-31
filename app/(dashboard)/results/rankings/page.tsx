'use client';

import { useState, useEffect } from 'react';
import { useExamContext } from '@/components/providers/exam-context';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatGPA, formatCentreNumber } from '@/lib/utils';
import type { PaginatedResponse, SchoolRankingData } from '@/lib/types';
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
import { Pagination } from '@/components/pagination';
import { GPADisplay } from '@/components/gpa-display';
import { Trophy, TrendingUp, TrendingDown, Search } from 'lucide-react';

export default function SchoolRankingsPage() {
  const { selectedExamId } = useExamContext();
  const examId = selectedExamId;

  const [data, setData] = useState<PaginatedResponse<SchoolRankingData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [sortBy, setSortBy] = useState<'gpa_asc' | 'gpa_desc'>('gpa_asc');
  const [searchCentre, setSearchCentre] = useState('');

  useEffect(() => {
    if (!examId) return;

    const fetchRankings = async () => {
      setLoading(true);
      try {
        const response = await api.getSchoolRankings(examId, {
          page,
          limit,
          sort_by: sortBy,
          format: 'json',
          centres: searchCentre || undefined,
        });
        setData(response);
      } catch (error) {
        console.error('Failed to fetch rankings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [examId, page, limit, sortBy, searchCentre]);

  if (!examId) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2 className="text-xl font-semibold">No Exam Selected</h2>
        <p className="text-muted-foreground">Please select an exam from the header to view rankings</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Trophy className="h-8 w-8" />
          School Rankings
        </h1>
        <p className="text-muted-foreground">Schools ranked by GPA (4 decimal places)</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Filters & Sorting</CardTitle>
              <CardDescription>Customize your view</CardDescription>
            </div>
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
                  <SelectItem value="gpa_asc">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Best First
                    </div>
                  </SelectItem>
                  <SelectItem value="gpa_desc">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4" />
                      Worst First
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter by centre numbers (comma-separated, e.g., s0330,s2532)"
              value={searchCentre}
              onChange={(e) => setSearchCentre(e.target.value.toLowerCase())}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Loading rankings...</p>
          </CardContent>
        </Card>
      ) : data && data.data.length > 0 ? (
        <>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Overall</TableHead>
                    <TableHead>Centre</TableHead>
                    <TableHead>School Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Council</TableHead>
                    <TableHead className="text-right">GPA</TableHead>
                    <TableHead className="text-center">Ward</TableHead>
                    <TableHead className="text-center">Council</TableHead>
                    <TableHead className="text-center">Region</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.map((school) => (
                    <TableRow key={school.centre_number}>
                      <TableCell className="font-bold">
                        <Badge variant={school.school_ranking.overall_pos! <= 10 ? 'default' : 'outline'}>
                          #{school.school_ranking.overall_pos}
                        </Badge>
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
                      <TableCell className="text-sm">{school.council_name}</TableCell>
                      <TableCell className="text-right">
                        <GPADisplay value={school.school_gpa} className="text-base font-semibold" />
                      </TableCell>
                      <TableCell className="text-center text-sm text-muted-foreground">
                        {school.school_ranking.ward_pos}/{school.school_ranking.ward_out_of}
                      </TableCell>
                      <TableCell className="text-center text-sm text-muted-foreground">
                        {school.school_ranking.council_pos}/{school.school_ranking.council_out_of}
                      </TableCell>
                      <TableCell className="text-center text-sm text-muted-foreground">
                        {school.school_ranking.region_pos}/{school.school_ranking.region_out_of}
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
            <p className="text-muted-foreground">No rankings found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
