'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useExamContext } from '@/components/providers/exam-context';
import { useExam, useExamSchools } from '@/lib/hooks';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/error-utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Upload, FileText, CheckCircle, XCircle, Loader2, Trash2 } from 'lucide-react';

interface FileUpload {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  message?: string;
}

export default function UploadStudentsPage() {
  const { selectedExamId } = useExamContext();
  const { data: exam } = useExam(selectedExamId || '');
  const { data: schools, refetch: refetchSchools } = useExamSchools(selectedExamId || '');
  
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const pdfFiles = selectedFiles.filter(f => f.type === 'application/pdf');
    
    setFiles(prev => [
      ...prev,
      ...pdfFiles.map(file => ({ file, status: 'pending' as const }))
    ]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const pdfFiles = droppedFiles.filter(f => f.type === 'application/pdf');
    
    setFiles(prev => [
      ...prev,
      ...pdfFiles.map(file => ({ file, status: 'pending' as const }))
    ]);
  }, []);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (!selectedExamId || files.length === 0) return;

    setIsUploading(true);

    for (let i = 0; i < files.length; i++) {
      if (files[i].status !== 'pending') continue;

      setFiles(prev => prev.map((f, idx) => 
        idx === i ? { ...f, status: 'uploading' } : f
      ));

      try {
        await api.uploadStudentPdf(selectedExamId, files[i].file);
        setFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, status: 'success', message: 'Uploaded successfully' } : f
        ));
      } catch (err: any) {
        const errorMessage = getErrorMessage(err);
        setFiles(prev => prev.map((f, idx) => 
          idx === i ? { 
            ...f, 
            status: 'error', 
            message: errorMessage
          } : f
        ));
      }
    }

    setIsUploading(false);
    refetchSchools();
  };

  const pendingCount = files.filter(f => f.status === 'pending').length;
  const successCount = files.filter(f => f.status === 'success').length;
  const errorCount = files.filter(f => f.status === 'error').length;

  if (!selectedExamId) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2 className="text-xl font-semibold">No Exam Selected</h2>
        <p className="text-muted-foreground">Please select an exam from the header first</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/students">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Upload Student PDFs</h1>
          <p className="text-muted-foreground">{exam?.exam_name}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Upload Files</CardTitle>
            <CardDescription>
              Upload PDF files containing student registration data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary cursor-pointer transition-colors"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="mt-4 font-medium">Drop PDF files here or click to browse</p>
              <p className="text-sm text-muted-foreground mt-1">Only PDF files are accepted</p>
              <input
                id="file-input"
                type="file"
                accept=".pdf"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h3 className="font-medium">Files ({files.length})</h3>
                  <div className="flex gap-2 text-sm flex-wrap">
                    {pendingCount > 0 && <Badge variant="secondary">{pendingCount} pending</Badge>}
                    {successCount > 0 && <Badge className="bg-green-500">{successCount} uploaded</Badge>}
                    {errorCount > 0 && <Badge variant="destructive">{errorCount} failed</Badge>}
                  </div>
                </div>
                
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-red-500" />
                        <div>
                          <p className="font-medium text-sm">{file.file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {file.status === 'pending' && (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                        {file.status === 'uploading' && (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                        {file.status === 'success' && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        {file.status === 'error' && (
                          <div className="flex items-center gap-2">
                            <XCircle className="h-5 w-5 text-red-500" />
                            <span className="text-xs text-red-500">{file.message}</span>
                          </div>
                        )}
                        {file.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(index);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pendingCount > 0 && (
              <Button 
                className="w-full" 
                size="lg"
                onClick={uploadFiles}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload {pendingCount} File(s)
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold">{schools?.length || 0}</div>
              <p className="text-sm text-muted-foreground">Schools Registered</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold">
                {schools?.reduce((sum, s) => sum + s.student_count, 0).toLocaleString() || 0}
              </div>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </div>
            <Badge 
              variant={exam?.has_students_registered ? 'default' : 'secondary'}
              className="w-full justify-center py-2"
            >
              {exam?.has_students_registered ? '✅ Students Registered' : '⚪ No Students Yet'}
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
