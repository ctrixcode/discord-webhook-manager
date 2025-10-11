'use client';

import React, { useState, useRef } from 'react';
import { useTranslations } from 'next-intl'; // Import useTranslations
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { api } from '@/lib/api';
import { UpdateWebhookData, Webhook } from '@repo/shared-types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MoreHorizontal,
  Send,
  Trash2,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { testWebhook } from '@/lib/api/queries/webhook';

interface WebhookCardProps {
  webhook: Webhook;
  onWebhookUpdated: () => void;
  onCardClick?: (webhook: Webhook) => void;
}

export function WebhookCard({
  webhook,
  onWebhookUpdated,
  onCardClick,
}: WebhookCardProps) {
  const t = useTranslations('webhookCard'); // Initialize translations
  const tCommon = useTranslations('common'); // Initialize common translations

  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const queryClient = useQueryClient();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { mutate: updateWebhook } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWebhookData }) =>
      api.webhook.updateWebhook(id, data),
    onSuccess: () => {
      onWebhookUpdated();
      toast({
        // Internationalize Toast
        title: t('toasts.updateSuccessTitle'),
        description: t('toasts.updateSuccessDesc'),
      });
    },
    onError: error => {
      toast({
        // Internationalize Toast
        title: t('toasts.updateErrorTitle'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const { mutate: deleteWebhook } = useMutation({
    mutationFn: (id: string) => api.webhook.deleteWebhook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      onWebhookUpdated();
      toast({
        // Internationalize Toast
        title: t('toasts.deleteSuccessTitle'),
        description: t('toasts.deleteSuccessDesc'),
      });
    },
  });

  const handleTestWebhook = async () => {
    setIsTestingWebhook(true);
    try {
      const resp = await testWebhook(webhook.id);

      if (resp.success) {
        toast({
          // Internationalize Toast
          title: t('toasts.testSuccessTitle'),
          description: t('toasts.testSuccessDesc'),
        });
      } else {
        toast({
          // Internationalize Toast
          title: t('toasts.testFailTitle'),
          description: resp.message,
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        // Internationalize Toast
        title: t('toasts.testFailTitle'),
        description: t('toasts.testFailGenericDesc'),
        variant: 'destructive',
      });
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const handleDelete = async () => {
    deleteWebhook(webhook.id);
  };

  const toggleActive = async () => {
    updateWebhook({ id: webhook.id, data: { is_active: !webhook.is_active } });
  };

  return (
    <>
      <Card
        className="bg-slate-900/20 backdrop-blur-sm border-slate-700/50 text-white cursor-pointer"
        onClick={e => {
          // Check if the click originated from within the dropdown menu
          if (
            dropdownRef.current &&
            dropdownRef.current.contains(e.target as Node)
          ) {
            return; // Do nothing if click is inside dropdown
          }
          onCardClick?.(webhook); // Otherwise, proceed with card click
        }}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium text-white">
            {webhook.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant={webhook.is_active ? 'default' : 'secondary'}
              className={
                webhook.is_active
                  ? 'bg-green-500/20 text-green-400 border-green-500/30'
                  : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
              }
            >
              {webhook.is_active ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {/* Internationalize Active Status */}
                  {t('status.active')}
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3 mr-1" />
                  {/* Internationalize Inactive Status */}
                  {t('status.inactive')}
                </>
              )}
            </Badge>
            <div ref={dropdownRef}>
              {' '}
              {/* Add this ref */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700/50"
                    onClick={e => e.stopPropagation()} // Add stopPropagation here
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-slate-800/95 backdrop-blur-sm border-slate-700/50 text-white"
                >
                  <DropdownMenuItem
                    onClick={e => {
                      e.stopPropagation();
                      handleTestWebhook();
                    }}
                    disabled={isTestingWebhook}
                    className="hover:bg-slate-700/50 focus:bg-slate-700/50"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {/* Internationalize Test Button Text */}
                    {isTestingWebhook
                      ? t('actions.testing')
                      : t('actions.testWebhook')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={e => {
                      e.stopPropagation();
                      toggleActive();
                    }}
                    className="hover:bg-slate-700/50 focus:bg-slate-700/50"
                  >
                    {webhook.is_active ? (
                      <XCircle className="mr-2 h-4 w-4" />
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    {/* Internationalize Activate/Deactivate */}
                    {webhook.is_active
                      ? t('actions.deactivate')
                      : t('actions.activate')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={e => {
                      e.stopPropagation();
                      setShowDeleteDialog(true);
                    }}
                    className="text-red-400 hover:bg-red-500/20 focus:bg-red-500/20"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {/* Internationalize Delete */}
                    {t('actions.delete')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-sm text-slate-300">
              <span className="font-medium">
                {/* Internationalize Description Label */}
                {t('details.description')}
              </span>
              <div className="mt-1 p-2 bg-slate-800/50 rounded border border-slate-700/50 font-mono text-xs break-all">
                {webhook.description}
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-400">
              {/* Internationalize Messages Sent Label (with placeholder) */}
              <span>
                {t('details.messagesSent')} {t('details.todoPlaceholder')}
              </span>
              <span>
                {/* Internationalize Created Label */}
                {t('details.created')}{' '}
                {new Date(webhook.createdAt).toLocaleDateString()}
              </span>
            </div>
            {webhook.last_used && (
              <div className="text-sm text-slate-400">
                {/* Internationalize Last Used Label */}
                {t('details.lastUsed')}{' '}
                {new Date(webhook.last_used).toLocaleString()}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        // Internationalize Dialog Title
        title={t('dialog.title')}
        // Internationalize Dialog Description, passing webhook name as a variable
        description={t('dialog.description', { webhookName: webhook.name })}
        onConfirm={handleDelete}
        // Internationalize Confirm Button Text
        confirmButtonText={tCommon('delete')}
      />
    </>
  );
}
