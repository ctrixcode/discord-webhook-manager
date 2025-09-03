'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DiscordMessagePreview } from '@/components/discord-message-preview';
import { AvatarSelector } from '@/components/avatars/avatar-selector';

import type {
  MessageTemplate,
  CreateMessageTemplateRequest,
  UpdateMessageTemplateRequest,
} from '@/lib/api/types/message-template';
import type { DiscordEmbed } from '@/lib/api/types/discord';
import { FileText, MessageSquare, Layers, Users } from 'lucide-react';
import { PredefinedAvatar } from '@/lib/api/types/avatar';
import { EmbedSection } from '@/app/dashboard/send/EmbedSection';

interface TemplateFormProps {
  initialData?: MessageTemplate | null;
  onSave: (
    data: CreateMessageTemplateRequest | UpdateMessageTemplateRequest,
  ) => void;
  isSaving: boolean;
  saveError: Error | null;
}

interface TemplateFormRef {
  submit: () => void;
}

export const TemplateForm = React.forwardRef(function TemplateForm(
  { initialData, onSave, saveError }: TemplateFormProps,
  ref: React.Ref<TemplateFormRef>,
) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<PredefinedAvatar>({
    username: 'Webhook Manager',
    avatar_url: '/placeholder.svg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    id: 'predefined-avatar-id',
    user_id: 'predefined-user-id',
  });
  const [embeds, setEmbeds] = useState<DiscordEmbed[]>([]);

  React.useImperativeHandle(ref, () => ({
    submit: () => {
      onSave({
        name,
        description,
        content,
        avatar_ref: selectedAvatar?.id || '',
        embeds,
      });
    },
  }));

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || '');
      setContent(initialData.content);
      // For display, if initialData has avatar_ref, we might need to fetch the actual URL
      // For now, assuming initialData.avatar_ref can be directly used as a URL for preview if it's a full URL
      // or we need a mechanism to resolve ID to URL.
      // Given the backend schema, avatar_ref is an ID. So, we need to fetch the URL for display.
      // For now, I'll leave avatar_display_url as empty and it will be handled by AvatarSelector or a separate fetch.
      setEmbeds(initialData.embeds || []);
    } else {
      setName('');
      setDescription('');
      setContent('');
      setEmbeds([]);
    }
  }, [initialData]);

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
                Template Info
              </TabsTrigger>
              <TabsTrigger
                value="message"
                className="text-slate-300 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </TabsTrigger>
              <TabsTrigger
                value="embeds"
                className="text-slate-300 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <Layers className="w-4 h-4 mr-2" />
                Embeds
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="info" className="flex-1 p-4">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  Template Information
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-200">
                    Template Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="My Awesome Template"
                    required
                    className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-200">
                    Description (Optional)
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What is this template for? Describe its purpose..."
                    rows={4}
                    className="resize-none bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                  />
                </div>
              </div>

              {saveError && (
                <div className="text-red-400 text-sm">
                  Error: {saveError.message}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="message" className="flex-1 p-4">
            <ScrollArea className="h-full">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Message Content
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-slate-200">
                      Message Text
                    </Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Enter your message content here... (Max 2000 characters)"
                      rows={8}
                      maxLength={2000}
                      className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                    />
                    <div className="text-xs text-slate-400">
                      {content.length}/2000 characters
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      Message Avatar
                    </h3>
                    <AvatarSelector
                      onSelect={(avatar) => {
                        setSelectedAvatar(avatar);
                      }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Select Avatar
                      </Button>
                    </AvatarSelector>
                  </div>
                  <div className="grid grid-cols-1 gap-4"></div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="embeds" className="flex-1 p-4">
              <EmbedSection embeds={embeds} onEmbedsChange={setEmbeds} />
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
