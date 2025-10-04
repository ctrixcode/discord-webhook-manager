'use client';

import React from 'react';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { LogOut, Settings, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Image from 'next/image';

export function DashboardHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getAccountTypeBadge = (accountType: string) => {
    const commonBadgeClasses = 'ml-2';
    let quote = '';

    switch (accountType) {
      case 'free':
        quote = 'Explore the basics, unlock your potential.';
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  className={`${commonBadgeClasses} bg-blue-500/80 text-white text-xs px-1 py-0.5 rounded-full`}
                >
                  Free
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="bg-slate-800 border-slate-700 text-white">
                <p>{quote}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case 'paid':
        quote = 'Elevate your experience, achieve more.';
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  className={`${commonBadgeClasses} bg-purple-500/80 text-white text-xs px-1 py-0.5 rounded-full`}
                >
                  Paid
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="bg-slate-800 border-slate-700 text-white">
                <p>{quote}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case 'premium':
        quote = 'Unleash the ultimate power, no limits.';
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Crown
                  className={`${commonBadgeClasses} h-4 w-4 text-yellow-400 drop-shadow-md`}
                  fill="currentColor"
                />
              </TooltipTrigger>
              <TooltipContent className="bg-slate-800 border-slate-700 text-white">
                <p>{quote}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      default:
        return null;
    }
  };

  return (
    <header className="border-b border-t border-slate-800/50 bg-slate-900/20 backdrop-blur-xl sticky top-0 z-30">
      <div className="flex h-16 items-center justify-between px-6">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => router.push('/dashboard/webhooks')}
        >
          <Image
            width={40}
            height={40}
            src="/favicon.png"
            alt="Webhook Manager Logo"
          />
          <div>
            <h1 className="text-lg font-semibold text-white">
              Webhook Manager
            </h1>
            <p className="text-xs text-slate-400">Discord Integration</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user?.username && (
            <span className="text-white text-lg font-semibold mr-2 flex items-center">
              {user.username}
              {user?.accountType && getAccountTypeBadge(user.accountType)}
            </span>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full hover:bg-purple-500/20"
              >
                <Avatar className="h-10 w-10 ring-2 ring-purple-500/30">
                  <AvatarImage src={user?.discord_avatar} />
                  <AvatarFallback className="bg-purple-600 text-white">
                    {user?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-slate-900/95 border-slate-700 backdrop-blur-xl"
              align="end"
              forceMount
            >
              <DropdownMenuItem
                onClick={() => router.push('/dashboard/settings')}
                className="text-slate-300 hover:bg-purple-500/20 hover:text-white"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-slate-300 hover:bg-red-500/20 hover:text-white"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
