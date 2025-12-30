'use client';

import React, { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Avatar as AvatarComponent,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
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
import { MoreHorizontal, Edit, Trash2, Copy } from 'lucide-react';
import { deleteAvatar } from '@/lib/api/queries/avatar';
import type { Avatar } from '@repo/shared-types';
import { toast } from '@/hooks/use-toast';

interface AvatarCardProps {
  avatar: Avatar;
  onEdit: (avatar: Avatar) => void;
  onDeleteSuccess: () => void;
  onSelect?: (avatar: Avatar) => void;
  selectable?: boolean;
  onCardClick?: (avatar: Avatar) => void;
}

export function AvatarCard({
  avatar,
  onEdit,
  onDeleteSuccess,
  onSelect,
  selectable = false,
  onCardClick,
}: AvatarCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { mutate: deleteAvatarMutation } = useMutation({
    mutationFn: deleteAvatar,
    onSuccess: () => {
      setShowDeleteDialog(false);
      onDeleteSuccess();
      toast({
        title: 'Avatar deleted',
        description: 'Avatar deleted successfully',
      });
    },
    onError: error => {
      toast({
        title: 'Error deleting avatar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleDelete = () => {
    deleteAvatarMutation(avatar.id);
  };

  const handleCopyUrl = () => {
    if (avatar.avatar_url) {
      navigator.clipboard.writeText(avatar.avatar_url);
      toast({
        title: 'Avatar URL copied',
        description: 'Avatar URL copied to clipboard',
      });
    }
  };

  return (
    <>
      <Card
        className="bg-card/50 backdrop-blur-xl border-border hover:bg-card/80 transition-all duration-200 cursor-pointer"
        onClick={e => {
          // Check if the click originated from within the dropdown menu
          if (
            dropdownRef.current &&
            dropdownRef.current.contains(e.target as Node)
          ) {
            return; // Do nothing if click is inside dropdown
          }
          onCardClick?.(avatar); // Otherwise, proceed with card click
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <AvatarComponent className="w-12 h-12 ring-2 ring-primary/20">
                <AvatarImage
                  src={avatar.avatar_url || '/placeholder.svg'}
                  alt={avatar.username}
                />
                <AvatarFallback className="bg-primary/20 text-primary">
                  {avatar.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </AvatarComponent>
              <div>
                <h3 className="font-semibold text-foreground">
                  {avatar.username}
                </h3>
                <p className="text-sm text-muted-foreground">
                  @{avatar.username}
                </p>
              </div>
            </div>

            <div ref={dropdownRef}>
              {' '}
              {/* Add ref here */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={e => e.stopPropagation()} // Add stopPropagation here
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-popover border-border">
                  <DropdownMenuItem
                    onClick={e => {
                      e.stopPropagation();
                      onEdit(avatar);
                    }}
                    className="text-foreground hover:bg-accent"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={e => {
                      e.stopPropagation();
                      handleCopyUrl();
                    }}
                    className="text-foreground hover:bg-accent"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Avatar URL
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={e => {
                      e.stopPropagation();
                      setShowDeleteDialog(true);
                    }}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="text-xs text-muted-foreground mb-3">
            Created: {new Date(avatar.createdAt).toLocaleDateString()}
          </div>

          {selectable && (
            <Button
              onClick={() => onSelect?.(avatar)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              Select Avatar
            </Button>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-popover border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Delete Avatar
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete &quot;{avatar.username}&quot;?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-muted text-foreground hover:bg-accent">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
