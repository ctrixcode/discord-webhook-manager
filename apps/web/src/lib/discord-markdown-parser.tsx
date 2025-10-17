import React, { type ReactNode } from 'react';

interface Pattern {
  regex: RegExp;
  render: (args: string[], userMap: Map<string, string>) => ReactNode;
}

// Discord markdown patterns defined once outside the function for better performance
const patterns: Pattern[] = [
  {
    regex: /<@(\d+)>/g,
    render: (args: string[], userMap: Map<string, string>) => {
      const userId = args[0] as string;
      return (
        <span className="text-[#00aff4] bg-[#5865f2]/20 rounded px-1 py-0.5 font-medium">
          @{userMap.get(userId) || 'user'}
        </span>
      );
    },
  },
  {
    regex: /<#(\d+)>/g,
    render: () => (
      <span className="text-[#00aff4] bg-[#5865f2]/20 rounded px-1 py-0.5 font-medium">
        #channel
      </span>
    ),
  },
  {
    regex: /<@&(\d+)>/g,
    render: () => (
      <span className="text-[#00aff4] bg-[#5865f2]/20 rounded px-1 py-0.5 font-medium">
        @role
      </span>
    ),
  },
  {
    regex: /@everyone/g,
    render: () => (
      <span className="text-[#00aff4] bg-[#5865f2]/20 rounded px-1 py-0.5 font-medium">
        @everyone
      </span>
    ),
  },
  {
    regex: /@here/g,
    render: () => (
      <span className="text-[#00aff4] bg-[#5865f2]/20 rounded px-1 py-0.5 font-medium">
        @here
      </span>
    ),
  },
  {
    regex: /\[(.*?)\]\((.*?)\)/g,
    render: (args: string[]) => {
      const [linkText, url] = args;
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#00aff4] hover:underline"
        >
          {linkText}
        </a>
      );
    },
  },
  {
    regex: /\*\*\*(.*?)\*\*\*/g,
    render: (args: string[]) => {
      const match = args[0];
      return (
        <strong>
          <em>{match}</em>
        </strong>
      );
    },
  },
  {
    regex: /\*\*(.*?)\*\*/g,
    render: (args: string[]) => {
      const match = args[0];
      return <strong>{match}</strong>;
    },
  },
  {
    regex: /\*(.*?)\*/g,
    render: (args: string[]) => {
      const match = args[0];
      return <em>{match}</em>;
    },
  },
  {
    regex: /__(.*?)__/g,
    render: (args: string[]) => {
      const match = args[0];
      return <u>{match}</u>;
    },
  },
  {
    regex: /~~(.*?)~~/g,
    render: (args: string[]) => {
      const match = args[0];
      return <s>{match}</s>;
    },
  },
  {
    regex: /`(.*?)`/g,
    render: (args: string[]) => {
      const match = args[0];
      return (
        <code className="bg-[#202225] px-1 py-0.5 rounded text-[#f8f8ff] text-xs">
          {match}
        </code>
      );
    },
  },
  {
    regex: /\|\|(.*?)\|\|/g,
    render: (args: string[]) => {
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
  },
];

export function parseDiscordMarkdown(
  text: string,
  userMap: Map<string, string>
): ReactNode[] {
  if (!text) return [];

  // Split text into lines to handle lists
  const lines = text.split('\n');
  const result: ReactNode[] = [];

  lines.forEach((line, lineIndex) => {
    // Check if line is a list item (starts with - or * followed by space)
    const listMatch = line.match(/^(\s*)([-*])\s+(.+)$/);

    if (listMatch) {
      const indent = listMatch[1] || '';
      const content = listMatch[3] || '';
      const parsedContent = parseLineMarkdown(content, userMap);

      result.push(
        <div
          key={`line-${lineIndex}`}
          style={{ paddingLeft: `${indent.length * 8}px` }}
        >
          <span className="mr-2">•</span>
          {parsedContent}
        </div>
      );
    } else {
      // Regular line - parse markdown
      const parsedLine = parseLineMarkdown(line, userMap);
      result.push(
        <React.Fragment key={`line-${lineIndex}`}>
          {parsedLine}
          {lineIndex < lines.length - 1 && '\n'}
        </React.Fragment>
      );
    }
  });

  return result;
}

function parseLineMarkdown(
  text: string,
  userMap: Map<string, string>
): ReactNode[] {
  if (!text) return [];

  const replacements: { start: number; end: number; element: ReactNode }[] = [];

  // Find all matches
  patterns.forEach(pattern => {
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
    let match;

    while ((match = regex.exec(text)) !== null) {
      const args = match.slice(1) as string[];
      replacements.push({
        start: match.index,
        end: match.index + match[0].length,
        element: pattern.render(args, userMap),
      });
    }
  });

  // Early return if no matches found
  if (replacements.length === 0) {
    return [text];
  }

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
  const parts: ReactNode[] = [];
  let textIndex = 0;

  validReplacements.forEach((replacement, index) => {
    // Add text before the replacement
    if (replacement.start > textIndex) {
      parts.push(text.slice(textIndex, replacement.start));
    }
    // Add the replacement element
    parts.push(<span key={index}>{replacement.element}</span>);
    textIndex = replacement.end;
  });

  // Add remaining text
  if (textIndex < text.length) {
    parts.push(text.slice(textIndex));
  }

  return parts;
}
