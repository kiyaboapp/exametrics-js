// React Query Hooks for ExaMetrics

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api';
import type { Exam } from './types';

// Dashboard Hooks
export function useExamStats() {
  return useQuery({
    queryKey: ['exam-stats'],
    queryFn: () => api.getExamStats(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useResultsStats(examId: string | null) {
  return useQuery({
    queryKey: ['results-stats', examId],
    queryFn: () => api.getResultsStats(examId!),
    enabled: !!examId,
    staleTime: 2 * 60 * 1000,
  });
}

// Exams Hooks
export function useExams(params?: { skip?: number; limit?: number }) {
  return useQuery({
    queryKey: ['exams', params],
    queryFn: () => api.getExams(params),
    staleTime: 2 * 60 * 1000,
  });
}

export function useExam(examId: string | null) {
  return useQuery({
    queryKey: ['exam', examId],
    queryFn: () => api.getExam(examId!),
    enabled: !!examId,
  });
}

export function useCreateExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (exam: Partial<Exam>) => api.createExam(exam),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      queryClient.invalidateQueries({ queryKey: ['exam-stats'] });
    },
  });
}

export function useUpdateExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ examId, exam }: { examId: string; exam: Partial<Exam> }) =>
      api.updateExam(examId, exam),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['exam', variables.examId] });
      queryClient.invalidateQueries({ queryKey: ['exams'] });
    },
  });
}

export function useDeleteExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (examId: string) => api.deleteExam(examId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      queryClient.invalidateQueries({ queryKey: ['exam-stats'] });
    },
  });
}

export function useExamSchools(examId: string | null) {
  return useQuery({
    queryKey: ['exam-schools', examId],
    queryFn: () => api.getExamSchools(examId!),
    enabled: !!examId,
    staleTime: 5 * 60 * 1000,
  });
}

// Exam Configuration Hooks
export function useExamDivisions(examId: string | null) {
  return useQuery({
    queryKey: ['exam-divisions', examId],
    queryFn: () => api.getExamDivisions(examId!),
    enabled: !!examId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useExamGrades(examId: string | null) {
  return useQuery({
    queryKey: ['exam-grades', examId],
    queryFn: () => api.getExamGrades(examId!),
    enabled: !!examId,
    staleTime: 5 * 60 * 1000,
  });
}

// Division mutations
export function useCreateExamDivision() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ examId, division }: { examId: string; division: { division: string; lowest_points: number; highest_points: number; division_points: number } }) =>
      api.createExamDivision(examId, division),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['exam-divisions', variables.examId] });
    },
  });
}

export function useUpdateExamDivision() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ examId, divisionId, division }: { examId: string; divisionId: number; division: { division: string; lowest_points: number; highest_points: number; division_points: number } }) =>
      api.updateExamDivision(examId, divisionId, division),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['exam-divisions', variables.examId] });
    },
  });
}

export function useDeleteExamDivision() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ examId, divisionId }: { examId: string; divisionId: number }) =>
      api.deleteExamDivision(examId, divisionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['exam-divisions', variables.examId] });
    },
  });
}

// Grade mutations
export function useCreateExamGrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ examId, grade }: { examId: string; grade: { grade: string; lowest_marks: number; highest_marks: number; grade_points: number } }) =>
      api.createExamGrade(examId, grade),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['exam-grades', variables.examId] });
    },
  });
}

export function useUpdateExamGrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ examId, gradeId, grade }: { examId: string; gradeId: number; grade: { grade: string; lowest_marks: number; highest_marks: number; grade_points: number } }) =>
      api.updateExamGrade(examId, gradeId, grade),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['exam-grades', variables.examId] });
    },
  });
}

export function useDeleteExamGrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ examId, gradeId }: { examId: string; gradeId: number }) =>
      api.deleteExamGrade(examId, gradeId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['exam-grades', variables.examId] });
    },
  });
}

// Subject mutations
export function useCreateExamSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ examId, subject }: { examId: string; subject: {
      subject_code: string;
      subject_name: string;
      subject_short: string;
      has_practical: boolean;
      exclude_from_gpa: boolean;
      is_primary: boolean;
      is_olevel: boolean;
      is_alevel: boolean;
    } }) =>
      api.createExamSubject(examId, subject),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['exam-subjects', variables.examId] });
    },
  });
}

export function useUpdateExamSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ examId, subjectId, subject }: { examId: string; subjectId: number; subject: {
      subject_code: string;
      subject_name: string;
      subject_short: string;
      has_practical: boolean;
      exclude_from_gpa: boolean;
      is_primary: boolean;
      is_olevel: boolean;
      is_alevel: boolean;
    } }) =>
      api.updateExamSubject(examId, subjectId, subject),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['exam-subjects', variables.examId] });
    },
  });
}

export function useDeleteExamSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ examId, subjectId }: { examId: string; subjectId: number }) =>
      api.deleteExamSubject(examId, subjectId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['exam-subjects', variables.examId] });
    },
  });
}

export function useExamSubjects(examId: string | null) {
  return useQuery({
    queryKey: ['exam-subjects', examId],
    queryFn: () => api.getExamSubjects(examId!),
    enabled: !!examId,
  });
}

// Students Hooks
export function useStudents(examId: string | null, centreNumber?: string) {
  return useQuery({
    queryKey: ['students', examId, centreNumber],
    queryFn: () => api.getStudents(examId!, centreNumber),
    enabled: !!examId,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (student: any) => api.createStudent(student),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
}

// Upload History Hook
export function useUploadTrails(examId: string | null) {
  return useQuery({
    queryKey: ['upload-trails', examId],
    queryFn: () => api.getUploadTrails(examId!),
    enabled: !!examId,
  });
}

// Results Hooks
export function useResults(examId: string | null, params?: { skip?: number; limit?: number }) {
  return useQuery({
    queryKey: ['results', examId, params],
    queryFn: () => api.getResults(examId!, params),
    enabled: !!examId,
  });
}

export function useSchoolAnalysis(examId: string | null, centreNumber: string | null) {
  return useQuery({
    queryKey: ['school-analysis', examId, centreNumber],
    queryFn: () => api.getSchoolAnalysis(examId!, centreNumber!),
    enabled: !!examId && !!centreNumber,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProcessResults() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (examId: string) => api.processResults(examId),
    onSuccess: (_, examId) => {
      queryClient.invalidateQueries({ queryKey: ['results', examId] });
      queryClient.invalidateQueries({ queryKey: ['results-stats', examId] });
      queryClient.invalidateQueries({ queryKey: ['exam', examId] });
    },
  });
}

// Location Analysis Hooks
export function useLocationHierarchy(examId: string | null) {
  return useQuery({
    queryKey: ['location-hierarchy', examId],
    queryFn: () => api.getLocationHierarchy(examId!),
    enabled: !!examId,
    staleTime: 10 * 60 * 1000,
  });
}

export function useRegionSummary(examId: string | null, regionName: string | null) {
  return useQuery({
    queryKey: ['region-summary', examId, regionName],
    queryFn: () => api.getRegionSummary(examId!, regionName!),
    enabled: !!examId && !!regionName,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLocationAnalysis(examId: string | null) {
  return useQuery({
    queryKey: ['location-analysis', examId],
    queryFn: () => api.getLocationAnalysis(examId!),
    enabled: !!examId,
    staleTime: 5 * 60 * 1000,
  });
}

// Analytics Hooks
export function useGenderBreakdown(examId: string | null) {
  return useQuery({
    queryKey: ['gender-breakdown', examId],
    queryFn: () => api.getGenderBreakdown(examId!),
    enabled: !!examId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSchoolTypeComparison(examId: string | null) {
  return useQuery({
    queryKey: ['school-type-comparison', examId],
    queryFn: () => api.getSchoolTypeComparison(examId!),
    enabled: !!examId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSubjectDetailed(examId: string | null) {
  return useQuery({
    queryKey: ['subject-detailed', examId],
    queryFn: () => api.getSubjectDetailed(examId!),
    enabled: !!examId,
    staleTime: 10 * 60 * 1000,
  });
}

export function useTopPerformers(examId: string | null, params?: any) {
  return useQuery({
    queryKey: ['top-performers', examId, params],
    queryFn: () => api.getTopPerformers(examId!, params),
    enabled: !!examId,
    staleTime: 60 * 1000,
  });
}

export function useRegionalDeepDive(examId: string | null, regionName: string | null) {
  return useQuery({
    queryKey: ['regional-deep-dive', examId, regionName],
    queryFn: () => api.getRegionalDeepDive(examId!, regionName!),
    enabled: !!examId && !!regionName,
    staleTime: 5 * 60 * 1000,
  });
}

// User Management Hooks
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => api.getUsers(),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: any) => api.createUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// Reference Data Hooks
export function useExaminationBoards() {
  return useQuery({
    queryKey: ['examination-boards'],
    queryFn: () => api.getExaminationBoards(),
    staleTime: 30 * 60 * 1000,
  });
}

export function useMasterSubjects(examLevel?: string) {
  return useQuery({
    queryKey: ['master-subjects', examLevel],
    queryFn: () => api.getMasterSubjects(examLevel),
    staleTime: 30 * 60 * 1000,
  });
}

export function useRegions() {
  return useQuery({
    queryKey: ['regions'],
    queryFn: () => api.getRegions(),
    staleTime: 60 * 60 * 1000,
  });
}

export function useCouncils(regionId?: string) {
  return useQuery({
    queryKey: ['councils', regionId],
    queryFn: () => api.getCouncils(regionId),
    enabled: !!regionId,
    staleTime: 60 * 60 * 1000,
  });
}

export function useWards(councilId?: string) {
  return useQuery({
    queryKey: ['wards', councilId],
    queryFn: () => api.getWards(councilId),
    enabled: !!councilId,
    staleTime: 60 * 60 * 1000,
  });
}

export function useSchools() {
  return useQuery({
    queryKey: ['schools'],
    queryFn: () => api.getSchools(),
    staleTime: 30 * 60 * 1000,
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: () => api.getCurrentUser(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useLocationAnalyses(examId: string | null) {
  return useQuery({
    queryKey: ['location-analyses', examId],
    queryFn: () => api.getLocationAnalyses(examId!),
    enabled: !!examId,
    staleTime: 5 * 60 * 1000,
  });
}
