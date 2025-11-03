'use client';
import { BarChart2, Gem, Lock, Link as LinkIcon } from 'lucide-react';
import React from 'react';
import { useState } from 'react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { SettingsCard } from '@/components/settings/settings-card';
import { PasswordChangeDialog } from '@/components/settings/password-change-dialog';
import { useQuery } from '@tanstack/react-query';
import { userQueries } from '@/lib/api/queries/user';
import { authQueries } from '@/lib/api/queries/auth';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';

export default function SettingsPage() {
  const [showClearDataDialog, setShowClearDataDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const { data: usage, isLoading: isLoadingUsage } = useQuery({
    queryKey: ['userUsage'],
    queryFn: userQueries.getUserUsage,
  });

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: userQueries.getCurrentUser,
  });

  const { data: passwordStatus, isLoading: isLoadingPasswordStatus } = useQuery(
    {
      queryKey: ['passwordStatus'],
      queryFn: authQueries.checkPassword,
      enabled: !!user,
    }
  );

  const handleConfirmClearData = () => {
    localStorage.clear();
    window.location.reload();
  };

  const getAvatar = () => {
    if (user?.discord_avatar) {
      return user.discord_avatar;
    }
    return undefined;
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
    switch (accountType) {
      case 'free':
        return 'Explore the basics, unlock your potential.';
      case 'paid':
        return 'Elevate your experience, achieve more.';
      case 'premium':
        return 'Unleash the ultimate power, no limits.';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Settings
        </h2>
        <p className="text-slate-300">
          Manage your account and application preferences
        </p>
      </div>

      <SettingsCard
        title="Account Type"
        description="Your current subscription level"
        icon={<Gem className="h-5 w-5" />}
      >
        {isLoadingUser ? (
          <div className="h-8 bg-slate-700/50 rounded-md animate-pulse" />
        ) : user ? (
          <div className="flex items-center gap-2">
            <Badge
              className={
                `text-lg px-4 py-2 font-semibold ` +
                getAccountTypeBadgeClass(user.accountType || 'free')
              }
            >
              {(user.accountType || 'free').toUpperCase()}
            </Badge>
            <p className="text-slate-400 text-sm mt-2">
              {getAccountTypeQuote(user.accountType || 'free')}
            </p>
          </div>
        ) : (
          <p className="text-slate-400">Could not load account type.</p>
        )}
      </SettingsCard>

      <SettingsCard
        title="Password"
        description={
          !passwordStatus?.hasPassword
            ? 'Create a password to enable email login'
            : 'Change your account password'
        }
        icon={<Lock className="h-5 w-5" />}
      >
        {isLoadingUser || isLoadingPasswordStatus ? (
          <div className="h-10 bg-slate-700/50 rounded-md animate-pulse w-40" />
        ) : (
          <Button
            onClick={() => setShowPasswordDialog(true)}
            className="bg-slate-700 hover:bg-slate-600 text-white"
          >
            {!passwordStatus?.hasPassword
              ? 'Create Password'
              : 'Change Password'}
          </Button>
        )}
      </SettingsCard>

      <SettingsCard
        title="Discord Account"
        description={
          user?.discord_id
            ? 'Your Discord account is linked'
            : 'Link your Discord account for OAuth login'
        }
        icon={<LinkIcon className="h-5 w-5" />}
      >
        {isLoadingUser ? (
          <div className="h-10 bg-slate-700/50 rounded-md animate-pulse w-40" />
        ) : user?.discord_id ? (
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 ring-2 ring-purple-500/30">
              <AvatarImage src={getAvatar()} />
              <AvatarFallback className="bg-purple-600 text-white">
                {user?.display_name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-slate-300 font-medium">Connected</span>
              <span className="text-slate-500 text-sm">
                Discord ID: {user.discord_id}
              </span>
              <span className="text-slate-500 text-sm">
                Discord Username: {user.username}
              </span>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => {
              const accessToken = localStorage.getItem('accessToken');
              window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/discord?state=link&access_token=${accessToken}`;
            }}
            className="bg-[#5865F2] hover:bg-[#4752C4] text-white"
          >
            Link Discord Account
          </Button>
        )}
      </SettingsCard>

      <SettingsCard
        title="Usage"
        description="Track your current usage and limits"
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
                  Daily Webhook Messages
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
                  Media Storage
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
          <p className="text-slate-400">Could not load usage data.</p>
        )}
      </SettingsCard>

      <SettingsCard
        title="Subscription Plans"
        description="View details about different subscription tiers and their benefits"
        icon={<Gem className="h-5 w-5" />}
      >
        <Link href="/dashboard/plans">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            View Plans
          </Button>
        </Link>
      </SettingsCard>

      <SettingsCard
        title="Support Us"
        description="Help us grow by sharing Discord Webhook Manager"
        icon={<BarChart2 className="h-5 w-5" />}
      >
        <div className="space-y-4">
          <p className="text-slate-300">
            If you enjoy using Discord Webhook Manager and want to support its
            development, consider sharing it on X (formerly Twitter)!
          </p>
          <a
            href="https://twitter.com/intent/tweet?text=I%27m%20loving%20Discord%20Webhook%20Manager!%20%40ctrix%2C%20this%20app%20is%20amazing%20for%20managing%20my%20Discord%20webhooks.%20Highly%20recommend!%20%23Discord%20%23Webhooks%20%23DiscordBot&url=https%3A%2F%2Fwebhook.ctrix.pro"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              Share on X (Twitter)
            </Button>
          </a>
          <p className="text-slate-300 pt-2">
            DM me on X, if you want to get paid subscriptions.
          </p>
        </div>
      </SettingsCard>

      {/* <SettingsCard
        title="Appearance"
        description="Customize how the application looks and feels"
        icon={<Palette className="h-5 w-5" />}
      > */}
      {/* <ThemeSelector /> */}
      {/* </SettingsCard> */}

      {/* <SettingsCard
        title="Notifications"
        description="Configure how you receive notifications"
        icon={<Bell className="h-5 w-5" />}
      >
        <div className="space-y-4">
          <NotificationToggle
            title="Webhook Failures"
            description="Get notified when webhook messages fail to send"
            defaultChecked={true}
          />
          <Separator className="bg-slate-700/50" />
          <NotificationToggle
            title="Scheduled Messages"
            description="Receive confirmations when scheduled messages are sent"
            defaultChecked={true}
          />
        </div>
      </SettingsCard> */}

      {/* <SettingsCard
        title="Privacy & Security"
        description="Manage your data and security preferences"
        icon={<Shield className="h-5 w-5" />}
      >
        <div className="space-y-4">
          <NotificationToggle
            title="Save Message History"
            description="Keep a local history of sent messages for reference"
            defaultChecked={true}
          />
          <Separator className="bg-slate-700/50" />
          <NotificationToggle
            title="Auto-save Templates"
            description="Automatically save message drafts as templates"
            defaultChecked={false}
          />
        </div>
      </SettingsCard> */}

      {/* <SettingsCard
        title="Danger Zone"
        description="Irreversible actions that affect your data"
        icon={<Trash2 className="h-5 w-5" />}
        variant="danger"
      >
        <DangerAction
          title="Clear All Data"
          description="Remove all webhooks, templates, and scheduled messages"
          buttonText="Clear Data"
          onAction={handleClearData}
        />
      </SettingsCard> */}

      <ConfirmationDialog
        open={showClearDataDialog}
        onOpenChange={setShowClearDataDialog}
        title="Clear All Data?"
        description="Are you sure you want to clear all data? This action cannot be undone."
        onConfirm={handleConfirmClearData}
        confirmButtonText="Clear Data"
      />

      <PasswordChangeDialog
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
        hasPassword={passwordStatus?.hasPassword || false}
      />
    </div>
  );
}
