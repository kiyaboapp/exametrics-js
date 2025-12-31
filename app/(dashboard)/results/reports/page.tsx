'use client';

import { useExamContext } from '@/components/providers/exam-context';
import { useExam, useExamSchools } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Download, FileText, FileSpreadsheet, Archive } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function DownloadReportsPage() {
  const { selectedExamId } = useExamContext();
  const { data: exam } = useExam(selectedExamId);
  const { data: schools } = useExamSchools(selectedExamId);
  
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState(false);

  if (!selectedExamId) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2 className="text-xl font-semibold">No Exam Selected</h2>
        <p className="text-muted-foreground">Please select an exam from the header first</p>
      </div>
    );
  }

  const regions = [...new Set(schools?.map(s => s.region_name))].sort();

  const handleDownloadSchoolPDF = async () => {
    if (!selectedSchool) {
      toast.error('Please select a school');
      return;
    }
    
    setIsDownloading(true);
    try {
      const blob = await api.downloadSchoolResultsPDF(selectedExamId!, selectedSchool);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${selectedSchool}_results.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF downloaded successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to download PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadRegionZIP = async () => {
    if (!selectedRegion) {
      toast.error('Please select a region');
      return;
    }
    
    setIsDownloading(true);
    try {
      const blob = await api.downloadPDFZipByFilters({
        exam_id: selectedExamId!,
        region_name: selectedRegion,
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${selectedRegion}_results.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('ZIP file downloaded successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to download ZIP');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadRawData = async () => {
    setIsDownloading(true);
    try {
      const blob = await api.downloadRawData({
        exam_id: selectedExamId!,
        include_all_subjects: true,
        marks_type: 'all',
        include_results: true,
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${exam?.exam_name}_rawdata.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Raw data downloaded successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to download raw data');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadSchoolStats = async (format: 'csv' | 'xlsx') => {
    if (!selectedSchool) {
      toast.error('Please select a school');
      return;
    }
    
    setIsDownloading(true);
    try {
      const blob = await api.downloadSchoolSummaryStats(selectedExamId!, selectedSchool, format);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${selectedSchool}_summary_stats.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success(`Stats downloaded as ${format.toUpperCase()}`);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to download stats');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadSubjectStats = async (format: 'csv' | 'xlsx') => {
    if (!selectedSchool) {
      toast.error('Please select a school');
      return;
    }
    
    setIsDownloading(true);
    try {
      const blob = await api.downloadSchoolSubjectStats(selectedExamId!, selectedSchool, format);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${selectedSchool}_subject_stats.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success(`Subject stats downloaded as ${format.toUpperCase()}`);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to download subject stats');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/results">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Download Reports</h1>
          <p className="text-muted-foreground">{exam?.exam_name}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <CardTitle>Single School PDF</CardTitle>
            </div>
            <CardDescription>
              Download results PDF for a specific school
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select School</Label>
              <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a school" />
                </SelectTrigger>
                <SelectContent>
                  {schools?.map((school) => (
                    <SelectItem key={school.centre_number} value={school.centre_number}>
                      {school.centre_number} - {school.school_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleDownloadSchoolPDF} 
              disabled={isDownloading || !selectedSchool}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Archive className="h-5 w-5 text-green-500" />
              <CardTitle>Regional ZIP</CardTitle>
            </div>
            <CardDescription>
              Download all schools in a region as ZIP
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Region</Label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleDownloadRegionZIP} 
              disabled={isDownloading || !selectedRegion}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Download ZIP
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-orange-500" />
              <CardTitle>Raw Data Export</CardTitle>
            </div>
            <CardDescription>
              Download complete exam data as Excel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Exports all student results, marks, and statistics in Excel format
            </div>
            <Button 
              onClick={handleDownloadRawData} 
              disabled={isDownloading}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Excel
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-purple-500" />
              <CardTitle>School Summary Stats</CardTitle>
            </div>
            <CardDescription>
              Download school-level summary statistics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Total subject registrations, marks filled, and missing marks
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => handleDownloadSchoolStats('csv')} 
                disabled={isDownloading || !selectedSchool}
                variant="outline"
                className="flex-1"
              >
                CSV
              </Button>
              <Button 
                onClick={() => handleDownloadSchoolStats('xlsx')} 
                disabled={isDownloading || !selectedSchool}
                variant="outline"
                className="flex-1"
              >
                Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-pink-500" />
              <CardTitle>School Subject Stats</CardTitle>
            </div>
            <CardDescription>
              Download detailed subject-level statistics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Per-subject breakdown of registrations and marks
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => handleDownloadSubjectStats('csv')} 
                disabled={isDownloading || !selectedSchool}
                variant="outline"
                className="flex-1"
              >
                CSV
              </Button>
              <Button 
                onClick={() => handleDownloadSubjectStats('xlsx')} 
                disabled={isDownloading || !selectedSchool}
                variant="outline"
                className="flex-1"
              >
                Excel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
