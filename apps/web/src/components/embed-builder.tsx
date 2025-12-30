'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AvatarSelector } from '@/components/avatars/avatar-selector';
import { Users, Plus, Trash2 } from 'lucide-react';
import type { DiscordEmbed } from '@repo/shared-types';
import { DISCORD_BLURPLE_COLOR, DISCORD_MAX_EMBEDS } from '@/constants/discord';
import { ScrollArea } from '@/components/ui/scroll-area';
import { discordColorToHex, hexToDiscordColor } from '@/lib/discord-utils';
import { Input } from '@/components/ui/input';

interface EmbedBuilderProps {
  embeds: DiscordEmbed[];
  onEmbedsChange: (embeds: DiscordEmbed[]) => void;
}

export function EmbedBuilder({ embeds, onEmbedsChange }: EmbedBuilderProps) {
  const addEmbed = () => {
    const newEmbed: DiscordEmbed = {
      title: '',
      description: '',
      color: String(DISCORD_BLURPLE_COLOR), // Discord's default blurple color
      fields: [],
    };
    onEmbedsChange([...embeds, newEmbed]);
  };

  const updateEmbed = (index: number, updatedEmbed: DiscordEmbed) => {
    const newEmbeds = embeds.map((e, i) => {
      if (i === index) {
        // Check if author object should be removed
        if (updatedEmbed.author) {
          const { name, icon_url, url } = updatedEmbed.author;
          if (!name && !icon_url && !url) {
            // If all author fields are empty, set author to undefined
            return { ...updatedEmbed, author: undefined };
          }
        }
        return updatedEmbed;
      }
      return e;
    });
    onEmbedsChange(newEmbeds);
  };

  const removeEmbed = (index: number) => {
    onEmbedsChange(embeds.filter((_, i) => i !== index));
  };

  const addField = (embedIndex: number) => {
    const newEmbeds = [...embeds];
    if (newEmbeds[embedIndex]) {
      newEmbeds[embedIndex].fields = [
        ...(newEmbeds[embedIndex].fields || []),
        { name: '', value: '', inline: false },
      ];
    }
    onEmbedsChange(newEmbeds);
  };

  const updateField = (
    embedIndex: number,
    fieldIndex: number,
    field: { name: string; value: string; inline?: boolean }
  ) => {
    const newEmbeds = [...embeds];
    if (newEmbeds[embedIndex] && newEmbeds[embedIndex].fields) {
      newEmbeds[embedIndex].fields = newEmbeds[embedIndex].fields!.map(
        (f, i) => (i === fieldIndex ? field : f)
      );
    }
    onEmbedsChange(newEmbeds);
  };

  const removeField = (embedIndex: number, fieldIndex: number) => {
    const newEmbeds = [...embeds];
    if (newEmbeds[embedIndex] && newEmbeds[embedIndex].fields) {
      newEmbeds[embedIndex].fields = newEmbeds[embedIndex].fields!.filter(
        (_, i) => i !== fieldIndex
      );
    }
    onEmbedsChange(newEmbeds);
  };

  return (
    <ScrollArea className="flex flex-col overflow-hidden max-h-[400px] pr-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <Label className="text-foreground font-medium">Discord Embeds</Label>
          <p className="text-sm text-muted-foreground">
            Add rich embeds to your message (max 10)
          </p>
        </div>
        <Button
          onClick={addEmbed}
          disabled={embeds.length >= DISCORD_MAX_EMBEDS}
          size="sm"
          className="bg-discord hover:bg-discord/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Embed
        </Button>
      </div>

      {embeds.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-muted rounded-lg">
          <p>No embeds added yet</p>
          <p className="text-sm">
            Click &quot;Add Embed&quot; to create rich message content
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {embeds.map((embed, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-background/50 border border-border"
            >
              <div className="flex items-center justify-between mb-4">
                <Label className="text-foreground font-medium">
                  Embed {index + 1}
                </Label>
                <Button
                  onClick={() => removeEmbed(index)}
                  variant="outline"
                  size="sm"
                  className="border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">
                      Title
                    </Label>
                    <Input
                      type="text"
                      placeholder="Embed title"
                      value={embed.title || ''}
                      onChange={e =>
                        updateEmbed(index, {
                          ...embed,
                          title: e.target.value,
                        })
                      }
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">URL</Label>
                    <Input
                      type="url"
                      placeholder="Embed URL"
                      value={embed.url || ''}
                      onChange={e =>
                        updateEmbed(index, {
                          ...embed,
                          url: e.target.value,
                        })
                      }
                      className="bg-background/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">
                    Description
                  </Label>
                  <Textarea
                    placeholder="Embed description"
                    value={embed.description || ''}
                    onChange={e =>
                      updateEmbed(index, {
                        ...embed,
                        description: e.target.value,
                      })
                    }
                    className="bg-background/50 min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={discordColorToHex(
                        embed.color || DISCORD_BLURPLE_COLOR
                      )}
                      onChange={e =>
                        updateEmbed(index, {
                          ...embed,
                          color: hexToDiscordColor(e.target.value),
                        })
                      }
                      className="h-10 w-20 bg-background/50 border border-input rounded-md cursor-pointer p-1"
                    />
                    <Input
                      type="text"
                      value={discordColorToHex(
                        embed.color || DISCORD_BLURPLE_COLOR
                      )}
                      readOnly
                      className="flex-1 bg-background/50 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-border/50">
                  <Label className="text-foreground font-medium">Author</Label>
                  <div className="flex items-center justify-between gap-2">
                    {embed.author?.name ? (
                      <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50 border border-border flex-1">
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={embed.author.icon_url || '/placeholder.svg'}
                          />
                          <AvatarFallback>
                            {embed.author.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-foreground font-medium">
                          {embed.author.name}
                        </span>
                      </div>
                    ) : (
                      <AvatarSelector
                        onSelect={avatar => {
                          updateEmbed(index, {
                            ...embed,
                            author: {
                              name: avatar.username,
                              icon_url: avatar.avatar_url,
                            },
                          });
                        }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-background/50 border-input hover:bg-muted"
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Select Avatar
                        </Button>
                      </AvatarSelector>
                    )}
                    {embed.author?.name && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          updateEmbed(index, {
                            ...embed,
                            author: undefined,
                          });
                        }}
                        className="border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  {/* Manual Author Input Fields (conditionally rendered) */}
                  {!embed.author?.name && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-muted-foreground text-sm">
                          Name
                        </Label>
                        <Input
                          type="text"
                          placeholder="Author name"
                          value={embed.author?.name || ''}
                          onChange={e =>
                            updateEmbed(index, {
                              ...embed,
                              author: {
                                ...(embed.author || { name: '' }),
                                name: e.target.value,
                              },
                            })
                          }
                          className="bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-muted-foreground text-sm">
                          Icon URL
                        </Label>
                        <Input
                          type="url"
                          placeholder="Author icon URL"
                          value={embed.author?.icon_url || ''}
                          onChange={e =>
                            updateEmbed(index, {
                              ...embed,
                              author: {
                                ...(embed.author || { name: '' }),
                                icon_url: e.target.value,
                              },
                            })
                          }
                          className="bg-background/50"
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label className="text-muted-foreground text-sm">
                          URL
                        </Label>
                        <Input
                          type="url"
                          placeholder="Author URL"
                          value={embed.author?.url || ''}
                          onChange={e =>
                            updateEmbed(index, {
                              ...embed,
                              author: {
                                ...(embed.author || { name: '' }),
                                url: e.target.value,
                              },
                            })
                          }
                          className="bg-background/50"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-2 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground font-medium">
                      Fields
                    </Label>
                    <Button
                      onClick={() => addField(index)}
                      size="sm"
                      className="bg-discord hover:bg-discord/90 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Field
                    </Button>
                  </div>

                  {embed.fields && embed.fields.length > 0 && (
                    <div className="space-y-3">
                      {embed.fields.map((field, fieldIndex) => (
                        <div
                          key={fieldIndex}
                          className="p-3 rounded-md bg-muted/30 border border-border"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-foreground text-sm">
                              Field {fieldIndex + 1}
                            </Label>
                            <Button
                              onClick={() => removeField(index, fieldIndex)}
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <Label className="text-muted-foreground text-sm">
                                Name
                              </Label>
                              <Input
                                type="text"
                                placeholder="Field name"
                                value={field.name}
                                onChange={e =>
                                  updateField(index, fieldIndex, {
                                    ...field,
                                    name: e.target.value,
                                  })
                                }
                                className="bg-background/50"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-muted-foreground text-sm">
                                Value
                              </Label>
                              <Textarea
                                placeholder="Field value"
                                value={field.value}
                                onChange={e =>
                                  updateField(index, fieldIndex, {
                                    ...field,
                                    value: e.target.value,
                                  })
                                }
                                className="bg-background/50"
                                rows={2}
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={field.inline}
                                onCheckedChange={checked =>
                                  updateField(index, fieldIndex, {
                                    ...field,
                                    inline: !!checked,
                                  })
                                }
                                className="border-muted-foreground"
                              />
                              <Label className="text-muted-foreground text-sm">
                                Inline
                              </Label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
                  <div className="space-y-2">
                    <Label className="text-foreground font-medium">Image</Label>
                    <Input
                      type="url"
                      placeholder="Image URL"
                      value={embed.image?.url || ''}
                      onChange={e =>
                        updateEmbed(index, {
                          ...embed,
                          image: { url: e.target.value },
                        })
                      }
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground font-medium">
                      Thumbnail
                    </Label>
                    <Input
                      type="url"
                      placeholder="Thumbnail URL"
                      value={embed.thumbnail?.url || ''}
                      onChange={e =>
                        updateEmbed(index, {
                          ...embed,
                          thumbnail: { url: e.target.value },
                        })
                      }
                      className="bg-background/50"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-border/50">
                  <Label className="text-foreground font-medium">Footer</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-sm">
                        Text
                      </Label>
                      <Input
                        type="text"
                        placeholder="Footer text"
                        value={embed.footer?.text || ''}
                        onChange={e =>
                          updateEmbed(index, {
                            ...embed,
                            footer: {
                              ...(embed.footer || { text: '' }),
                              text: e.target.value,
                            },
                          })
                        }
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-sm">
                        Icon URL
                      </Label>
                      <Input
                        type="url"
                        placeholder="Footer icon URL"
                        value={embed.footer?.icon_url || ''}
                        onChange={e =>
                          updateEmbed(index, {
                            ...embed,
                            footer: {
                              ...(embed.footer || { text: '' }),
                              icon_url: e.target.value,
                            },
                          })
                        }
                        className="bg-background/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-border/50">
                  <Label className="text-foreground font-medium">
                    Timestamp
                  </Label>
                  <Input
                    type="datetime-local"
                    value={
                      embed.timestamp
                        ? new Date(embed.timestamp).toISOString().slice(0, 16)
                        : ''
                    }
                    onChange={e =>
                      updateEmbed(index, {
                        ...embed,
                        timestamp: e.target.value
                          ? new Date(e.target.value).toISOString()
                          : undefined,
                      })
                    }
                    className="bg-background/50"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </ScrollArea>
  );
}
