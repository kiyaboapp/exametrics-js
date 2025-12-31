'use client';

import { useState } from 'react';
import { useExamContext } from '@/components/providers/exam-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, FileText, Table, Database } from 'lucide-react';

export default function ExportPage() {
  const [selectedExports, setSelectedExports] = useState<string[]>([]);

  const exportOptions = [
    { id: 'rankings', label: 'School Rankings', icon: Trophy },
    { id: 'overviews', label: 'School Overviews', icon: BarChart3 },
    { id: 'subjects', label: 'Subject Rankings', icon: BookOpen },
    { id: 'raw', label: 'Raw Data', icon: Database },
    { id: 'reports', label: 'Full Reports', icon: FileText },
  ];

  const { selectedExamId } = useExamContext();

  const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
    console.log(`Exporting ${selectedExports} in ${format}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Download className="h-8 w-8" />
          Export Data
        </h1>
        <p className="text-muted-foreground">Download examination results and analytics</p>
      </div>

      {!selectedExamId ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Please select an exam from the header to export data</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Select Data to Export</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {exportOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2 p-4 border rounded-lg">
                    <Checkbox
                      id={option.id}
                      checked={selectedExports.includes(option.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedExports([...selectedExports, option.id]);
                        } else {
                          setSelectedExports(selectedExports.filter(id => id !== option.id));
                        }
                      }}
                    />
                    <option.icon className="h-5 w-5 text-muted-foreground" />
                    <label htmlFor={option.id} className="text-sm font-medium flex-1">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Export Format</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  onClick={() => handleExport('excel')}
                  disabled={selectedExports.length === 0}
                >
                  <Table className="mr-2 h-4 w-4" />
                  Export as Excel
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExport('csv')}
                  disabled={selectedExports.length === 0}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Export as CSV
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExport('pdf')}
                  disabled={selectedExports.length === 0}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Export as PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
