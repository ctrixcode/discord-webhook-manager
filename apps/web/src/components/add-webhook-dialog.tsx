'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
import { createWebhook } from '@/lib/api/queries/webhook';
import { validateWebhookUrl } from '@/lib/discord-utils';
import { Plus, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function AddWebhookDialog() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');

  const {
    mutate: createWebhookMutation,
    isPending: isLoading,
    error: apiError,
  } = useMutation({
    mutationFn: createWebhook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      // Reset form
      setName('');
      setUrl('');
      setDescription('');
      setOpen(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedUrl = url.trim();
    const trimmedDescription = description.trim() || undefined;

    // Validation
    if (!trimmedName || !trimmedUrl || !validateWebhookUrl(trimmedUrl)) {
      // Basic validation, can be improved with a form library
      return;
    }

    createWebhookMutation({
      name: trimmedName,
      url: trimmedUrl,
      description: trimmedDescription,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Webhook
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-popover border-border text-popover-foreground">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add New Webhook</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add a Discord webhook to start sending messages. You can find
            webhook URLs in your Discord server settings.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Webhook Name
              </Label>
              <Input
                id="name"
                placeholder="My Discord Webhook"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-ring"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url" className="text-foreground">
                Webhook URL
              </Label>
              <Input
                id="url"
                placeholder="https://discord.com/api/webhooks/..."
                value={url}
                onChange={e => setUrl(e.target.value)}
                required
                className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-ring"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                placeholder="What is this webhook used for?"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-ring resize-none"
              />
            </div>
            {apiError && (
              <Alert
                variant="destructive"
                className="bg-destructive/20 border-destructive/50 text-destructive-foreground"
              >
                <AlertCircle className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-destructive-foreground">
                  {apiError.message}
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="bg-muted border-input text-foreground hover:bg-accent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
            >
              {isLoading ? 'Adding...' : 'Add Webhook'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
