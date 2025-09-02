import React, { type ReactNode } from 'react';

type RenderFunction = (...args: string[]) => ReactNode;

interface Pattern {
  regex: RegExp;
  render: RenderFunction;
}

export function parseDiscordMarkdown(text: string, userMap: Map<string, string>): ReactNode[] {
  if (!text) return [];

  const parts: ReactNode[] = [];

  // Discord markdown patterns in order of precedence
  const patterns: Pattern[] = [
    {
      regex: /<@(\d+)>/g, // Matches <@ followed by digits followed by >
      render: (...args: string[]) => {
        const userId = args[0];
        return (
          <span className="text-[#00aff4] bg-[#5865f2]/20 rounded px-1 py-0.5 font-medium">
            @{userMap.get(userId) || 'user'}
          </span>
        );
      },
    }, // User mention
    {
      regex: /<#(\d+)>/g, // Matches <# followed by digits followed by >
      render: (...args: string[]) => {
        // const channelId = args[0]; // Not used for now
        return (
          <span className="text-[#00aff4] bg-[#5865f2]/20 rounded px-1 py-0.5 font-medium">
            #channel
          </span>
        );
      },
    }, // Channel mention
    {
      regex: /<@&(\d+)>/g, // Matches <@& followed by digits followed by >
      render: (...args: string[]) => {
        // const roleId = args[0]; // Not used for now
        return (
          <span className="text-[#00aff4] bg-[#5865f2]/20 rounded px-1 py-0.5 font-medium">
            @role
          </span>
        );
      },
    }, // Role mention
    {
      regex: /@everyone/g, // Matches @everyone
      render: (...args: string[]) => (
        <span className="text-[#00aff4] bg-[#5865f2]/20 rounded px-1 py-0.5 font-medium">
          @everyone
        </span>
      ),
    }, // @everyone mention
    {
      regex: /@here/g, // Matches @here
      render: (...args: string[]) => (
        <span className="text-[#00aff4] bg-[#5865f2]/20 rounded px-1 py-0.5 font-medium">
          @here
        </span>
      ),
    }, // @here mention
    {
      regex: /\[(.*?)\]\((.*?)\)/g, // Matches [link text](URL)
      render: (...args: string[]) => {
        const [linkText, url] = args;
        return (
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-[#00aff4] hover:underline">
            {linkText}
          </a>
        );
      },
    }, // Link
    {
      regex: /\*\*\*(.*?)\*\*\*/g,
      render: (...args: string[]) => {
        const match = args[0];
        return (
          <strong>
            <em>{match}</em>
          </strong>
        );
      },
    }, // ***bold italic***
    {
      regex: /\*\*(.*?)\*\*/g,
      render: (...args: string[]) => {
        const match = args[0];
        return <strong>{match}</strong>;
      },
    }, // **bold**
    { regex: /\*(.*?)\*/g, render: (...args: string[]) => {
      const match = args[0];
      return <em>{match}</em>;
    } }, // *italic*
    { regex: /__(.*?)__/g, render: (...args: string[]) => {
      const match = args[0];
      return <u>{match}</u>;
    } }, // __underline__
    { regex: /~~(.*?)~~/g, render: (...args: string[]) => {
      const match = args[0];
      return <s>{match}</s>;
    } }, // ~~strikethrough~~
    {
      regex: /`(.*?)`/g,
      render: (...args: string[]) => {
        const match = args[0];
        return (
          <code className="bg-[#202225] px-1 py-0.5 rounded text-[#f8f8ff] text-xs">
            {match}
          </code>
        );
      },
    }, // `code`
    {
      regex: /\|\|(.*?)\|\|/g,
      render: (...args: string[]) => {
        const match = args[0];
        return (
          <span
            className="bg-[#202225] text-[#202225] hover:text-[#dcddde] cursor-pointer rounded px-1"
            title="Spoiler - click to reveal"
          >
            {match}
          </span>
        );
      },
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
        element: pattern.render(...(match.slice(1) as string[])),
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

  return parts;
}