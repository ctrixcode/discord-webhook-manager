'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

import { getAllWebhooks } from '@/lib/api/queries/webhook';
import { scheduledMessageQueries } from '@/lib/api/queries/scheduled-message';
import type { Webhook } from '@/lib/api/types/webhook';
import type { ApiError } from '@/lib/api/types/api';
import type { ScheduledMessage } from '@/lib/api/types/scheduled-message';
import { Clock, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ScheduleMessageDialogProps {
  triggerButton?: React.ReactNode;
}

export function ScheduleMessageDialog({ triggerButton }: ScheduleMessageDialogProps) {
  
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedWebhookId, setSelectedWebhookId] = useState('');
  const [content, setContent] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [formError, setFormError] = useState('');

  const { data: webhooks = [] } = useQuery<Webhook[]>({
    queryKey: ['webhooks'],
    queryFn: ({ queryKey }) => getAllWebhooks({ queryKey: queryKey as [string, { isActive?: boolean }] }),
    enabled: open,
  });

  // const { mutate: scheduleMessage, isPending, error } = useMutation<ScheduledMessage, ApiError, Omit<ScheduledMessage, 'id' | 'createdAt' | 'userId' | 'status'>>({
  //   mutationFn: scheduledMessageQueries.createScheduledMessage,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['scheduled-messages'] });
  //     setOpen(false);
  //   },
  // });

  useEffect(() => {
    if (!open) {
      // Reset form when dialog closes
      setSelectedWebhookId('');
      setContent('');
      setScheduledDate('');
      setScheduledTime('');
      setFormError('');
    } else {
      // Set default date/time to 1 hour from now when dialog opens
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      setScheduledDate(oneHourLater.toISOString().split('T')[0]);
      setScheduledTime(oneHourLater.toTimeString().slice(0, 5));
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!selectedWebhookId) return setFormError('Please select a webhook.');
    if (!content.trim()) return setFormError('Message content is required.');
    if (!scheduledDate || !scheduledTime) return setFormError('Please select a date and time.');

    const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
    if (scheduledDateTime <= new Date()) return setFormError('Scheduled time must be in the future.');

    const selectedWebhook = webhooks.find((w) => w.id === selectedWebhookId);
    if (!selectedWebhook) return setFormError('Selected webhook not found.');

    // scheduleMessage({
    //   webhookId: selectedWebhook.id,
    //   webhookName: selectedWebhook.name,
    //   webhookUrl: selectedWebhook.url,
    //   content: content.trim(),
    //   scheduledFor: scheduledDateTime.toISOString(),
    // });
  };

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

            {/* {(formError || error) && (
              <Alert
                variant="destructive"
                className="bg-red-900/50 border-red-700 text-red-200"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formError || error?.message}</AlertDescription>
              </Alert>
            )} */}
          </div>
          {/* <DialogFooter>
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
              disabled={isPending || webhooks.length === 0}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isPending ? 'Scheduling...' : 'Schedule Message'}
            </Button>
          </DialogFooter> */}
        </form>
      </DialogContent>
    </Dialog>
  );
}
