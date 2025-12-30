'use client';

import React, { useState, useRef } from 'react';
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
        title: 'Webhook updated',
        description: 'Webhook updated successfully',
      });
    },
    onError: error => {
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
        className="bg-card/50 backdrop-blur-xl border-border/50 text-card-foreground cursor-pointer hover:shadow-md transition-all"
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
          <CardTitle className="text-base font-medium text-foreground">
            {webhook.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant={webhook.is_active ? 'default' : 'secondary'}
              className={
                webhook.is_active
                  ? 'bg-success/20 text-success border-success/30'
                  : 'bg-muted text-muted-foreground border-border'
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
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    onClick={e => e.stopPropagation()} // Add stopPropagation here
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-card border-border text-card-foreground"
                >
                  <DropdownMenuItem
                    onClick={e => {
                      e.stopPropagation();
                      handleTestWebhook();
                    }}
                    disabled={isTestingWebhook}
                    className="hover:bg-muted/50 focus:bg-muted/50 cursor-pointer"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {isTestingWebhook ? 'Testing...' : 'Test Webhook'}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={e => {
                      e.stopPropagation();
                      toggleActive();
                    }}
                    className="hover:bg-muted/50 focus:bg-muted/50 cursor-pointer"
                  >
                    {webhook.is_active ? (
                      <XCircle className="mr-2 h-4 w-4" />
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    {webhook.is_active ? 'Deactivate' : 'Activate'}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={e => {
                      e.stopPropagation();
                      setShowDeleteDialog(true);
                    }}
                    className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10 cursor-pointer"
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
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Description:</span>
              <div className="mt-1 p-2 bg-muted/50 rounded border border-border font-mono text-xs break-all text-muted-foreground">
                {webhook.description}
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Messages sent: TODO</span>
              <span>
                Created: {new Date(webhook.createdAt).toLocaleDateString()}
              </span>
            </div>
            {webhook.last_used && (
              <div className="text-sm text-muted-foreground">
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
