'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AvatarSelector } from '@/components/avatars/avatar-selector';
import { Users } from 'lucide-react';
import type { DiscordEmbed } from '@/lib/api/types/discord';
import { DISCORD_BLURPLE_COLOR, DISCORD_MAX_EMBEDS } from '@/constants/discord';

interface EmbedSectionProps {
  embeds: DiscordEmbed[];
  onEmbedsChange: (embeds: DiscordEmbed[]) => void;
}

export function EmbedSection({ embeds, onEmbedsChange }: EmbedSectionProps) {
  const addEmbed = () => {
    const newEmbed: DiscordEmbed = {
      title: '',
      description: '',
      color: DISCORD_BLURPLE_COLOR, // Discord's default blurple color
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
    field: { name: string; value: string; inline?: boolean },
  ) => {
    const newEmbeds = [...embeds];
    if (newEmbeds[embedIndex] && newEmbeds[embedIndex].fields) {
      newEmbeds[embedIndex].fields = newEmbeds[embedIndex].fields!.map(
        (f, i) => (i === fieldIndex ? field : f),
      );
    }
    onEmbedsChange(newEmbeds);
  };

  const removeField = (embedIndex: number, fieldIndex: number) => {
    const newEmbeds = [...embeds];
    if (newEmbeds[embedIndex] && newEmbeds[embedIndex].fields) {
      newEmbeds[embedIndex].fields = newEmbeds[embedIndex].fields!.filter(
        (_, i) => i !== fieldIndex,
      );
    }
    onEmbedsChange(newEmbeds);
  };

  return (
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
          disabled={embeds.length >= DISCORD_MAX_EMBEDS}
          size="sm"
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          Add Embed
        </Button>
      </div>

      {embeds.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <p>No embeds added yet</p>
          <p className="text-sm">
            Click &quot;Add Embed&quot; to create rich message
            content
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {embeds.map((embed, index) => (
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
                    value={`#${(embed.color || DISCORD_BLURPLE_COLOR).toString(16).padStart(6, '0')}`}
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
                  <Label className="text-slate-200 font-medium">
                    Author
                  </Label>
                  <div className="flex items-center justify-between gap-2">
                    {embed.author?.name ? (
                      <div className="flex items-center gap-2 p-2 rounded-md bg-slate-700/50 border border-slate-600">
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={
                              embed.author.icon_url ||
                              '/placeholder.svg'
                            }
                          />
                          <AvatarFallback>
                            {embed.author.name
                              .slice(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-white font-medium">
                          {embed.author.name}
                        </span>
                      </div>
                    ) : (
                      <AvatarSelector
                        onSelect={(avatar) => {
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
                          className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
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
                        className="bg-red-700 border-red-600 text-white hover:bg-red-600"
                      >
                        Clear Author
                      </Button>
                    )}
                  </div>
                  {/* Manual Author Input Fields (conditionally rendered) */}
                  {!embed.author?.name && (
                    <div className="space-y-2">
                      <Label className="text-slate-300 text-sm">
                        Name
                      </Label>
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
                      <Label className="text-slate-300 text-sm">
                        Icon URL
                      </Label>
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
                      <Label className="text-slate-300 text-sm">
                        URL
                      </Label>
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
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200 font-medium">
                    Fields
                  </Label>
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
                            <Label className="text-slate-200 text-sm">
                              Field {fieldIndex + 1}
                            </Label>
                            <Button
                              onClick={() =>
                                removeField(index, fieldIndex)
                              }
                              variant="outline"
                              size="sm"
                              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white bg-transparent"
                            >
                              Remove
                            </Button>
                          </div>
                          <div>
                            <Label className="text-slate-300 text-sm">
                              Name
                            </Label>
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
                            <Label className="text-slate-300 text-sm">
                              Value
                            </Label>
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
                            <Label className="text-slate-300 text-sm">
                              Inline
                            </Label>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 space-y-2">
                    <Label className="text-slate-200 font-medium">
                      Image
                    </Label>
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
                    <Label className="text-slate-200 font-medium">
                      Thumbnail
                    </Label>
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
                  <Label className="text-slate-200 font-medium">
                    Footer
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label className="text-slate-300 text-sm">
                        Text
                      </Label>
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
                      <Label className="text-slate-300 text-sm">
                        Icon URL
                      </Label>
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
                  <Label className="text-slate-200 font-medium">
                    Timestamp
                  </Label>
                  <input
                    type="datetime-local"
                    value={
                      embed.timestamp
                        ? new Date(embed.timestamp)
                            .toISOString()
                            .slice(0, 16)
                        : ''
                    }
                    onChange={(e) =>
                      updateEmbed(index, {
                        ...embed,
                        timestamp: e.target.value
                          ? new Date(
                              e.target.value,
                            ).toISOString()
                          : undefined,
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
  );
}
