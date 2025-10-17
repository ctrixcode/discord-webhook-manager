/**
 * Discord Message Preview Component
 *
 * Renders a preview of how a Discord message will appear, including:
 * - Message content with markdown formatting
 * - User avatar and username
 * - Rich embeds with fields, images, and footers
 * - User mentions (displayed as @user)
 *
 * Performance optimizations:
 * - Memoizes parsed content to avoid re-parsing on every render
 * - Pre-parses all embed content once and caches it
 * - Only re-parses when content actually changes
 */

'use client';
import {
  Avatar as AvatarComponent,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Avatar } from '@repo/shared-types';
import { type DiscordEmbed } from '@repo/shared-types';
import { discordColorToHex } from '@/lib/discord-utils';
import React, { useMemo } from 'react';
import Image from 'next/image';
import { parseDiscordMarkdown } from '@/lib/discord-markdown-parser';

interface DiscordMessagePreviewProps {
  content: string;
  embeds?: DiscordEmbed[];
  avatar?: Avatar;
}

export function DiscordMessagePreview({
  content,
  embeds,
  avatar = {
    username: 'Webhook Manager',
    avatar_url: '/placeholder.svg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    id: 'predefined-avatar-id',
    user_id: 'predefined-user-id',
  },
}: DiscordMessagePreviewProps) {
  // Empty user map - all mentions will display as @user
  const userMap = useMemo(() => new Map<string, string>(), []);

  /**
   * Memoize parsed message content
   * Only re-parse when content changes
   * This prevents expensive markdown parsing on every render
   */
  const parsedContent = useMemo(
    () => (content ? parseDiscordMarkdown(content, userMap) : null),
    [content, userMap]
  );

  /**
   * Memoize parsed embeds
   * Pre-parse all embed content (description, fields, footer) once
   * Only re-parse when embeds change
   * This is a major performance optimization for messages with multiple embeds
   */
  const parsedEmbeds = useMemo(() => {
    if (!embeds || embeds.length === 0) return [];

    return embeds.map((embed: DiscordEmbed) => {
      // Parse embed description
      const parsedDescription = embed.description
        ? parseDiscordMarkdown(embed.description, userMap)
        : null;

      // Parse all embed fields (name and value)
      const parsedFields = embed.fields?.map(
        (field: { name: string; value: string; inline?: boolean }) => ({
          ...field,
          parsedName: parseDiscordMarkdown(field.name, userMap),
          parsedValue: parseDiscordMarkdown(field.value, userMap),
        })
      );

      // Parse embed footer text
      const parsedFooter = embed.footer?.text
        ? parseDiscordMarkdown(embed.footer.text, userMap)
        : null;

      return {
        ...embed,
        parsedDescription,
        parsedFields,
        parsedFooter,
      };
    });
  }, [embeds, userMap]);

  return (
    <div className="bg-[#313338] text-white p-4 rounded-lg font-sans text-[15px] leading-[1.375]">
      <div className="flex items-start gap-4">
        {/* User Avatar */}
        <AvatarComponent className="w-10 h-10 mt-0.5 flex-shrink-0">
          <AvatarImage src={avatar.avatar_url || '/placeholder.svg'} />
          <AvatarFallback className="bg-[#5865f2] text-white text-sm font-medium">
            {avatar.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </AvatarComponent>

        <div className="flex-1 min-w-0">
          {/* Message Header: Username and Timestamp */}
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="font-medium text-[#f2f3f5] text-base hover:underline cursor-pointer">
              {avatar.username}
            </span>
            <span className="text-xs text-[#949ba4] font-medium">
              Today at{' '}
              {new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          {/* Message Content with parsed markdown */}
          {parsedContent && (
            <div className="text-[#dbdee1] mb-2 whitespace-pre-wrap break-words leading-[1.375]">
              {parsedContent}
            </div>
          )}

          {/* Rich Embeds - render each embed with all its components */}
          {parsedEmbeds.map(
            (
              embed: DiscordEmbed & {
                parsedDescription: React.ReactNode[] | null;
                parsedFields?: Array<{
                  name: string;
                  value: string;
                  inline?: boolean;
                  parsedName: React.ReactNode[];
                  parsedValue: React.ReactNode[];
                }>;
                parsedFooter: React.ReactNode[] | null;
              },
              index: number
            ) => (
              <div key={index} className="max-w-lg mt-2">
                <div className="flex">
                  {/* Embed container with colored left border */}
                  <div
                    className="bg-[#2b2d31] rounded-r-md rounded-l-sm p-4 flex-1 border-l-4"
                    style={{
                      borderLeftColor: embed.color
                        ? discordColorToHex(embed.color)
                        : 'transparent',
                    }}
                  >
                    {/* Embed Author (optional) */}
                    {embed.author && (
                      <div className="flex items-center gap-2 mb-2">
                        {embed.author.icon_url && (
                          <Image
                            src={embed.author.icon_url || '/placeholder.svg'}
                            alt=""
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        )}
                        <span className="text-sm font-medium text-[#f2f3f5]">
                          {embed.author.url ? (
                            <a
                              href={embed.author.url}
                              className="text-[#00aff4] hover:underline"
                            >
                              {embed.author.name}
                            </a>
                          ) : (
                            embed.author.name
                          )}
                        </span>
                      </div>
                    )}

                    {/* Embed Title (optional) */}
                    {embed.title && (
                      <div className="text-[#00aff4] font-semibold mb-2 text-base leading-[1.375]">
                        {embed.url ? (
                          <a href={embed.url} className="hover:underline">
                            {embed.title}
                          </a>
                        ) : (
                          embed.title
                        )}
                      </div>
                    )}

                    <div className="flex">
                      <div className="flex-1 mr-4">
                        {/* Embed Description (optional) */}
                        {embed.parsedDescription && (
                          <div className="text-[#dbdee1] mb-3 whitespace-pre-wrap text-sm leading-[1.375]">
                            {embed.parsedDescription}
                          </div>
                        )}

                        {/* Embed Fields (optional) - can be inline or full-width */}
                        {embed.parsedFields &&
                          embed.parsedFields.length > 0 && (
                            <div
                              className="grid gap-2 mb-3"
                              style={{
                                // Use 3-column grid if any field is inline, otherwise single column
                                gridTemplateColumns: embed.parsedFields.some(
                                  (f: { inline?: boolean }) => f.inline
                                )
                                  ? 'repeat(3, 1fr)'
                                  : '1fr',
                              }}
                            >
                              {embed.parsedFields.map(
                                (
                                  field: {
                                    name: string;
                                    value: string;
                                    inline?: boolean;
                                    parsedName: React.ReactNode[];
                                    parsedValue: React.ReactNode[];
                                  },
                                  fieldIndex: number
                                ) => (
                                  <div
                                    key={fieldIndex}
                                    className={
                                      // Non-inline fields span all columns
                                      field.inline ? '' : 'col-span-full'
                                    }
                                  >
                                    <div className="text-white font-semibold text-sm mb-1">
                                      {field.parsedName}
                                    </div>
                                    <div className="text-[#dbdee1] text-sm whitespace-pre-wrap">
                                      {field.parsedValue}
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                      </div>

                      {/* Embed Thumbnail (optional) - appears on the right */}
                      {embed.thumbnail && (
                        <div className="flex-shrink-0">
                          <Image
                            src={embed.thumbnail.url || '/placeholder.svg'}
                            alt=""
                            width={80}
                            height={80}
                            className="rounded"
                          />
                        </div>
                      )}
                    </div>

                    {/* Embed Image (optional) - large image below content */}
                    {embed.image && (
                      <div className="mb-3 w-2/3 h-48 relative">
                        <Image
                          src={embed.image.url || '/placeholder.svg'}
                          alt="embed image"
                          fill
                          className=""
                        />
                      </div>
                    )}

                    {/* Embed Footer (optional) - appears at bottom with timestamp */}
                    {embed.footer && (
                      <div className="flex items-center gap-2 mt-3 pt-0">
                        {embed.footer.icon_url && (
                          <Image
                            src={embed.footer.icon_url || '/placeholder.svg'}
                            alt="embed footer icon"
                            width={20}
                            height={20}
                            className="rounded-full"
                          />
                        )}
                        <span className="text-xs text-[#949ba4] font-medium">
                          {embed.parsedFooter}
                          {embed.timestamp && (
                            <>
                              {' '}
                              • {new Date(embed.timestamp).toLocaleDateString()}
                            </>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
