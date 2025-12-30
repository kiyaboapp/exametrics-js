'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useExamContext } from '@/components/providers/exam-context';
import { useExam, useExamSchools, useExamSubjects } from '@/lib/hooks';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Download, FileSpreadsheet, Loader2 } from 'lucide-react';

export default function ExportTemplatesPage() {
  const { selectedExamId } = useExamContext();
  const { data: exam } = useExam(selectedExamId || '');
  const { data: schools } = useExamSchools(selectedExamId || '');
  const { data: subjects } = useExamSubjects(selectedExamId || '');

  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [exportAll, setExportAll] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!selectedExamId) return;

    setIsExporting(true);
    try {
      const schoolsToExport = exportAll 
        ? schools?.map(s => s.centre_number) || []
        : selectedSchools;

      await api.exportMarksTemplate(selectedExamId, schoolsToExport);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  if (!selectedExamId) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2 className="text-xl font-semibold">No Exam Selected</h2>
        <p className="text-muted-foreground">Please select an exam first</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/marks">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Export Templates</h1>
          <p className="text-muted-foreground">{exam?.exam_name}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold">{schools?.length || 0}</div>
            <p className="text-sm text-muted-foreground">Schools</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold">
              {schools?.reduce((sum, s) => sum + s.student_count, 0).toLocaleString() || 0}
            </div>
            <p className="text-sm text-muted-foreground">Students</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold">{subjects?.length || 0}</div>
            <p className="text-sm text-muted-foreground">Subjects</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Export Options</CardTitle>
          <CardDescription>
            Choose which schools to export templates for
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="export-all"
              checked={exportAll}
              onCheckedChange={(checked) => setExportAll(checked as boolean)}
            />
            <Label htmlFor="export-all">Export all schools</Label>
          </div>

          {!exportAll && (
            <div className="space-y-2">
              <Label>Select Schools</Label>
              <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto border rounded-lg p-4">
                {schools?.map((school) => (
                  <div key={school.centre_number} className="flex items-center space-x-2">
                    <Checkbox
                      id={school.centre_number}
                      checked={selectedSchools.includes(school.centre_number)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedSchools([...selectedSchools, school.centre_number]);
                        } else {
                          setSelectedSchools(selectedSchools.filter(s => s !== school.centre_number));
                        }
                      }}
                    />
                    <Label htmlFor={school.centre_number} className="text-sm">
                      {school.centre_number} - {school.school_name}
                    </Label>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedSchools.length} school(s) selected
              </p>
            </div>
          )}

          <Button
            size="lg"
            onClick={handleExport}
            disabled={isExporting || (!exportAll && selectedSchools.length === 0)}
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export {exportAll ? 'All' : selectedSchools.length} Template(s)
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Template Format</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 border rounded-lg">
            <FileSpreadsheet className="h-10 w-10 text-green-600" />
            <div>
              <p className="font-medium">Excel (.xlsx)</p>
              <p className="text-sm text-muted-foreground">
                Each school gets a separate sheet with student list and subject columns
              </p>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>The template includes:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Student exam numbers and names</li>
              <li>Columns for each subject the student is registered for</li>
              <li>Practical marks columns where applicable</li>
              <li>Data validation for mark ranges</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
