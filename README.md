# ExaMetrics - Examination Analytics Platform

A comprehensive examination results analysis and management system built with Next.js 15, TypeScript, Tailwind CSS v3, and shadcn/ui.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to access the application.

## 🔑 Test Credentials

```
URL: https://exametrics.kiyabo.com/api/v1
Username: anon@kiyabo.com
Password: anon@kiyabo.com
Test Exam ID: 1f07dc72-745c-6761-84eb-29f052c12afa
```

## 📚 Documentation

- **Windsurf Rules**: See `WINDSURF_RULES.md` for development guidelines
- **Project Status**: See `PROJECT_STATUS.md` for current progress and TODO list
- **API Documentation**: `C:\Users\droge\OneDrive\Desktop\HANDLER\DJANGO\exametrics\API_DOCUMENTATION.md`
- **Implementation Guide**: `C:\Users\droge\OneDrive\Desktop\HANDLER\DJANGO\exametrics\FE_IMPLEMENTATION_GUIDE.md`
- **Backend Source**: `C:\Users\droge\OneDrive\Desktop\HANDLER\DJANGO\exametrics`

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **UI Components**: shadcn/ui
- **State Management**: React Query (@tanstack/react-query)
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Icons**: Lucide React
- **Theme**: next-themes (light/dark mode)

## 📁 Project Structure

```
exametrics-js/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard pages
│   └── layout.tsx         # Root layout with providers
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── providers/        # Context providers
│   ├── charts/           # Chart components
│   └── [other]           # Custom components
├── lib/                   # Utilities and helpers
│   ├── api.ts            # API client
│   ├── hooks.ts          # React Query hooks
│   ├── auth.ts           # Authentication utilities
│   ├── types.ts          # TypeScript types
│   └── constants.ts      # App constants
└── .env.local            # Environment variables
```

## 🎯 Key Features

- **Dashboard**: Exam statistics and overview
- **Exam Management**: Create and configure exams
- **Student Registration**: Manual and PDF bulk upload
- **Marks Management**: Export templates, upload marks
- **Results Processing**: Complete results analysis
- **Location Analysis**: Regional/council/school rankings
- **Analytics**: Gender, school type, subject deep dives
- **User Management**: Role-based access control
- **Theme Support**: Light and dark modes

## ⚠️ Critical Rules

### Exam Type Logic
- **Primary Exams** (STNA, SFNA, PSLE): Display **Average Marks** as key metric, NO divisions, NO GPA
- **Secondary Exams** (FTNA, CSEE, ACSEE): Display **GPA as BIG NUMBER** (NOT a chart!), show division charts

### School Filtering
Always use exam-scoped schools:
```typescript
// ✅ CORRECT
const schools = await api.getExamSchools(examId);

// ❌ WRONG
const schools = await api.getSchools();
```

### Permissions
- Active exams: All authorized users can edit
- Inactive exams: Only SUPER_ADMIN can edit/delete

## 🔧 Development

### Add shadcn/ui Components
```bash
npx shadcn@latest add [component-name]
```

### Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://exametrics.kiyabo.com/api/v1
```

### Type Safety
All API responses are fully typed. See `lib/types.ts` for type definitions.

## 📊 Charts and Visualizations

- Division Distribution (Pie/Bar) - Secondary exams only
- Grade Distribution (Bar) - All exams
- Subject Performance (Horizontal Bar)
- Gender Breakdown
- School Type Comparison
- Regional Analysis Maps

## 🎨 Color Schemes

### Divisions
- I: Green (#22c55e) - Excellent
- II: Blue (#3b82f6) - Good
- III: Yellow (#eab308) - Average
- IV: Orange (#f97316) - Below Average
- 0: Red (#ef4444) - Fail

### Grades
- A: Green, B: Lime, C: Yellow, D: Orange, E: Red, F: Dark Red, S: Gray

## 📝 TODO

See `PROJECT_STATUS.md` for detailed progress and remaining tasks.

**High Priority:**
- Exams list and create pages
- Results processing page
- School analysis dashboard
- Student registration pages
- Marks upload functionality

## 🤝 Contributing

Refer to `WINDSURF_RULES.md` for development guidelines and best practices.

## 📄 License

This project is part of the ExaMetrics examination management system.
