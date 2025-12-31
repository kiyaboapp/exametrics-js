# ExaMetrics Frontend - Implementation TODO

## ✅ COMPLETED
- [x] TypeScript types for all analysis endpoints
- [x] API client methods for analysis endpoints
- [x] GPA formatting utilities (4 decimal places)
- [x] Pagination utilities and component
- [x] School rankings page with filtering & sorting
- [x] School overviews page
- [x] Subject rankings page (dynamic route)
- [x] Updated school analysis page with full analysis endpoint
- [x] Reusable pagination component
- [x] GPA display component

## 🔄 NAVIGATION & ROUTING

### Add to Sidebar/Navigation
Update `components/sidebar.tsx` to include:
- `/results/rankings?exam={id}` - School Rankings
- `/results/overviews?exam={id}` - School Overviews  
- `/results/subjects/{code}?exam={id}` - Subject Rankings (needs subject selector)

### Results Page Updates
Update `app/(dashboard)/results/page.tsx`:
- Add buttons/links to navigate to rankings and overviews
- Add subject selector to navigate to subject rankings

## 📊 PAGES READY TO USE

### 1. School Rankings (`/results/rankings`)
**Features:**
- Pagination (10/20/50/100 per page)
- Sort by GPA (best/worst first)
- Filter by centre numbers (comma-separated)
- Shows: Overall position, GPA (4 decimals), ward/council/region positions
- Clickable school names → school analysis page

**Usage:** Navigate to `/results/rankings?exam={exam_id}`

### 2. School Overviews (`/results/overviews`)
**Features:**
- Pagination
- Sort by GPA
- Shows: School GPA, Subjects GPA, Divisions GPA (all 4 decimals)
- Clickable school names → school analysis page

**Usage:** Navigate to `/results/overviews?exam={exam_id}`

### 3. Subject Rankings (`/results/subjects/[code]`)
**Features:**
- Pagination
- Sort by subject GPA
- Shows: Subject position, GPA (4 decimals), ward/council/region positions
- Dynamic route for any subject code

**Usage:** Navigate to `/results/subjects/011?exam={exam_id}` (for subject 011)

### 4. School Analysis (`/results/school`)
**Updated Features:**
- Uses new full analysis endpoint
- Displays all GPAs with 4 decimal places
- Shows school_gpa, subjects_gpa, divisions_gpa
- Detailed subject breakdown with proper GPA formatting

**Usage:** Navigate to `/results/school?exam={exam_id}&centre={centre_number}`

## 🎯 IMMEDIATE ACTIONS NEEDED

### 1. Update Results Landing Page
File: `app/(dashboard)/results/page.tsx`

Add navigation cards:
```tsx
<Card>
  <CardHeader>
    <CardTitle>School Rankings</CardTitle>
    <CardDescription>View schools ranked by GPA</CardDescription>
  </CardHeader>
  <CardContent>
    <Link href={`/results/rankings?exam=${selectedExam}`}>
      <Button>View Rankings</Button>
    </Link>
  </CardContent>
</Card>

<Card>
  <CardHeader>
    <CardTitle>School Overviews</CardTitle>
    <CardDescription>Compare GPA breakdowns</CardDescription>
  </CardHeader>
  <CardContent>
    <Link href={`/results/overviews?exam=${selectedExam}`}>
      <Button>View Overviews</Button>
    </Link>
  </CardContent>
</Card>

<Card>
  <CardHeader>
    <CardTitle>Subject Rankings</CardTitle>
    <CardDescription>View rankings by subject</CardDescription>
  </CardHeader>
  <CardContent>
    <Select onValueChange={(code) => router.push(`/results/subjects/${code}?exam=${selectedExam}`)}>
      <SelectTrigger>
        <SelectValue placeholder="Select subject" />
      </SelectTrigger>
      <SelectContent>
        {subjects.map(s => (
          <SelectItem key={s.code} value={s.code}>{s.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </CardContent>
</Card>
```

### 2. Update Sidebar Navigation
File: `components/sidebar.tsx`

Add under "Results" section:
```tsx
{
  title: 'School Rankings',
  href: '/results/rankings',
  icon: Trophy,
},
{
  title: 'School Overviews',
  href: '/results/overviews',
  icon: BarChart3,
},
```

### 3. Add Exam Selector Context
All new pages need exam ID from query params. Consider:
- Global exam selector in layout
- Persist selected exam in localStorage
- Or require exam param in URL (current approach)

## 🔧 OPTIONAL ENHANCEMENTS

### Export Functionality
Add export buttons to:
- Rankings page → Export to Excel/CSV
- Overviews page → Export to Excel/CSV
- Subject rankings → Export to Excel/CSV

### Advanced Filtering
- Filter by region/council/ward
- Filter by school type (Government/Private)
- Multi-select for multiple subjects

### Data Visualization
- Add charts to rankings page (top 10 schools)
- GPA distribution histogram
- Regional comparison charts

### Performance
- Add loading skeletons instead of "Loading..." text
- Implement data caching with React Query
- Add error boundaries

## 📝 DOCUMENTATION USAGE

### For Developers
- `ANALYSIS_ENDPOINTS.md` - Complete API documentation
- `IMPLEMENTATION_SUMMARY.md` - What was implemented

### For Users
Create user guide:
- How to navigate to rankings
- How to filter and sort
- Understanding GPA values (4 decimals)
- Understanding position columns

## 🚀 DEPLOYMENT CHECKLIST

Before deploying:
- [ ] Test all pagination (first/last/next/prev)
- [ ] Test filtering by centre numbers
- [ ] Verify GPA displays with 4 decimals everywhere
- [ ] Test sorting (asc/desc)
- [ ] Test all links between pages
- [ ] Test with different exam IDs
- [ ] Test with missing/invalid exam IDs
- [ ] Test mobile responsiveness
- [ ] Test loading states
- [ ] Test error states

## 🎨 UI/UX IMPROVEMENTS

### Consistency
- Ensure all tables have same styling
- Consistent badge colors for school types
- Consistent GPA display format (font-mono)

### Accessibility
- Add aria-labels to pagination buttons
- Add loading announcements for screen readers
- Ensure keyboard navigation works

### Mobile
- Make tables scrollable on mobile
- Stack filters vertically on small screens
- Adjust pagination for mobile

## 💡 NOTES

**GPA Display:**
- Always use `<GPADisplay value={gpa} />` component
- Or use `formatGPA(value)` utility
- Secondary schools: 4 decimals
- O-level: 2 decimals (use `formatAverage()`)

**Pagination:**
- Default: 20 items per page
- Max: 100 items per page
- Use `<Pagination />` component for consistency

**Centre Numbers:**
- Display uppercase using `formatCentreNumber()`
- API accepts lowercase in filters

**Links:**
- All school names link to school analysis page
- Include exam ID in query params
