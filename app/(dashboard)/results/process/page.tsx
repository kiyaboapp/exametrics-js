'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useExam, useExams, useProcessResults } from '@/lib/hooks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/error-utils';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlayCircle, CheckCircle, XCircle, AlertTriangle, Loader2, ArrowLeft } from 'lucide-react';
import { useExamContext } from '@/components/providers/exam-context';

export default function ProcessResultsPage() {
  const searchParams = useSearchParams();
  const examIdFromUrl = searchParams.get('exam');
  const { selectedExamId, setSelectedExamId } = useExamContext();
  
  const examId = examIdFromUrl || selectedExamId;
  const { data: exams } = useExams();
  const { data: exam, isLoading: examLoading } = useExam(examId || '');
  const processResults = useProcessResults();

  const [isProcessing, setIsProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleProcess = async () => {
    if (!examId) return;

    setIsProcessing(true);
    setProcessStatus('processing');
    setErrorMessage('');

    try {
      await processResults.mutateAsync(examId);
      setProcessStatus('success');
    } catch (err: any) {
      setProcessStatus('error');
      setErrorMessage(getErrorMessage(err) || 'Failed to process results');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = () => {
    switch (processStatus) {
      case 'processing':
        return <Loader2 className="h-8 w-8 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'error':
        return <XCircle className="h-8 w-8 text-red-500" />;
      default:
        return <PlayCircle className="h-8 w-8 text-muted-foreground" />;
    }
  };

  const canProcess = exam && exam.has_students_registered && exam.has_marks_uploaded;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/results">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Process Results</h1>
          <p className="text-muted-foreground">Generate exam results and analysis</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Exam</CardTitle>
          <CardDescription>Choose an exam to process results for</CardDescription>
        </CardHeader>
        <CardContent>
          <Select 
            value={examId || ''} 
            onValueChange={(value) => {
              setSelectedExamId(value);
              setProcessStatus('idle');
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an exam" />
            </SelectTrigger>
            <SelectContent>
              {exams?.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.exam_name} ({e.exam_level})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {exam && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Exam Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-3 p-4 rounded-lg border">
                  {exam.has_students_registered ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-500" />
                  )}
                  <div>
                    <p className="font-medium">Students Registered</p>
                    <p className="text-sm text-muted-foreground">
                      {exam.has_students_registered ? 'Ready' : 'No students registered'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg border">
                  {exam.has_marks_uploaded ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-500" />
                  )}
                  <div>
                    <p className="font-medium">Marks Uploaded</p>
                    <p className="text-sm text-muted-foreground">
                      {exam.has_marks_uploaded ? 'Ready' : 'No marks uploaded'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg border">
                  {exam.results_processed ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-yellow-500" />
                  )}
                  <div>
                    <p className="font-medium">Results Processed</p>
                    <p className="text-sm text-muted-foreground">
                      {exam.results_processed ? 'Completed' : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>

              {!canProcess && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                    <AlertTriangle className="h-5 w-5" />
                    <p className="font-medium">Cannot Process</p>
                  </div>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    {!exam.has_students_registered && 'Students must be registered. '}
                    {!exam.has_marks_uploaded && 'Marks must be uploaded. '}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Process Results</CardTitle>
              <CardDescription>
                This will calculate grades, divisions, rankings, and generate school analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
                {getStatusIcon()}
                <p className="mt-4 text-lg font-medium">
                  {processStatus === 'idle' && 'Ready to process'}
                  {processStatus === 'processing' && 'Processing results...'}
                  {processStatus === 'success' && 'Results processed successfully!'}
                  {processStatus === 'error' && 'Processing failed'}
                </p>
                {processStatus === 'processing' && (
                  <p className="text-sm text-muted-foreground mt-1">
                    This may take a few minutes depending on the number of students
                  </p>
                )}
                {processStatus === 'error' && errorMessage && (
                  <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
                )}
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={handleProcess}
                  disabled={!canProcess || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <PlayCircle className="mr-2 h-4 w-4" />
                      {exam.results_processed ? 'Re-Process Results' : 'Process Results'}
                    </>
                  )}
                </Button>

                {processStatus === 'success' && (
                  <Link href={`/results?exam=${examId}`}>
                    <Button size="lg" variant="outline">
                      View Results
                    </Button>
                  </Link>
                )}
              </div>

              {exam.results_processed && (
                <p className="text-center text-sm text-muted-foreground">
                  ⚠️ Re-processing will overwrite existing results
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
