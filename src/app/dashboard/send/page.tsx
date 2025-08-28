'use client';

import { useState } from 'react';
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
import type { PredefinedAvatar } from '@/lib/api/types/avatar';
import { useQuery } from '@tanstack/react-query';
import { AvatarSelector } from '@/components/avatars/avatar-selector';
import { DiscordMessagePreview } from '@/components/discord-message-preview';
import type { DiscordEmbed } from '@/lib/api/types/discord';
import { useToast } from '@/hooks/use-toast';
import { SendMessageData } from '@/lib/api/types/webhook';

interface SendResult {
  webhookId: string;
  success: boolean;
  error?: string; // Optional error message
}

export default function SendMessagePage() {
  const { toast } = useToast();
  const [selectedWebhooks, setSelectedWebhooks] = useState<string[]>([]);
  const [message, setMessage] = useState({
    content: '',
    avatarRefID: '',
    tts: false,
    threadName: '',
    embeds: [] as DiscordEmbed[],
  });
  const [isSending, setIsSending] = useState(false);
  const [sendResults, setSendResults] = useState<SendResult[]>([]);
  const [avatarMode, setAvatarMode] = useState<'predefined' | 'custom'>(
    'predefined',
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState<
    string | undefined
  >(undefined);
  const [selectedAvatar, setSelectedAvatar] = useState<
    PredefinedAvatar | undefined
  >();
  const [hideSelectTemplate, setHideSelectTemplate] = useState(false);

  const handleClearMessage = () => {
    setMessage({
      content: '',
      avatarRefID: '',
      tts: false,
      threadName: '',
      embeds: [],
    });
    setSelectedAvatar(undefined);
    setSelectedTemplateId('');
    setHideSelectTemplate(false);
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const selectedTemplate = templates.find((t) => t._id === templateId);
    if (selectedTemplate) {
      setMessage({
        content: selectedTemplate.content || '',
        avatarRefID: selectedTemplate.avatar_ref || '',
        tts: false,
        threadName: '',
        embeds: selectedTemplate.embeds || [],
      });
      if (selectedTemplate.avatar_ref) {
        const avatar = avatars.find(
          (a) => a.id === selectedTemplate.avatar_ref,
        );
        setSelectedAvatar(avatar);
      } else {
        setSelectedAvatar(undefined);
      }
    }
    setHideSelectTemplate(true);
  };

  const { data: webhooks = [], isLoading: isLoadingWebhooks } = useQuery({
    queryKey: ['webhooks', { isActive: true }],
    queryFn: () => api.webhook.getAllWebhooks({ isActive: true }),
  });
  const { data: avatars = [], isLoading: isLoadingAvatars } = useQuery({
    queryKey: ['avatars'],
    queryFn: () => api.avatar.getAllAvatars(),
  });
  const { data: templates = [], isLoading: isLoadingTemplates } = useQuery({
    queryKey: ['messageTemplates'],
    queryFn: () => api.template.getAllTemplates(),
  });

  const handleWebhookToggle = (webhookId: string) => {
    setSelectedWebhooks((prev) =>
      prev.includes(webhookId)
        ? prev.filter((id) => id !== webhookId)
        : [...prev, webhookId],
    );
  };

  const handleSelectAll = () => {
    if (selectedWebhooks.length === webhooks.length) {
      setSelectedWebhooks([]);
    } else {
      setSelectedWebhooks(webhooks.map((w) => w.id));
    }
  };

  const handleAvatarSelect = (avatar: PredefinedAvatar) => {
    setMessage((prev) => ({
      ...prev,
      avatarRefID: avatar.id, // Use avatar.id as avatarRefID
    }));
    setSelectedAvatar(avatar);
  };

  const addEmbed = () => {
    const newEmbed: DiscordEmbed = {
      title: '',
      description: '',
      color: 5814783, // Discord's default blurple color
      fields: [],
    };
    setMessage((prev) => ({
      ...prev,
      embeds: [...prev.embeds, newEmbed],
    }));
  };

  const updateEmbed = (index: number, embed: DiscordEmbed) => {
    setMessage((prev) => ({
      ...prev,
      embeds: prev.embeds.map((e, i) => (i === index ? embed : e)),
    }));
  };

  const removeEmbed = (index: number) => {
    setMessage((prev) => ({
      ...prev,
      embeds: prev.embeds.filter((_, i) => i !== index),
    }));
  };

  const addField = (embedIndex: number) => {
    setMessage((prev) => {
      const newEmbeds = [...prev.embeds];
      if (newEmbeds[embedIndex]) {
        newEmbeds[embedIndex].fields = [
          ...(newEmbeds[embedIndex].fields || []),
          { name: '', value: '', inline: false },
        ];
      }
      return { ...prev, embeds: newEmbeds };
    });
  };

  const updateField = (
    embedIndex: number,
    fieldIndex: number,
    field: { name: string; value: string; inline?: boolean },
  ) => {
    setMessage((prev) => {
      const newEmbeds = [...prev.embeds];
      if (newEmbeds[embedIndex] && newEmbeds[embedIndex].fields) {
        newEmbeds[embedIndex].fields = newEmbeds[embedIndex].fields!.map(
          (f, i) => (i === fieldIndex ? field : f),
        );
      }
      return { ...prev, embeds: newEmbeds };
    });
  };

  const removeField = (embedIndex: number, fieldIndex: number) => {
    setMessage((prev) => {
      const newEmbeds = [...prev.embeds];
      if (newEmbeds[embedIndex] && newEmbeds[embedIndex].fields) {
        newEmbeds[embedIndex].fields = newEmbeds[embedIndex].fields!.filter(
          (_, i) => i !== fieldIndex,
        );
      }
      return { ...prev, embeds: newEmbeds };
    });
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
    setSendResults([]);

    try {
      const payload: SendMessageData = {
        webhookIds: selectedWebhooks,
        messageData: {
          message: message.content || '',
          avatarRefID: message.avatarRefID || undefined,
          embeds: message.embeds.length > 0 ? message.embeds : undefined,
        },
      };

      const response = await api.webhook.sendMessage(payload);

      if (response.success) {
        toast({
          variant: 'success',
          title: 'Success',
          description: `Message sent successfully to ${selectedWebhooks.length} webhook${selectedWebhooks.length > 1 ? 's' : ''}`,
        });
        setSendResults(
          selectedWebhooks.map((id) => ({ webhookId: id, success: true })),
        );
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.message || 'Failed to send message',
        });
        setSendResults(
          selectedWebhooks.map((id) => ({
            webhookId: id,
            success: false,
            error: response.message,
          })),
        );
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: String(error),
      });
      setSendResults(
        selectedWebhooks.map((id) => ({
          webhookId: id,
          success: false,
          error: String(error),
        })),
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
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
                            {templates.map((template) => (
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
                        onChange={(e) =>
                          setMessage((prev) => ({
                            ...prev,
                            content: e.target.value,
                          }))
                        }
                        className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 min-h-[120px]"
                      />
                      <p className="text-xs text-slate-400 mt-1">
                        {message.content.length}/2000 characters
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

                      {/* Avatar Mode Toggle */}
                      <div className="flex gap-2">
                        <Button
                          variant={
                            avatarMode === 'predefined' ? 'default' : 'outline'
                          }
                          size="sm"
                          onClick={() => setAvatarMode('predefined')}
                          className={
                            avatarMode === 'predefined'
                              ? 'bg-purple-600 hover:bg-purple-700 text-white'
                              : 'border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent'
                          }
                        >
                          Predefined Avatar
                        </Button>
                        {/* <Button
                          variant={
                            avatarMode === 'custom' ? 'default' : 'outline'
                          }
                          size="sm"
                          onClick={() => setAvatarMode('custom')}
                          className={
                            avatarMode === 'custom'
                              ? 'bg-purple-600 hover:bg-purple-700 text-white'
                              : 'border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent'
                          }
                        >
                          Custom Avatar
                        </Button> */}
                      </div>

                      {/* Predefined Avatar Selection */}
                      {avatarMode === 'predefined' && (
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
                      )}

                      {/* Custom Avatar Input */}
                      {/* {avatarMode === 'custom' && (
                        <div className="space-y-4 p-4 rounded-lg bg-slate-700/30 border border-slate-600/50">
                          <div>
                            <Label
                              htmlFor="custom-username"
                              className="text-slate-200"
                            >
                              Custom Username
                            </Label>
                            <input
                              id="custom-username"
                              type="text"
                              placeholder="Enter custom username"
                              value={message.username}
                              onChange={(e) =>
                                setMessage((prev) => ({
                                  ...prev,
                                  username: e.target.value,
                                }))
                              }
                              className="mt-1 w-full px-3 py-2 bg-slate-600/50 border border-slate-500 rounded-md text-white placeholder:text-slate-400 focus:border-purple-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor="custom-avatar"
                              className="text-slate-200"
                            >
                              Custom Avatar URL
                            </Label>
                            <input
                              id="custom-avatar"
                              type="url"
                              placeholder="Enter custom avatar URL"
                              value={message.avatar_url}
                              onChange={(e) =>
                                setMessage((prev) => ({
                                  ...prev,
                                  avatar_url: e.target.value,
                                }))
                              }
                              className="mt-1 w-full px-3 py-2 bg-slate-600/50 border border-slate-500 rounded-md text-white placeholder:text-slate-400 focus:border-purple-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      )} */}
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
                          onCheckedChange={(checked) =>
                            setMessage((prev) => ({ ...prev, tts: !!checked }))
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
                          onChange={(e) =>
                            setMessage((prev) => ({
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
                    </div>
                  </TabsContent>

                  <TabsContent value="embeds" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-slate-200 font-medium">
                            Discord Embeds
                          </Label>
                          <p className="text-sm text-slate-400">
                            Add rich embeds to your message (max 10)
                          </p>
                        </div>
                        <Button
                          onClick={addEmbed}
                          disabled={message.embeds.length >= 10}
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          Add Embed
                        </Button>
                      </div>

                      {message.embeds.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">
                          <p>No embeds added yet</p>
                          <p className="text-sm">
                            Click &quot;Add Embed&quot; to create rich message
                            content
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {message.embeds.map((embed, index) => (
                            <div
                              key={index}
                              className="p-4 rounded-lg bg-slate-700/30 border border-slate-600/50"
                            >
                              <div className="flex items-center justify-between mb-4">
                                <Label className="text-slate-200 font-medium">
                                  Embed {index + 1}
                                </Label>
                                <Button
                                  onClick={() => removeEmbed(index)}
                                  variant="outline"
                                  size="sm"
                                  className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white bg-transparent"
                                >
                                  Remove
                                </Button>
                              </div>

                              <div className="space-y-3">
                                <div className="flex gap-2">
                                  <div className="flex-1">
                                    <Label className="text-slate-300 text-sm">
                                      Title
                                    </Label>
                                    <input
                                      type="text"
                                      placeholder="Embed title"
                                      value={embed.title || ''}
                                      onChange={(e) =>
                                        updateEmbed(index, {
                                          ...embed,
                                          title: e.target.value,
                                        })
                                      }
                                      className="mt-1 w-full px-3 py-2 bg-slate-600/50 border border-slate-500 rounded-md text-white placeholder:text-slate-400 focus:border-purple-500 focus:outline-none"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <Label className="text-slate-300 text-sm">
                                      URL
                                    </Label>
                                    <input
                                      type="url"
                                      placeholder="Embed URL"
                                      value={embed.url || ''}
                                      onChange={(e) =>
                                        updateEmbed(index, {
                                          ...embed,
                                          url: e.target.value,
                                        })
                                      }
                                      className="mt-1 w-full px-3 py-2 bg-slate-600/50 border border-slate-500 rounded-md text-white placeholder:text-slate-400 focus:border-purple-500 focus:outline-none"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <Label className="text-slate-300 text-sm">
                                    Description
                                  </Label>
                                  <Textarea
                                    placeholder="Embed description"
                                    value={embed.description || ''}
                                    onChange={(e) =>
                                      updateEmbed(index, {
                                        ...embed,
                                        description: e.target.value,
                                      })
                                    }
                                    className="mt-1 bg-slate-600/50 border-slate-500 text-white placeholder:text-slate-400 focus:border-purple-500"
                                    rows={3}
                                  />
                                </div>

                                <div>
                                  <Label className="text-slate-300 text-sm">
                                    Color
                                  </Label>
                                  <input
                                    type="color"
                                    value={`#${(embed.color || 5814783).toString(16).padStart(6, '0')}`}
                                    onChange={(e) =>
                                      updateEmbed(index, {
                                        ...embed,
                                        color: Number.parseInt(
                                          e.target.value.slice(1),
                                          16,
                                        ),
                                      })
                                    }
                                    className="mt-1 w-full h-10 bg-slate-600/50 border border-slate-500 rounded-md"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-slate-200 font-medium">Author</Label>
                                  <div className="flex gap-2">
                                    <div className="flex-1">
                                      <Label className="text-slate-300 text-sm">Name</Label>
                                      <input
                                        type="text"
                                        placeholder="Author name"
                                        value={embed.author?.name || ''}
                                        onChange={(e) =>
                                          updateEmbed(index, {
                                            ...embed,
                                            author: {
                                              ...(embed.author || { name: '' }),
                                              name: e.target.value,
                                            },
                                          })
                                        }
                                        className="mt-1 w-full px-3 py-2 bg-slate-600/50 border border-slate-500 rounded-md text-white placeholder:text-slate-400 focus:border-purple-500 focus:outline-none"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <Label className="text-slate-300 text-sm">Icon URL</Label>
                                      <input
                                        type="url"
                                        placeholder="Author icon URL"
                                        value={embed.author?.icon_url || ''}
                                        onChange={(e) =>
                                          updateEmbed(index, {
                                            ...embed,
                                            author: {
                                              ...(embed.author || { name: '' }),
                                              icon_url: e.target.value,
                                            },
                                          })
                                        }
                                        className="mt-1 w-full px-3 py-2 bg-slate-600/50 border border-slate-500 rounded-md text-white placeholder:text-slate-400 focus:border-purple-500 focus:outline-none"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-slate-300 text-sm">URL</Label>
                                    <input
                                      type="url"
                                      placeholder="Author URL"
                                      value={embed.author?.url || ''}
                                      onChange={(e) =>
                                        updateEmbed(index, {
                                          ...embed,
                                          author: {
                                            ...(embed.author || { name: '' }),
                                            url: e.target.value,
                                          },
                                        })
                                      }
                                      className="mt-1 w-full px-3 py-2 bg-slate-600/50 border border-slate-500 rounded-md text-white placeholder:text-slate-400 focus:border-purple-500 focus:outline-none"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-slate-200 font-medium">Fields</Label>
                                  <Button
                                    onClick={() => addField(index)}
                                    size="sm"
                                    className="bg-purple-600 hover:bg-purple-700 text-white"
                                  >
                                    Add Field
                                  </Button>
                                  {embed.fields && embed.fields.length > 0 && (
                                    <div className="space-y-3 mt-2">
                                      {embed.fields.map((field, fieldIndex) => (
                                        <div
                                          key={fieldIndex}
                                          className="p-3 rounded-md bg-slate-600/50 border border-slate-500"
                                        >
                                          <div className="flex items-center justify-between mb-2">
                                            <Label className="text-slate-200 text-sm">Field {fieldIndex + 1}</Label>
                                            <Button
                                              onClick={() => removeField(index, fieldIndex)}
                                              variant="outline"
                                              size="sm"
                                              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white bg-transparent"
                                            >
                                              Remove
                                            </Button>
                                          </div>
                                          <div>
                                            <Label className="text-slate-300 text-sm">Name</Label>
                                            <input
                                              type="text"
                                              placeholder="Field name"
                                              value={field.name}
                                              onChange={(e) =>
                                                updateField(index, fieldIndex, {
                                                  ...field,
                                                  name: e.target.value,
                                                })
                                              }
                                              className="mt-1 w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white placeholder:text-slate-400 focus:border-purple-500 focus:outline-none"
                                            />
                                          </div>
                                          <div className="mt-2">
                                            <Label className="text-slate-300 text-sm">Value</Label>
                                            <Textarea
                                              placeholder="Field value"
                                              value={field.value}
                                              onChange={(e) =>
                                                updateField(index, fieldIndex, {
                                                  ...field,
                                                  value: e.target.value,
                                                })
                                              }
                                              className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                                              rows={2}
                                            />
                                          </div>
                                          <div className="flex items-center space-x-2 mt-2">
                                            <Checkbox
                                              checked={field.inline}
                                              onCheckedChange={(checked) =>
                                                updateField(index, fieldIndex, {
                                                  ...field,
                                                  inline: !!checked,
                                                })
                                              }
                                              className="border-slate-500"
                                            />
                                            <Label className="text-slate-300 text-sm">Inline</Label>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                <div className="flex gap-2">
                                  <div className="flex-1 space-y-2">
                                    <Label className="text-slate-200 font-medium">Image</Label>
                                    <input
                                      type="url"
                                      placeholder="Image URL"
                                      value={embed.image?.url || ''}
                                      onChange={(e) =>
                                        updateEmbed(index, {
                                          ...embed,
                                          image: { url: e.target.value },
                                        })
                                      }
                                      className="mt-1 w-full px-3 py-2 bg-slate-600/50 border border-slate-500 rounded-md text-white placeholder:text-slate-400 focus:border-purple-500 focus:outline-none"
                                    />
                                  </div>

                                  <div className="flex-1 space-y-2">
                                    <Label className="text-slate-200 font-medium">Thumbnail</Label>
                                    <input
                                      type="url"
                                      placeholder="Thumbnail URL"
                                      value={embed.thumbnail?.url || ''}
                                      onChange={(e) =>
                                        updateEmbed(index, {
                                          ...embed,
                                          thumbnail: { url: e.target.value },
                                        })
                                      }
                                      className="mt-1 w-full px-3 py-2 bg-slate-600/50 border border-slate-500 rounded-md text-white placeholder:text-slate-400 focus:border-purple-500 focus:outline-none"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-slate-200 font-medium">Footer</Label>
                                  <div className="flex gap-2">
                                    <div className="flex-1">
                                      <Label className="text-slate-300 text-sm">Text</Label>
                                      <input
                                        type="text"
                                        placeholder="Footer text"
                                        value={embed.footer?.text || ''}
                                        onChange={(e) =>
                                          updateEmbed(index, {
                                            ...embed,
                                            footer: {
                                              ...(embed.footer || { text: '' }),
                                              text: e.target.value,
                                            },
                                          })
                                        }
                                        className="mt-1 w-full px-3 py-2 bg-slate-600/50 border border-slate-500 rounded-md text-white placeholder:text-slate-400 focus:border-purple-500 focus:outline-none"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <Label className="text-slate-300 text-sm">Icon URL</Label>
                                      <input
                                        type="url"
                                        placeholder="Footer icon URL"
                                        value={embed.footer?.icon_url || ''}
                                        onChange={(e) =>
                                          updateEmbed(index, {
                                            ...embed,
                                            footer: {
                                              ...(embed.footer || { text: '' }),
                                              icon_url: e.target.value,
                                            },
                                          })
                                        }
                                        className="mt-1 w-full px-3 py-2 bg-slate-600/50 border border-slate-500 rounded-md text-white placeholder:text-slate-400 focus:border-purple-500 focus:outline-none"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-slate-200 font-medium">Timestamp</Label>
                                  <input
                                    type="datetime-local"
                                    value={embed.timestamp ? new Date(embed.timestamp).toISOString().slice(0, 16) : ''}
                                    onChange={(e) =>
                                      updateEmbed(index, {
                                        ...embed,
                                        timestamp: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                                      })
                                    }
                                    className="mt-1 w-full px-3 py-2 bg-slate-600/50 border border-slate-500 rounded-md text-white placeholder:text-slate-400 focus:border-purple-500 focus:outline-none"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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
                        webhooks.map((webhook) => (
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
                                {webhook.url}
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
