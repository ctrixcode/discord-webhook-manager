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
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (editingAvatar) {
      setName(editingAvatar.name);
      setUsername(editingAvatar.username);
      setAvatarUrl(editingAvatar.avatarUrl || '');
    } else {
      setName('');
      setUsername('');
      setAvatarUrl('');
    }
  }, [editingAvatar]);

  const { mutate: saveAvatar, isPending } = useMutation({
    mutationFn: (avatarData: Omit<PredefinedAvatar, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
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
    if (!name.trim() || !username.trim()) return;

    saveAvatar({
      name: name.trim(),
      username: username.trim(),
      avatarUrl: avatarUrl.trim(),
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
                src={avatarUrl || '/placeholder.svg'}
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
              <Label htmlFor="name" className="text-slate-300">
                Display Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Bot Assistant, Announcements"
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
              />
            </div>

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
              <Label htmlFor="avatarUrl" className="text-slate-300">
                Avatar URL (Optional)
              </Label>
              <Input
                id="avatarUrl"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
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
              disabled={isPending || !name.trim() || !username.trim()}
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
