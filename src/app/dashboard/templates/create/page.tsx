'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EmbedBuilder } from '@/components/embed-builder';
import { DiscordMessagePreview } from '@/components/discord-message-preview';
import { AvatarSelector } from '@/components/avatars/avatar-selector';
import { useAuth } from '@/contexts/auth-context';
import {
  addTemplate,
  updateTemplate,
  getTemplate,
  type MessageTemplate,
  type DiscordEmbed,
} from '@/lib/template-storage';
import {
  ArrowLeft,
  Save,
  FileText,
  Settings,
  Plus,
  AlertCircle,
  MessageSquare,
  Layers,
  Users,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function CreateTemplatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('edit');
  const { user } = useAuth();

  const [template, setTemplate] = useState<MessageTemplate | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [tts, setTts] = useState(false);
  const [threadName, setThreadName] = useState('');
  const [embeds, setEmbeds] = useState<DiscordEmbed[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (templateId) {
      const existingTemplate = getTemplate(templateId);
      if (existingTemplate) {
        setTemplate(existingTemplate);
        setName(existingTemplate.name);
        setDescription(existingTemplate.description || '');
        setContent(existingTemplate.content);
        setUsername(existingTemplate.username || '');
        setAvatarUrl(existingTemplate.avatarUrl || '');
        setTts(existingTemplate.tts || false);
        setThreadName(existingTemplate.threadName || '');
        setEmbeds(existingTemplate.embeds || []);
      }
    }
  }, [templateId]);

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
        username: username.trim() || undefined,
        avatarUrl: avatarUrl.trim() || undefined,
        tts: tts || undefined,
        threadName: threadName.trim() || undefined,
        embeds: embeds.length > 0 ? embeds : undefined,
      };

      if (template) {
        updateTemplate(template.id, templateData);
      } else {
        addTemplate({
          ...templateData,
          userId: user.id,
        });
      }

      router.push('/dashboard/templates');
    } catch (err) {
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
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-white hover:bg-slate-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-white">
                {template ? 'Edit Template' : 'Create Template'}
              </h1>
              <p className="text-sm text-slate-300">
                Design your Discord message with live preview
              </p>
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : template ? 'Update' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Main Content - Split Screen */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Editor */}
        <div className="w-1/2 border-r border-slate-700/50 flex flex-col">
          <Tabs defaultValue="info" className="flex-1 flex flex-col">
            <div className="border-b border-slate-700/50 px-4 py-2 bg-slate-800/30">
              <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border-slate-600">
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
                  value="settings"
                  className="text-slate-300 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
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

                  {error && (
                    <Alert
                      variant="destructive"
                      className="bg-red-900/50 border-red-700 text-red-200"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
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
                          setAvatarUrl(avatar.avatarUrl);
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
                        <Label htmlFor="avatarUrl" className="text-slate-200">
                          Custom Avatar URL
                        </Label>
                        <Input
                          id="avatarUrl"
                          value={avatarUrl}
                          onChange={(e) => setAvatarUrl(e.target.value)}
                          placeholder="https://example.com/avatar.png"
                          className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="settings" className="flex-1 p-4">
              <ScrollArea className="h-full">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">
                      Advanced Settings
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="threadName" className="text-slate-200">
                          Thread Name (Forum Channels)
                        </Label>
                        <Input
                          id="threadName"
                          value={threadName}
                          onChange={(e) => setThreadName(e.target.value)}
                          placeholder="Create new thread with this name"
                          className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="tts"
                          checked={tts}
                          onCheckedChange={setTts}
                        />
                        <Label htmlFor="tts" className="text-slate-200">
                          Text-to-Speech (TTS)
                        </Label>
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
                        onEmbedChange={(newEmbed) =>
                          updateEmbed(index, newEmbed)
                        }
                        onRemove={() => removeEmbed(index)}
                      />
                    ))}

                    {embeds.length === 0 && (
                      <div className="text-center py-8 text-slate-400">
                        No embeds added yet. Click "Add Embed" to create rich
                        formatted content.
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
                avatarUrl={avatarUrl}
                embeds={embeds.length > 0 ? embeds : undefined}
              />
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
