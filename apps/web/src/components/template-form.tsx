'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl'; // Import useTranslations
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DiscordMessagePreview } from '@/components/discord-message-preview';
import { AvatarSelector } from '@/components/avatars/avatar-selector';

import type {
  DiscordEmbed,
  MessageTemplate,
  CreateMessageTemplateRequest,
  UpdateMessageTemplateRequest,
} from '@repo/shared-types';
import { FileText, MessageSquare, Layers, Users } from 'lucide-react';
import { Avatar } from '@repo/shared-types';
import { EmbedBuilder } from '@/components/embed-builder';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface TemplateFormProps {
  initialData?: MessageTemplate | null;
  onSave: (
    data: CreateMessageTemplateRequest | UpdateMessageTemplateRequest
  ) => void;
  isSaving: boolean;
}

interface TemplateFormRef {
  submit: () => void;
}

export const TemplateForm = React.forwardRef(function TemplateForm(
  { initialData, onSave, isSaving }: TemplateFormProps,
  ref: React.Ref<TemplateFormRef>
) {
  const t = useTranslations('templateForm'); // Initialize translations

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar>({
    username: 'Webhook Manager',
    avatar_url: '/placeholder.svg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    id: 'predefined-avatar-id',
    user_id: 'predefined-user-id',
  });
  const [embeds, setEmbeds] = useState<DiscordEmbed[]>([]);
  const { data: avatars = [] } = useQuery<Avatar[]>({
    queryKey: ['avatars'],
    queryFn: api.avatar.getAllAvatars,
  });

  React.useImperativeHandle(ref, () => ({
    submit: () => {
      if (isSaving) return;
      const payload: CreateMessageTemplateRequest = {
        name,
        description,
        content,
        embeds,
      };
      if (selectedAvatar && avatars.some(a => a.id === selectedAvatar.id)) {
        payload.avatar_ref = selectedAvatar.id;
      }
      onSave(payload);
    },
  }));

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || '');
      setContent(initialData.content);
      // Logic to set the selected avatar based on initialData.avatar_ref
      if (avatars && avatars.length > 0) {
        const matchedAvatar = avatars.find(
          a => a.id === initialData.avatar_ref
        );
        if (matchedAvatar) {
          setSelectedAvatar(matchedAvatar);
        } else {
          // Handle case where avatar_ref exists but doesn't match an fetched avatar
          // For now, reset to default or keep current state
        }
      }
      setEmbeds(initialData.embeds || []);
    } else {
      setName('');
      setDescription('');
      setContent('');
      setEmbeds([]);
    }
  }, [initialData, avatars]); // Added 'avatars' to dependency array

  return (
    <div className="flex-1 flex">
      {/* Left Side - Editor */}
      <div className="w-1/2 border-r border-slate-700/50 flex flex-col">
        <Tabs defaultValue="info" className="flex-1 flex flex-col">
          <div className="border-b border-slate-700/50 px-4 py-2 bg-slate-800/30">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border-slate-600">
              <TabsTrigger
                value="info"
                className="text-slate-300 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <FileText className="w-4 h-4 mr-2" />
                {/* Translate Template Info Tab */}
                {t('tabs.info')}
              </TabsTrigger>
              <TabsTrigger
                value="message"
                className="text-slate-300 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                {/* Translate Message Tab */}
                {t('tabs.message')}
              </TabsTrigger>
              <TabsTrigger
                value="embeds"
                className="text-slate-300 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <Layers className="w-4 h-4 mr-2" />
                {/* Translate Embeds Tab */}
                {t('tabs.embeds')}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="info" className="flex-1 p-4">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  {/* Translate Template Info Header */}
                  {t('infoTab.header')}
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-200">
                    {/* Translate Template Name Label */}
                    {t('infoTab.nameLabel')}
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    // Translate Template Name Placeholder
                    placeholder={t('infoTab.namePlaceholder')}
                    required
                    className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-200">
                    {/* Translate Description Label */}
                    {t('infoTab.descriptionLabel')}
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    // Translate Description Placeholder
                    placeholder={t('infoTab.descriptionPlaceholder')}
                    rows={4}
                    className="resize-none bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="message" className="flex-1 p-4">
            <ScrollArea className="h-full">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    {/* Translate Message Content Header */}
                    {t('messageTab.contentHeader')}
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-slate-200">
                      {/* Translate Message Text Label */}
                      {t('messageTab.contentLabel')}
                    </Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={e => setContent(e.target.value)}
                      // Translate Message Content Placeholder
                      placeholder={t('messageTab.contentPlaceholder')}
                      rows={8}
                      maxLength={2000}
                      className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                    />
                    <div className="text-xs text-slate-400">
                      {/* Translate Character Count */}
                      {t('messageTab.characterCount', {
                        current: content.length,
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      {/* Translate Message Avatar Header */}
                      {t('messageTab.avatarHeader')}
                    </h3>
                    <AvatarSelector
                      onSelect={avatar => {
                        setSelectedAvatar(avatar);
                      }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        {/* Translate Select Avatar Button */}
                        {t('messageTab.avatarSelectButton')}
                      </Button>
                    </AvatarSelector>
                  </div>
                  <div className="grid grid-cols-1 gap-4"></div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="embeds" className="flex-1 p-4">
            <EmbedBuilder embeds={embeds} onEmbedsChange={setEmbeds} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Side - Live Preview */}
      <div className="w-1/2 flex flex-col">
        <ScrollArea className="h-[600px]">
          <DiscordMessagePreview
            content={content}
            avatar={selectedAvatar}
            embeds={embeds.length > 0 ? embeds : undefined}
          />
        </ScrollArea>
      </div>
    </div>
  );
});
