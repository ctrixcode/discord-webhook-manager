'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Webhook,
  Send,
  MessageSquare,
  User,
  Moon,
  Sun,
  Settings,
  Bell,
  Search,
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavigationProps {
  userProfile?: string | null;
  userDropdownContent?: React.ReactNode;
}

export function Navigation({
  userProfile,
  userDropdownContent,
}: NavigationProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/webhooks', label: 'Webhooks', icon: Webhook },
    { href: '/dashboard/templates', label: 'Templates', icon: MessageSquare },
    { href: '/dashboard/avatars', label: 'Avatars', icon: User },
    { href: '/dashboard/send', label: 'Send', icon: Send },
  ];

  return (
    <header className="border-b border-border/40 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between relative">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-discord flex items-center justify-center">
                <Webhook className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Discord Webhook Manager
                </h1>
                <p className="text-xs text-muted-foreground">
                  Streamline your announcements
                </p>
              </div>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-1 ml-auto mr-4">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary/10 text-primary shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {mounted &&
                (theme === 'dark' ? (
                  <Sun className="size-5" />
                ) : (
                  <Moon className="size-5" />
                ))}
            </Button>
            {userProfile &&
              (userDropdownContent ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none">
                    <div className="size-10 rounded-xl bg-gradient-to-br from-discord to-discord-dark overflow-hidden border-2 border-discord/20 cursor-pointer hover:opacity-80 transition-opacity">
                      <img
                        src={userProfile}
                        alt="User"
                        className="size-full object-cover"
                      />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-card border-border/50 backdrop-blur-xl"
                  >
                    {userDropdownContent}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="size-10 rounded-xl bg-gradient-to-br from-discord to-discord-dark overflow-hidden border-2 border-discord/20">
                  <img
                    src={userProfile}
                    alt="User"
                    className="size-full object-cover"
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </header>
  );
}
