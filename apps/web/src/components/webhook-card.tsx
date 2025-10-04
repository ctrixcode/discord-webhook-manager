'use client';

import { useState, useRef } from 'react';
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
import { type Webhook } from '@/lib/api/types/webhook';
import { api } from '@/lib/api';
import { UpdateWebhookRequest } from '@/lib/api/types/webhook';
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
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const queryClient = useQueryClient();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { mutate: updateWebhook } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWebhookRequest }) =>
      api.webhook.updateWebhook(id, data),
    onSuccess: () => {
      onWebhookUpdated();
      toast({title: 'Webhook updated', description: 'Webhook updated successfully'});
    },
    onError: (error) => {
      toast({
        title: 'Error updating webhook',
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
        title: 'Webhook deleted',
        description: 'The webhook has been removed from your account',
      });
    },
  });

  const handleTestWebhook = async () => {
    setIsTestingWebhook(true);
    try {
      const resp = await testWebhook(webhook.id);

      if (resp.success) {
        toast({
          title: 'Test successful!',
          description: 'Test message sent to Discord',
        });
      } else {
        toast({
          title: 'Test failed',
          description: resp.message,
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Test failed',
        description: 'An error occurred while testing the webhook',
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
        onClick={(e) => {
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
                  Active
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3 mr-1" />
                  Inactive
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
                    onClick={(e) => e.stopPropagation()} // Add stopPropagation here
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-slate-800/95 backdrop-blur-sm border-slate-700/50 text-white"
                >
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTestWebhook();
                    }}
                    disabled={isTestingWebhook}
                    className="hover:bg-slate-700/50 focus:bg-slate-700/50"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {isTestingWebhook ? 'Testing...' : 'Test Webhook'}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
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
                    {webhook.is_active ? 'Deactivate' : 'Activate'}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteDialog(true);
                    }}
                    className="text-red-400 hover:bg-red-500/20 focus:bg-red-500/20"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-sm text-slate-300">
              <span className="font-medium">Description:</span>
              <div className="mt-1 p-2 bg-slate-800/50 rounded border border-slate-700/50 font-mono text-xs break-all">
                {webhook.description}
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Messages sent: TODO</span>
              <span>
                Created: {new Date(webhook.createdAt).toLocaleDateString()}
              </span>
            </div>
            {webhook.last_used && (
              <div className="text-sm text-slate-400">
                Last used: {new Date(webhook.last_used).toLocaleString()}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Are you sure?"
        description={`This action cannot be undone. This will permanently delete the webhook "${webhook.name}" from your account.`}
        onConfirm={handleDelete}
        confirmButtonText="Delete"
      />
    </>
  );
}
