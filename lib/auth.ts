// Authentication utilities

import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY, USER_EXAMS_STORAGE_KEY, EXAM_STORAGE_KEY } from './constants';
import type { User, UserExam } from './types';

export function setAuthData(token: string, user: User, userExams: UserExam[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(USER_EXAMS_STORAGE_KEY, JSON.stringify(userExams));
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }
  return null;
}

export function getUser(): User | null {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem(USER_STORAGE_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
}

export function getUserExams(): UserExam[] {
  if (typeof window !== 'undefined') {
    const examsStr = localStorage.getItem(USER_EXAMS_STORAGE_KEY);
    return examsStr ? JSON.parse(examsStr) : [];
  }
  return [];
}

export function clearAuthData() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(USER_EXAMS_STORAGE_KEY);
    localStorage.removeItem(EXAM_STORAGE_KEY);
  }
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

export function getSelectedExamId(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(EXAM_STORAGE_KEY);
  }
  return null;
}

export function setSelectedExamId(examId: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(EXAM_STORAGE_KEY, examId);
  }
}

export function getInitialExamId(userExams: UserExam[]): string | null {
  const saved = getSelectedExamId();
  if (saved && userExams.some(e => e.exam.exam_id === saved)) {
    return saved;
  }
  if (userExams.length === 1) {
    return userExams[0].exam.exam_id;
  }
  return null;
}

export function canEditExam(examIsActive: boolean, userRole: string): boolean {
  if (examIsActive) return true;
  return userRole === 'SUPER_ADMIN';
}
