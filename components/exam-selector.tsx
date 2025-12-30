'use client';

import { useExamContext } from './providers/exam-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BookOpen } from 'lucide-react';

export function ExamSelector() {
  const { selectedExamId, setSelectedExamId, userExams } = useExamContext();


  if (!userExams || userExams.length === 0) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <BookOpen className="h-5 w-5" />
        <span className="text-sm">No exams assigned</span>
      </div>
    );
  }

  const selectedExam = userExams.find(userExam => userExam.exam.exam_id === selectedExamId);

  return (
    <div className="flex items-center gap-2">
      <BookOpen className="h-5 w-5 text-muted-foreground flex-shrink-0" />
      <Select 
        value={selectedExamId || ''} 
        onValueChange={(value) => {
          setSelectedExamId(value);
        }}
      >
        <SelectTrigger className="w-[200px] md:w-[300px]">
          <SelectValue placeholder="Select an exam">
            {selectedExam ? (
              <span className="truncate">{selectedExam.exam.exam_name}</span>
            ) : (
              "Select an exam"
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {userExams.map((userExam) => (
            <SelectItem key={userExam.exam.exam_id} value={userExam.exam.exam_id}>
              <div className="flex flex-col">
                <span className="truncate">{userExam.exam.exam_name}</span>
                <span className="text-xs text-muted-foreground">{userExam.exam.exam_level}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
