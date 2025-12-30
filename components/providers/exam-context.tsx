'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { getSelectedExamId, setSelectedExamId as saveExamId, getUserExams, getInitialExamId } from '@/lib/auth';
import type { UserExam } from '@/lib/types';

interface ExamContextType {
  selectedExamId: string | null;
  setSelectedExamId: (examId: string) => void;
  userExams: UserExam[];
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export function ExamProvider({ children }: { children: ReactNode }) {
  const userExams = typeof window !== 'undefined' ? getUserExams() : [];
  const initialExamId = typeof window !== 'undefined' ? getInitialExamId(userExams) : null;
  
  
  const [selectedExamId, setExamIdState] = useState<string | null>(initialExamId);

  const setSelectedExamId = (examId: string) => {
    setExamIdState(examId);
    saveExamId(examId);
  };

  return (
    <ExamContext.Provider value={{ selectedExamId, setSelectedExamId, userExams }}>
      {children}
    </ExamContext.Provider>
  );
}

export function useExamContext() {
  const context = useContext(ExamContext);
  if (context === undefined) {
    throw new Error('useExamContext must be used within an ExamProvider');
  }
  return context;
}
