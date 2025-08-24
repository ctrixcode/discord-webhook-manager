'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import type { PredefinedAvatar } from '@/lib/api/types/avatar';

interface AvatarCardProps {
  avatar: PredefinedAvatar;
  onEdit: (avatar: PredefinedAvatar) => void;
  onDeleteSuccess: () => void;
  onSelect?: (avatar: PredefinedAvatar) => void;
  selectable?: boolean;
}

export function AvatarCard({
  avatar,
  onEdit,
  onDeleteSuccess,
  onSelect,
  selectable = false,
}: AvatarCardProps) {
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { mutate: deleteAvatarMutation } = useMutation({
    mutationFn: deleteAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['avatars'] });
      setShowDeleteDialog(false);
      onDeleteSuccess();
    },
  });

  const handleDelete = () => {
    deleteAvatarMutation(avatar.id);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(avatar.avatar_url);
  };

  return (
    <>
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:bg-slate-800/50 transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 ring-2 ring-purple-500/20">
                <AvatarImage
                  src={avatar.avatar_url || '/placeholder.svg'}
                  alt={avatar.username}
                />
                <AvatarFallback className="bg-purple-500/20 text-purple-300">
                  {avatar.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-white">{avatar.username}</h3>
                <p className="text-sm text-slate-400">@{avatar.username}</p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border-slate-700">
                <DropdownMenuItem
                  onClick={() => onEdit(avatar)}
                  className="text-slate-300 hover:text-white hover:bg-slate-700"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleCopyUrl}
                  className="text-slate-300 hover:text-white hover:bg-slate-700"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Avatar URL
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="text-xs text-slate-500 mb-3">
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
        <AlertDialogContent className="bg-slate-800 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete Avatar
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to delete &quot;{avatar.username}&quot;? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-700 text-slate-300 hover:bg-slate-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
