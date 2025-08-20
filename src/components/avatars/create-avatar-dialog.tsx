'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createAvatar, updateAvatar } from '@/lib/api/queries/avatar';
import type { PredefinedAvatar } from '@/lib/api/types';
import { toast } from 'sonner';

interface CreateAvatarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveSuccess: () => void;
  editingAvatar?: PredefinedAvatar | null;
}

export function CreateAvatarDialog({
  open,
  onOpenChange,
  onSaveSuccess,
  editingAvatar,
}: CreateAvatarDialogProps) {
  const queryClient = useQueryClient();
  const [username, setUsername] = useState('');
  const [avatar_url, setAvatar_url] = useState('');

  useEffect(() => {
    if (editingAvatar) {
      setUsername(editingAvatar.username);
      setAvatar_url(editingAvatar.avatar_url || '');
    } else {
      setUsername('');
      setAvatar_url('');
    }
  }, [editingAvatar]);

  const { mutate: saveAvatar, isPending } = useMutation({
    mutationFn: (avatarData: Omit<PredefinedAvatar, 'id' | 'createdAt' | 'updatedAt' | 'user_id'>) => {
      if (editingAvatar) {
        return updateAvatar(editingAvatar.id, avatarData);
      }
      return createAvatar(avatarData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['avatars'] });
      onSaveSuccess();
    },
  });

  const handleSave = () => {
    if (!username.trim()) return;

    saveAvatar({
      username: username.trim(),
      avatar_url: avatar_url.trim(),
    });
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {editingAvatar ? 'Edit Avatar' : 'Create New Avatar'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Preview */}
          <div className="flex items-center justify-center">
            <Avatar className="w-20 h-20 ring-2 ring-purple-500/20">
              <AvatarImage
                src={avatar_url || '/placeholder.svg'}
                alt={username}
              />
              <AvatarFallback className="bg-purple-500/20 text-purple-300 text-lg">
                {username.slice(0, 2).toUpperCase() || '??'}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-slate-300">
                Username
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g., BotHelper, Announcer"
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
              />
            </div>

            <div>
              <Label htmlFor="avatar_url" className="text-slate-300">
                Avatar Icon
              </Label>
              <Input
                id="avatar_url"
                value={avatar_url}
                onChange={(e) => setAvatar_url(e.target.value)}
                placeholder="https://example.com/avatar.png"
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
              />
            </div>

          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isPending || !username.trim()}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isPending ? (editingAvatar ? 'Updating...' : 'Creating...') : (editingAvatar ? 'Update Avatar' : 'Create Avatar')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
