// API Client for ExaMetrics

import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL, TOKEN_STORAGE_KEY } from './constants';
import type {
  LoginResponse,
  Exam,
  ExamStats,
  School,
  Student,
  ExamSubject,
  ExamDivision,
  ExamGrade,
  ResultsStats,
  SchoolAnalysis,
  LocationHierarchy,
  RegionSummary,
  UploadTrail,
  ProcessingResult,
  ExaminationBoard,
  Region,
  Council,
  Ward,
  User,
} from './types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use((config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication
  async login(username: string, password: string): Promise<LoginResponse> {
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('username', username);
    params.append('password', password);
    
    const { data } = await this.client.post<LoginResponse>('/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return data;
  }

  async logout(token: string): Promise<void> {
    await this.client.post('/auth/logout', { access_token: token });
  }

  // Dashboard
  async getExamStats(): Promise<ExamStats> {
    const { data } = await this.client.get<ExamStats>('/exams/stats');
    return data;
  }

  async getResultsStats(examId: string): Promise<ResultsStats> {
    const { data } = await this.client.get<ResultsStats>(`/results/stats/${examId}`);
    return data;
  }

  // Exams
  async getExams(params?: { skip?: number; limit?: number }): Promise<Exam[]> {
    const { data } = await this.client.get<Exam[]>('/exams', { params });
    return data;
  }

  async getExam(examId: string): Promise<Exam> {
    const { data } = await this.client.get<Exam>(`/exams/${examId}`);
    return data;
  }

  async createExam(exam: Partial<Exam>): Promise<Exam> {
    const { data } = await this.client.post<Exam>('/exams', exam);
    return data;
  }

  async updateExam(examId: string, exam: Partial<Exam>): Promise<Exam> {
    const { data } = await this.client.put<Exam>(`/exams/${examId}`, exam);
    return data;
  }

  async deleteExam(examId: string): Promise<void> {
    await this.client.delete(`/exams/${examId}`);
  }

  async getExamSchools(examId: string): Promise<School[]> {
    const { data } = await this.client.get<School[]>(`/exams/${examId}/schools`);
    return data;
  }

  // Exam Divisions
  async getExamDivisions(examId: string): Promise<ExamDivision[]> {
    const { data } = await this.client.get<ExamDivision[]>('/exam-divisions', {
      params: { exam_id: examId },
    });
    return data;
  }

  async updateExamDivision(divisionId: number, division: Partial<ExamDivision>): Promise<ExamDivision> {
    const { data } = await this.client.put<ExamDivision>(`/exam-divisions/${divisionId}`, division);
    return data;
  }

  // Exam Grades
  async getExamGrades(examId: string): Promise<ExamGrade[]> {
    const { data } = await this.client.get<ExamGrade[]>('/exam-grades', {
      params: { exam_id: examId },
    });
    return data;
  }

  async updateExamGrade(gradeId: number, grade: Partial<ExamGrade>): Promise<ExamGrade> {
    const { data } = await this.client.put<ExamGrade>(`/exam-grades/${gradeId}`, grade);
    return data;
  }

  // Exam Subjects
  async getExamSubjects(examId: string): Promise<ExamSubject[]> {
    const { data } = await this.client.get<ExamSubject[]>('/exam-subjects', {
      params: { exam_id: examId },
    });
    return data;
  }

  async addExamSubject(subject: Partial<ExamSubject>): Promise<ExamSubject> {
    const { data } = await this.client.post<ExamSubject>('/exam-subjects', subject);
    return data;
  }

  async deleteExamSubject(subjectId: number): Promise<void> {
    await this.client.delete(`/exam-subjects/${subjectId}`);
  }

  // Students
  async getStudents(examId: string, centreNumber?: string): Promise<Student[]> {
    const { data } = await this.client.get<Student[]>('/students', {
      params: { exam_id: examId, centre_number: centreNumber },
    });
    return data;
  }

  async createStudent(student: Partial<Student>): Promise<Student> {
    const { data } = await this.client.post<Student>('/students', student);
    return data;
  }

  async updateStudent(studentId: string, student: Partial<Student>): Promise<Student> {
    const { data } = await this.client.put<Student>(`/students/${studentId}`, student);
    return data;
  }

  async deleteStudent(studentId: string): Promise<void> {
    await this.client.delete(`/students/${studentId}`);
  }

  // PDF Upload
  async uploadPDF(file: File, examId: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('exam_id', examId);
    const { data } = await this.client.post('/schools/upload/pdfs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  }

  async uploadMultiplePDFs(files: File[], examId: string): Promise<any> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    formData.append('exam_id', examId);
    const { data } = await this.client.post('/schools/upload/pdfs/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  }

  async uploadZipPDFs(file: File, examId: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('exam_id', examId);
    const { data } = await this.client.post('/schools/upload/pdfs/zip', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  }

  // Marks Export
  async exportMarksTemplate(params: {
    exam_id: string;
    centre_number?: string;
    practical_mode?: number;
    marks_filler?: string;
    include_marks?: boolean;
  }): Promise<Blob> {
    const { data } = await this.client.get('/student/subjects/export/excel', {
      params,
      responseType: 'blob',
    });
    return data;
  }

  async exportMultipleMarksTemplates(params: {
    exam_id: string;
    region_name?: string;
    council_name?: string;
    ward_name?: string;
    school_type?: string;
  }): Promise<Blob> {
    const { data } = await this.client.get('/student/subjects/export/excel/multiple', {
      params,
      responseType: 'blob',
    });
    return data;
  }

  // Marks Import
  async importMarks(file: File, examId: string, uploadNulls = false, useStudentId = false): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('exam_id', examId);
    formData.append('upload_nulls', String(uploadNulls));
    formData.append('use_student_id', String(useStudentId));
    const { data } = await this.client.post('/student/subjects/import/marks', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  }

  async importMultipleMarks(files: File[], examId: string): Promise<any> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    formData.append('exam_id', examId);
    const { data } = await this.client.post('/student/subjects/import/marks/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  }

  async importMarksZip(file: File, examId: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('exam_id', examId);
    const { data } = await this.client.post('/student/subjects/import/marks/zip', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  }

  // Upload History
  async getUploadTrails(examId: string): Promise<UploadTrail[]> {
    const { data } = await this.client.get<UploadTrail[]>('/upload-trails', {
      params: { exam_id: examId },
    });
    return data;
  }

  // Results Processing
  async processResults(examId: string, options?: {
    delete_theory?: boolean;
    delete_practical?: boolean;
    delete_overall?: boolean;
  }): Promise<ProcessingResult> {
    const { data } = await this.client.get<ProcessingResult>(`/results/results/complete/${examId}`, {
      params: options,
    });
    return data;
  }

  async getResults(examId: string, params?: { skip?: number; limit?: number }): Promise<any[]> {
    const { data } = await this.client.get('/results', {
      params: { exam_id: examId, ...params },
    });
    return data;
  }

  async getSchoolAnalysis(examId: string, centreNumber: string): Promise<SchoolAnalysis> {
    const { data } = await this.client.get<SchoolAnalysis>(`/results/analysis/${examId}/${centreNumber}`);
    return data;
  }

  // PDF Reports
  async downloadSchoolPDF(examId: string, centreNumber: string): Promise<Blob> {
    const { data } = await this.client.get(`/results/results/pdf/${examId}/${centreNumber}`, {
      responseType: 'blob',
    });
    return data;
  }

  async downloadPDFZip(examId: string, params?: {
    region_name?: string;
    council_name?: string;
    ward_name?: string;
    organize_by_ward?: boolean;
  }): Promise<Blob> {
    const { data } = await this.client.get(`/results/pdf/zip/${examId}`, {
      params,
      responseType: 'blob',
    });
    return data;
  }

  // Raw Data Download
  async downloadRawData(examId: string, params?: any): Promise<Blob> {
    const { data } = await this.client.get(`/results/download/rawdata/${examId}`, {
      params,
      responseType: 'blob',
    });
    return data;
  }

  // Location Analysis
  async getLocationHierarchy(examId: string): Promise<LocationHierarchy> {
    const { data } = await this.client.get<LocationHierarchy>(`/location-analysis/hierarchy/${examId}`);
    return data;
  }

  async getRegionSummary(examId: string, regionName: string): Promise<RegionSummary> {
    const { data } = await this.client.get<RegionSummary>(
      `/location-analysis/region-summary/${examId}/${encodeURIComponent(regionName)}`
    );
    return data;
  }

  async getLocationAnalysis(examId: string): Promise<any[]> {
    const { data } = await this.client.get(`/location-analysis/exam/${examId}`);
    return data;
  }

  // Analytics
  async getGenderBreakdown(examId: string): Promise<any> {
    const { data } = await this.client.get(`/analytics/gender-breakdown/${examId}`);
    return data;
  }

  async getSchoolTypeComparison(examId: string): Promise<any> {
    const { data } = await this.client.get(`/analytics/school-type-comparison/${examId}`);
    return data;
  }

  async getSubjectDetailed(examId: string): Promise<any> {
    const { data } = await this.client.get(`/analytics/subject-detailed/${examId}`);
    return data;
  }

  async getTopPerformers(examId: string, params?: any): Promise<any> {
    const { data } = await this.client.get(`/analytics/top-performers/${examId}`, { params });
    return data;
  }

  async getRegionalDeepDive(examId: string, regionName: string): Promise<any> {
    const { data } = await this.client.get(
      `/analytics/regional-deep-dive/${examId}/${encodeURIComponent(regionName)}`
    );
    return data;
  }

  // Comparisons
  async compareSchools(examId: string, centreNumbers: string[]): Promise<any> {
    const { data } = await this.client.post('/comparisons/schools', {
      exam_id: examId,
      centre_numbers: centreNumbers,
    });
    return data;
  }

  async compareRegions(examId: string, regionNames: string[]): Promise<any> {
    const { data } = await this.client.post('/comparisons/regions', {
      exam_id: examId,
      region_names: regionNames,
    });
    return data;
  }

  async getSchoolExamHistory(centreNumber: string, limit = 10): Promise<any> {
    const { data } = await this.client.get(`/comparisons/exam-history/${centreNumber}`, {
      params: { limit },
    });
    return data;
  }

  // User Management
  async getUsers(): Promise<User[]> {
    const { data } = await this.client.get<User[]>('/users');
    return data;
  }

  async createUser(user: Partial<User> & { password: string }): Promise<User> {
    const { data } = await this.client.post<User>('/users', user);
    return data;
  }

  async updateUser(userId: string, user: Partial<User>): Promise<User> {
    const { data } = await this.client.put<User>(`/users/${userId}`, user);
    return data;
  }

  async deleteUser(userId: string): Promise<void> {
    await this.client.delete(`/users/${userId}`);
  }

  async assignExamToUser(userId: string, examId: string, permissions: string[]): Promise<any> {
    const { data } = await this.client.post(`/users/${userId}/assign-exam`, {
      exam_id: examId,
      permissions,
    });
    return data;
  }

  async getUserExams(userId: string): Promise<any[]> {
    const { data } = await this.client.get(`/users/${userId}/exams`);
    return data;
  }

  // Reference Data
  async getExaminationBoards(): Promise<ExaminationBoard[]> {
    const { data } = await this.client.get<ExaminationBoard[]>('/examination-boards');
    return data;
  }

  async createExaminationBoard(board: Partial<ExaminationBoard>): Promise<ExaminationBoard> {
    const { data } = await this.client.post<ExaminationBoard>('/examination-boards', board);
    return data;
  }

  async updateExaminationBoard(boardId: string, board: Partial<ExaminationBoard>): Promise<ExaminationBoard> {
    const { data } = await this.client.put<ExaminationBoard>(`/examination-boards/${boardId}`, board);
    return data;
  }

  async deleteExaminationBoard(boardId: string): Promise<void> {
    await this.client.delete(`/examination-boards/${boardId}`);
  }

  async getMasterSubjects(examLevel?: string): Promise<any[]> {
    const { data } = await this.client.get('/subjects', {
      params: examLevel ? { exam_level: examLevel } : undefined,
    });
    return data;
  }

  async getRegions(): Promise<Region[]> {
    const { data } = await this.client.get<Region[]>('/regions');
    return data;
  }

  async getCouncils(regionId?: string): Promise<Council[]> {
    const { data } = await this.client.get<Council[]>('/councils', {
      params: regionId ? { region_id: regionId } : undefined,
    });
    return data;
  }

  async getWards(councilId?: string): Promise<Ward[]> {
    const { data } = await this.client.get<Ward[]>('/wards', {
      params: councilId ? { council_id: councilId } : undefined,
    });
    return data;
  }

  async getSchools(): Promise<School[]> {
    const { data } = await this.client.get<School[]>('/schools');
    return data;
  }

  async getCurrentUser(): Promise<User> {
    const { data } = await this.client.get<User>('/auth/me');
    return data;
  }

  async updateProfile(profile: { full_name?: string; email?: string }): Promise<User> {
    const { data } = await this.client.put<User>('/auth/me', profile);
    return data;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await this.client.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  }

  async registerStudent(examId: string, student: any): Promise<Student> {
    const { data } = await this.client.post<Student>('/students', {
      exam_id: examId,
      ...student,
    });
    return data;
  }

  async uploadStudentPdf(examId: string, file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('exam_id', examId);
    const { data } = await this.client.post('/schools/upload/pdfs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  }

  async uploadMarks(examId: string, file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('exam_id', examId);
    const { data } = await this.client.post('/student/subjects/import/marks', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  }

  async getLocationAnalyses(examId: string): Promise<any[]> {
    const { data } = await this.client.get(`/location-analysis/exam/${examId}`);
    return data;
  }
}

export const api = new ApiClient();
