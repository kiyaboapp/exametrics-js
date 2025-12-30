'use client';

import { useExamContext } from '@/components/providers/exam-context';
import { useExam, useLocationHierarchy } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Building2, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function CouncilsPage() {
  const { selectedExamId } = useExamContext();
  const { data: exam } = useExam(selectedExamId || '');
  const { data: hierarchy, isLoading } = useLocationHierarchy(selectedExamId || '');

  if (!selectedExamId) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2 className="text-xl font-semibold">No Exam Selected</h2>
        <p className="text-muted-foreground">Please select an exam from the header first</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading councils...</div>;
  }

  // Flatten hierarchy to get all councils
  const allCouncils: { regionName: string; councilName: string; totalSchools: number }[] = [];
  if (hierarchy?.hierarchy) {
    Object.entries(hierarchy.hierarchy).forEach(([regionName, regionData]) => {
      Object.entries(regionData.councils).forEach(([councilName, councilData]) => {
        allCouncils.push({
          regionName,
          councilName,
          totalSchools: councilData.total_schools,
        });
      });
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/location">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Council Analysis</h1>
          <p className="text-muted-foreground">
            {exam?.exam_name} • {allCouncils.length} Councils
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Councils Overview</CardTitle>
          <CardDescription>
            List of councils and their school counts in this exam
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Council Name</TableHead>
                <TableHead>Region</TableHead>
                <TableHead className="text-right">Schools</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allCouncils.map((council) => (
                <TableRow key={`${council.regionName}-${council.councilName}`}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      {council.councilName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {council.regionName}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary">{council.totalSchools}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/location/regions?region=${encodeURIComponent(council.regionName)}`}>
                      <Button variant="outline" size="sm">
                        View Region
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {allCouncils.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No councils found for this exam.
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
