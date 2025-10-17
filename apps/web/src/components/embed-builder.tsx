'use client';

import React from 'react';
import { useTranslations } from 'next-intl'; // Import useTranslations
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AvatarSelector } from '@/components/avatars/avatar-selector';
import { Users } from 'lucide-react';
import type { DiscordEmbed } from '@repo/shared-types';
import { DISCORD_BLURPLE_COLOR, DISCORD_MAX_EMBEDS } from '@/constants/discord';
import { ScrollArea } from '@/components/ui/scroll-area';
import { discordColorToHex, hexToDiscordColor } from '@/lib/discord-utils';

interface EmbedBuilderProps {
  embeds: DiscordEmbed[];
  onEmbedsChange: (embeds: DiscordEmbed[]) => void;
}

export function EmbedBuilder({ embeds, onEmbedsChange }: EmbedBuilderProps) {
  const t = useTranslations('embedBuilder'); // Initialize translations

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
    <ScrollArea className="flex flex-col overflow-hidden max-h-[400px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          {/* Translate Header Title */}
          <Label className="text-slate-200 font-medium">
            {t('header.title')}
          </Label>
          {/* Translate Header Subtitle, passing max value */}
          <p className="text-sm text-slate-400">
            {t('header.subtitle', { max: DISCORD_MAX_EMBEDS })}
          </p>
        </div>
        <Button
          onClick={addEmbed}
          disabled={embeds.length >= DISCORD_MAX_EMBEDS}
          size="sm"
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          {/* Translate Add Embed Button */}
          {t('header.addButton')}
        </Button>
      </div>

      {embeds.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          {/* Translate Empty State Text 1 */}
          <p>{t('emptyState.noEmbeds')}</p>
          {/* Translate Empty State Text 2 */}
          <p className="text-sm">{t('emptyState.callToAction')}</p>
        </div>
      ) : (
        <div>
          {embeds.map((embed, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-slate-700/30 border border-slate-600/50"
            >
              <div className="flex items-center justify-between mb-4">
                {/* Translate Embed Label (e.g., "Embed 1") */}
                <Label className="text-slate-200 font-medium">
                  {t('embedItem.titleLabel', { index: index + 1 })}
                </Label>
                <Button
                  onClick={() => removeEmbed(index)}
                  variant="outline"
                  size="sm"
                  className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white bg-transparent"
                >
                  {/* Translate Remove Button */}
                  {t('embedItem.removeButton')}
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1">
                    {/* Translate Title Label */}
                    <Label className="text-slate-300 text-sm">
                      {t('embedItem.fields.title')}
                    </Label>
                    <input
                      type="text"
                      // Translate Title Placeholder
                      placeholder={t('embedItem.fields.titlePlaceholder')}
                      value={embed.title || ''}
                      onChange={e =>
                        updateEmbed(index, {
                          ...embed,
                          title: e.target.value,
                        })
                      }
                      className="mt-1 w-full px-3 py-2 bg-slate-600/50 border border-slate-500 rounded-md text-white placeholder:text-slate-400 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    {/* Translate URL Label */}
                    <Label className="text-slate-300 text-sm">
                      {t('embedItem.fields.url')}
                    </Label>
                    <input
                      type="url"
                      // Translate URL Placeholder
                      placeholder={t('embedItem.fields.urlPlaceholder')}
                      value={embed.url || ''}
                      onChange={e =>
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
                  {/* Translate Description Label */}
                  <Label className="text-slate-300 text-sm">
                    {t('embedItem.fields.description')}
                  </Label>
                  <Textarea
                    // Translate Description Placeholder
                    placeholder={t('embedItem.fields.descriptionPlaceholder')}
                    value={embed.description || ''}
                    onChange={e =>
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
                  {/* Translate Color Label */}
                  <Label className="text-slate-300 text-sm">
                    {t('embedItem.fields.color')}
                  </Label>
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
                    className="mt-1 w-full h-10 bg-slate-600/50 border border-slate-500 rounded-md"
                  />
                </div>

                <div className="space-y-2">
                  {/* Translate Author Title */}
                  <Label className="text-slate-200 font-medium">
                    {t('embedItem.author.title')}
                  </Label>
                  <div className="flex items-center justify-between gap-2">
                    {embed.author?.name ? (
                      <div className="flex items-center gap-2 p-2 rounded-md bg-slate-700/50 border border-slate-600">
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={embed.author.icon_url || '/placeholder.svg'}
                          />
                          <AvatarFallback>
                            {embed.author.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-white font-medium">
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
                          className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                        >
                          <Users className="w-4 h-4 mr-2" />
                          {/* Translate Select Avatar Button */}
                          {t('embedItem.author.selectButton')}
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
                        {/* Translate Clear Author Button */}
                        {t('embedItem.author.clearButton')}
                      </Button>
                    )}
                  </div>
                  {/* Manual Author Input Fields (conditionally rendered) */}
                  {!embed.author?.name && (
                    <div className="space-y-2">
                      <div className="flex justify-between gap-2">
                        <div className="w-full">
                          {/* Translate Manual Name Label */}
                          <Label className="text-slate-300 text-sm">
                            {t('embedItem.author.manualName')}
                          </Label>
                          <input
                            type="text"
                            // Translate Manual Name Placeholder
                            placeholder={t(
                              'embedItem.author.manualNamePlaceholder'
                            )}
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
                            className="mt-1 w-full px-3 py-2 bg-slate-600/50 border border-slate-500 rounded-md text-white placeholder:text-slate-400 focus:border-purple-500 focus:outline-none"
                          />
                        </div>
                        <div className="w-full">
                          {/* Translate Manual Icon URL Label */}
                          <Label className="text-slate-300 text-sm">
                            {t('embedItem.author.manualIconUrl')}
                          </Label>
                          <input
                            type="url"
                            // Translate Manual Icon URL Placeholder
                            placeholder={t(
                              'embedItem.author.manualIconUrlPlaceholder'
                            )}
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
                            className="mt-1 w-full px-3 py-2 bg-slate-600/50 border border-slate-500 rounded-md text-white placeholder:text-slate-400 focus:border-purple-500 focus:outline-none"
                          />
                        </div>
                      </div>
                      {/* Translate Manual URL Label */}
                      <Label className="text-slate-300 text-sm">
                        {t('embedItem.author.manualUrl')}
                      </Label>
                      <input
                        type="url"
                        // Translate Manual URL Placeholder
                        placeholder={t('embedItem.author.manualUrlPlaceholder')}
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
                        className="mt-1 w-full px-3 py-2 bg-slate-600/50 border border-slate-500 rounded-md text-white placeholder:text-slate-400 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {/* Translate Fields Title */}
                  <Label className="text-slate-200 font-medium">
                    {t('embedItem.fieldBuilder.title')}
                  </Label>
                  <Button
                    onClick={() => addField(index)}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {/* Translate Add Field Button */}
                    {t('embedItem.fieldBuilder.addButton')}
                  </Button>
                  {embed.fields && embed.fields.length > 0 && (
                    <div className="space-y-3 mt-2">
                      {embed.fields.map((field, fieldIndex) => (
                        <div
                          key={fieldIndex}
                          className="p-3 rounded-md bg-slate-600/50 border border-slate-500"
                        >
                          <div className="flex items-center justify-between mb-2">
                            {/* Translate Field Label (e.g., "Field 1") */}
                            <Label className="text-slate-200 text-sm">
                              {t('embedItem.fieldBuilder.fieldLabel', {
                                index: fieldIndex + 1,
                              })}
                            </Label>
                            <Button
                              onClick={() => removeField(index, fieldIndex)}
                              variant="outline"
                              size="sm"
                              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white bg-transparent"
                            >
                              {/* Translate Remove Button */}
                              {t('embedItem.fieldBuilder.removeButton')}
                            </Button>
                          </div>
                          <div>
                            {/* Translate Field Name Label */}
                            <Label className="text-slate-300 text-sm">
                              {t('embedItem.fieldBuilder.name')}
                            </Label>
                            <input
                              type="text"
                              // Translate Field Name Placeholder
                              placeholder={t(
                                'embedItem.fieldBuilder.namePlaceholder'
                              )}
                              value={field.name}
                              onChange={e =>
                                updateField(index, fieldIndex, {
                                  ...field,
                                  name: e.target.value,
                                })
                              }
                              className="mt-1 w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-white placeholder:text-slate-400 focus:border-purple-500 focus:outline-none"
                            />
                          </div>
                          <div className="mt-2">
                            {/* Translate Field Value Label */}
                            <Label className="text-slate-300 text-sm">
                              {t('embedItem.fieldBuilder.value')}
                            </Label>
                            <Textarea
                              // Translate Field Value Placeholder
                              placeholder={t(
                                'embedItem.fieldBuilder.valuePlaceholder'
                              )}
                              value={field.value}
                              onChange={e =>
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
                              onCheckedChange={checked =>
                                updateField(index, fieldIndex, {
                                  ...field,
                                  inline: !!checked,
                                })
                              }
                              className="border-slate-500"
                            />
                            {/* Translate Inline Checkbox Label */}
                            <Label className="text-slate-300 text-sm">
                              {t('embedItem.fieldBuilder.inline')}
                            </Label>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 space-y-2">
                    {/* Translate Image Label */}
                    <Label className="text-slate-200 font-medium">
                      {t('embedItem.fields.image')}
                    </Label>
                    <input
                      type="url"
                      // Translate Image Placeholder
                      placeholder={t('embedItem.fields.imagePlaceholder')}
                      value={embed.image?.url || ''}
                      onChange={e =>
                        updateEmbed(index, {
                          ...embed,
                          image: { url: e.target.value },
                        })
                      }
                      className="mt-1 w-full px-3 py-2 bg-slate-600/50 border border-slate-500 rounded-md text-white placeholder:text-slate-400 focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    {/* Translate Thumbnail Label */}
                    <Label className="text-slate-200 font-medium">
                      {t('embedItem.fields.thumbnail')}
                    </Label>
                    <input
                      type="url"
                      // Translate Thumbnail Placeholder
                      placeholder={t('embedItem.fields.thumbnailPlaceholder')}
                      value={embed.thumbnail?.url || ''}
                      onChange={e =>
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
                  {/* Translate Footer Title */}
                  <Label className="text-slate-200 font-medium">
                    {t('embedItem.footer.title')}
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      {/* Translate Footer Text Label */}
                      <Label className="text-slate-300 text-sm">
                        {t('embedItem.footer.text')}
                      </Label>
                      <input
                        type="text"
                        // Translate Footer Text Placeholder
                        placeholder={t('embedItem.footer.textPlaceholder')}
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
                        className="mt-1 w-full px-3 py-2 bg-slate-600/50 border border-slate-500 rounded-md text-white placeholder:text-slate-400 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      {/* Translate Footer Icon URL Label */}
                      <Label className="text-slate-300 text-sm">
                        {t('embedItem.footer.iconUrl')}
                      </Label>
                      <input
                        type="url"
                        // Translate Footer Icon URL Placeholder
                        placeholder={t('embedItem.footer.iconUrlPlaceholder')}
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
                        className="mt-1 w-full px-3 py-2 bg-slate-600/50 border border-slate-500 rounded-md text-white placeholder:text-slate-400 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {/* Translate Timestamp Label */}
                  <Label className="text-slate-200 font-medium">
                    {t('embedItem.fields.timestamp')}
                  </Label>
                  <input
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
                    className="mt-1 w-full px-3 py-2 bg-slate-600/50 border border-slate-500 rounded-md text-white placeholder:text-slate-400 focus:border-purple-500 focus:outline-none"
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
