import React, { useState, useEffect, useRef, ChangeEventHandler } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Avatar as UIAvatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  createAvatar,
  updateAvatar,
  uploadAvatar,
} from '@/lib/api/queries/avatar';
import type { Avatar } from '@repo/shared-types';
import { Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AxiosError } from 'axios';
import Link from 'next/link';

interface CreateAvatarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveSuccess: () => void;
  editingAvatar?: Avatar | null;
}

export function CreateAvatarDialog({
  open,
  onOpenChange,
  onSaveSuccess,
  editingAvatar,
}: CreateAvatarDialogProps) {
  const [username, setUsername] = useState('');
  const [avatar_url, setAvatar_url] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (editingAvatar) {
      setUsername(editingAvatar.username || '');
      setAvatar_url(editingAvatar.avatar_url || '');
      setSelectedFile(null); // Clear selected file when editing existing avatar
    } else {
      setUsername('');
      setAvatar_url('');
      setSelectedFile(null);
    }
  }, [editingAvatar]);

  const handleClear = () => {
    setUsername('');
    setAvatar_url('');
    setSelectedFile(null);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleError = (error: unknown) => {
    if (error instanceof AxiosError && error.response?.status === 403) {
      handleClear();
      handleClose();
      const errorData = error.response.data as {
        success: boolean;
        message: string;
        code: 'webhook_limit' | 'media_limit';
      };
      if (errorData.code === 'media_limit') {
        const toastResponse = toast({
          title: 'Limit Reached',
          description: (
            <div>
              <p>{errorData.message}</p>
              <Link
                href="/dashboard/settings"
                onClick={() => toastResponse.dismiss()}
                className="text-blue-400 hover:underline"
              >
                Check your usage in settings.
              </Link>
            </div>
          ),
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: errorData.message || 'An unexpected error occurred',
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };
  const createAvatarMutation = useMutation({
    mutationFn: async (data: {
      username: string;
      avatar_url?: string;
      file?: File;
    }) => {
      if (data.file) {
        const formData = new FormData();
        formData.append('username', data.username);
        formData.append('image', data.file);
        return await uploadAvatar(formData);
      } else {
        return await createAvatar({
          username: data.username,
          avatar_url: data.avatar_url || '',
        });
      }
    },
    onSuccess: () => {
      debugger;
      onSaveSuccess();
      toast({
        title: 'Avatar created',
        description: 'Avatar created successfully',
      });
      handleClear();
      handleClose();
    },
    onError: handleError,
  });

  const updateAvatarMutation = useMutation({
    mutationFn: async (data: {
      id: string;
      username: string;
      avatar_url?: string;
    }) => {
      return await updateAvatar(data.id, {
        username: data.username,
        avatar_url: data.avatar_url,
      });
    },
    onSuccess: () => {
      onSaveSuccess();
      toast({
        title: 'Avatar updated',
        description: 'Avatar updated successfully',
      });
      handleClear();
      handleClose();
    },
    onError: handleError,
  });

  const handleSave = () => {
    debugger;
    if (!username.trim()) return;

    if (editingAvatar) {
      updateAvatarMutation.mutate({
        id: editingAvatar.id,
        username: username.trim(),
        avatar_url: avatar_url.trim(),
      });
    } else {
      if (selectedFile) {
        createAvatarMutation.mutate({
          username: username.trim(),
          file: selectedFile,
        });
      } else {
        createAvatarMutation.mutate({
          username: username.trim(),
          avatar_url: avatar_url.trim(),
        });
      }
    }
  };

  const isPending =
    createAvatarMutation.isPending || updateAvatarMutation.isPending;

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = event => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setAvatar_url(''); // Clear URL when file is selected
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const previewUrl = selectedFile
    ? URL.createObjectURL(selectedFile)
    : avatar_url || '/placeholder.svg';

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
            <UIAvatar
              className="w-20 h-20 ring-2 ring-purple-500/20 cursor-pointer"
              onClick={handleBrowseClick}
            >
              <AvatarImage src={previewUrl} alt={username} />
              <AvatarFallback className="bg-purple-500/20 text-purple-300 text-lg">
                {username.slice(0, 2).toUpperCase() || '??'}
              </AvatarFallback>
            </UIAvatar>
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
                onChange={e => setUsername(e.target.value)}
                placeholder="e.g., BotHelper, Announcer"
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
              />
            </div>

            <div>
              <Label htmlFor="avatar_url" className="text-slate-300">
                Avatar Icon
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="avatar_url"
                  value={selectedFile ? selectedFile.name : avatar_url}
                  onChange={e => {
                    setAvatar_url(e.target.value);
                    setSelectedFile(null); // Clear file when URL is typed
                  }}
                  placeholder={
                    selectedFile
                      ? selectedFile.name
                      : 'https://example.com/avatar.png'
                  }
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBrowseClick}
                  className="shrink-0 border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                >
                  <ImageIcon className="h-4 w-4 mr-2" /> Browse
                </Button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
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
              disabled={
                isPending ||
                !username.trim() ||
                (!avatar_url.trim() && !selectedFile)
              }
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isPending
                ? editingAvatar
                  ? 'Updating...'
                  : 'Creating...'
                : editingAvatar
                  ? 'Update Avatar'
                  : 'Create Avatar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
