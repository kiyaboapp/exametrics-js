'use client';

import { useState } from 'react';
import { useExamContext } from '@/components/providers/exam-context';
import { useExamSchools, useExam } from '@/lib/hooks';
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
import { Search, Eye, Download, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, TrendingUp, Users, BookOpen, Trophy } from 'lucide-react';

export default function ResultsPage() {
  const { selectedExamId } = useExamContext();
  const { data: exam } = useExam(selectedExamId || '');
  const { data: schools, isLoading } = useExamSchools(selectedExamId || '');
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('all');

  if (!selectedExamId) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2 className="text-xl font-semibold">No Exam Selected</h2>
        <p className="text-muted-foreground">Please select an exam from the header to view results</p>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Results</h1>
          <p className="text-muted-foreground">
            {exam?.exam_name} - {schools?.length || 0} schools
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/results/process?exam=${selectedExamId}`}>
            <Button variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              Process Results
            </Button>
          </Link>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>

      {!exam?.results_processed && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
          <CardContent className="p-4">
            <p className="text-yellow-800 dark:text-yellow-200">
              ⚠️ Results have not been processed yet. Click "Process Results" to generate results.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              School Rankings
            </CardTitle>
            <CardDescription>View schools ranked by GPA with detailed positions</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/results/rankings">
              <Button>View Rankings</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              School Overviews
            </CardTitle>
            <CardDescription>Compare GPA breakdowns across schools</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/results/overviews">
              <Button>View Overviews</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Subject Rankings
            </CardTitle>
            <CardDescription>View rankings by specific subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Select onValueChange={(code) => router.push(`/results/subjects/${code}`)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="011">Mathematics</SelectItem>
                  <SelectItem value="012">Physics</SelectItem>
                  <SelectItem value="013">Chemistry</SelectItem>
                  <SelectItem value="014">Biology</SelectItem>
                  <SelectItem value="021">History</SelectItem>
                  <SelectItem value="022">Geography</SelectItem>
                  <SelectItem value="031">Kiswahili</SelectItem>
                  <SelectItem value="032">English Language</SelectItem>
                  <SelectItem value="041">Civics</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Process Results</CardTitle>
            <CardDescription>Process examination results to generate analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/results/process">
              <Button>Process Results</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>School Results</CardTitle>
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
                <TableHead>Council</TableHead>
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
                  <TableCell className="text-right">{school.student_count}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/results/school?exam=${selectedExamId}&centre=${school.centre_number}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        View Analysis
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {filteredSchools?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
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
