'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useExamContext } from '@/components/providers/exam-context';
import { useExam, useLocationAnalyses, useRegionSummary } from '@/lib/hooks';
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
import { ArrowLeft, MapPin, TrendingUp, TrendingDown } from 'lucide-react';
import { DivisionPieChart } from '@/components/charts/division-pie-chart';
import { GPACard } from '@/components/gpa-card';
import { isSecondary } from '@/lib/constants';

export default function RegionalOverviewPage() {
  const searchParams = useSearchParams();
  const selectedRegionParam = searchParams.get('region');
  
  const { selectedExamId } = useExamContext();
  const { data: exam } = useExam(selectedExamId || '');
  const { data: analyses, isLoading } = useLocationAnalyses(selectedExamId || '');
  
  const [selectedRegion, setSelectedRegion] = useState(selectedRegionParam || '');
  const { data: regionSummary } = useRegionSummary(selectedExamId || '', selectedRegion);

  if (!selectedExamId) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2 className="text-xl font-semibold">No Exam Selected</h2>
        <p className="text-muted-foreground">Please select an exam first</p>
      </div>
    );
  }

  const showGPA = exam && isSecondary(exam.exam_level);
  const regionAnalyses = analyses?.filter(a => a.location_type === 'REGION') || [];
  const regions = regionAnalyses.map(a => a.region_name).filter(Boolean).sort();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/location">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Regional Overview</h1>
          <p className="text-muted-foreground">{exam?.exam_name}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Region</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select a region to view details" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region} value={region!}>{region}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedRegion && regionSummary && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            {showGPA && (
              <GPACard value={regionSummary.region_gpa || 0} label="Region GPA" />
            )}
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold">{regionSummary.total_schools || 0}</div>
                <p className="text-sm text-muted-foreground">Schools</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold">
                  {(regionSummary.total_students || 0).toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">Students</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold">#{regionSummary.national_rank || '-'}</div>
                <p className="text-sm text-muted-foreground">National Rank</p>
              </CardContent>
            </Card>
          </div>

          {showGPA && regionSummary.division_summary && (
            <Card>
              <CardHeader>
                <CardTitle>Division Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <DivisionPieChart data={regionSummary.division_summary} />
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Regions Ranking</CardTitle>
          <CardDescription>
            {showGPA ? 'Sorted by GPA (lower is better)' : 'Sorted by average marks (higher is better)'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Region</TableHead>
                  {showGPA && <TableHead className="text-right">GPA</TableHead>}
                  <TableHead className="text-right">Average</TableHead>
                  <TableHead className="text-right">Schools</TableHead>
                  <TableHead className="text-right">Students</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {regionAnalyses
                  .sort((a, b) => showGPA 
                    ? (a.gpa || 99) - (b.gpa || 99)
                    : (b.average_marks || 0) - (a.average_marks || 0)
                  )
                  .map((analysis, index) => (
                    <TableRow 
                      key={analysis.id}
                      className={analysis.region_name === selectedRegion ? 'bg-accent' : ''}
                    >
                      <TableCell>
                        <Badge variant={index < 3 ? 'default' : 'outline'}>
                          #{index + 1}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        <Link 
                          href={`/location/regions?region=${analysis.region_name}`}
                          className="hover:underline"
                        >
                          {analysis.region_name}
                        </Link>
                      </TableCell>
                      {showGPA && (
                        <TableCell className="text-right font-mono">
                          {analysis.gpa?.toFixed(2) || '-'}
                        </TableCell>
                      )}
                      <TableCell className="text-right">
                        {analysis.average_marks?.toFixed(1) || '-'}%
                      </TableCell>
                      <TableCell className="text-right">{analysis.total_schools || 0}</TableCell>
                      <TableCell className="text-right">
                        {(analysis.total_students || 0).toLocaleString()}
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
