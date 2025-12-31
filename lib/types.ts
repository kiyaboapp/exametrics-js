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
  exam_id: string;
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

export interface MasterSubject {
  id: number;
  subject_code: string;
  subject_name: string;
  subject_short: string;
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
  lowest_value: number;
  highest_value: number;
  grade_points: number;
  division_points: number;
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
  division_summary?: Record<Division, { count: number; percentage: number } | number>;
  grades_summary: Record<Grade, number>;
  school_ranking?: {
    national_position?: number;
    national_total?: number;
    regional_position?: number;
    regional_total?: number;
    council_position?: number;
    council_total?: number;
    ward_position?: number;
    ward_total?: number;
  };
  subjects_gpa: SubjectPerformance[];
}

export interface SubjectPerformance {
  subject_code?: string;
  subject_name: string;
  gpa?: number;
  average: number;
  position?: number;
  out_of?: number;
  student_count?: number;
}

export interface LocationHierarchy {
  exam_id: string;
  total_regions: number;
  total_schools: number;
  hierarchy: Record<string, RegionData>;
}

export interface RegionData {
  total_schools: number;
  total_students?: number;
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

// Pagination Types
export interface PaginationInfo {
  next: string | null;
  previous: string | null;
  current: number;
  total_pages: number;
  total_items: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
  total_queried: number;
}

// Position/Ranking Types
export interface Position {
  subject_pos?: number | null;
  subject_out_of?: number | null;
  subject_gvt_pos?: number | null;
  subject_gvt_out_of?: number | null;
  subject_pvt_pos?: number | null;
  subject_pvt_out_of?: number | null;
  ward_pos?: number | null;
  ward_out_of?: number | null;
  ward_gvt_pos?: number | null;
  ward_gvt_out_of?: number | null;
  ward_pvt_pos?: number | null;
  ward_pvt_out_of?: number | null;
  council_pos?: number | null;
  council_out_of?: number | null;
  council_gvt_pos?: number | null;
  council_gvt_out_of?: number | null;
  council_pvt_pos?: number | null;
  council_pvt_out_of?: number | null;
  region_pos?: number | null;
  region_out_of?: number | null;
  region_gvt_pos?: number | null;
  region_gvt_out_of?: number | null;
  region_pvt_pos?: number | null;
  region_pvt_out_of?: number | null;
}

export interface SchoolRanking {
  overall_pos?: number;
  overall_out_of?: number;
  ward_pos?: number;
  ward_out_of?: number;
  council_pos?: number;
  council_out_of?: number;
  region_pos?: number;
  region_out_of?: number;
}

// Gender breakdown type
export interface GenderBreakdown {
  F: number;
  M: number;
  T: number;
}

// Analysis Rankings
export interface SchoolRankingData {
  exam_id: string;
  centre_number: string;
  school_name: string;
  region_name: string;
  council_name: string;
  ward_name: string;
  school_type: SchoolType;
  school_gpa: number;
  school_ranking: SchoolRanking;
}

// Analysis Overviews
export interface SchoolOverview {
  exam_id: string;
  centre_number: string;
  school_name: string;
  region_name: string;
  council_name: string;
  ward_name: string;
  school_type: SchoolType;
  school_gpa: number;
  subjects_gpa: number;
  divisions_gpa: number;
}

// Subject Rankings
export interface SubjectRankingData {
  exam_id: string;
  centre_number: string;
  school_name: string;
  region_name: string;
  council_name: string;
  ward_name: string;
  school_type: SchoolType;
  subject_gpa: number | null;
  position: Position | null;
}

// School Subject Analysis
export interface SchoolSubjectAnalysis {
  exam_id: string;
  centre_number: string;
  school_name: string;
  region_name: string;
  council_name: string;
  ward_name: string;
  school_type: SchoolType;
  subject_code: string;
  subject_performance: {
    grades: Record<Grade, GenderBreakdown>;
    registered: number;
    sat: number;
    pass: number;
    fail: number;
    withheld: number;
    clean: number;
    subject_gpa: number;
    position: Position;
  };
}

// School Analysis - Grades
export interface SchoolGradesAnalysis {
  exam_id: string;
  centre_number: string;
  school_name: string;
  region_name: string;
  council_name: string;
  ward_name: string;
  school_type: SchoolType;
  school_ranking: SchoolRanking;
  grades_summary: {
    combined: Record<Grade, GenderBreakdown>;
  };
}

// School Analysis - Divisions
export interface SchoolDivisionsAnalysis {
  exam_id: string;
  centre_number: string;
  school_name: string;
  region_name: string;
  council_name: string;
  ward_name: string;
  school_type: SchoolType;
  divisions_gpa: number;
  division_summary: {
    divisions_gpa: number;
    divisions: Record<Division, GenderBreakdown>;
    totals: GenderBreakdown;
  };
}

// School Analysis - Subjects
export interface SubjectGradeDetail {
  subject_gpa: number;
  position: Position;
}

export interface SchoolSubjectsAnalysis {
  exam_id: string;
  centre_number: string;
  school_name: string;
  region_name: string;
  council_name: string;
  ward_name: string;
  school_type: SchoolType;
  subjects_gpa: number;
  grades_summary: {
    subjects_gpa: Record<string, number> & { combined: number };
    grades: Record<string, SubjectGradeDetail> & {
      combined: SubjectGradeDetail;
    };
  };
}

// School Analysis - Ranking
export interface SchoolRankingAnalysis {
  exam_id: string;
  centre_number: string;
  school_name: string;
  region_name: string;
  council_name: string;
  ward_name: string;
  school_type: SchoolType;
  school_gpa: number;
  school_ranking: SchoolRanking;
}

// School Analysis - Full
export interface SubjectFullDetail {
  grades: Record<Grade, GenderBreakdown>;
  registered: number;
  sat: number;
  pass: number;
  fail: number;
  withheld: number;
  clean: number;
  subject_gpa: number;
  position: Position;
}

export interface SchoolFullAnalysis {
  centre_number: string;
  school_name: string;
  ward_name: string;
  council_name: string;
  region_name: string;
  subjects_gpa: SubjectGPA[];
  divisions_gpa: DivisionGPA[];
  school_gpa: number;
  grades_summary: GradesSummary[];
}

export interface ResultsProgress {
  exam_id: string;
  centre_number: string;
  ward_name: string;
  council_name: string;
  region_name: string;
  registered: number;
  with_marks: number;
  absents: number;
  subjects: SubjectProgress[];
  subject_completion: Record<string, boolean>;
  is_finished: boolean;
  id: string;
}

export interface SubjectProgress {
  subject_code: string;
  subject_name: string;
  registered: number;
  has_practical: boolean;
  filled_theory: number;
  filled_practical: number;
  filled_complete: number;
  absents: number;
}

export interface SubjectGPA {
  subject_code: string;
  subject_name: string;
  subject_gpa: number;
}

export interface DivisionGPA {
  division: Division;
  division_gpa: number;
}

export interface GradesSummary {
  grade: Grade;
  gender_breakdown: GenderBreakdown;
}

export interface SchoolFullAnalysis {
  exam_id: string;
  centre_number: string;
  school_name: string;
  region_name: string;
  council_name: string;
  ward_name: string;
  school_type: SchoolType;
  subjects_gpa: number;
  divisions_gpa: number;
  school_gpa: number;
  grades_summary: {
    grades: Record<string, SubjectFullDetail>;
  };
  division_summary?: {
    divisions_gpa: number;
    divisions: Record<Division, GenderBreakdown>;
    totals: GenderBreakdown;
  };
  school_ranking?: SchoolRanking;
}

// Exam Stats with detailed breakdown
export interface ExamStatsDetailed {
  exam_id: string;
  total_schools: number;
  average_school_gpa: number;
  top_schools: Array<{
    centre_number: string;
    school_gpa: number;
    school_name: string;
  }>;
  division_totals: Record<Division, GenderBreakdown>;
  grade_totals: Record<Grade, GenderBreakdown>;
}
