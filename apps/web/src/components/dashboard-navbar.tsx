'use client';

import { useAuth } from '@/contexts/auth-context';
import { Navigation } from '@/components/navigation';
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Settings, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function DashboardNavbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getAvatar = () => {
    if (user?.discord_avatar) {
      return user.discord_avatar;
    } else if (user?.google_avatar) {
      return user.google_avatar;
    }
    return undefined;
  };

  const userMenu = (
    <>
      <DropdownMenuItem
        onClick={() => router.push('/dashboard/settings')}
        className="cursor-pointer"
      >
        <Settings className="mr-2 h-4 w-4" />
        <span>Settings</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={handleLogout}
        className="text-red-500 hover:text-red-600 cursor-pointer"
      >
        <LogOut className="mr-2 h-4 w-4" />
        <span>Log out</span>
      </DropdownMenuItem>
    </>
  );

  return (
    <Navigation userProfile={getAvatar()} userDropdownContent={userMenu} />
  );
}
