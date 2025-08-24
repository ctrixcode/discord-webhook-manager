'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { formatScheduledTime } from '@/lib/discord-utils';
import { scheduledMessageQueries } from '@/lib/api/queries/scheduled-message';
import type { ScheduledMessage } from '@/lib/api/types/scheduled-message';
import {
  MoreHorizontal,
  Clock,
  X,
  Trash2,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScheduledMessageCardProps {
  message: ScheduledMessage;
}

export function ScheduledMessageCard({ message }: ScheduledMessageCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const { mutate: cancelMessage } = useMutation({
    mutationFn: scheduledMessageQueries.cancelScheduledMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-messages'] });
      toast({
        title: 'Message Cancelled',
        description: 'The scheduled message will not be sent.',
      });
      setShowCancelDialog(false);
    },
  });

  const { mutate: deleteMessage } = useMutation({
    mutationFn: scheduledMessageQueries.deleteScheduledMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-messages'] });
      toast({
        title: 'Message Deleted',
        description: 'The scheduled message has been permanently removed.',
      });
      setShowDeleteDialog(false);
    },
  });

  const getStatusIcon = () => {
    switch (message.status) {
      case 'pending':
        return <Clock className="w-3 h-3 mr-1" />;
      case 'sent':
        return <CheckCircle className="w-3 h-3 mr-1" />;
      case 'failed':
        return <XCircle className="w-3 h-3 mr-1" />;
      case 'cancelled':
        return <X className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  const getStatusVariant = () => {
    switch (message.status) {
      case 'pending':
        return 'default';
      case 'sent':
        return 'default';
      case 'failed':
        return 'destructive';
      case 'cancelled':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const canCancel = message.status === 'pending' && new Date(message.scheduledFor) > new Date();

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">
            {message.webhookName}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusVariant()}>
              {getStatusIcon()}
              {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canCancel && (
                  <DropdownMenuItem
                    onClick={() => setShowCancelDialog(true)}
                    className="text-destructive"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-sm">
              <div className="font-medium mb-1">Message:</div>
              <div className="text-muted-foreground bg-muted p-2 rounded text-xs">
                {message.content.length > 100
                  ? `${message.content.substring(0, 100)}...`
                  : message.content}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div>
                <span className="font-medium">Scheduled: </span>
                <span className="text-muted-foreground">
                  {new Date(message.scheduledFor).toLocaleString()}
                </span>
              </div>
              {message.status === 'pending' && (
                <span className="text-primary font-medium">
                  {formatScheduledTime(message.scheduledFor)}
                </span>
              )}
            </div>

            {message.status === 'sent' && message.sentAt && (
              <div className="text-sm">
                <span className="font-medium">Sent: </span>
                <span className="text-muted-foreground">
                  {new Date(message.sentAt).toLocaleString()}
                </span>
              </div>
            )}

            {message.status === 'failed' && message.errorMessage && (
              <div className="text-sm">
                <div className="flex items-center gap-1 text-destructive mb-1">
                  <AlertCircle className="w-3 h-3" />
                  <span className="font-medium">Error:</span>
                </div>
                <div className="text-destructive text-xs bg-destructive/10 p-2 rounded">
                  {message.errorMessage}
                </div>
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              Created: {new Date(message.createdAt).toLocaleString()}
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel scheduled message?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel the scheduled message. It will not be sent to
              Discord.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep scheduled</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => cancelMessage(message.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancel message
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete scheduled message?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              scheduled message from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMessage(message.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
