'use client';

import React from 'react';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl'; // 1. Import useTranslations
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Users } from 'lucide-react';
import { getAllAvatars } from '@/lib/api/queries/avatar';
import { type Avatar } from '@repo/shared-types';
import { useAuth } from '@/contexts/auth-context';
import { AvatarCard } from '@/components/avatars/avatar-card';
import { CreateAvatarDialog } from '@/components/avatars/create-avatar-dialog';

import { Spinner } from '@/components/ui/spinner';

export default function AvatarsPage() {
  const t = useTranslations('dashboard.avatarsPage'); // 2. Initialize translations
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingAvatar, setEditingAvatar] = useState<Avatar | null>(null);

  const { data: avatars = [], isLoading } = useQuery<Avatar[]>({
    queryKey: ['avatars'],
    queryFn: getAllAvatars,
    enabled: !!user,
  });

  const filteredAvatars = useMemo(() => {
    return avatars.filter(avatar =>
      avatar.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [avatars, searchQuery]);

  const handleEdit = (avatar: Avatar) => {
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

  const handleCardClick = (avatar: Avatar) => {
    router.push(`/dashboard/send?avatarId=${avatar.id}`);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {/* 3. Translate Title */}
              {t('title')}
            </h1>
            <p className="text-slate-400">
              {/* 4. Translate Subtitle */}
              {t('subtitle')}
            </p>
          </div>
          <Button
            onClick={handleOpenCreateDialog}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            {/* 5. Translate Create Button */}
            {t('createButton')}
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            // 6. Translate Search Placeholder
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-purple-500"
          />
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            {/* 7. Loading state is purely visual, but if you wanted a message:
            <p className="text-slate-400">{t('loading')}</p> */}
            <Spinner size={48} className="text-primary" />
          </div>
        ) : filteredAvatars.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-8 max-w-md mx-auto">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                {/* 8. Translate No Avatars/No Results Title */}
                {searchQuery
                  ? t('emptyState.noResultsTitle')
                  : t('emptyState.noAvatarsTitle')}
              </h3>
              <p className="text-slate-400 mb-4">
                {/* 9. Translate No Avatars/No Results Message */}
                {searchQuery
                  ? t('emptyState.noResultsMessage')
                  : t('emptyState.noAvatarsMessage')}
              </p>
              {!searchQuery && (
                <Button
                  onClick={handleOpenCreateDialog}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {/* 10. Translate Create Button in empty state */}
                  {t('createButton')}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAvatars.map(avatar => (
              <AvatarCard
                key={avatar.id}
                avatar={avatar}
                onEdit={handleEdit}
                onDeleteSuccess={handleMutationSuccess}
                onCardClick={handleCardClick}
              />
            ))}
          </div>
        )}

        {/* Create/Edit Dialog is assumed to be translated internally by nextintl */}
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
