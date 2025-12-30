// ExaMetrics Constants

import { Division, Grade, ExamLevel } from './types';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://exametrics.kiyabo.com/api/v1';

export const EXAM_LEVELS: ExamLevel[] = ['STNA', 'SFNA', 'PSLE', 'FTNA', 'CSEE', 'ACSEE'];

export const PRIMARY_LEVELS: ExamLevel[] = ['STNA', 'SFNA', 'PSLE'];
export const SECONDARY_LEVELS: ExamLevel[] = ['FTNA', 'CSEE', 'ACSEE'];

export const DIVISION_ORDER: Division[] = ['I', 'II', 'III', 'IV', '0', 'INC', 'ABS'];
export const GRADE_ORDER: Grade[] = ['A', 'B', 'C', 'D', 'E', 'F', 'S'];

export const DIVISION_COLORS: Record<Division, string> = {
  'I': '#22c55e',
  'II': '#3b82f6',
  'III': '#eab308',
  'IV': '#f97316',
  '0': '#ef4444',
  'INC': '#9ca3af',
  'ABS': '#d1d5db',
};

export const GRADE_COLORS: Record<Grade, string> = {
  'A': '#22c55e',
  'B': '#84cc16',
  'C': '#eab308',
  'D': '#f97316',
  'E': '#ef4444',
  'F': '#dc2626',
  'S': '#6b7280',
};

export const GENDER_COLORS = {
  'M': '#3b82f6',
  'F': '#ec4899',
};

export const GRADE_POINTS: Record<Grade, number> = {
  'A': 1,
  'B': 2,
  'C': 3,
  'D': 4,
  'E': 5,
  'F': 6,
  'S': 7,
};

export const EXAM_STORAGE_KEY = 'selected_exam_id';
export const TOKEN_STORAGE_KEY = 'access_token';
export const USER_STORAGE_KEY = 'user';
export const USER_EXAMS_STORAGE_KEY = 'user_exams';

export const isPrimary = (level: ExamLevel) => PRIMARY_LEVELS.includes(level);
export const isSecondary = (level: ExamLevel) => SECONDARY_LEVELS.includes(level);
export const hasDivisions = (level: ExamLevel) => isSecondary(level);
export const hasGPA = (level: ExamLevel) => isSecondary(level);
