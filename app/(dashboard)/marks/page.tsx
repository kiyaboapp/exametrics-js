'use client';

import Link from 'next/link';
import { useExamContext } from '@/components/providers/exam-context';
import { useExam, useUploadTrails } from '@/lib/hooks';
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
import { Download, Upload, History, FileSpreadsheet } from 'lucide-react';
import { format } from 'date-fns';

export default function MarksPage() {
  const { selectedExamId } = useExamContext();
  const { data: exam } = useExam(selectedExamId || '');
  const { data: trails, isLoading } = useUploadTrails(selectedExamId || '');

  if (!selectedExamId) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2 className="text-xl font-semibold">No Exam Selected</h2>
        <p className="text-muted-foreground">Please select an exam from the header to manage marks</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marks Management</h1>
          <p className="text-muted-foreground">{exam?.exam_name}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:border-primary transition-colors cursor-pointer">
          <Link href="/marks/export">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Download className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <CardTitle>Export Templates</CardTitle>
                  <CardDescription>Download Excel templates for marks entry</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Generate Excel files with student lists ready for marks entry. 
                Templates include subjects based on student registrations.
              </p>
              <Button className="mt-4">
                <Download className="mr-2 h-4 w-4" />
                Export Templates
              </Button>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:border-primary transition-colors cursor-pointer">
          <Link href="/marks/upload">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Upload className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <CardTitle>Upload Marks</CardTitle>
                  <CardDescription>Import marks from Excel files</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Upload completed Excel files with student marks. 
                System will validate and process the data.
              </p>
              <Button className="mt-4">
                <Upload className="mr-2 h-4 w-4" />
                Upload Marks
              </Button>
            </CardContent>
          </Link>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <History className="h-5 w-5" />
              <CardTitle>Upload History</CardTitle>
            </div>
            <Badge variant={exam?.has_marks_uploaded ? 'default' : 'secondary'}>
              {exam?.has_marks_uploaded ? '✅ Marks Uploaded' : '⚪ No Marks Yet'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : trails && trails.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>File Name</TableHead>
                  <TableHead>School</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trails.slice(0, 10).map((trail) => (
                  <TableRow key={trail.id}>
                    <TableCell>
                      {format(new Date(trail.created_at), 'dd MMM yyyy HH:mm')}
                    </TableCell>
                    <TableCell className="font-medium">{trail.file_name}</TableCell>
                    <TableCell>{trail.centre_number}</TableCell>
                    <TableCell>{trail.records_count}</TableCell>
                    <TableCell>
                      <Badge variant={trail.status === 'success' ? 'default' : 'destructive'}>
                        {trail.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No upload history yet</p>
              <p className="text-sm mt-1">Upload marks to see history here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
