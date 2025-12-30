// ExaMetrics Type Definitions

export type ExamLevel = 'STNA' | 'SFNA' | 'PSLE' | 'FTNA' | 'CSEE' | 'ACSEE';
export type Division = 'I' | 'II' | 'III' | 'IV' | '0' | 'INC' | 'ABS';
export type Grade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'S';
export type Sex = 'M' | 'F';
export type SchoolType = 'GOVERNMENT' | 'PRIVATE' | 'UNKNOWN';
export type UserRole = 'USER' | 'TEACHER' | 'ACADEMIC_MASTER' | 'HEAD_OF_SCHOOL' | 'WEO' | 'DEO' | 'REO' | 'ADMIN' | 'SUPER_ADMIN';
export type AverageStyle = 'AUTO' | 'SEVEN_BEST' | 'EIGHT_BEST';
export type RankingStyle = 'AVERAGE_ONLY' | 'GPA_THEN_AVERAGE' | 'AVERAGE_THEN_GPA' | 'TOTAL_ONLY' | 'TOTAL_THEN_AVERAGE';
export type SubjectRankingStyle = 'SUBJECT_GPA_THEN_SUBJECT_AVERAGE' | 'SUBJECT_AVERAGE_THEN_SUBJECT_GPA' | 'SUBJECT_AVERAGE_ONLY' | 'SUBJECT_GPA_ONLY';

export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  surname: string;
  role: UserRole;
  centre_number?: string;
}

export interface UserExam {
  exam: {
    exam_id: string;
    exam_name: string;
    exam_level: ExamLevel;
  };
  role: string;
  permissions: string[];
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
  user_exams: UserExam[];
}

export interface Exam {
  id: string;
  board_id: string;
  exam_name: string;
  exam_name_swahili?: string;
  start_date: string;
  end_date: string;
  exam_level: ExamLevel;
  avg_style: AverageStyle;
  ranking_style: RankingStyle;
  subject_ranking_style: SubjectRankingStyle;
  is_active: boolean;
  has_students_registered: boolean;
  has_marks_uploaded: boolean;
  results_processed: boolean;
  results_processed_at?: string;
  created_at: string;
}

export interface ExamStats {
  total_exams: number;
  active_exams: number;
  this_month_exams: number;
  pending_exams: number;
  no_students_exams: number;
  no_marks_exams: number;
  processed_exams: number;
}

export interface School {
  centre_number: string;
  school_name: string;
  region_name: string;
  council_name: string;
  ward_name: string;
  school_type: SchoolType;
  student_count: number;
}

export interface Student {
  id: string;
  exam_id: string;
  centre_number: string;
  student_global_id: string;
  candidate_number: string;
  first_name: string;
  middle_name?: string;
  surname: string;
  sex: Sex;
}

export interface ExamSubject {
  id: number;
  exam_id: string;
  subject_code: string;
  subject_name: string;
  subject_short: string;
  has_practical: boolean;
  exclude_from_gpa: boolean;
  is_primary: boolean;
  is_olevel: boolean;
  is_alevel: boolean;
}

export interface ExamDivision {
  id: number;
  exam_id: string;
  division: Division;
  lowest_points: number;
  highest_points: number;
  division_points: number;
}

export interface ExamGrade {
  id: number;
  exam_id: string;
  grade: Grade;
  lowest_marks: number;
  highest_marks: number;
  grade_points: number;
}

export interface ResultsStats {
  exam_id: string;
  total_students: number;
  average_score: number;
  division_distribution?: Record<Division, { count: number; percentage: number }>;
  grades_summary?: Record<Grade, number>;
}

export interface SchoolAnalysis {
  centre_number: string;
  school_name: string;
  total_students: number;
  school_gpa?: number;
  average_marks: number;
  division_summary?: Record<Division, number>;
  grades_summary: Record<Grade, number>;
  school_ranking: {
    overall_position: number;
    out_of: number;
    ward_position: number;
    council_position: number;
    region_position: number;
  };
  subjects_gpa: Record<string, SubjectPerformance>;
}

export interface SubjectPerformance {
  subject_name: string;
  gpa?: number;
  average: number;
  position: number;
  out_of: number;
}

export interface LocationHierarchy {
  exam_id: string;
  total_regions: number;
  total_schools: number;
  hierarchy: Record<string, RegionData>;
}

export interface RegionData {
  total_schools: number;
  councils: Record<string, CouncilData>;
}

export interface CouncilData {
  total_schools: number;
  wards: Record<string, WardData>;
}

export interface WardData {
  total_schools: number;
  schools: School[];
}

export interface RegionSummary {
  exam_id: string;
  region_name: string;
  region_gpa?: number;
  average_marks: number;
  total_schools: number;
  total_students: number;
  division_summary?: Record<Division, number>;
  grades_summary: Record<Grade, number>;
  councils: CouncilSummary[];
}

export interface CouncilSummary {
  council_name: string;
  total_schools: number;
  total_students: number;
  average_marks: number;
  council_gpa?: number;
}

export interface UploadTrail {
  upload_id: string;
  exam_id: string;
  user_id: string;
  filename: string;
  upload_type: string;
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  total_records: number;
  successful: number;
  failed: number;
  created_at: string;
}

export interface ProcessingResult {
  message: string;
  exam_id: string;
  processed_students: number;
  processing_time: number;
  stages: {
    subject_ranking: boolean;
    division_processing: boolean;
    sex_ranking: boolean;
    school_ranking: boolean;
    location_ranking: boolean;
    detailed_subjects: boolean;
  };
}

export interface ExaminationBoard {
  id: string;
  board_name: string;
  board_code: string;
  is_active: boolean;
}

export interface Region {
  id: string;
  region_name: string;
}

export interface Council {
  id: string;
  region_id: string;
  council_name: string;
}

export interface Ward {
  id: string;
  council_id: string;
  ward_name: string;
}
