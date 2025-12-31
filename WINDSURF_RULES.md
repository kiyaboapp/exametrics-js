# Windsurf Rules for ExaMetrics Project

## Project Overview
ExaMetrics is a comprehensive examination results analysis and management system built with Next.js 15, TypeScript, Tailwind CSS v3, and shadcn/ui components.

## Backend API
- **Base URL**: `https://exametrics.kiyabo.com/api/v1`
- **Documentation**: See `C:\Users\droge\OneDrive\Desktop\HANDLER\DJANGO\exametrics\API_DOCUMENTATION.md`
- **Implementation Guide**: See `C:\Users\droge\OneDrive\Desktop\HANDLER\DJANGO\exametrics\FE_IMPLEMENTATION_GUIDE.md`
- **Backend Source**: `C:\Users\droge\OneDrive\Desktop\HANDLER\DJANGO\exametrics`

allowed to go to backend source and change files
eg i see there is a /exam/stats which is mistakenly as exam starst for dashboard that is false. cvreate a new endpoint for that and study all
endpoints to see how fits into you FE, so some reason allowed to create others to fit eg dor dasboard analsyis we need new/ existing of not well referenced.

dont be afread to hit the following where needed to get real data to see the structure, also use the schem responses in backend to preditc the data.

## Test Credentials
```
URL: https://exametrics.kiyabo.com/api/v1
Username: anon@kiyabo.com
Password: anon@kiyabo.com
Test Exam ID: 1f07dc72-745c-6761-84eb-29f052c12afa
```

## Technology Stack
- **Framework**: Next.js 15 (App Router, no src directory)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **UI Components**: shadcn/ui (always use)
- **State Management**: React Query (@tanstack/react-query)
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Icons**: Lucide React
- **Theme**: next-themes (light/dark mode support)

## Project Structure
```
exametrics-js/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── exams/
│   │   ├── students/
│   │   ├── marks/
│   │   ├── results/
│   │   ├── location/
│   │   ├── analytics/
│   │   ├── users/
│   │   ├── settings/
│   │   └── layout.tsx
│   ├── layout.tsx (root with providers)
│   └── page.tsx (redirects to /login)
├── components/
│   ├── ui/ (shadcn components)
│   ├── providers/
│   ├── charts/
│   ├── sidebar.tsx
│   ├── header.tsx
│   ├── exam-selector.tsx
│   ├── theme-toggle.tsx
│   └── [other components]
├── lib/
│   ├── api.ts (API client)
│   ├── hooks.ts (React Query hooks)
│   ├── auth.ts (authentication utilities)
│   ├── types.ts (TypeScript types)
│   ├── constants.ts (app constants)
│   └── utils.ts (utility functions)
└── .env.local
```

## Critical Rules

### 1. Exam Type Logic
**NEVER GRAPH GPA - Display it as a BIG NUMBER, not chart data**

#### Primary Exams (STNA, SFNA, PSLE)
- **Key Metric**: Average Marks (display as big number)
- **NO divisions** (don't show division charts)
- **NO GPA** (don't calculate or display)
- **Chart**: Grades distribution, subject performance by average

#### Secondary Exams (FTNA, CSEE, ACSEE)
- **Key Metric**: GPA (display as big number, NOT a chart!)
- **Has divisions**: I, II, III, IV, 0
- **Chart**: Division distribution (pie/bar), grades, subject performance by GPA

### 2. School Filtering
```typescript
// ❌ WRONG - Returns ALL schools
const schools = await api.getSchools();

// ✅ CORRECT - Returns only schools in THIS exam
const schools = await api.getExamSchools(examId);
```

### 3. Permission Rules
- **Active exams** (`is_active=true`): All authorized users can edit
- **Inactive exams** (`is_active=false`): **ONLY SUPER_ADMIN** can edit/delete
- Editing marks on processed exam → automatically sets `results_processed=false`

### 4. Exam Context
- Global `selectedExamId` persisted in localStorage
- Most pages are exam-scoped (require exam selection)
- Clear dependent filters when exam changes

### 5. Sorting Orders
```typescript
DIVISION_ORDER = ['I', 'II', 'III', 'IV', '0', 'INC', 'ABS']
GRADE_ORDER = ['A', 'B', 'C', 'D', 'E', 'F', 'S']
GRADE_POINTS = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, S: 7 }
```

## Color Schemes

### Divisions
```typescript
'I': '#22c55e'   // Green - Excellent
'II': '#3b82f6'  // Blue - Good
'III': '#eab308' // Yellow - Average
'IV': '#f97316'  // Orange - Below Average
'0': '#ef4444'   // Red - Fail
```

### Grades
```typescript
'A': '#22c55e'   // Green
'B': '#84cc16'   // Lime
'C': '#eab308'   // Yellow
'D': '#f97316'   // Orange
'E': '#ef4444'   // Red
'F': '#dc2626'   // Dark Red
'S': '#6b7280'   // Gray (Special, points = 7)
```

### Gender
```typescript
'M': '#3b82f6'   // Blue
'F': '#ec4899'   // Pink
```

## API Integration

### Exam Configuration API (ExamSubject, ExamDivision, ExamGrade)

All exam configuration endpoints require `exam_id` in the URL path:

```typescript
// ExamSubject
api.getExamSubjects(examId)                           // GET /exam-subjects/exam/{examId}
api.createExamSubject(examId, subject)                // POST /exam-subjects/exam/{examId}
api.updateExamSubject(examId, subjectId, subject)     // PUT /exam-subjects/exam/{examId}/{subjectId}
api.deleteExamSubject(examId, subjectId)              // DELETE /exam-subjects/exam/{examId}/{subjectId}

// ExamDivision
api.getExamDivisions(examId)                          // GET /exam-divisions/exam/{examId}
api.createExamDivision(examId, division)              // POST /exam-divisions/exam/{examId}
api.updateExamDivision(examId, divisionId, division)  // PUT /exam-divisions/exam/{examId}/{divisionId}
api.deleteExamDivision(examId, divisionId)            // DELETE /exam-divisions/exam/{examId}/{divisionId}

// ExamGrade
api.getExamGrades(examId)                             // GET /exam-grades/exam/{examId}
api.createExamGrade(examId, grade)                    // POST /exam-grades/exam/{examId}
api.updateExamGrade(examId, gradeId, grade)           // PUT /exam-grades/exam/{examId}/{gradeId}
api.deleteExamGrade(examId, gradeId)                  // DELETE /exam-grades/exam/{examId}/{gradeId}
```

**Field Names:**
- **ExamSubject**: exam_id, subject_code, subject_name, subject_short, has_practical, exclude_from_gpa, is_primary, is_olevel, is_alevel
- **ExamDivision**: exam_id, division, lowest_points, highest_points, division_points
- **ExamGrade**: exam_id, grade, **lowest_value**, **highest_value**, grade_points, division_points

**Security**: All operations validate item belongs to specified exam_id. Returns 403 if not.

### Authentication
```typescript
// Login
const response = await api.login(username, password);
setAuthData(response.access_token, response.user, response.user_exams);

// Logout
clearAuthData();
router.push('/login');
```

### React Query Hooks
```typescript
// Dashboard
const { data: stats } = useExamStats();
const { data: resultsStats } = useResultsStats(examId);

// Exams
const { data: exams } = useExams();
const { data: exam } = useExam(examId);
const { data: schools } = useExamSchools(examId);

// Results
const { data: analysis } = useSchoolAnalysis(examId, centreNumber);

// Location
const { data: hierarchy } = useLocationHierarchy(examId);
const { data: regionSummary } = useRegionSummary(examId, regionName);

// Analytics
const { data: genderData } = useGenderBreakdown(examId);
const { data: schoolTypeData } = useSchoolTypeComparison(examId);
```

## Component Usage

### Key Metric Cards
```typescript
// For Secondary Exams - Display GPA as BIG NUMBER
<GPACard value={data.school_gpa} label="School GPA" />

// For Primary Exams - Display Average Marks as BIG NUMBER
<AverageMarksCard value={data.average_marks} label="Average Marks" />
```

### Charts
```typescript
// Division Charts (Secondary Only)
<DivisionPieChart data={divisionDistribution} />
<DivisionBarChart data={divisionDistribution} />

// Grade Chart (All Exams)
<GradeBarChart data={gradesSummary} />

// Subject Performance
<SubjectPerformanceChart 
  subjects={subjects} 
  metric={isSecondary ? 'gpa' : 'average'} 
/>
```

### Badges
```typescript
<DivisionBadge division="I" />
<GradeBadge grade="A" />
```

## Page Structure

### Required Pages
1. **Authentication**
   - `/login` - Login page with test credentials

2. **Dashboard**
   - `/dashboard` - Main dashboard with exam stats

3. **Exams Management**
   - `/exams` - List all exams
   - `/exams/create` - Create new exam
   - `/exams/[id]` - View/edit exam
   - `/exams/divisions` - Configure divisions
   - `/exams/grades` - Configure grades

4. **Students**
   - `/students` - Student list
   - `/students/register` - Manual registration
   - `/students/upload` - PDF upload

5. **Marks**
   - `/marks/export` - Export templates
   - `/marks/upload` - Upload marks
   - `/marks/history` - Upload history

6. **Results**
   - `/results/process` - Process results (THE MAIN BUTTON)
   - `/results` - View results
   - `/results/school` - School analysis
   - `/results/reports` - Download reports

7. **Location Analysis**
   - `/location/regions` - Regional overview
   - `/location/councils` - Council analysis
   - `/location/schools` - School rankings

8. **Analytics**
   - `/analytics/gender` - Gender breakdown
   - `/analytics/school-type` - School type comparison
   - `/analytics/subjects` - Subject deep dive
   - `/analytics/top-performers` - Top performers

9. **User Management** (Admin only)
   - `/users` - User list
   - `/users/create` - Add user
   - `/users/assignments` - Exam assignments

10. **Settings**
    - `/settings/boards` - Examination boards
    - `/settings/subjects` - Master subjects
    - `/settings/locations` - Locations

## Development Guidelines

### Always Use shadcn/ui
```bash
npx shadcn@latest add [component-name]
```

### Theme Support
- Always support light and dark modes
- Use `ThemeToggle` component in header
- Use semantic color classes from Tailwind

### Type Safety
- All API responses should be typed
- Use types from `lib/types.ts`
- Avoid `any` types

### Error Handling
```typescript
try {
  const data = await api.someEndpoint();
} catch (error: any) {
  // Show user-friendly error message
  toast.error(error.response?.data?.detail || 'An error occurred');
}
```

### Loading States
```typescript
const { data, isLoading, error } = useQuery(...);

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <EmptyState />;
```

## Environment Variables
```env
NEXT_PUBLIC_API_URL=https://exametrics.kiyabo.com/api/v1
```

## Common Patterns

### Conditional Rendering by Exam Type
```typescript
const isPrimary = ['STNA', 'SFNA', 'PSLE'].includes(exam.exam_level);
const isSecondary = ['FTNA', 'CSEE', 'ACSEE'].includes(exam.exam_level);

{isPrimary && <AverageMarksCard value={data.average_marks} />}
{isSecondary && <GPACard value={data.school_gpa} />}
{isSecondary && <DivisionPieChart data={data.division_summary} />}
```

### Exam Context Usage
```typescript
const { selectedExamId, setSelectedExamId, userExams } = useExamContext();

// Require exam selection
if (!selectedExamId) {
  return <ExamSelectionPrompt />;
}
```

### Permission Checks
```typescript
import { canEditExam, getUser } from '@/lib/auth';

const user = getUser();
const canEdit = canEditExam(exam.is_active, user.role);

{canEdit && <Button onClick={handleEdit}>Edit</Button>}
```

## TODO: Remaining Pages to Create

### High Priority
- [ ] Exams list and create pages
- [ ] Results processing page
- [ ] School analysis page
- [ ] Student registration pages
- [ ] Marks upload pages

### Medium Priority
- [ ] Location analysis pages
- [ ] Analytics pages (gender, school type, subjects)
- [ ] User management pages

### Low Priority
- [ ] Settings pages
- [ ] Profile page
- [ ] Advanced filters and comparisons

## Notes
- The backend FastAPI project is fully functional
- All API endpoints are documented in API_DOCUMENTATION.md
- Frontend implementation patterns are in FE_IMPLEMENTATION_GUIDE.md
- Always refer to these docs when implementing new features
