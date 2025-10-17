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
import { useRouter, usePathname } from '@/i18n/navigation';
import { LogOut, Settings, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl'; // Import useTranslations
import { localeMap } from '@/i18n/routing';

export function DashboardHeader() {
  const t = useTranslations('dashboardHeader'); // Initialize translations
  const { user, logout } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getAccountTypeBadge = (accountType: string) => {
    const commonBadgeClasses = 'ml-2';
    let labelKey: 'free' | 'paid' | 'premium';
    let quoteKey: 'free' | 'paid' | 'premium';
    let badgeContent;
    let badgeClasses;

    switch (accountType) {
      case 'free':
        labelKey = 'free';
        quoteKey = 'free';
        badgeClasses =
          'bg-blue-500/80 text-white text-xs px-1 py-0.5 rounded-full';
        badgeContent = t(`accountType.${labelKey}`);
        break;
      case 'paid':
        labelKey = 'paid';
        quoteKey = 'paid';
        badgeClasses =
          'bg-purple-500/80 text-white text-xs px-1 py-0.5 rounded-full';
        badgeContent = t(`accountType.${labelKey}`);
        break;
      case 'premium':
        labelKey = 'premium';
        quoteKey = 'premium';
        badgeClasses = 'h-4 w-4 text-yellow-400 drop-shadow-md';
        badgeContent = (
          <Crown
            className={`${commonBadgeClasses} ${badgeClasses}`}
            fill="currentColor"
          />
        );
        break;
      default:
        return null;
    }

    const tooltipQuote = t(`accountTypeTooltip.${quoteKey}`);

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {accountType === 'premium' ? (
              // Crown is rendered directly for premium
              badgeContent
            ) : (
              // Badge is rendered for free/paid
              <Badge className={`${commonBadgeClasses} ${badgeClasses}`}>
                {badgeContent}
              </Badge>
            )}
          </TooltipTrigger>
          <TooltipContent className="bg-slate-800 border-slate-700 text-white">
            <p>{tooltipQuote}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const getAvatar = () => {
    if (user?.discord_avatar) {
      return user.discord_avatar;
    } else if (user?.google_avatar) {
      return user.google_avatar;
    }
    return undefined;
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
            {/* Translate Title */}
            <h1 className="text-lg font-semibold text-white">{t('title')}</h1>
            {/* Translate Subtitle */}
            <p className="text-xs text-slate-400">{t('subtitle')}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-fit rounded hover:bg-purple-500/20 text-white"
              >
                {/* Translate "Lang" and display current locale */}
                {t('languageSelector')} ({locale})
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-slate-900/95 border-slate-700 backdrop-blur-xl"
              align="end"
              forceMount
            >
              {Object.keys(localeMap).map(loc => (
                <DropdownMenuItem
                  key={loc}
                  onClick={() => {
                    router.replace(pathname, { locale: loc });
                  }}
                  className="text-slate-300 hover:bg-purple-500/20 hover:text-white"
                >
                  {/* Assuming localeMap contains the translated language name (e.g., 'en' -> 'English') */}
                  {localeMap[loc as keyof typeof localeMap]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {user?.username && (
            <span className="text-white text-lg font-semibold mr-2 flex items-center">
              {user.display_name}
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
                  <AvatarImage src={getAvatar()} />
                  <AvatarFallback className="bg-purple-600 text-white">
                    {user?.display_name?.charAt(0).toUpperCase()}
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
                {/* Translate Settings menu item */}
                <span>{t('menu.settings')}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-slate-300 hover:bg-red-500/20 hover:text-white"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {/* Translate Log out menu item */}
                <span>{t('menu.logout')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
