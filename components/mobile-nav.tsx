'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  FileText,
  BarChart3,
  MapPin,
  UserCog,
  Settings,
} from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
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
      { title: 'Subjects Config', href: '/exams/subjects' },
      { title: 'Divisions Config', href: '/exams/divisions' },
      { title: 'Grades Config', href: '/exams/grades' },
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
    ],
  },
  {
    title: 'Results',
    icon: BarChart3,
    children: [
      { title: 'Process Results', href: '/results/process' },
      { title: 'View Results', href: '/results' },
    ],
  },
  {
    title: 'Location',
    icon: MapPin,
    children: [
      { title: 'Regional Overview', href: '/location/regions' },
    ],
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    children: [
      { title: 'Gender Breakdown', href: '/analytics/gender' },
    ],
  },
  {
    title: 'Users',
    icon: UserCog,
    children: [
      { title: 'User List', href: '/users' },
    ],
  },
  {
    title: 'Settings',
    icon: Settings,
    children: [
      { title: 'Profile Settings', href: '/settings' },
    ],
  },
];

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();

  const handleNavClick = () => {
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <span>ExaMetrics</span>
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {navItems.map((item) => {
              const isActive = item.href === pathname;
              const hasActiveChild = item.children?.some(
                (child) => child.href === pathname
              );

              if (item.children) {
                return (
                  <div key={item.title} className="space-y-2">
                    <div className="flex items-center gap-2 px-3 py-2">
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium">{item.title}</span>
                    </div>
                    <div className="ml-6 space-y-1">
                      {item.children.map((child) => (
                        <Link key={child.href} href={child.href}>
                          <Button
                            variant="ghost"
                            className={cn(
                              'w-full justify-start text-sm h-8',
                              pathname === child.href && 'bg-accent'
                            )}
                            onClick={handleNavClick}
                          >
                            {child.title}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link key={item.title} href={item.href!}>
                  <Button
                    variant="ghost"
                    className={cn(
                      'w-full justify-start',
                      isActive && 'bg-accent'
                    )}
                    onClick={handleNavClick}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Button>
                </Link>
              );
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
