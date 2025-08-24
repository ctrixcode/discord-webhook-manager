'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EmbedBuilder } from '@/components/embed-builder';
import { DiscordMessagePreview } from '@/components/discord-message-preview';
import { AvatarSelector } from '@/components/avatars/avatar-selector';

import type { MessageTemplate, DiscordEmbed, CreateMessageTemplateRequest, UpdateMessageTemplateRequest } from '@/lib/api/types';
import {
  FileText,
  Settings,
  Plus,
  MessageSquare,
  Layers,
  Users,
} from 'lucide-react';

interface TemplateFormProps {
  initialData?: MessageTemplate | null;
  onSave: (
    data: CreateMessageTemplateRequest | UpdateMessageTemplateRequest,
  ) => void;
  isSaving: boolean;
  saveError: Error | null;
}

export const TemplateForm = React.forwardRef(function TemplateForm(
  { initialData, onSave, isSaving, saveError }: TemplateFormProps,
  ref: React.Ref<any>,
) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [username, setUsername] = useState('');
  const [avatar_ref_id, setAvatar_ref_id] = useState(''); // This will be the ID sent to backend
  const [avatar_display_url, setAvatar_display_url] = useState(''); // For frontend preview
  const [embeds, setEmbeds] = useState<DiscordEmbed[]>([]);

  React.useImperativeHandle(ref, () => ({
    submit: () => {
      onSave({
        name,
        description,
        content,
        username,
        avatar_ref: avatar_ref_id, // Send the ID to the backend
        embeds,
      });
    },
  }));

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || '');
      setContent(initialData.content);
      setUsername(initialData.username || '');
      setAvatar_ref_id(initialData.avatar_ref || '');
      // For display, if initialData has avatar_ref, we might need to fetch the actual URL
      // For now, assuming initialData.avatar_ref can be directly used as a URL for preview if it's a full URL
      // or we need a mechanism to resolve ID to URL.
      // For simplicity, if avatar_ref is a URL, use it. Otherwise, it's an ID and needs resolution.
      // Given the backend schema, avatar_ref is an ID. So, we need to fetch the URL for display.
      // For now, I'll leave avatar_display_url as empty and it will be handled by AvatarSelector or a separate fetch.
      setAvatar_display_url(initialData.avatar_ref || ''); // This needs to be resolved to an actual URL
      setEmbeds(initialData.embeds || []);
    } else {
      setName('');
      setDescription('');
      setContent('');
      setUsername('');
      setAvatar_ref_id('');
      setAvatar_display_url('');
      setEmbeds([]);
    }
  }, [initialData]);

  const addEmbed = () => {
    setEmbeds([...embeds, { title: 'New Embed', color: 0x5865f2 }]);
  };

  const updateEmbed = (index: number, embed: DiscordEmbed) => {
    const newEmbeds = [...embeds];
    newEmbeds[index] = embed;
    setEmbeds(newEmbeds);
  };

  const removeEmbed = (index: number) => {
    setEmbeds(embeds.filter((_, i) => i !== index));
  };

  return (
    <div className="flex-1 flex overflow-hidden">
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
            <ScrollArea className="h-full">
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
            </ScrollArea>
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
                      className="resize-none bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                    />
                    <div className="text-xs text-slate-400">
                      {content.length}/2000 characters
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      Message Appearance
                    </h3>
                    <AvatarSelector
                      onSelect={(avatar) => {
                        setUsername(avatar.username);
                        setAvatar_ref_id(avatar.id);
                        setAvatar_display_url(avatar.avatar_url);
                      }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Use Predefined Avatar
                      </Button>
                    </AvatarSelector>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-slate-200">
                        Custom Username
                      </Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Override webhook username"
                        className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="avatar_ref_id" className="text-slate-200">
                        Avatar ID (from Predefined Avatars)
                      </Label>
                      <Input
                        id="avatar_ref_id"
                        value={avatar_ref_id}
                        onChange={(e) => setAvatar_ref_id(e.target.value)}
                        placeholder="Enter Avatar ID or select from list"
                        className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="embeds" className="flex-1 p-4">
            <ScrollArea className="h-full">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      Discord Embeds (Max 10)
                    </h3>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addEmbed}
                      disabled={embeds.length >= 10}
                      className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Embed ({embeds.length}/10)
                    </Button>
                  </div>

                  {embeds.map((embed, index) => (
                    <EmbedBuilder
                      key={index}
                      embed={embed}
                      onEmbedChange={(newEmbed) => updateEmbed(index, newEmbed)}
                      onRemove={() => removeEmbed(index)}
                    />
                  ))}

                  {embeds.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      No embeds added yet. Click &quot;Add Embed&quot; to create
                      rich formatted content.
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Side - Live Preview */}
      <div className="w-1/2 flex flex-col">
        <div className="border-b border-slate-700/50 px-4 py-3 bg-slate-800/30">
          <h2 className="font-semibold text-white">Live Preview</h2>
          <p className="text-sm text-slate-300">
            See how your message will appear in Discord
          </p>
        </div>
        <div className="flex-1 p-4 bg-[#36393f]">
          <ScrollArea className="h-full">
            <DiscordMessagePreview
              content={content}
              username={username}
              avatar_url={avatar_display_url}
              embeds={embeds.length > 0 ? embeds : undefined}
            />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
});
