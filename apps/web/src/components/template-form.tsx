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
import { MarkdownToolbar } from '@/components/message-composer/markdown-toolbar';
import { MentionAutocomplete } from '@/components/message-composer/mention-autocomplete';
import { insertMarkdown, markdownFormats } from '@/lib/utils/markdown';

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

  // Mention autocomplete state
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const [mentionStartIndex, setMentionStartIndex] = useState(-1);
  const [mentionSearchQuery, setMentionSearchQuery] = useState('');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Markdown formatting handlers
  const applyMarkdown = (formatKey: keyof typeof markdownFormats) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const format = markdownFormats[formatKey];
    const result = insertMarkdown({
      content: content,
      selectionStart: textarea.selectionStart,
      selectionEnd: textarea.selectionEnd,
      before: format.before,
      after: format.after,
      placeholder: format.placeholder,
    });

    setContent(result.newContent);

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
      content.substring(0, start) + emoji + content.substring(end);

    setContent(newContent);

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
      content.substring(0, mentionStartIndex) +
      value +
      content.substring(cursorPos);

    setContent(newContent);
    setShowMentionDropdown(false);
    setMentionStartIndex(-1);
    setMentionSearchQuery('');

    setTimeout(() => {
      textarea.focus();
      let newCursorPos;
      if (value === '@everyone') {
        newCursorPos = mentionStartIndex + value.length;
      } else {
        newCursorPos = mentionStartIndex + value.length - 1;
      }
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    const cursorPos = e.target.selectionStart;

    setContent(newContent);

    if (cursorPos > 0 && newContent[cursorPos - 1] === '@') {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const rect = textarea.getBoundingClientRect();
      const lineHeight = 24;
      const lines = newContent.substring(0, cursorPos).split('\n').length;

      setMentionPosition({
        top: rect.top + lines * lineHeight + 30,
        left: rect.left + 20,
      });
      setMentionStartIndex(cursorPos - 1);
      setMentionSearchQuery('');
      setShowMentionDropdown(true);
    } else if (showMentionDropdown) {
      if (mentionStartIndex !== -1) {
        const charAtMentionStart = newContent[mentionStartIndex];
        if (charAtMentionStart !== '@') {
          setShowMentionDropdown(false);
          setMentionStartIndex(-1);
          setMentionSearchQuery('');
          return;
        }

        const textAfterMention = newContent.substring(
          mentionStartIndex + 1,
          cursorPos
        );

        if (
          textAfterMention.includes(' ') ||
          cursorPos < mentionStartIndex ||
          textAfterMention.length > 20
        ) {
          setShowMentionDropdown(false);
          setMentionStartIndex(-1);
          setMentionSearchQuery('');
        } else {
          setMentionSearchQuery(textAfterMention);
        }
      }
    }
  };

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
      if (avatars && avatars.length > 0) {
        setSelectedAvatar(
          avatars.find(a => a.id === initialData.avatar_ref) as Avatar
        );
      }
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
  }, [initialData, avatars]);

  return (
    <div className="flex-1 flex relative">
      <MentionAutocomplete
        isOpen={showMentionDropdown}
        position={mentionPosition}
        onSelect={handleMentionSelect}
        onClose={() => {
          setShowMentionDropdown(false);
          setMentionStartIndex(-1);
          setMentionSearchQuery('');
        }}
        searchQuery={mentionSearchQuery}
      />
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
                    onChange={e => setName(e.target.value)}
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
                    onChange={e => setDescription(e.target.value)}
                    placeholder="What is this template for? Describe its purpose..."
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
                    Message Content
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="content" className="text-slate-200">
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
                      value={content}
                      onChange={handleTextareaChange}
                      onKeyDown={e => {
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
