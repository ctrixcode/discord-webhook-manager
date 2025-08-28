'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PredefinedAvatar } from '@/lib/api/types/avatar';
import { type DiscordEmbed } from '@/lib/api/types/discord';
import { discordColorToHex } from '@/lib/discord-utils';
import type { ReactNode } from 'react';

interface DiscordMessagePreviewProps {
  content: string;
  embeds?: DiscordEmbed[];
  avatar?: PredefinedAvatar
}

function parseDiscordMarkdown(text: string): ReactNode[] {
  if (!text) return [];

  const parts: ReactNode[] = [];

  // Discord markdown patterns in order of precedence
  const patterns = [
    {
      regex: /\*\*\*(.*?)\*\*\*/g,
      render: (match: string) => (
        <strong>
          <em>{match}</em>
        </strong>
      ),
    }, // ***bold italic***
    {
      regex: /\*\*(.*?)\*\*/g,
      render: (match: string) => <strong>{match}</strong>,
    }, // **bold**
    { regex: /\*(.*?)\*/g, render: (match: string) => <em>{match}</em> }, // *italic*
    { regex: /__(.*?)__/g, render: (match: string) => <u>{match}</u> }, // __underline__
    { regex: /~~(.*?)~~/g, render: (match: string) => <s>{match}</s> }, // ~~strikethrough~~
    {
      regex: /`(.*?)`/g,
      render: (match: string) => (
        <code className="bg-[#202225] px-1 py-0.5 rounded text-[#f8f8ff] text-xs">
          {match}
        </code>
      ),
    }, // `code`
    {
      regex: /\|\|(.*?)\|\|/g,
      render: (match: string) => (
        <span
          className="bg-[#202225] text-[#202225] hover:text-[#dcddde] cursor-pointer rounded px-1"
          title="Spoiler - click to reveal"
        >
          {match}
        </span>
      ),
    }, // ||spoiler||
  ];

  const workingText = text;
  const replacements: { start: number; end: number; element: ReactNode }[] = [];

  // Find all matches
  patterns.forEach((pattern) => {
    let match;
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
    while ((match = regex.exec(workingText)) !== null) {
      replacements.push({
        start: match.index,
        end: match.index + match[0].length,
        element: pattern.render(match[1]),
      });
    }
  });

  // Sort by position and remove overlapping matches
  replacements.sort((a, b) => a.start - b.start);
  const validReplacements = [];
  let lastEnd = 0;

  for (const replacement of replacements) {
    if (replacement.start >= lastEnd) {
      validReplacements.push(replacement);
      lastEnd = replacement.end;
    }
  }

  // Build the result
  let textIndex = 0;
  validReplacements.forEach((replacement, index) => {
    // Add text before the replacement
    if (replacement.start > textIndex) {
      parts.push(workingText.slice(textIndex, replacement.start));
    }
    // Add the replacement element
    parts.push(<span key={index}>{replacement.element}</span>);
    textIndex = replacement.end;
  });

  // Add remaining text
  if (textIndex < workingText.length) {
    parts.push(workingText.slice(textIndex));
  }

  return parts.length > 0 ? parts : [text];
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
  }
}: DiscordMessagePreviewProps) {
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
              {parseDiscordMarkdown(content)}
            </div>
          )}

          {embeds &&
            embeds.map((embed, index) => (
              <div key={index} className="max-w-lg mt-2">
                <div className="flex">
                  {embed.color && (
                    <div
                      className="w-1 rounded-l-md mr-3 flex-shrink-0"
                      style={{
                        backgroundColor: discordColorToHex(embed.color),
                      }}
                    />
                  )}
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
                          <img
                            src={embed.author.icon_url || '/placeholder.svg'}
                            alt=""
                            className="w-6 h-6 rounded-full"
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

                    {embed.description && (
                      <div className="text-[#dbdee1] mb-3 whitespace-pre-wrap text-sm leading-[1.375]">
                        {parseDiscordMarkdown(embed.description)}
                      </div>
                    )}

                    {embed.fields && embed.fields.length > 0 && (
                      <div
                        className="grid gap-2 mb-3"
                        style={{
                          gridTemplateColumns: embed.fields.some(
                            (f) => f.inline,
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
                              {parseDiscordMarkdown(field.name)}
                            </div>
                            <div className="text-[#dbdee1] text-sm whitespace-pre-wrap">
                              {parseDiscordMarkdown(field.value)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {embed.image && (
                      <div className="mb-3">
                        <img
                          src={embed.image.url || '/placeholder.svg'}
                          alt=""
                          className="max-w-full rounded"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      {embed.thumbnail && (
                        <img
                          src={embed.thumbnail.url || '/placeholder.svg'}
                          alt=""
                          className="w-20 h-20 rounded ml-auto"
                        />
                      )}
                    </div>

                    {embed.footer && (
                      <div className="flex items-center gap-2 mt-3 pt-0">
                        {embed.footer.icon_url && (
                          <img
                            src={embed.footer.icon_url || '/placeholder.svg'}
                            alt=""
                            className="w-5 h-5 rounded-full"
                          />
                        )}
                        <span className="text-xs text-[#949ba4] font-medium">
                          {parseDiscordMarkdown(embed.footer.text)}
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
