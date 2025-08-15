'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/auth-context';
import { getWebhooks, type Webhook } from '@/lib/webhook-storage';
import { addScheduledMessage } from '@/lib/scheduled-storage';
import { Clock, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ScheduleMessageDialogProps {
  onMessageScheduled: () => void;
  triggerButton?: React.ReactNode;
}

export function ScheduleMessageDialog({
  onMessageScheduled,
  triggerButton,
}: ScheduleMessageDialogProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [selectedWebhookId, setSelectedWebhookId] = useState('');
  const [content, setContent] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && open) {
      const userWebhooks = getWebhooks(user.id).filter((w) => w.isActive);
      setWebhooks(userWebhooks);
    }
  }, [user, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError('');
    setIsLoading(true);

    // Validation
    if (!selectedWebhookId) {
      setError('Please select a webhook');
      setIsLoading(false);
      return;
    }

    if (!content.trim()) {
      setError('Message content is required');
      setIsLoading(false);
      return;
    }

    if (!scheduledDate || !scheduledTime) {
      setError('Please select a date and time');
      setIsLoading(false);
      return;
    }

    const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
    const now = new Date();

    if (scheduledDateTime <= now) {
      setError('Scheduled time must be in the future');
      setIsLoading(false);
      return;
    }

    try {
      const selectedWebhook = webhooks.find((w) => w.id === selectedWebhookId);
      if (!selectedWebhook) {
        setError('Selected webhook not found');
        setIsLoading(false);
        return;
      }

      addScheduledMessage({
        webhookId: selectedWebhook.id,
        webhookName: selectedWebhook.name,
        webhookUrl: selectedWebhook.url,
        content: content.trim(),
        scheduledFor: scheduledDateTime.toISOString(),
        status: 'pending',
        userId: user.id,
      });

      // Reset form
      setSelectedWebhookId('');
      setContent('');
      setScheduledDate('');
      setScheduledTime('');
      setOpen(false);
      onMessageScheduled();
    } catch (err) {
      setError('Failed to schedule message');
    } finally {
      setIsLoading(false);
    }
  };

  // Set default date/time to 1 hour from now
  useEffect(() => {
    if (open && !scheduledDate && !scheduledTime) {
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

      setScheduledDate(oneHourLater.toISOString().split('T')[0]);
      setScheduledTime(oneHourLater.toTimeString().slice(0, 5));
    }
  }, [open, scheduledDate, scheduledTime]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button>
            <Clock className="w-4 h-4 mr-2" />
            Schedule Message
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-slate-900/95 backdrop-blur-xl border-slate-700/50 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Schedule Message</DialogTitle>
          <DialogDescription className="text-slate-300">
            Schedule a message to be sent to your Discord webhook at a specific
            time.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="webhook" className="text-slate-200">
                Select Webhook
              </Label>
              <Select
                value={selectedWebhookId}
                onValueChange={setSelectedWebhookId}
              >
                <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white focus:border-purple-500">
                  <SelectValue placeholder="Choose a webhook" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {webhooks.map((webhook) => (
                    <SelectItem
                      key={webhook.id}
                      value={webhook.id}
                      className="text-white hover:bg-slate-700"
                    >
                      {webhook.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {webhooks.length === 0 && (
                <p className="text-sm text-slate-400">
                  No active webhooks found. Add a webhook first.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-slate-200">
                Message Content
              </Label>
              <Textarea
                id="content"
                placeholder="Enter your message here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                required
                className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-slate-200">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  required
                  className="bg-slate-800/50 border-slate-600 text-white focus:border-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className="text-slate-200">
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  required
                  className="bg-slate-800/50 border-slate-600 text-white focus:border-purple-500"
                />
              </div>
            </div>

            {error && (
              <Alert
                variant="destructive"
                className="bg-red-900/50 border-red-700 text-red-200"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || webhooks.length === 0}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isLoading ? 'Scheduling...' : 'Schedule Message'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
