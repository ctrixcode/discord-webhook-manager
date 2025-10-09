'use client';

import { BarChart2, Gem } from 'lucide-react';
import React, { useState } from 'react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { SettingsCard } from '@/components/settings/settings-card';
import { useQuery } from '@tanstack/react-query';
import { userQueries } from '@/lib/api/queries/user';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function SettingsPage() {
  const t = useTranslations('dashboard.settingsPage');
  const [showClearDataDialog, setShowClearDataDialog] = useState(false);

  const { data: usage, isLoading: isLoadingUsage } = useQuery({
    queryKey: ['userUsage'],
    queryFn: userQueries.getUserUsage,
  });

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: userQueries.getCurrentUser,
  });

  const handleConfirmClearData = () => {
    localStorage.clear();
    window.location.reload();
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const getAccountTypeBadgeClass = (accountType: string) => {
    switch (accountType) {
      case 'free':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'paid':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'premium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 shadow-lg shadow-yellow-500/20';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getAccountTypeQuote = (accountType: string) => {
    const key = `accountQuotes.${accountType || 'free'}` as const;
    return t(key);
  };

  return (
    <div className="min-h-screen p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">
          {t('title')}
        </h2>
        <p className="text-slate-300">{t('subtitle')}</p>
      </div>

      <SettingsCard
        title={t('accountType.title')}
        description={t('accountType.desc')}
        icon={<Gem className="h-5 w-5" />}
      >
        {isLoadingUser ? (
          <div className="h-8 bg-slate-700/50 rounded-md animate-pulse" />
        ) : user ? (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Badge
                className={
                  `text-lg px-4 py-2 font-semibold ` +
                  getAccountTypeBadgeClass(user.accountType || 'free')
                }
              >
                {(user.accountType || 'free').toUpperCase()}
              </Badge>
            </div>
            <p className="text-slate-400 text-sm mt-2">
              {getAccountTypeQuote(user.accountType || 'free')}
            </p>
          </div>
        ) : (
          <p className="text-slate-400">{t('accountType.error')}</p>
        )}
      </SettingsCard>

      <SettingsCard
        title={t('usage.title')}
        description={t('usage.desc')}
        icon={<BarChart2 className="h-5 w-5" />}
      >
        {isLoadingUsage ? (
          <div className="space-y-4">
            <div className="h-8 bg-slate-700/50 rounded-md animate-pulse" />
            <div className="h-8 bg-slate-700/50 rounded-md animate-pulse" />
          </div>
        ) : usage ? (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-slate-300">
                  {t('usage.webhookMessages')}
                </span>
                <span className="text-sm font-medium text-slate-400">
                  {usage.webhookMessagesSentToday} /{' '}
                  {usage.dailyWebhookMessageLimit === null
                    ? '∞'
                    : usage.dailyWebhookMessageLimit}
                </span>
              </div>
              <Progress
                value={
                  (usage.webhookMessagesSentToday /
                    (usage.dailyWebhookMessageLimit === null
                      ? 10000000000
                      : usage.dailyWebhookMessageLimit)) *
                  100
                }
                className="bg-slate-700/50"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-slate-300">
                  {t('usage.mediaStorage')}
                </span>
                <span className="text-sm font-medium text-slate-400">
                  {formatBytes(usage.totalMediaStorageUsed)} /{' '}
                  {formatBytes(usage.overallMediaStorageLimit)}
                </span>
              </div>
              <Progress
                value={
                  (usage.totalMediaStorageUsed /
                    usage.overallMediaStorageLimit) *
                  100
                }
                className="bg-slate-700/50"
              />
            </div>
          </div>
        ) : (
          <p className="text-slate-400">{t('usage.error')}</p>
        )}
      </SettingsCard>

      <SettingsCard
        title={t('plans.title')}
        description={t('plans.desc')}
        icon={<Gem className="h-5 w-5" />}
      >
        <Link href="/dashboard/plans">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            {t('plans.button')}
          </Button>
        </Link>
      </SettingsCard>

      <SettingsCard
        title={t('support.title')}
        description={t('support.desc')}
        icon={<BarChart2 className="h-5 w-5" />}
      >
        <div className="space-y-4">
          <p className="text-slate-300">{t('support.message')}</p>
          <a
            href="https://twitter.com/intent/tweet?text=I%27m%20loving%20Discord%20Webhook%20Manager!%20%40ctrix%2C%20this%20app%20is%20amazing%20for%20managing%20my%20Discord%20webhooks.%20Highly%20recommend!%20%23Discord%20%23Webhooks%20%23DiscordBot&url=https%3A%2F%2Fwebhook.ctrix.pro"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              {t('support.button')}
            </Button>
          </a>
          <p className="text-slate-300 pt-2">{t('support.dm')}</p>
        </div>
      </SettingsCard>

      <ConfirmationDialog
        open={showClearDataDialog}
        onOpenChange={setShowClearDataDialog}
        title={t('clearData.title')}
        description={t('clearData.desc')}
        onConfirm={handleConfirmClearData}
        confirmButtonText={t('clearData.confirm')}
      />
    </div>
  );
}
