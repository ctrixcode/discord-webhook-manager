'use client';

import type React from 'react';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Users } from 'lucide-react';
import { getAllAvatars } from '@/lib/api/queries/avatar';
import type { PredefinedAvatar } from '@/lib/api/types';
import { useAuth } from '@/contexts/auth-context';

interface AvatarSelectorProps {
  onSelect: (avatar: PredefinedAvatar) => void;
  children: React.ReactNode;
}

export function AvatarSelector({ onSelect, children }: AvatarSelectorProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: avatars = [] } = useQuery<PredefinedAvatar[]>({
    queryKey: ['avatars'],
    queryFn: getAllAvatars,
    enabled: !!user && open,
  });

  const filteredAvatars = avatars.filter(
    (avatar: PredefinedAvatar) =>
      avatar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      avatar.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelect = (avatar: PredefinedAvatar) => {
    onSelect(avatar);
    setOpen(false);
    setSearchQuery('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Select Predefined Avatar
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search avatars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
            />
          </div>

          {/* Avatar List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredAvatars.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400">
                  {searchQuery
                    ? 'No avatars found'
                    : 'No predefined avatars yet'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {filteredAvatars.map((avatar) => (
                  <Button
                    key={avatar.id}
                    variant="ghost"
                    onClick={() => handleSelect(avatar)}
                    className="flex items-center gap-3 p-3 h-auto justify-start hover:bg-slate-700/50"
                  >
                    <Avatar className="w-10 h-10 ring-2 ring-purple-500/20">
                      <AvatarImage
                        src={avatar.avatarUrl || '/placeholder.svg'}
                        alt={avatar.username}
                      />
                      <AvatarFallback className="bg-purple-500/20 text-purple-300">
                        {avatar.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <div className="font-medium text-white">
                        {avatar.name}
                      </div>
                      <div className="text-sm text-slate-400">
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
    </Dialog>
  );
}
