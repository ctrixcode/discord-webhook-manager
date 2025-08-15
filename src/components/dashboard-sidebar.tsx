'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DiscordLogo } from '@/components/discord-logo';
import { Home, Webhook, Clock, FileText, Settings, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Webhooks', href: '/dashboard/webhooks', icon: Webhook },
  { name: 'Scheduled', href: '/dashboard/scheduled', icon: Clock },
  { name: 'Templates', href: '/dashboard/templates', icon: FileText },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r border-border">
      <div className="flex h-16 items-center gap-3 px-6 border-b border-border">
        <DiscordLogo className="w-8 h-8 text-primary" />
        <span className="text-lg font-semibold">Webhook Manager</span>
      </div>

      <div className="flex-1 space-y-1 p-4">
        <div className="mb-4">
          <Button className="w-full" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Webhook
          </Button>
        </div>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start',
                    isActive && 'bg-secondary text-secondary-foreground',
                  )}
                  size="sm"
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
