'use client';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { LogOut, Settings } from 'lucide-react';
import { DiscordLogo } from '@/components/discord-logo';

export function DashboardHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="border-b border-slate-800/50 bg-gradient-to-r from-slate-900 via-purple-900/20 to-slate-900 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-900/80 sticky top-0 z-30">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/dashboard/webhooks')}>
          <DiscordLogo className="w-8 h-8 text-purple-400" />
          <div>
            <h1 className="text-lg font-semibold text-white">
              Webhook Manager
            </h1>
            <p className="text-xs text-slate-400">Discord Integration</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
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
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-white">
                    {user?.username}
                  </p>
                  
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700" />
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
