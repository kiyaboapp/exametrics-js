'use client';

import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  FileText,
  BarChart3,
  MapPin,
  UserCog,
  Settings,
  ChevronDown,
  Trophy,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { LucideIcon } from 'lucide-react';

interface NavItem {
  title: string;
  href?: string;
  icon: LucideIcon;
  children?: { title: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Exams',
    icon: BookOpen,
    children: [
      { title: 'All Exams', href: '/exams' },
      { title: 'Create Exam', href: '/exams/create' },
      { title: 'Subjects', href: '/exams/subjects' },
      { title: 'Divisions', href: '/exams/divisions' },
      { title: 'Grades', href: '/exams/grades' },
    ],
  },
  {
    title: 'Students',
    icon: Users,
    children: [
      { title: 'Registration', href: '/students/register' },
      { title: 'Upload PDFs', href: '/students/upload' },
      { title: 'Student List', href: '/students' },
    ],
  },
  {
    title: 'Marks',
    icon: FileText,
    children: [
      { title: 'Export Templates', href: '/marks/export' },
      { title: 'Upload Marks', href: '/marks/upload' },
      { title: 'Upload History', href: '/marks/history' },
      { title: 'Upload Progress', href: '/marks/progress' },
      {
        title: 'Results',
        href: '/results',
        icon: FileText,
        items: [
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
          {
            title: 'Process Results',
            href: '/results/process',
          },
          {
            title: 'School Analysis',
            href: '/results/school',
          },
          {
            title: 'Reports',
            href: '/results/reports',
          },
        ],
      },
    ],
  },
  {
    title: 'Results',
    icon: BarChart3,
    children: [
      { title: 'School Rankings', href: '/results/rankings' },
      { title: 'School Overviews', href: '/results/overviews' },
      { title: 'Subject Rankings', href: '/results/subjects' },
      { title: 'View Results', href: '/results' },
      { title: 'School Analysis', href: '/results/school' },
      { title: 'Process Results', href: '/results/process' },
      { title: 'Download Reports', href: '/results/reports' },
    ],
  },
  {
    title: 'Location Analysis',
    icon: MapPin,
    children: [
      { title: 'Regional Overview', href: '/location/regions' },
      { title: 'Council Analysis', href: '/location/councils' },
      { title: 'School Rankings', href: '/location/schools' },
    ],
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    children: [
      { title: 'Gender Breakdown', href: '/analytics/gender' },
      { title: 'School Type Comparison', href: '/analytics/school-type' },
      { title: 'Subject Deep Dive', href: '/analytics/subjects' },
      { title: 'Top Performers', href: '/analytics/top-performers' },
    ],
  },
  {
    title: 'Users',
    icon: UserCog,
    children: [
      { title: 'User List', href: '/users' },
      { title: 'Add User', href: '/users/create' },
      { title: 'Exam Assignments', href: '/users/assignments' },
    ],
  },
  {
    title: 'Settings',
    icon: Settings,
    children: [
      { title: 'Examination Boards', href: '/settings/boards' },
      { title: 'Master Subjects', href: '/settings/subjects' },
      { title: 'Locations', href: '/settings/locations' },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Exams', 'Results']);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]
    );
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    // Close mobile sidebar if open
    const sheet = document.querySelector('[data-state="open"]') as HTMLElement;
    if (sheet && isMobile) {
      sheet.click();
    }
  };

  return (
    <div className={cn(
      'flex h-full flex-col border-r bg-background transition-all duration-300',
      isCollapsed && !isMobile ? 'w-16' : 'w-64'
    )}>
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isCollapsed && <h1 className="text-xl font-bold">📊 ExaMetrics</h1>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden sm:flex"
        >
          <ChevronDown className={cn(
            'h-4 w-4 transition-transform',
            isCollapsed && 'rotate-90'
          )} />
        </Button>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isExpanded = expandedItems.includes(item.title);
            const isActive = item.href === pathname;

            if (item.children) {
              return (
                <div key={item.title}>
                  <Button
                    variant="ghost"
                    className={cn(
                      'w-full justify-between',
                      item.children.some((child) => child.href === pathname) &&
                        'bg-accent'
                    )}
                    onClick={() => toggleExpand(item.title)}
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </div>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        isExpanded && 'rotate-180'
                      )}
                    />
                  </Button>
                  {isExpanded && !isCollapsed && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Button
                          key={child.href}
                          variant="ghost"
                          className={cn(
                            'w-full justify-start text-sm',
                            pathname === child.href && 'bg-accent'
                          )}
                          onClick={() => handleNavigation(child.href)}
                        >
                          {child.title}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Button
                key={item.title}
                variant="ghost"
                className={cn(
                  'w-full justify-start',
                  isActive && 'bg-accent'
                )}
                onClick={() => handleNavigation(item.href!)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {!isCollapsed && <span>{item.title}</span>}
              </Button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
