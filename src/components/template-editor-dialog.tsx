'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EmbedBuilder } from '@/components/embed-builder';
import { DiscordMessagePreview } from '@/components/discord-message-preview';
import { useAuth } from '@/contexts/auth-context';
import { AvatarSelector } from '@/components/avatars/avatar-selector';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import type { PredefinedAvatar } from '@/lib/api/types/avatar';
import {
  addTemplate,
  updateTemplate,
  type MessageTemplate,
  type DiscordEmbed,
} from '@/lib/template-storage';
import { Plus, FileText, AlertCircle, Eye, Settings } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TemplateEditorDialogProps {
  template?: MessageTemplate;
  onTemplateSaved: () => void;
  triggerButton?: React.ReactNode;
}

export function TemplateEditorDialog({
  template,
  onTemplateSaved,
  triggerButton,
}: TemplateEditorDialogProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [tts, setTts] = useState(false);
  const [threadName, setThreadName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<PredefinedAvatar | undefined>(undefined);
  const [embeds, setEmbeds] = useState<DiscordEmbed[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { data: avatars = [] } = useQuery({
    queryKey: ['avatars'],
    queryFn: () => api.avatar.getAllAvatars(),
  });

  useEffect(() => {
    if (template && open) {
      setName(template.name);
      setDescription(template.description || '');
      setContent(template.content);
      setTts(template.tts || false);
      setThreadName(template.threadName || '');
      setEmbeds(template.embeds || []);
      if (template.avatar_url) {
        const avatar = avatars.find(a => a.id === template.avatar_url);
        setSelectedAvatar(avatar);
      } else {
        setSelectedAvatar(undefined);
      }
    } else if (!template && open) {
      setName('');
      setDescription('');
      setContent('');
      setTts(false);
      setThreadName('');
      setEmbeds([]);
      setSelectedAvatar(undefined);
    }
  }, [template, open, avatars]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError('');
    setIsLoading(true);

    if (!name.trim()) {
      setError('Template name is required');
      setIsLoading(false);
      return;
    }

    if (!content.trim() && (!embeds || embeds.length === 0)) {
      setError('Template must have either content or embeds');
      setIsLoading(false);
      return;
    }

    try {
      const templateData = {
        name: name.trim(),
        description: description.trim() || undefined,
        content: content.trim(),
        avatar_ref: selectedAvatar?.id || undefined,
        tts: tts || undefined,
        threadName: threadName.trim() || undefined,
        embeds: embeds.length > 0 ? embeds : undefined,
      };

      if (template) {
        updateTemplate(template.id, templateData);
      } else {
        addTemplate({
          ...templateData,
          user_id: user.id,
        });
      }

      setOpen(false);
      onTemplateSaved();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      setError('Failed to save template');
    } finally {
      setIsLoading(false);
    }
  };

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] bg-slate-900/95 backdrop-blur-xl border-slate-700/50 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">
            {template ? 'Edit Template' : 'Create Template'}
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Create reusable message templates with full Discord webhook support.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="content" className="flex-1">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border-slate-700/50">
            <TabsTrigger
              value="content"
              className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-200 text-slate-300"
            >
              <FileText className="w-4 h-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-200 text-slate-300"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
            <TabsTrigger
              value="embeds"
              className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-200 text-slate-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Embeds
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-200 text-slate-300"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="mt-4">
            <form onSubmit={handleSubmit}>
              <ScrollArea className="h-[60vh] pr-4">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
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
                        className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-purple-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-slate-200">
                        Description (Optional)
                      </Label>
                      <Input
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What is this template for?"
                        className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-purple-500/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-slate-200">
                      Message Content
                    </Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Enter your message content here... (Max 2000 characters)"
                      rows={6}
                      maxLength={2000}
                      className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-purple-500/20 resize-none"
                    />
                    <div className="text-xs text-slate-400">
                      {content.length}/2000 characters
                    </div>
                  </div>

                  {error && (
                    <Alert
                      variant="destructive"
                      className="bg-red-900/20 border-red-500/50 text-red-200"
                    >
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      <AlertDescription className="text-red-200">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </ScrollArea>
            </form>
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Webhook Settings
                  </h3>

                  <div className="space-y-2">
                    <Label className="text-slate-200">
                      Message Avatar
                    </Label>
                    <div className="flex items-center gap-2">
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
                          Select Predefined Avatar
                        </Button>
                      </AvatarSelector>
                      {selectedAvatar && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedAvatar(undefined);
                          }}
                          className="bg-red-700 border-red-600 text-white hover:bg-red-600"
                        >
                          Clear Avatar
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="threadName" className="text-slate-200">
                      Thread Name (Forum Channels)
                    </Label>
                    <Input
                      id="threadName"
                      value={threadName}
                      onChange={(e) => setThreadName(e.target.value)}
                      placeholder="Create new thread with this name"
                      className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-500/50 focus:ring-purple-500/20"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="tts"
                      checked={tts}
                      onCheckedChange={setTts}
                      className="data-[state=checked]:bg-purple-600"
                    />
                    <Label htmlFor="tts" className="text-slate-200">
                      Text-to-Speech (TTS)
                    </Label>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="embeds" className="mt-4">
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-200">
                    Discord Embeds (Max 10)
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addEmbed}
                    disabled={embeds.length >= 10}
                    className="bg-slate-800/50 border-slate-600/50 text-slate-200 hover:bg-slate-700/50 hover:text-white"
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
                    No embeds added yet. Click &quot;Add Embed&quot; to create rich
                    formatted content.
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="preview" className="mt-4">
            <ScrollArea className="h-[60vh]">
              <div className="space-y-4">
                <div className="text-sm text-slate-400">
                  Preview of how your message will appear in Discord:
                </div>
                <DiscordMessagePreview
                  content={content}
                  avatar={selectedAvatar}
                  embeds={embeds.length > 0 ? embeds : undefined}
                />
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="bg-slate-800/50 border-slate-600/50 text-slate-200 hover:bg-slate-700/50 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            onClick={handleSubmit}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
          >
            {isLoading
              ? 'Saving...'
              : template
                ? 'Update Template'
                : 'Create Template'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
