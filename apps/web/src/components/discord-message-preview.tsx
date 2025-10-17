/**
 * Discord Message Preview Component
 *
 * Renders a preview of how a Discord message will appear, including:
 * - Message content with markdown formatting
 * - User avatar and username
 * - Rich embeds with fields, images, and footers
 * - User mentions with resolved usernames
 *
 * Performance optimizations:
 * - Memoizes parsed content to avoid re-parsing on every render
 * - Pre-parses all embed content once and caches it
 * - Only re-parses when content or user data actually changes
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
import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { useQueries } from '@tanstack/react-query';
import { userQueries } from '@/lib/api/queries/user';
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
  // Memoize embed cloning to prevent unnecessary deep copies on every render
  const clonedEmbeds = useMemo(
    () => (embeds ? JSON.parse(JSON.stringify(embeds)) : []),
    [embeds]
  );

  // State for tracking user IDs found in mentions
  const [userIds, setUserIds] = useState<string[]>([]);

  // State for mapping user IDs to usernames (fetched from API)
  const [userMap, setUserMap] = useState<Map<string, string>>(new Map());

  /**
   * Effect: Extract all user IDs from mentions in content and embeds
   * Runs when content or embeds change
   */
  useEffect(() => {
    /**
     * Extracts user IDs from text containing <@123456789> mentions
     */
    const extractUserIds = (text: string) => {
      const ids: string[] = [];
      const userMentionRegex = /<@(\d+)>/g;
      let match;
      while ((match = userMentionRegex.exec(text)) !== null) {
        ids.push(match[1] as string);
      }
      return ids;
    };

    // Collect all user IDs from message content
    let allUserIds: string[] = [];
    if (content) {
      allUserIds = allUserIds.concat(extractUserIds(content));
    }

    // Collect user IDs from all embed fields
    if (embeds) {
      embeds.forEach(embed => {
        if (embed.description) {
          allUserIds = allUserIds.concat(extractUserIds(embed.description));
        }
        if (embed.fields) {
          embed.fields.forEach(field => {
            allUserIds = allUserIds.concat(extractUserIds(field.name));
            allUserIds = allUserIds.concat(extractUserIds(field.value));
          });
        }
        if (embed.footer?.text) {
          allUserIds = allUserIds.concat(extractUserIds(embed.footer.text));
        }
      });
    }

    // Remove duplicates
    const uniqueUserIds = Array.from(new Set(allUserIds));

    // Only update state if the user IDs have actually changed
    // This prevents infinite re-render loops
    if (
      uniqueUserIds.length !== userIds.length ||
      uniqueUserIds.some((id, index) => id !== userIds[index])
    ) {
      setUserIds(uniqueUserIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, embeds]);

  /**
   * Fetch user data for all mentioned user IDs
   * Uses React Query's useQueries to fetch multiple users in parallel
   */
  const userQueriesResults = useQueries({
    queries: userIds.map(id => ({
      queryKey: ['user', id],
      queryFn: () => userQueries.getCurrentUser(),
      staleTime: Infinity, // Cache user data indefinitely
      enabled: !!id, // Only fetch if ID exists
    })),
  });

  /**
   * Effect: Build a map of user IDs to usernames from query results
   * Updates when user queries complete or user IDs change
   */
  useEffect(() => {
    const newUserMap = new Map<string, string>();

    // Populate map with fetched usernames
    userQueriesResults.forEach((result, index) => {
      if (result.isSuccess && result.data) {
        newUserMap.set(userIds[index] as string, result.data.username);
      }
    });

    // Deep compare maps before setting state to prevent infinite loops
    // Only update if the map contents have actually changed
    let mapsEqual = userMap.size === newUserMap.size;
    if (mapsEqual) {
      for (const [key, value] of userMap.entries()) {
        if (newUserMap.get(key) !== value) {
          mapsEqual = false;
          break;
        }
      }
    }

    if (!mapsEqual) {
      setUserMap(newUserMap);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userQueriesResults, userIds]);

  /**
   * Memoize parsed message content
   * Only re-parse when content or userMap changes
   * This prevents expensive markdown parsing on every render
   */
  const parsedContent = useMemo(
    () => (content ? parseDiscordMarkdown(content, userMap) : null),
    [content, userMap]
  );

  /**
   * Memoize parsed embeds
   * Pre-parse all embed content (description, fields, footer) once
   * Only re-parse when embeds or userMap changes
   * This is a major performance optimization for messages with multiple embeds
   */
  const parsedEmbeds = useMemo(() => {
    if (!clonedEmbeds || clonedEmbeds.length === 0) return [];

    return clonedEmbeds.map((embed: DiscordEmbed) => {
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
  }, [clonedEmbeds, userMap]);

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
