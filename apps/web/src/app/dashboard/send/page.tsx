'use client';

import React from 'react';
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
import type { Avatar } from '@repo/shared-types';
import { useQuery } from '@tanstack/react-query';
import { AvatarSelector } from '@/components/avatars/avatar-selector';
import { DiscordMessagePreview } from '@/components/discord-message-preview';
import type { DiscordEmbed } from '@repo/shared-types';
import { useToast } from '@/hooks/use-toast';
import { SendMessageData } from '@/lib/api/types/webhook';
import { DISCORD_MAX_MESSAGE_LENGTH } from '@/constants/discord';
import Link from 'next/link';
import { EmbedBuilder } from '../../../components/embed-builder';
import { ApiError } from '@/lib/error';
import { MarkdownToolbar } from '@/components/message-composer/markdown-toolbar';
import { insertMarkdown, markdownFormats } from '@/lib/utils/markdown';
import { MentionAutocomplete } from '@/components/message-composer/mention-autocomplete';

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
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | undefined>();
  const [hideSelectTemplate, setHideSelectTemplate] = useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Mention autocomplete state
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const [mentionStartIndex, setMentionStartIndex] = useState(-1);

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
      newSearchParams.set('webhookId', selectedWebhooks[0] as string);
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

  const handleAvatarSelect = (avatar: Avatar) => {
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

  const applyMarkdown = (formatKey: keyof typeof markdownFormats) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const format = markdownFormats[formatKey];
    const result = insertMarkdown({
      content: message.content,
      selectionStart: textarea.selectionStart,
      selectionEnd: textarea.selectionEnd,
      before: format.before,
      after: format.after,
      placeholder: format.placeholder,
    });

    setMessage(prev => ({ ...prev, content: result.newContent }));

    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        result.newCursorPosition,
        result.newCursorPosition
      );
    }, 0);
  };

  const handleBold = () => applyMarkdown('bold');
  const handleItalic = () => applyMarkdown('italic');
  const handleCode = () => applyMarkdown('code');
  const handleCodeBlock = () => applyMarkdown('codeBlock');
  const handleStrikethrough = () => applyMarkdown('strikethrough');
  const handleUnderline = () => applyMarkdown('underline');
  const handleSpoiler = () => applyMarkdown('spoiler');

  const handleEmojiSelect = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const newContent =
      message.content.substring(0, start) +
      emoji +
      message.content.substring(end);

    setMessage(prev => ({ ...prev, content: newContent }));

    // Set cursor position after emoji
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + emoji.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleMentionSelect = (value: string) => {
    const textarea = textareaRef.current;
    if (!textarea || mentionStartIndex === -1) return;

    const cursorPos = textarea.selectionStart;
    const newContent =
      message.content.substring(0, mentionStartIndex) +
      value +
      message.content.substring(cursorPos);

    setMessage(prev => ({ ...prev, content: newContent }));
    setShowMentionDropdown(false);
    setMentionStartIndex(-1);

    // Set cursor position before the closing > so user can type ID
    // For @everyone, position after the text
    setTimeout(() => {
      textarea.focus();
      let newCursorPos;
      if (value === '@everyone') {
        newCursorPos = mentionStartIndex + value.length;
      } else {
        // Position before the closing >
        newCursorPos = mentionStartIndex + value.length - 1;
      }
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    const cursorPos = e.target.selectionStart;

    setMessage(prev => ({ ...prev, content: newContent }));

    // Check if @ was just typed
    if (cursorPos > 0 && newContent[cursorPos - 1] === '@') {
      const textarea = textareaRef.current;
      if (!textarea) return;

      // Calculate dropdown position
      const rect = textarea.getBoundingClientRect();
      const lineHeight = 24; // Approximate line height
      const lines = newContent.substring(0, cursorPos).split('\n').length;

      setMentionPosition({
        top: rect.top + lines * lineHeight + 30,
        left: rect.left + 20,
      });
      setMentionStartIndex(cursorPos - 1);
      setShowMentionDropdown(true);
    } else if (showMentionDropdown) {
      // Check if we should close the dropdown
      if (mentionStartIndex !== -1) {
        // Check if @ was deleted
        const charAtMentionStart = newContent[mentionStartIndex];
        if (charAtMentionStart !== '@') {
          setShowMentionDropdown(false);
          setMentionStartIndex(-1);
          return;
        }

        // Check if cursor moved away from @ or user typed something after @
        const textAfterMention = newContent.substring(
          mentionStartIndex,
          cursorPos
        );

        // Close dropdown if:
        // - User typed space after @
        // - User typed any character after @ (length > 1 means @ + something)
        // - Cursor moved before the @
        // - Cursor moved too far away
        if (
          textAfterMention.includes(' ') ||
          textAfterMention.length > 1 ||
          cursorPos < mentionStartIndex ||
          cursorPos > mentionStartIndex + 1
        ) {
          setShowMentionDropdown(false);
          setMentionStartIndex(-1);
        }
      }
    }
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
    <div className="h-screen flex flex-col p-4 overflow-hidden">
      <MentionAutocomplete
        isOpen={showMentionDropdown}
        position={mentionPosition}
        onSelect={handleMentionSelect}
        onClose={() => {
          setShowMentionDropdown(false);
          setMentionStartIndex(-1);
        }}
      />
      <div className="max-w-7xl mx-auto w-full flex flex-col h-full gap-4">
        {/* Compact Header */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-white">Send Message</h1>
            <p className="text-slate-400 text-sm">
              Send to {selectedWebhooks.length} webhook
              {selectedWebhooks.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(message.content.trim() || message.embeds.length > 0) && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearMessage}
                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white bg-transparent"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
            <Button
              onClick={handleSendMessage}
              disabled={isSending || selectedWebhooks.length === 0}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSending ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 overflow-hidden">
          {/* Left Side - Message Composer */}
          <div className="flex flex-col overflow-hidden">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 text-white flex flex-col h-full overflow-hidden">
              <CardHeader className="pb-3 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Compose Message</CardTitle>
                  {!hideSelectTemplate && templates.length > 0 && (
                    <Select
                      onValueChange={handleTemplateSelect}
                      value={selectedTemplateId}
                      disabled={isLoadingTemplates}
                    >
                      <SelectTrigger className="w-[180px] h-8 bg-slate-700/50 border-slate-600 text-white text-xs">
                        <SelectValue placeholder="Load template" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700 text-white">
                        {templates.map(template => (
                          <SelectItem key={template._id} value={template._id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden flex flex-col">
                <Tabs
                  defaultValue="content"
                  className="w-full flex flex-col h-full overflow-hidden"
                >
                  <TabsList className="grid w-full grid-cols-4 bg-slate-700/50 flex-shrink-0">
                    <TabsTrigger
                      value="content"
                      className="data-[state=active]:bg-purple-600 text-xs"
                    >
                      Content
                    </TabsTrigger>
                    <TabsTrigger
                      value="settings"
                      className="data-[state=active]:bg-purple-600 text-xs"
                    >
                      Settings
                    </TabsTrigger>
                    <TabsTrigger
                      value="embeds"
                      className="data-[state=active]:bg-purple-600 text-xs"
                    >
                      Embeds
                    </TabsTrigger>
                    <TabsTrigger
                      value="webhooks"
                      className="data-[state=active]:bg-purple-600 text-xs"
                    >
                      Webhooks
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent
                    value="content"
                    className="flex-1 overflow-y-auto mt-3 space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label
                          htmlFor="content"
                          className="text-slate-200 text-sm"
                        >
                          Message Text
                        </Label>
                        <MarkdownToolbar
                          onBold={handleBold}
                          onItalic={handleItalic}
                          onCode={handleCode}
                          onCodeBlock={handleCodeBlock}
                          onStrikethrough={handleStrikethrough}
                          onUnderline={handleUnderline}
                          onSpoiler={handleSpoiler}
                          onEmojiSelect={handleEmojiSelect}
                        />
                      </div>
                      <Textarea
                        ref={textareaRef}
                        id="content"
                        placeholder="Enter your message content..."
                        value={message.content}
                        onChange={handleTextareaChange}
                        onKeyDown={e => {
                          // Prevent default behavior for arrow keys and Enter when dropdown is open
                          if (showMentionDropdown) {
                            if (
                              e.key === 'ArrowDown' ||
                              e.key === 'ArrowUp' ||
                              e.key === 'Enter' ||
                              e.key === 'Escape'
                            ) {
                              e.preventDefault();
                            }
                          }
                        }}
                        className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 min-h-[200px] resize-none"
                      />
                      <p className="text-xs text-slate-400 mt-1">
                        {message.content.length}/{DISCORD_MAX_MESSAGE_LENGTH}{' '}
                        characters
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="settings"
                    className="flex-1 overflow-y-auto mt-3 space-y-3"
                  >
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 border border-slate-600/50">
                      <div className="flex-1">
                        <p className="text-slate-200 font-medium text-sm">
                          Avatar
                        </p>
                        <p className="text-xs text-slate-400">
                          Choose from saved profiles
                        </p>
                      </div>
                      <AvatarSelector onSelect={handleAvatarSelect}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 text-xs h-8"
                        >
                          Select
                        </Button>
                      </AvatarSelector>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 border border-slate-600/50">
                      <div>
                        <Label className="text-slate-200 font-medium text-sm">
                          Text-to-Speech
                        </Label>
                        <p className="text-xs text-slate-400">Enable TTS</p>
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
                      <Label
                        htmlFor="thread-name"
                        className="text-slate-200 text-sm"
                      >
                        Thread Name (Optional)
                      </Label>
                      <input
                        id="thread-name"
                        type="text"
                        placeholder="Create a new thread"
                        value={message.threadName || ''}
                        onChange={e =>
                          setMessage(prev => ({
                            ...prev,
                            threadName: e.target.value,
                          }))
                        }
                        className="mt-1 w-full px-3 py-2 text-sm bg-slate-600/50 border border-slate-500 rounded-md text-white placeholder:text-slate-400 focus:border-purple-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="message-url"
                        className="text-slate-200 text-sm"
                      >
                        Discord Message URL (Optional)
                      </Label>
                      <input
                        id="message-url"
                        type="url"
                        placeholder="https://discord.com/channels/..."
                        value={message.message_replace_url || ''}
                        onChange={e => {
                          setMessage(prev => ({
                            ...prev,
                            message_replace_url: e.target.value,
                          }));
                        }}
                        className="mt-1 w-full px-3 py-2 text-sm bg-slate-600/50 border border-slate-500 rounded-md text-white placeholder:text-slate-400 focus:border-purple-500 focus:outline-none"
                      />
                      <p className="text-xs text-slate-400 mt-1">
                        Replace an existing message
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="embeds"
                    className="flex-1 overflow-y-auto mt-3"
                  >
                    <EmbedBuilder
                      embeds={message.embeds}
                      onEmbedsChange={newEmbeds =>
                        setMessage(prev => ({ ...prev, embeds: newEmbeds }))
                      }
                    />
                  </TabsContent>

                  <TabsContent
                    value="webhooks"
                    className="flex-1 overflow-y-auto mt-3"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Webhook className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm font-medium text-white">
                          {selectedWebhooks.length}/{webhooks.length} Selected
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAll}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent text-xs h-7"
                      >
                        {selectedWebhooks.length === webhooks.length
                          ? 'Deselect All'
                          : 'Select All'}
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {isLoadingWebhooks ? (
                        <p className="text-slate-400 text-center py-4 text-sm">
                          Loading...
                        </p>
                      ) : webhooks.length === 0 ? (
                        <p className="text-slate-400 text-center py-4 text-sm">
                          No webhooks available
                        </p>
                      ) : (
                        webhooks.map(webhook => (
                          <div
                            key={webhook.id}
                            className="flex items-center space-x-3 p-2.5 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors cursor-pointer"
                            onClick={() => handleWebhookToggle(webhook.id)}
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
                                <span className="font-medium text-white text-sm">
                                  {webhook.name}
                                </span>
                                <Badge
                                  variant={
                                    webhook.is_active ? 'default' : 'secondary'
                                  }
                                  className="text-xs h-4"
                                >
                                  {webhook.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                              </div>
                              {webhook.description && (
                                <p className="text-xs text-slate-400 truncate">
                                  {webhook.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Message Preview */}
          <div className="flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <DiscordMessagePreview
                content={message.content}
                embeds={message.embeds}
                avatar={selectedAvatar}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
