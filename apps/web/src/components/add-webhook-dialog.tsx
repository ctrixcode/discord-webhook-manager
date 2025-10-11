'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl'; // Import useTranslations
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
  const t = useTranslations('addWebhookDialog'); // Initialize translations
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
          {/* Translate trigger button text */}
          {t('triggerButton')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-slate-900/95 backdrop-blur-xl border-slate-700/50 text-white">
        <DialogHeader>
          {/* Translate Dialog Title */}
          <DialogTitle className="text-white">{t('title')}</DialogTitle>
          {/* Translate Dialog Description */}
          <DialogDescription className="text-slate-300">
            {t('description')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              {/* Translate Name Label */}
              <Label htmlFor="name" className="text-slate-200">
                {t('form.nameLabel')}
              </Label>
              <Input
                id="name"
                // Translate Name Placeholder
                placeholder={t('form.namePlaceholder')}
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-purple-500/20"
              />
            </div>
            <div className="space-y-2">
              {/* Translate URL Label */}
              <Label htmlFor="url" className="text-slate-200">
                {t('form.urlLabel')}
              </Label>
              <Input
                id="url"
                // Translate URL Placeholder
                placeholder={t('form.urlPlaceholder')}
                value={url}
                onChange={e => setUrl(e.target.value)}
                required
                className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-purple-500/20"
              />
            </div>
            <div className="space-y-2">
              {/* Translate Description Label */}
              <Label htmlFor="description" className="text-slate-200">
                {t('form.descriptionLabel')}
              </Label>
              <Textarea
                id="description"
                // Translate Description Placeholder
                placeholder={t('form.descriptionPlaceholder')}
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-purple-500/20 resize-none"
              />
            </div>
            {apiError && (
              <Alert
                variant="destructive"
                className="bg-red-900/20 border-red-500/50 text-red-200"
              >
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-200">
                  {/* API error messages usually come from the server and are not translated here, but the surrounding structure is */}
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
              className="bg-slate-800/50 border-slate-600/50 text-slate-200 hover:bg-slate-700/50 hover:text-white"
            >
              {/* Translate Cancel Button */}
              {t('actions.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
            >
              {/* Translate Dynamic Submit Button Text */}
              {isLoading ? t('actions.adding') : t('actions.add')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
