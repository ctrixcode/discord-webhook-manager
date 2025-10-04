'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IAvatar } from '@/lib/api/types/avatar';
import { type DiscordEmbed } from '@/lib/api/types/discord';
import { discordColorToHex } from '@/lib/discord-utils';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useQueries } from '@tanstack/react-query';
import { userQueries } from '@/lib/api/queries/user';
import { parseDiscordMarkdown } from '@/lib/discord-markdown-parser';

interface DiscordMessagePreviewProps {
  content: string;
  embeds?: DiscordEmbed[];
  avatar?: IAvatar;
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
  const clonedEmbeds = embeds ? JSON.parse(JSON.stringify(embeds)) : [];
  const [userIds, setUserIds] = useState<string[]>([]);
  const [userMap, setUserMap] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const extractUserIds = (text: string) => {
      const ids: string[] = [];
      const userMentionRegex = /<@(\d+)>/g;
      let match;
      while ((match = userMentionRegex.exec(text)) !== null) {
        ids.push(match[1]);
      }
      return ids;
    };

    let allUserIds: string[] = [];
    if (content) {
      allUserIds = allUserIds.concat(extractUserIds(content));
    }

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

    const uniqueUserIds = Array.from(new Set(allUserIds));

    // Only update if the userIds have actually changed to prevent infinite loops
    if (
      uniqueUserIds.length !== userIds.length ||
      uniqueUserIds.some((id, index) => id !== userIds[index])
    ) {
      setUserIds(uniqueUserIds);
    }
  }, [content, embeds]);

  const userQueriesResults = useQueries({
    queries: userIds.map(id => ({
      queryKey: ['user', id],
      queryFn: () => userQueries.getCurrentUser(),
      staleTime: Infinity,
      enabled: !!id,
    })),
  });

  useEffect(() => {
    const newUserMap = new Map<string, string>();
    userQueriesResults.forEach((result, index) => {
      if (result.isSuccess && result.data) {
        newUserMap.set(userIds[index], result.data.username);
      }
    });

    // Deep compare maps before setting state to prevent infinite loops
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
  }, [userQueriesResults, userIds, userMap]);

  return (
    <div className="bg-[#313338] text-white p-4 rounded-lg font-sans text-[15px] leading-[1.375]">
      <div className="flex items-start gap-4">
        <Avatar className="w-10 h-10 mt-0.5 flex-shrink-0">
          <AvatarImage src={avatar.avatar_url || '/placeholder.svg'} />
          <AvatarFallback className="bg-[#5865f2] text-white text-sm font-medium">
            {avatar.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
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

          {content && (
            <div className="text-[#dbdee1] mb-2 whitespace-pre-wrap break-words leading-[1.375]">
              {parseDiscordMarkdown(content, userMap)}
            </div>
          )}

          {clonedEmbeds &&
            clonedEmbeds.map((embed: DiscordEmbed, index: number) => (
              <div key={index} className="max-w-lg mt-2">
                <div className="flex">
                  <div
                    className="bg-[#2b2d31] rounded-r-md rounded-l-sm p-4 flex-1 border-l-4"
                    style={{
                      borderLeftColor: embed.color
                        ? discordColorToHex(embed.color)
                        : 'transparent',
                    }}
                  >
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
                        {embed.description && (
                          <div className="text-[#dbdee1] mb-3 whitespace-pre-wrap text-sm leading-[1.375]">
                            {parseDiscordMarkdown(embed.description, userMap)}
                          </div>
                        )}

                        {embed.fields && embed.fields.length > 0 && (
                          <div
                            className="grid gap-2 mb-3"
                            style={{
                              gridTemplateColumns: embed.fields.some(
                                f => f.inline
                              )
                                ? 'repeat(3, 1fr)'
                                : '1fr',
                            }}
                          >
                            {embed.fields.map((field, fieldIndex) => (
                              <div
                                key={fieldIndex}
                                className={field.inline ? '' : 'col-span-full'}
                              >
                                <div className="text-white font-semibold text-sm mb-1">
                                  {parseDiscordMarkdown(field.name, userMap)}
                                </div>
                                <div className="text-[#dbdee1] text-sm whitespace-pre-wrap">
                                  {parseDiscordMarkdown(field.value, userMap)}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

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
                          {parseDiscordMarkdown(embed.footer.text, userMap)}
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
            ))}
        </div>
      </div>
    </div>
  );
}
