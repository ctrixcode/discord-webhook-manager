'use client';

import { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Users } from 'lucide-react';
import { getAllAvatars } from '@/lib/api/queries/avatar';
import { type PredefinedAvatar } from '@/lib/api/types';
import { useAuth } from '@/contexts/auth-context';
import { AvatarCard } from '@/components/avatars/avatar-card';
import { CreateAvatarDialog } from '@/components/avatars/create-avatar-dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function AvatarsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingAvatar, setEditingAvatar] = useState<PredefinedAvatar | null>(null);

  const { data: avatars = [], isLoading } = useQuery<PredefinedAvatar[]>({
    queryKey: ['avatars'],
    queryFn: getAllAvatars,
    enabled: !!user,
  });

  const filteredAvatars = useMemo(() => {
    return avatars.filter(
      (avatar) =>
        avatar.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [avatars, searchQuery]);

  const handleEdit = (avatar: PredefinedAvatar) => {
    setEditingAvatar(avatar);
    setShowCreateDialog(true);
  };

  const handleMutationSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['avatars'] });
    setEditingAvatar(null);
    setShowCreateDialog(false);
  };

  const handleOpenCreateDialog = () => {
    setEditingAvatar(null);
    setShowCreateDialog(true);
  };

  const handleCloseDialog = () => {
    setShowCreateDialog(false);
    setEditingAvatar(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Predefined Avatars
            </h1>
            <p className="text-slate-400">
              Create and manage reusable avatar profiles for your webhooks
            </p>
          </div>
          <Button
            onClick={handleOpenCreateDialog}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Avatar
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search avatars..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-purple-500"
          />
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div>
                        <Skeleton className="h-5 w-24 mb-1" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                    <Skeleton className="w-8 h-8" />
                  </div>
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredAvatars.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-8 max-w-md mx-auto">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                {searchQuery ? 'No avatars found' : 'No avatars yet'}
              </h3>
              <p className="text-slate-400 mb-4">
                {searchQuery
                  ? 'Try adjusting your search terms'
                  : 'Create your first predefined avatar to get started'}
              </p>
              {!searchQuery && (
                <Button
                  onClick={handleOpenCreateDialog}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Avatar
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAvatars.map((avatar) => (
              <AvatarCard
                key={avatar.id}
                avatar={avatar}
                onEdit={handleEdit}
                onDeleteSuccess={handleMutationSuccess}
              />
            ))}
          </div>
        )}

        {/* Create/Edit Dialog */}
        <CreateAvatarDialog
          open={showCreateDialog}
          onOpenChange={handleCloseDialog}
          onSaveSuccess={handleMutationSuccess}
          editingAvatar={editingAvatar}
        />
      </div>
    </div>
  );
}
