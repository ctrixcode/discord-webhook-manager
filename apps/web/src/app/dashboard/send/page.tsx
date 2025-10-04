'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, Webhook } from 'lucide-react';
import { api } from '@/lib/api';
import type { IAvatar } from '@/lib/api/types/avatar';
import { useQuery } from '@tanstack/react-query';
import { AvatarSelector } from '@/components/avatars/avatar-selector';
import { DiscordMessagePreview } from '@/components/discord-message-preview';
import type { DiscordEmbed } from '@/lib/api/types/discord';
import { useToast } from '@/hooks/use-toast';
import { SendMessageData } from '@/lib/api/types/webhook';
import { DISCORD_MAX_MESSAGE_LENGTH } from '@/constants/discord';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { EmbedBuilder } from '../../../components/embed-builder';
import { ApiError } from '@/lib/error';

export default function SendMessagePage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialAvatarId = searchParams.get('avatarId');
  const initialWebhookId = searchParams.get('webhookId');

  const [selectedWebhooks, setSelectedWebhooks] = useState<string[]>(
    initialWebhookId ? [initialWebhookId] : []
  );
  const [message, setMessage] = useState({
    content: '',
    avatarRefID: initialAvatarId || '',
    tts: false,
    threadName: '',
    embeds: [] as DiscordEmbed[],
    message_replace_url: '',
  });
  const [isSending, setIsSending] = useState(false);

  const [selectedTemplateId, setSelectedTemplateId] = useState<
    string | undefined
  >(undefined);
  const [selectedAvatar, setSelectedAvatar] = useState<IAvatar | undefined>();
  const [hideSelectTemplate, setHideSelectTemplate] = useState(false);

  const handleClearMessage = () => {
    setMessage({
      content: '',
      avatarRefID: '',
      tts: false,
      threadName: '',
      embeds: [],
      message_replace_url: '',
    });
    setSelectedAvatar(undefined);
    setSelectedTemplateId('');
    setHideSelectTemplate(false);
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const selectedTemplate = templates.find(t => t._id === templateId);
    if (selectedTemplate) {
      setMessage({
        content: selectedTemplate.content || '',
        avatarRefID: selectedTemplate.avatar_ref || '',
        tts: false,
        threadName: '',
        embeds: selectedTemplate.embeds || [],
        message_replace_url: '',
      });
      if (selectedTemplate.avatar_ref) {
        const avatar = avatars.find(a => a.id === selectedTemplate.avatar_ref);
        setSelectedAvatar(avatar);
      } else {
        setSelectedAvatar(undefined);
      }
    }
    setHideSelectTemplate(true);
  };

  const { data: webhooks = [], isLoading: isLoadingWebhooks } = useQuery({
    queryKey: ['webhooks', { isActive: true }],
    queryFn: ({ queryKey }) =>
      api.webhook.getAllWebhooks({
        queryKey: queryKey as [string, { isActive?: boolean }],
      }),
  });
  const { data: avatars = [] } = useQuery({
    queryKey: ['avatars'],
    queryFn: () => api.avatar.getAllAvatars(),
  });
  const { data: templates = [], isLoading: isLoadingTemplates } = useQuery({
    queryKey: ['messageTemplates'],
    queryFn: () => api.template.getAllTemplates(),
  });

  useEffect(() => {
    if (initialAvatarId && avatars.length > 0) {
      const avatar = avatars.find(a => a.id === initialAvatarId);
      if (avatar) {
        setSelectedAvatar(avatar);
        setMessage(prev => ({ ...prev, avatarRefID: avatar.id }));
      }
    }
  }, [initialAvatarId, avatars]);

  useEffect(() => {
    if (initialWebhookId) {
      // Optionally, switch to the webhooks tab if a webhookId is present
      // This might require managing the active tab state
      // For now, just ensure the webhook is selected
      setSelectedWebhooks([initialWebhookId]);
    }
  }, [initialWebhookId]);

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (selectedWebhooks.length === 1) {
      newSearchParams.set('webhookId', selectedWebhooks[0]);
    } else {
      newSearchParams.delete('webhookId');
    }
    router.replace(`${pathname}?${newSearchParams.toString()}`);
  }, [selectedWebhooks, router, pathname, searchParams]);

  const handleWebhookToggle = (webhookId: string) => {
    setSelectedWebhooks(prev =>
      prev.includes(webhookId)
        ? prev.filter(id => id !== webhookId)
        : [...prev, webhookId]
    );
  };

  const handleSelectAll = () => {
    if (selectedWebhooks.length === webhooks.length) {
      setSelectedWebhooks([]);
    } else {
      setSelectedWebhooks(webhooks.map(w => w.id));
    }
  };

  const handleAvatarSelect = (avatar: IAvatar) => {
    setMessage(prev => ({
      ...prev,
      avatarRefID: avatar.id, // Use avatar.id as avatarRefID
    }));
    setSelectedAvatar(avatar);

    // Update URL param
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('avatarId', avatar.id);
    router.replace(`${pathname}?${newSearchParams.toString()}`);
  };

  const handleSendMessage = async () => {
    if (selectedWebhooks.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select at least one webhook',
      });
      return;
    }

    if (!message.content.trim() && message.embeds.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a message or add an embed',
      });
      return;
    }

    setIsSending(true);

    try {
      const payload: SendMessageData = {
        webhookIds: selectedWebhooks,
        messageData: {
          message: message.content || '',
          avatarRefID: message.avatarRefID || undefined,
          embeds: message.embeds.length > 0 ? message.embeds : undefined,
          tts: message.tts,
          message_replace_url: message.message_replace_url || undefined,
        },
      };

      const response = await api.webhook.sendMessage(payload);

      if (response.success) {
        toast({
          variant: 'success',
          title: 'Success',
          description: `Message sent successfully to ${selectedWebhooks.length} webhook${selectedWebhooks.length > 1 ? 's' : ''}`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.message || 'Failed to send message',
        });
      }
    } catch (error) {
      if (error instanceof ApiError) {
        if (
          error.errCode === 'WEBHOOK_LIMIT' ||
          error.errCode === 'MEDIA_LIMIT'
        ) {
          const toastResponse = toast({
            variant: 'destructive',
            title: 'Limit Reached',
            description: (
              <div>
                <p>{error.message}</p>
                <Link
                  href="/dashboard/settings"
                  className="text-blue-400 hover:underline"
                  onClick={() => toastResponse.dismiss()}
                >
                  Check your usage in settings.
                </Link>
              </div>
            ),
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: error.message || 'An unexpected error occurred',
          });
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'something went wrong',
        });
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Send Message</h1>
            <p className="text-slate-300 mt-1">
              Send messages immediately to one or multiple webhooks
            </p>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={isSending || selectedWebhooks.length === 0}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6"
          >
            <Send className="w-4 h-4 mr-2" />
            {isSending
              ? 'Sending...'
              : `Send to ${selectedWebhooks.length} webhook${selectedWebhooks.length !== 1 ? 's' : ''}`}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Message Composer */}
          <div className="space-y-6">
            {/* Message Composer */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 text-white">
              <CardHeader>
                <CardTitle>Compose Message</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1 mr-4">
                    {!hideSelectTemplate && (
                      <>
                        <Label
                          htmlFor="template-select"
                          className="text-slate-200"
                        >
                          Load Template
                        </Label>
                        <Select
                          onValueChange={handleTemplateSelect}
                          value={selectedTemplateId}
                          disabled={
                            isLoadingTemplates || templates.length === 0
                          }
                        >
                          <SelectTrigger
                            id="template-select"
                            className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                          >
                            <SelectValue placeholder="Select a template" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700 text-white">
                            {templates.map(template => (
                              <SelectItem
                                key={template._id}
                                value={template._id}
                                className="flex items-center gap-2"
                              >
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearMessage}
                    className="mt-auto border-red-600 text-red-400 hover:bg-red-600 hover:text-white bg-transparent"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                </div>
                <Tabs defaultValue="content" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-slate-700/50">
                    <TabsTrigger
                      value="content"
                      className="data-[state=active]:bg-purple-600"
                    >
                      Content
                    </TabsTrigger>
                    <TabsTrigger
                      value="settings"
                      className="data-[state=active]:bg-purple-600"
                    >
                      Settings
                    </TabsTrigger>
                    <TabsTrigger
                      value="embeds"
                      className="data-[state=active]:bg-purple-600"
                    >
                      Embeds
                    </TabsTrigger>
                    <TabsTrigger
                      value="webhooks"
                      className="data-[state=active]:bg-purple-600"
                    >
                      Webhooks
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="content" className="text-slate-200">
                        Message Text
                      </Label>
                      <Textarea
                        id="content"
                        placeholder="Enter your message content..."
                        value={message.content}
                        onChange={e =>
                          setMessage(prev => ({
                            ...prev,
                            content: e.target.value,
                          }))
                        }
                        className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 min-h-[120px]"
                      />
                      <p className="text-xs text-slate-400 mt-1">
                        {message.content.length}/{DISCORD_MAX_MESSAGE_LENGTH}{' '}
                        characters
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-slate-200">
                          Message Appearance
                        </Label>
                        <p className="text-sm text-slate-400">
                          Choose how the webhook message will appear in Discord
                        </p>
                      </div>

                      {/* Predefined Avatar Selection */}
                      <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30 border border-slate-600/50">
                        <div>
                          <p className="text-slate-200 font-medium">
                            Select Predefined Avatar
                          </p>
                          <p className="text-sm text-slate-400">
                            Choose from your saved avatar profiles
                          </p>
                        </div>
                        <AvatarSelector onSelect={handleAvatarSelect}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                          >
                            Select Avatar
                          </Button>
                        </AvatarSelector>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30 border border-slate-600/50">
                        <div>
                          <Label className="text-slate-200 font-medium">
                            Text-to-Speech
                          </Label>
                          <p className="text-sm text-slate-400">
                            Enable TTS for this message
                          </p>
                        </div>
                        <Checkbox
                          checked={message.tts}
                          onCheckedChange={checked =>
                            setMessage(prev => ({ ...prev, tts: !!checked }))
                          }
                          className="border-slate-500"
                        />
                      </div>

                      <div>
                        <Label htmlFor="thread-name" className="text-slate-200">
                          Thread Name (Optional)
                        </Label>
                        <input
                          id="thread-name"
                          type="text"
                          placeholder="Create a new thread with this name"
                          value={message.threadName || ''}
                          onChange={e =>
                            setMessage(prev => ({
                              ...prev,
                              threadName: e.target.value,
                            }))
                          }
                          className="mt-1 w-full px-3 py-2 bg-slate-600/50 border border-slate-500 rounded-md text-white placeholder:text-slate-400 focus:border-purple-500 focus:outline-none"
                        />
                        <p className="text-xs text-slate-400 mt-1">
                          If specified, the message will be sent to a new thread
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="message-url" className="text-slate-200">
                          Discord Message URL (Optional)
                        </Label>
                        <input
                          id="message-url"
                          type="url"
                          placeholder="e.g., https://discord.com/channels/guild_id/channel_id/message_id"
                          value={message.message_replace_url || ''}
                          onChange={e => {
                            const url = e.target.value;
                            setMessage(prev => ({
                              ...prev,
                              message_replace_url: url,
                            }));
                          }}
                          className="mt-1 w-full px-3 py-2 bg-slate-600/50 border border-slate-500 rounded-md text-white placeholder:text-slate-400 focus:border-purple-500 focus:outline-none"
                        />
                        <p className="text-xs text-slate-400 mt-1">
                          If provided, the message will replace the existing
                          Discord message at this URL.
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="embeds" className="space-y-4 mt-4">
                    <EmbedBuilder
                      embeds={message.embeds}
                      onEmbedsChange={newEmbeds =>
                        setMessage(prev => ({ ...prev, embeds: newEmbeds }))
                      }
                    />
                  </TabsContent>

                  <TabsContent value="webhooks" className="space-y-4 mt-4">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="flex items-center gap-2">
                        <Webhook className="w-5 h-5 text-cyan-400" />
                        Select Webhooks ({selectedWebhooks.length}/
                        {webhooks.length})
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAll}
                        className="w-fit border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                      >
                        {selectedWebhooks.length === webhooks.length
                          ? 'Deselect All'
                          : 'Select All'}
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-3 px-0 pb-0">
                      {isLoadingWebhooks ? (
                        <p className="text-slate-400 text-center py-4">
                          Loading webhooks...
                        </p>
                      ) : webhooks.length === 0 ? (
                        <p className="text-slate-400 text-center py-4">
                          No webhooks available. Add some webhooks first.
                        </p>
                      ) : (
                        webhooks.map(webhook => (
                          <div
                            key={webhook.id}
                            className="flex items-center space-x-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                          >
                            <Checkbox
                              checked={selectedWebhooks.includes(webhook.id)}
                              onCheckedChange={() =>
                                handleWebhookToggle(webhook.id)
                              }
                              className="border-slate-500"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-white">
                                  {webhook.name}
                                </span>
                                <Badge
                                  variant={
                                    webhook.is_active ? 'default' : 'secondary'
                                  }
                                  className="text-xs"
                                >
                                  {webhook.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-400 truncate">
                                {webhook.description}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Message Preview */}
          <div className="space-y-6">
            <DiscordMessagePreview
              content={message.content}
              embeds={message.embeds}
              avatar={selectedAvatar}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
