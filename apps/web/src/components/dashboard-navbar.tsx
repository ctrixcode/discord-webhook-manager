'use client';

import { useAuth } from '@/contexts/auth-context';
import { Navigation } from '@/components/navigation';

export function DashboardNavbar() {
  const { user } = useAuth();

  const getAvatar = () => {
    if (user?.discord_avatar) {
      return user.discord_avatar;
    } else if (user?.google_avatar) {
      return user.google_avatar;
    }
    return undefined;
  };

  return <Navigation userProfile={getAvatar()} />;
}
