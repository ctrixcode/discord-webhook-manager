'use client';

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Avatar as AvatarComponent,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Search, Users, Plus } from 'lucide-react';
import { getAllAvatars } from '@/lib/api/queries/avatar';
import type { Avatar } from '@repo/shared-types';
import { useAuth } from '@/contexts/auth-context';
import { CreateAvatarDialog } from '@/components/avatars/create-avatar-dialog';

interface AvatarSelectorProps {
  onSelect: (avatar: Avatar) => void;
  children: React.ReactNode;
}

export function AvatarSelector({ onSelect, children }: AvatarSelectorProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data: avatars = [] } = useQuery<Avatar[]>({
    queryKey: ['avatars'],
    queryFn: getAllAvatars,
    enabled: !!user && open,
  });

  const filteredAvatars = avatars.filter((avatar: Avatar) => {
    const nameMatches =
      avatar.username &&
      avatar.username.toLowerCase().includes(searchQuery.toLowerCase());
    const usernameMatches =
      avatar.username &&
      avatar.username.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatches || usernameMatches;
  });

  const handleSelect = (avatar: Avatar) => {
    onSelect(avatar);
    setOpen(false);
    setSearchQuery('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-card border-border text-card-foreground max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Select Predefined Avatar
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and Add Button */}
          <div className="flex items-center gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search avatars..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50 border-input text-foreground placeholder:text-muted-foreground focus:border-ring"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCreateDialog(true)}
              className="text-foreground border-input hover:bg-muted"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Avatar List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredAvatars.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery
                    ? 'No avatars found'
                    : 'No predefined avatars yet'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {filteredAvatars.map(avatar => (
                  <Button
                    key={avatar.id}
                    variant="ghost"
                    onClick={() => handleSelect(avatar)}
                    className="flex items-center gap-3 p-3 h-auto justify-start hover:bg-muted/50"
                  >
                    <AvatarComponent className="w-10 h-10 ring-2 ring-border/50">
                      <AvatarImage
                        src={avatar.avatar_url || '/placeholder.svg'}
                        alt={avatar.username}
                      />
                      <AvatarFallback className="bg-muted text-muted-foreground">
                        {avatar.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </AvatarComponent>
                    <div className="text-left">
                      <div className="font-medium text-foreground">
                        {avatar.username}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        @{avatar.username}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
      <CreateAvatarDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSaveSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['avatars'] });
          setShowCreateDialog(false);
        }}
      />
    </Dialog>
  );
}
