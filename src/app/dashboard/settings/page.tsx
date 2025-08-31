'use client';

import { Separator } from '@/components/ui/separator';
import { Palette, Bell, Shield, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { SettingsCard } from '@/components/settings/settings-card';
import { ThemeSelector } from '@/components/settings/theme-selector';
import { NotificationToggle } from '@/components/settings/notification-toggle';
import { DangerAction } from '@/components/settings/danger-action';

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [showClearDataDialog, setShowClearDataDialog] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleClearData = () => {
    setShowClearDataDialog(true);
  };

  const handleConfirmClearData = () => {
    localStorage.clear();
    window.location.reload();
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
        title="Appearance"
        description="Customize how the application looks and feels"
        icon={<Palette className="h-5 w-5" />}
      >
        <ThemeSelector />
      </SettingsCard>

      <SettingsCard
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
      </SettingsCard>

      <SettingsCard
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
      </SettingsCard>

      <SettingsCard
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
      </SettingsCard>

      <ConfirmationDialog
        open={showClearDataDialog}
        onOpenChange={setShowClearDataDialog}
        title="Clear All Data?"
        description="Are you sure you want to clear all data? This action cannot be undone."
        onConfirm={handleConfirmClearData}
        confirmButtonText="Clear Data"
      />
    </div>)

  }