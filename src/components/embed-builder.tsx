'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { type DiscordEmbed } from '@/lib/api/types';
import { hexToDiscordColor } from '@/lib/discord-utils';
import { Plus, Trash2, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface EmbedBuilderProps {
  embed: DiscordEmbed;
  onEmbedChange: (embed: DiscordEmbed) => void;
  onRemove: () => void;
}

export function EmbedBuilder({
  embed,
  onEmbedChange,
  onRemove,
}: EmbedBuilderProps) {
  const [isOpen, setIsOpen] = useState(true); // Always start expanded

  const updateEmbed = (updates: Partial<DiscordEmbed>) => {
    onEmbedChange({ ...embed, ...updates });
  };

  const addField = () => {
    const fields = embed.fields || [];
    updateEmbed({
      fields: [
        ...fields,
        { name: 'Field Name', value: 'Field Value', inline: false },
      ],
    });
  };

  const updateField = (
    index: number,
    updates: Partial<DiscordEmbed['fields'][number]>,
  ) => {
    const currentFields = (embed.fields || []) as DiscordEmbed['fields'];
    const newFields = [...currentFields];

    if (newFields[index]) {
      newFields[index] = { ...newFields[index], ...updates };
      updateEmbed({ fields: newFields });
    }
  };

  const removeField = (index: number) => {
    const fields = embed.fields || [];
    updateEmbed({ fields: fields.filter((_, i) => i !== index) });
  };

  const setCurrentTimestamp = () => {
    updateEmbed({ timestamp: new Date().toISOString() });
  };

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 mb-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="p-0 h-auto font-semibold text-white hover:text-purple-300"
              >
                <CardTitle className="flex items-center gap-2 text-white">
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                  Discord Embed - All Fields Available
                </CardTitle>
              </Button>
            </CollapsibleTrigger>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-6 max-h-none overflow-visible">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-purple-300 border-b border-purple-500/30 pb-1">
                Basic Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-slate-200">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={embed.title || ''}
                    onChange={(e) => updateEmbed({ title: e.target.value })}
                    placeholder="Embed title"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url" className="text-slate-200">
                    Title URL (Makes title clickable)
                  </Label>
                  <Input
                    id="url"
                    value={embed.url || ''}
                    onChange={(e) => updateEmbed({ url: e.target.value })}
                    placeholder="https://example.com"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-200">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={embed.description || ''}
                  onChange={(e) => updateEmbed({ description: e.target.value })}
                  placeholder="Embed description (supports markdown)"
                  rows={3}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color" className="text-slate-200">
                  Color (Left border accent)
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={
                      embed.color
                        ? `#${embed.color.toString(16).padStart(6, '0')}`
                        : '#5865f2'
                    }
                    onChange={(e) =>
                      updateEmbed({ color: hexToDiscordColor(e.target.value) })
                    }
                    className="w-20 bg-slate-700/50 border-slate-600"
                  />
                  <Input
                    value={
                      embed.color
                        ? `#${embed.color.toString(16).padStart(6, '0')}`
                        : '#5865f2'
                    }
                    onChange={(e) =>
                      updateEmbed({ color: hexToDiscordColor(e.target.value) })
                    }
                    placeholder="#5865f2"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Author Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-purple-300 border-b border-purple-500/30 pb-1">
                Author Information
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  value={embed.author?.name || ''}
                  onChange={(e) =>
                    updateEmbed({
                      author: { ...embed.author, name: e.target.value },
                    })
                  }
                  placeholder="Author name"
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                />
                <Input
                  value={embed.author?.url || ''}
                  onChange={(e) =>
                    updateEmbed({
                      author: {
                        ...embed.author,
                        name: embed.author?.name || '',
                        url: e.target.value,
                      },
                    })
                  }
                  placeholder="Author URL"
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                />
                <Input
                  value={embed.author?.icon_url || ''}
                  onChange={(e) =>
                    updateEmbed({
                      author: {
                        ...embed.author,
                        name: embed.author?.name || '',
                        icon_url: e.target.value,
                      },
                    })
                  }
                  placeholder="Author icon URL"
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                />
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-purple-300 border-b border-purple-500/30 pb-1">
                Images
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="thumbnail" className="text-slate-200">
                    Thumbnail URL (Small image, top-right)
                  </Label>
                  <Input
                    id="thumbnail"
                    value={embed.thumbnail?.url || ''}
                    onChange={(e) =>
                      updateEmbed({
                        thumbnail: e.target.value
                          ? { url: e.target.value }
                          : undefined,
                      })
                    }
                    placeholder="https://example.com/image.png"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image" className="text-slate-200">
                    Image URL (Large image, bottom)
                  </Label>
                  <Input
                    id="image"
                    value={embed.image?.url || ''}
                    onChange={(e) =>
                      updateEmbed({
                        image: e.target.value
                          ? { url: e.target.value }
                          : undefined,
                      })
                    }
                    placeholder="https://example.com/image.png"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Timestamp */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-purple-300 border-b border-purple-500/30 pb-1">
                Timestamp
              </h4>
              <div className="flex gap-2">
                <Input
                  id="timestamp"
                  value={embed.timestamp || ''}
                  onChange={(e) => updateEmbed({ timestamp: e.target.value })}
                  placeholder="2025-08-06T18:30:00.000Z"
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={setCurrentTimestamp}
                  className="bg-purple-600 hover:bg-purple-700 border-purple-500 text-white"
                >
                  <Calendar className="w-4 h-4 mr-1" />
                  Now
                </Button>
              </div>
            </div>

            {/* Fields (Grid Layout) */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-purple-300 border-b border-purple-500/30 pb-1">
                Fields (Grid Layout)
              </h4>
              <div className="flex items-center justify-between">
                <Label className="text-slate-200">Custom Fields</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addField}
                  disabled={(embed.fields?.length || 0) >= 25}
                  className="bg-purple-600 hover:bg-purple-700 border-purple-500 text-white disabled:opacity-50"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Field ({embed.fields?.length || 0}/25)
                </Button>
              </div>
              {embed.fields &&
                embed.fields.map((field, index) => (
                  <Card
                    key={index}
                    className="p-3 bg-slate-700/30 border-slate-600/50"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-200">
                          Field {index + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeField(index)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={field.name}
                          onChange={(e) =>
                            updateField(index, { name: e.target.value })
                          }
                          placeholder="Field name"
                          className="bg-slate-600/50 border-slate-500 text-white placeholder:text-slate-400 focus:border-purple-500"
                        />
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`inline-${index}`}
                            checked={field.inline || false}
                            onCheckedChange={(checked) =>
                              updateField(index, { inline: !!checked })
                            }
                            className="border-slate-500 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                          />
                          <Label
                            htmlFor={`inline-${index}`}
                            className="text-sm text-slate-200"
                          >
                            Inline
                          </Label>
                        </div>
                      </div>
                      <Textarea
                        value={field.value}
                        onChange={(e) =>
                          updateField(index, { value: e.target.value })
                        }
                        placeholder="Field value (supports markdown)"
                        rows={2}
                        className="bg-slate-600/50 border-slate-500 text-white placeholder:text-slate-400 focus:border-purple-500"
                      />
                    </div>
                  </Card>
                ))}
            </div>

            {/* Footer */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-purple-300 border-b border-purple-500/30 pb-1">
                Footer
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={embed.footer?.text || ''}
                  onChange={(e) =>
                    updateEmbed({
                      footer: e.target.value
                        ? {
                            text: e.target.value,
                            icon_url: embed.footer?.icon_url,
                          }
                        : undefined,
                    })
                  }
                  placeholder="Footer text"
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                />
                <Input
                  value={embed.footer?.icon_url || ''}
                  onChange={(e) =>
                    updateEmbed({
                      footer: embed.footer?.text
                        ? { text: embed.footer.text, icon_url: e.target.value }
                        : undefined,
                    })
                  }
                  placeholder="Footer icon URL"
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500"
                />
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
