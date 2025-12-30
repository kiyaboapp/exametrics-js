'use client';

import Link from 'next/link';
import { useExamContext } from '@/components/providers/exam-context';
import { useExam, useLocationHierarchy } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Building2, Home, School } from 'lucide-react';

export default function LocationAnalysisPage() {
  const { selectedExamId } = useExamContext();
  const { data: exam } = useExam(selectedExamId || '');
  const { data: hierarchy, isLoading } = useLocationHierarchy(selectedExamId || '');

  if (!selectedExamId) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2 className="text-xl font-semibold">No Exam Selected</h2>
        <p className="text-muted-foreground">Please select an exam to view location analysis</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  const regions = hierarchy?.hierarchy ? Object.keys(hierarchy.hierarchy) : [];
  const totalCouncils = regions.reduce((sum, region) => 
    sum + Object.keys(hierarchy?.hierarchy?.[region]?.councils || {}).length, 0);
  const totalSchools = regions.reduce((sum, region) => 
    sum + (hierarchy?.hierarchy?.[region]?.total_schools || 0), 0);
  const totalStudents = regions.reduce((sum, region) => 
    sum + (hierarchy?.hierarchy?.[region]?.total_students || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Location Analysis</h1>
        <p className="text-muted-foreground">{exam?.exam_name}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <MapPin className="h-8 w-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{regions.length}</div>
                <p className="text-sm text-muted-foreground">Regions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Building2 className="h-8 w-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{totalCouncils}</div>
                <p className="text-sm text-muted-foreground">Councils</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <School className="h-8 w-8 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">{totalSchools}</div>
                <p className="text-sm text-muted-foreground">Schools</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Home className="h-8 w-8 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">{totalStudents.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Link href="/location/regions">
          <Card className="hover:border-primary transition-colors cursor-pointer h-full">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <CardTitle>Regional Overview</CardTitle>
                  <CardDescription>Compare performance across regions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View rankings, division distribution, and GPA comparisons for all regions
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/location/councils">
          <Card className="hover:border-primary transition-colors cursor-pointer h-full">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Building2 className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <CardTitle>Council Analysis</CardTitle>
                  <CardDescription>Drill down to council level</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Analyze performance by council with regional comparisons
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/location/schools">
          <Card className="hover:border-primary transition-colors cursor-pointer h-full">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <School className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                </div>
                <div>
                  <CardTitle>School Rankings</CardTitle>
                  <CardDescription>National and regional rankings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View top performing schools at national, regional, and council levels
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Regions Overview</CardTitle>
          <CardDescription>Click a region to view detailed analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {regions.sort().map((region) => {
              const data = hierarchy?.hierarchy?.[region];
              return (
                <Link key={region} href={`/location/regions?region=${region}`}>
                  <div className="p-4 border rounded-lg hover:border-primary transition-colors cursor-pointer">
                    <h3 className="font-medium">{region}</h3>
                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                      <span>{Object.keys(data?.councils || {}).length} councils</span>
                      <span>{data?.total_schools || 0} schools</span>
                      <span>{(data?.total_students || 0).toLocaleString()} students</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
