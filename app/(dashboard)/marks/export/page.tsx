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
import { Input } from '@/components/ui/input';
import { ArrowLeft, Download, FileSpreadsheet, Loader2 } from 'lucide-react';

export default function ExportTemplatesPage() {
  const { selectedExamId } = useExamContext();
  const { data: exam } = useExam(selectedExamId || '');
  const { data: schools } = useExamSchools(selectedExamId || '');
  const { data: subjects } = useExamSubjects(selectedExamId || '');

  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  
  // Export options
  const [practicalMode, setPracticalMode] = useState<number>(0);
  const [includeMarks, setIncludeMarks] = useState(false);
  const [includeUnregistered, setIncludeUnregistered] = useState(false);
  const [includeAbsent, setIncludeAbsent] = useState(true);
  const [marksFiller, setMarksFiller] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [councilFilter, setCouncilFilter] = useState<string>('all');
  const [wardFilter, setWardFilter] = useState<string>('all');
  const [schoolTypeFilter, setSchoolTypeFilter] = useState<string>('all');

  const handleExport = async () => {
    if (!selectedExamId) return;

    setIsExporting(true);
    try {
      const params: any = {
        exam_id: selectedExamId,
        practical_mode: practicalMode,
        include_marks: includeMarks,
        include_unregistered: includeUnregistered,
        include_absent: includeAbsent,
      };

      if (marksFiller.trim()) params.marks_filler = marksFiller.trim();

      // Add filters if provided (not 'all')
      if (regionFilter && regionFilter !== 'all') params.region_name = regionFilter;
      if (councilFilter && councilFilter !== 'all') params.council_name = councilFilter;
      if (wardFilter && wardFilter !== 'all') params.ward_name = wardFilter;
      if (schoolTypeFilter && schoolTypeFilter !== 'all') params.school_type = schoolTypeFilter;
      
      // Add selected subjects
      if (selectedSubjects.length > 0) {
        params.subject_codes = selectedSubjects;
      }

      // Handle school selection logic
      // Either centre_number (single) OR centre_number_list (multiple) can be provided, but not both
      
      if (selectedSchools.length === 1) {
        // Single school - use centre_number
        params.centre_number = selectedSchools[0];
      } else if (selectedSchools.length > 1) {
        // Multiple schools - use centre_number_list
        params.centre_number_list = selectedSchools;
      } else if (regionFilter !== 'all' || councilFilter !== 'all' || wardFilter !== 'all' || schoolTypeFilter !== 'all') {
        // No specific schools selected but filters applied - let API handle filtered schools
        // Don't set either centre_number or centre_number_list
      } else {
        // No filters and no specific schools - export all schools
        // Don't set either centre_number or centre_number_list
      }
      
      // Debug: log request params before calling API
      console.log('Export params', params);

      const res = await api.exportMarksTemplate(params);
      const blob = res.blob;
      const filenameFromServer = res.filename;
      const contentType = res.contentType || blob.type;

      let fallback = 'export';
      if (contentType?.includes('zip')) fallback = 'templates_export.zip';
      else if (contentType?.includes('sheet')) fallback = 'templates_export.xlsm';

      downloadBlob(blob, filenameFromServer || fallback);
    } catch (err: any) {
      console.error('Export failed:', err);
      alert(err.response?.data?.detail || 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  if (!selectedExamId) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2 className="text-xl font-semibold">No Exam Selected</h2>
        <p className="text-muted-foreground">Please select an exam first</p>
      </div>
    );
  }

  const regions = [...new Set(schools?.map((s) => s.region_name).filter(Boolean))].sort();
  const councils = [...new Set(schools?.map((s) => s.council_name).filter(Boolean))].sort();
  const wards = [...new Set(schools?.map((s) => s.ward_name).filter(Boolean))].sort();

  const filteredSchools = (schools || []).filter((s) => {
    if (regionFilter !== 'all' && s.region_name !== regionFilter) return false;
    if (councilFilter !== 'all' && s.council_name !== councilFilter) return false;
    if (wardFilter !== 'all' && s.ward_name !== wardFilter) return false;
    if (schoolTypeFilter !== 'all' && (s as any).school_type !== schoolTypeFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
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

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
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
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold flex items-center justify-center gap-2">
              <FileSpreadsheet className="h-6 w-6" />
              XLSM/ZIP
            </div>
            <p className="text-sm text-muted-foreground">API decides output</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle>Export Options</CardTitle>
            <CardDescription>
              Configure your template export settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Output</Label>
              <div className="text-sm text-muted-foreground">
                Single school usually downloads an Excel template (.xlsm). Multiple schools may download a ZIP.
              </div>
            </div>

            {/* Practical Mode */}
            <div className="space-y-2">
              <Label>Practical Mode</Label>
              <Select value={practicalMode.toString()} onValueChange={(value) => setPracticalMode(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Theory Only</SelectItem>
                  <SelectItem value="1">Theory + Practical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Marks filler (person name)</Label>
              <Input
                value={marksFiller}
                onChange={(e) => setMarksFiller(e.target.value)}
                placeholder="e.g. John Doe"
              />
            </div>

            {/* School Selection - ALWAYS VISIBLE */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Select Schools (Optional)</Label>
              <p className="text-sm text-muted-foreground">
                Leave empty to export ALL schools. Select 1 school for single export. Select multiple for batch export.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Schools ({filteredSchools.length} available)</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedSchools(filteredSchools.map(s => s.centre_number))}
                    >
                      Select All
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedSchools([])}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto border rounded-lg p-4">
                  {filteredSchools.map((school) => (
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
                      <Label htmlFor={school.centre_number} className="text-sm cursor-pointer">
                        {school.centre_number} - {school.school_name}
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <p className="text-muted-foreground">
                    <strong>{selectedSchools.length}</strong> school(s) selected
                  </p>
                  {selectedSchools.length === 1 && (
                    <Badge variant="secondary">Single school → centre_number</Badge>
                  )}
                  {selectedSchools.length > 1 && (
                    <Badge variant="secondary">Multiple schools → centre_number_list</Badge>
                  )}
                  {selectedSchools.length === 0 && (
                    <Badge variant="outline">All schools (filtered)</Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Include Options */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-marks"
                  checked={includeMarks}
                  onCheckedChange={(checked) => setIncludeMarks(checked as boolean)}
                />
                <Label htmlFor="include-marks">Include existing marks</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-unregistered"
                  checked={includeUnregistered}
                  onCheckedChange={(checked) => setIncludeUnregistered(checked as boolean)}
                />
                <Label htmlFor="include-unregistered">Include unregistered subjects</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-absent"
                  checked={includeAbsent}
                  onCheckedChange={(checked) => setIncludeAbsent(checked as boolean)}
                />
                <Label htmlFor="include-absent">Include absent students</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Location Filters</CardTitle>
            <CardDescription>
              Filter schools by location (optional)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Region</Label>
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All regions</SelectItem>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Council</Label>
              <Select value={councilFilter} onValueChange={setCouncilFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All councils" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All councils</SelectItem>
                  {councils.map((council) => (
                    <SelectItem key={council} value={council}>{council}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Ward</Label>
              <Select value={wardFilter} onValueChange={setWardFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All wards" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All wards</SelectItem>
                  {wards.map((ward) => (
                    <SelectItem key={ward} value={ward}>{ward}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>School Type</Label>
              <Select value={schoolTypeFilter} onValueChange={setSchoolTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="GOVERNMENT">Government</SelectItem>
                  <SelectItem value="PRIVATE">Private</SelectItem>
                  <SelectItem value="UNKNOWN">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Filter (Optional)</CardTitle>
          <CardDescription>
            Select specific subjects to include in the template. Leave empty to include all.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-[200px] overflow-y-auto border rounded-lg p-4">
            {subjects?.map((subject) => (
              <div key={subject.subject_code} className="flex items-center space-x-2">
                <Checkbox
                  id={subject.subject_code}
                  checked={selectedSubjects.includes(subject.subject_code)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedSubjects([...selectedSubjects, subject.subject_code]);
                    } else {
                      setSelectedSubjects(selectedSubjects.filter(s => s !== subject.subject_code));
                    }
                  }}
                />
                <Label htmlFor={subject.subject_code} className="text-sm">
                  {subject.subject_code} - {subject.subject_name}
                </Label>
              </div>
            ))}
          </div>
          {selectedSubjects.length > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              {selectedSubjects.length} subject(s) selected
            </p>
          )}
        </CardContent>
      </Card>

      {/* Export Button */}
      <Card>
        <CardContent className="pt-6">
          <Button
            size="lg"
            onClick={handleExport}
            disabled={isExporting}
            className="w-full"
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Template...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export Template
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
