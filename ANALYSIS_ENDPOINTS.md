# Analysis Endpoints Documentation

This document describes the analysis endpoints available in the ExaMetrics API and how to use them in the frontend application.

## Overview

The analysis endpoints provide comprehensive examination results data with proper pagination support. All GPA values are formatted with **4 decimal places** for secondary school exams (CSEE/ACSEE) and **2 decimal places** for O-level averages (PSLE).

## Key Features

- **Pagination Support**: All list endpoints support pagination with `page` and `limit` parameters
- **Sorting**: Results can be sorted by GPA (ascending or descending)
- **Filtering**: Filter by specific schools using comma-separated centre numbers
- **Proper GPA Formatting**: GPA values display with 4 decimal places as per requirements

## Endpoints

### 1. Exam Statistics

**Endpoint**: `GET /api/v1/exams/{exam_id}/stats`

Returns detailed exam statistics including school counts, average GPA, top performers, and grade/division distributions.

**Response Example**:
```typescript
{
  exam_id: "1f07dc72-745c-6761-84eb-29f052c12afa",
  total_schools: 287,
  average_school_gpa: 3.7815,  // 4 decimal places
  top_schools: [
    {
      centre_number: "S0239",
      school_gpa: 1.0250,  // 4 decimal places
      school_name: "ST. FRANCIS GIRLS' SECONDARY SCHOOL"
    }
  ],
  division_totals: {
    "0": { F: 5364, M: 3760, T: 9124 },
    "I": { F: 1120, M: 1274, T: 2394 },
    // ...
  },
  grade_totals: {
    "A": { F: 4972, M: 4882, T: 9854 },
    // ...
  }
}
```

**Usage**:
```typescript
import { api } from '@/lib/api';

const stats = await api.getExamStatsDetailed(examId);
console.log(`Average GPA: ${formatGPA(stats.average_school_gpa)}`);
```

---

### 2. School Rankings

**Endpoint**: `GET /api/v1/exams/{exam_id}/analyses/rankings`

Returns paginated list of schools with their rankings and GPA.

**Query Parameters**:
- `page` (number, default: 1): Page number
- `limit` (number, default: 20): Items per page
- `sort_by` (string): `gpa_asc` or `gpa_desc`
- `format` (string): `json`
- `centres` (string): Comma-separated centre numbers (e.g., "s0330,s2532")

**Response Example**:
```typescript
{
  data: [
    {
      exam_id: "...",
      centre_number: "S0239",
      school_name: "ST. FRANCIS GIRLS' SECONDARY SCHOOL",
      region_name: "MBEYA",
      council_name: "MBEYA CC",
      ward_name: "SINDE",
      school_type: "PRIVATE",
      school_gpa: 1.0250,  // 4 decimal places
      school_ranking: {
        overall_pos: 1,
        overall_out_of: 287,
        ward_pos: 1,
        ward_out_of: 2,
        council_pos: 1,
        council_out_of: 61,
        region_pos: 1,
        region_out_of: 287
      }
    }
  ],
  pagination: {
    next: "/api/v1/exams/.../analyses/rankings?page=2&limit=20",
    previous: null,
    current: 1,
    total_pages: 15,
    total_items: 287
  },
  total_queried: 287
}
```

**Usage**:
```typescript
import { api } from '@/lib/api';
import { formatGPA } from '@/lib/utils';

// Get first page
const response = await api.getSchoolRankings(examId, {
  page: 1,
  limit: 20,
  sort_by: 'gpa_asc'
});

// Display results
response.data.forEach(school => {
  console.log(`${school.school_name}: ${formatGPA(school.school_gpa)}`);
});

// Filter by specific schools
const filtered = await api.getSchoolRankings(examId, {
  centres: 's0330,s2532'
});
```

---

### 3. School Overviews

**Endpoint**: `GET /api/v1/exams/{exam_id}/analyses/overviews`

Returns paginated list of schools with GPA breakdown (school, subjects, divisions).

**Query Parameters**: Same as School Rankings

**Response Example**:
```typescript
{
  data: [
    {
      exam_id: "...",
      centre_number: "S0239",
      school_name: "ST. FRANCIS GIRLS' SECONDARY SCHOOL",
      region_name: "MBEYA",
      council_name: "MBEYA CC",
      ward_name: "SINDE",
      school_type: "PRIVATE",
      school_gpa: 1.0250,      // 4 decimal places
      subjects_gpa: 1.0500,    // 4 decimal places
      divisions_gpa: 1.0000    // 4 decimal places
    }
  ],
  pagination: { /* ... */ },
  total_queried: 287
}
```

**Usage**:
```typescript
const overviews = await api.getSchoolOverviews(examId, {
  page: 1,
  limit: 20,
  sort_by: 'gpa_asc'
});
```

---

### 4. Subject Rankings

**Endpoint**: `GET /api/v1/exams/{exam_id}/subjects/{subject_code}/rankings`

Returns paginated rankings for a specific subject across all schools.

**Query Parameters**:
- `page`, `limit`, `sort_by`, `format` (same as above)

**Response Example**:
```typescript
{
  data: [
    {
      exam_id: "...",
      centre_number: "S0239",
      school_name: "ST. FRANCIS GIRLS' SECONDARY SCHOOL",
      region_name: "MBEYA",
      council_name: "MBEYA CC",
      ward_name: "SINDE",
      school_type: "PRIVATE",
      subject_gpa: 1.0217,  // 4 decimal places
      position: {
        subject_pos: 1,
        subject_out_of: 286,
        subject_gvt_pos: null,
        subject_gvt_out_of: null,
        subject_pvt_pos: 1,
        subject_pvt_out_of: 74,
        ward_pos: 1,
        ward_out_of: 2,
        // ... more position fields
      }
    }
  ],
  pagination: { /* ... */ },
  total_queried: 287
}
```

**Usage**:
```typescript
// Get rankings for Mathematics (subject code 011)
const mathRankings = await api.getSubjectRankings(examId, '011', {
  page: 1,
  limit: 20,
  sort_by: 'gpa_asc'
});
```

---

### 5. School Subject Analysis

**Endpoint**: `GET /api/v1/exams/{exam_id}/schools/{centre_number}/subjects/{subject_code}`

Returns detailed analysis for a specific subject at a specific school.

**Response Example**:
```typescript
{
  exam_id: "...",
  centre_number: "S0330",
  school_name: "MBEYA SECONDARY SCHOOL",
  region_name: "MBEYA",
  council_name: "MBEYA CC",
  ward_name: "MBALIZI ROAD",
  school_type: "GOVERNMENT",
  subject_code: "011",
  subject_performance: {
    grades: {
      "A": { F: 3, M: 11, T: 14 },
      "B": { F: 10, M: 22, T: 32 },
      // ...
    },
    registered: 209,
    sat: 206,
    pass: 192,
    fail: 14,
    withheld: 0,
    clean: 206,
    subject_gpa: 3.0728,  // 4 decimal places
    position: { /* ... */ }
  }
}
```

**Usage**:
```typescript
const subjectAnalysis = await api.getSchoolSubjectAnalysis(
  examId,
  's0330',
  '011'
);
```

---

### 6. School Analysis Endpoints

#### Grades Analysis
**Endpoint**: `GET /api/v1/exams/{exam_id}/schools/{centre_number}/analysis/grades`

Returns grade distribution for all subjects combined.

#### Divisions Analysis
**Endpoint**: `GET /api/v1/exams/{exam_id}/schools/{centre_number}/analysis/divisions`

Returns division distribution with GPA.

**Response includes**:
- `divisions_gpa`: Overall divisions GPA (4 decimal places)
- `division_summary`: Breakdown by division with gender counts

#### Subjects Analysis
**Endpoint**: `GET /api/v1/exams/{exam_id}/schools/{centre_number}/analysis/subjects`

Returns GPA for each subject with positions.

**Response includes**:
- `subjects_gpa`: Overall subjects GPA (4 decimal places)
- `grades_summary.subjects_gpa`: GPA per subject (4 decimal places)
- `grades_summary.grades`: Detailed position info per subject

#### Ranking Analysis
**Endpoint**: `GET /api/v1/exams/{exam_id}/schools/{centre_number}/analysis/ranking`

Returns school ranking information.

#### Full Analysis
**Endpoint**: `GET /api/v1/exams/{exam_id}/schools/{centre_number}/analysis/full`

Returns complete analysis including all subjects, grades, divisions, and rankings.

**Usage**:
```typescript
// Get comprehensive school analysis
const fullAnalysis = await api.getSchoolFullAnalysis(examId, 's0330');

console.log(`School GPA: ${formatGPA(fullAnalysis.school_gpa)}`);
console.log(`Subjects GPA: ${formatGPA(fullAnalysis.subjects_gpa)}`);
console.log(`Divisions GPA: ${formatGPA(fullAnalysis.divisions_gpa)}`);

// Access subject-specific data
Object.entries(fullAnalysis.grades_summary.grades).forEach(([code, detail]) => {
  if (code !== 'combined') {
    console.log(`Subject ${code}: ${formatGPA(detail.subject_gpa)}`);
  }
});
```

---

## Utility Functions

### GPA Formatting

Always use the `formatGPA` utility function to display GPA values:

```typescript
import { formatGPA, formatAverage } from '@/lib/utils';

// For secondary school (CSEE/ACSEE) - 4 decimal places
const gpaDisplay = formatGPA(school.school_gpa);  // "1.0250"

// For O-level (PSLE) - 2 decimal places
const avgDisplay = formatAverage(school.average);  // "45.67"
```

### Pagination Helpers

```typescript
import { buildPaginationParams, parsePaginationInfo } from '@/lib/utils';

// Build pagination params
const params = buildPaginationParams(2, 50);  // page 2, 50 items

// Parse pagination response
const paginationInfo = parsePaginationInfo(response.pagination);
console.log(`Page ${paginationInfo.currentPage} of ${paginationInfo.totalPages}`);
console.log(`Has next: ${paginationInfo.hasNext}`);
```

---

## Important Notes

1. **GPA Precision**: Always display GPA with 4 decimal places for secondary schools
2. **Centre Numbers**: Centre numbers should be uppercase (use `formatCentreNumber()`)
3. **Pagination**: Default page size is 20, maximum is 100
4. **Null Values**: Use the formatting utilities which handle null/undefined gracefully
5. **Filtering**: When filtering by centres, use comma-separated lowercase values in the query

---

## Example: Building a Rankings Table

```typescript
import { api } from '@/lib/api';
import { formatGPA, parsePaginationInfo } from '@/lib/utils';
import { useState, useEffect } from 'react';

function RankingsTable({ examId }: { examId: string }) {
  const [page, setPage] = useState(1);
  const [rankings, setRankings] = useState<any>(null);

  useEffect(() => {
    const fetchRankings = async () => {
      const response = await api.getSchoolRankings(examId, {
        page,
        limit: 20,
        sort_by: 'gpa_asc'
      });
      setRankings(response);
    };
    fetchRankings();
  }, [examId, page]);

  if (!rankings) return <div>Loading...</div>;

  const pagination = parsePaginationInfo(rankings.pagination);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>School</th>
            <th>GPA</th>
            <th>Region</th>
          </tr>
        </thead>
        <tbody>
          {rankings.data.map((school: any) => (
            <tr key={school.centre_number}>
              <td>{school.school_ranking.overall_pos}</td>
              <td>{school.school_name}</td>
              <td>{formatGPA(school.school_gpa)}</td>
              <td>{school.region_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div>
        <button 
          disabled={!pagination.hasPrevious}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
        <button 
          disabled={!pagination.hasNext}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

---

## API Response Types

All types are available in `@/lib/types`:

- `PaginatedResponse<T>`: Wrapper for paginated responses
- `SchoolRankingData`: School ranking data
- `SchoolOverview`: School overview with GPA breakdown
- `SubjectRankingData`: Subject-specific rankings
- `SchoolSubjectAnalysis`: Detailed subject analysis
- `SchoolGradesAnalysis`: Grade distribution
- `SchoolDivisionsAnalysis`: Division distribution
- `SchoolSubjectsAnalysis`: Subjects GPA analysis
- `SchoolRankingAnalysis`: Ranking information
- `SchoolFullAnalysis`: Complete school analysis
- `ExamStatsDetailed`: Exam statistics
- `Position`: Ranking position details
- `SchoolRanking`: School ranking details
- `GenderBreakdown`: Gender-based counts (F, M, T)
