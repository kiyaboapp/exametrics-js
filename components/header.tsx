'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { ThemeToggle } from './theme-toggle';
import { ExamSelector } from './exam-selector';
import { LogOut, User, Menu } from 'lucide-react';
import { getUser, clearAuthData } from '@/lib/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState } from 'react';

interface HeaderProps {
  onMobileMenuClick?: () => void;
  showMobileMenuButton?: boolean;
}

export function Header({ onMobileMenuClick, showMobileMenuButton = false }: HeaderProps) {
  const router = useRouter();
  const user = getUser();

  const handleLogout = () => {
    clearAuthData();
    router.push('/login');
  };

  if (!user) return null;

  const initials = `${user.first_name[0]}${user.surname[0]}`.toUpperCase();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
      <div className="flex items-center gap-2">
        {showMobileMenuButton && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMobileMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <ExamSelector />
      </div>
      
      <div className="flex items-center gap-4">
        <ThemeToggle />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar>
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user.first_name} {user.surname}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground">{user.role}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/profile')}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
