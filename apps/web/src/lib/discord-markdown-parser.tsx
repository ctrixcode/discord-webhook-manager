/**
 * Discord Markdown Parser
 *
 * This module parses Discord-flavored markdown and converts it to React elements.
 * It supports all standard Discord formatting including mentions, text styling,
 * code blocks, lists, and more.
 */

import React, { type ReactNode } from 'react';

/**
 * Pattern interface for markdown regex patterns
 * Each pattern has a regex to match and a render function to convert matches to React elements
 */
interface Pattern {
  regex: RegExp;
  render: (args: string[], userMap: Map<string, string>) => ReactNode;
}

/**
 * Discord markdown patterns defined once outside the function for better performance.
 * These patterns are processed in order, and overlapping matches are resolved by position.
 */
const patterns: Pattern[] = [
  {
    // User mentions: <@123456789> -> @username
    // Matches: <@ followed by one or more digits followed by >
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
    // Channel mentions: <#123456789> -> #channel
    // Matches: <# followed by one or more digits followed by >
    regex: /<#(\d+)>/g,
    render: () => (
      <span className="text-[#00aff4] bg-[#5865f2]/20 rounded px-1 py-0.5 font-medium">
        #channel
      </span>
    ),
  },
  {
    // Role mentions: <@&123456789> -> @role
    // Matches: <@& followed by one or more digits followed by >
    regex: /<@&(\d+)>/g,
    render: () => (
      <span className="text-[#00aff4] bg-[#5865f2]/20 rounded px-1 py-0.5 font-medium">
        @role
      </span>
    ),
  },
  {
    // Everyone mention: @everyone
    // Matches: literal @everyone text
    regex: /@everyone/g,
    render: () => (
      <span className="text-[#00aff4] bg-[#5865f2]/20 rounded px-1 py-0.5 font-medium">
        @everyone
      </span>
    ),
  },
  {
    // Here mention: @here
    // Matches: literal @here text
    regex: /@here/g,
    render: () => (
      <span className="text-[#00aff4] bg-[#5865f2]/20 rounded px-1 py-0.5 font-medium">
        @here
      </span>
    ),
  },
  {
    // Markdown links: [text](url) -> clickable link
    // Matches: [any text](any text)
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
    // Bold + Italic: ***text*** -> bold and italic
    // Matches: *** followed by any text followed by ***
    // Must be checked before ** and * patterns to avoid conflicts
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
    // Bold: **text** -> bold
    // Matches: ** followed by any text followed by **
    regex: /\*\*(.*?)\*\*/g,
    render: (args: string[]) => {
      const match = args[0];
      return <strong>{match}</strong>;
    },
  },
  {
    // Italic: *text* or _text_ -> italic
    // Matches: * followed by any text followed by *
    regex: /\*(.*?)\*/g,
    render: (args: string[]) => {
      const match = args[0];
      return <em>{match}</em>;
    },
  },
  {
    // Underline: __text__ -> underlined
    // Matches: __ followed by any text followed by __
    regex: /__(.*?)__/g,
    render: (args: string[]) => {
      const match = args[0];
      return <u>{match}</u>;
    },
  },
  {
    // Strikethrough: ~~text~~ -> strikethrough
    // Matches: ~~ followed by any text followed by ~~
    regex: /~~(.*?)~~/g,
    render: (args: string[]) => {
      const match = args[0];
      return <s>{match}</s>;
    },
  },
  {
    // Inline code: `code` -> monospace code
    // Matches: ` followed by any text followed by `
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
    // Spoiler: ||text|| -> hidden text (click to reveal)
    // Matches: || followed by any text followed by ||
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

/**
 * Main parsing function that converts Discord markdown text to React elements
 *
 * @param text - The raw text containing Discord markdown
 * @param userMap - Map of user IDs to usernames for rendering mentions
 * @returns Array of React nodes representing the parsed content
 *
 * Processing order:
 * 1. Multi-line code blocks (```code```) - processed first to avoid conflicts
 * 2. Lists (- item or * item)
 * 3. Inline markdown (bold, italic, mentions, etc.)
 */
export function parseDiscordMarkdown(
  text: string,
  userMap: Map<string, string>
): ReactNode[] {
  if (!text) return [];

  // Multi-line code blocks: ```language\ncode\n``` or ```code```
  // Matches: ``` followed by optional language, optional newline, any content, then ```
  // Uses [\s\S]*? to match any character including newlines (non-greedy)
  const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
  const codeBlocks: { start: number; end: number; element: ReactNode }[] = [];
  let match;

  // Find all code blocks in the text
  while ((match = codeBlockRegex.exec(text)) !== null) {
    const code = match[2] || '';
    codeBlocks.push({
      start: match.index,
      end: match.index + match[0].length,
      element: (
        <pre className="bg-[#2b2d31] border border-[#1e1f22] rounded p-2 my-1 overflow-x-auto">
          <code className="text-[#f8f8ff] text-sm font-mono block whitespace-pre">
            {code}
          </code>
        </pre>
      ),
    });
  }

  // If there are code blocks, split text around them and process separately
  if (codeBlocks.length > 0) {
    const result: ReactNode[] = [];
    let lastIndex = 0;

    codeBlocks.forEach((block, index) => {
      // Process text before this code block
      if (block.start > lastIndex) {
        const textBefore = text.slice(lastIndex, block.start);
        result.push(
          <React.Fragment key={`text-${index}`}>
            {parseTextWithoutCodeBlocks(textBefore, userMap)}
          </React.Fragment>
        );
      }
      // Add the code block element
      result.push(
        <React.Fragment key={`code-${index}`}>{block.element}</React.Fragment>
      );
      lastIndex = block.end;
    });

    // Process any remaining text after the last code block
    if (lastIndex < text.length) {
      const textAfter = text.slice(lastIndex);
      result.push(
        <React.Fragment key="text-end">
          {parseTextWithoutCodeBlocks(textAfter, userMap)}
        </React.Fragment>
      );
    }

    return result;
  }

  // No code blocks found, process the entire text normally
  return parseTextWithoutCodeBlocks(text, userMap);
}

/**
 * Parses text that doesn't contain multi-line code blocks
 * Handles lists and inline markdown formatting
 *
 * @param text - Text without code blocks
 * @param userMap - Map of user IDs to usernames
 * @returns Array of React nodes
 */
function parseTextWithoutCodeBlocks(
  text: string,
  userMap: Map<string, string>
): ReactNode[] {
  if (!text) return [];

  // Split text into lines to handle lists
  const lines = text.split('\n');
  const result: ReactNode[] = [];

  lines.forEach((line, lineIndex) => {
    // List item pattern: optional whitespace, then - or *, then space, then content
    // Matches: "- item", "* item", "  - nested item", etc.
    // Groups: (whitespace)(- or *)(content)
    const listMatch = line.match(/^(\s*)([-*])\s+(.+)$/);

    if (listMatch) {
      // This is a list item
      const indent = listMatch[1] || ''; // Leading whitespace for nested lists
      const content = listMatch[3] || ''; // The actual list item text
      const parsedContent = parseLineMarkdown(content, userMap);

      result.push(
        <div
          key={`line-${lineIndex}`}
          style={{ paddingLeft: `${indent.length * 8}px` }} // 8px per space for indentation
        >
          <span className="mr-2">•</span>
          {parsedContent}
        </div>
      );
    } else {
      // Regular line - parse inline markdown
      const parsedLine = parseLineMarkdown(line, userMap);
      result.push(
        <React.Fragment key={`line-${lineIndex}`}>
          {parsedLine}
          {lineIndex < lines.length - 1 && '\n'}{' '}
          {/* Add newline between lines */}
        </React.Fragment>
      );
    }
  });

  return result;
}

/**
 * Parses inline markdown within a single line of text
 * Handles all inline formatting like bold, italic, mentions, etc.
 *
 * @param text - A single line of text to parse
 * @param userMap - Map of user IDs to usernames
 * @returns Array of React nodes with formatted elements
 *
 * Algorithm:
 * 1. Find all pattern matches in the text
 * 2. Sort matches by position
 * 3. Remove overlapping matches (first match wins)
 * 4. Build result by interleaving plain text and formatted elements
 */
function parseLineMarkdown(
  text: string,
  userMap: Map<string, string>
): ReactNode[] {
  if (!text) return [];

  const replacements: { start: number; end: number; element: ReactNode }[] = [];

  // Find all pattern matches in the text
  patterns.forEach(pattern => {
    // Create a new regex instance to reset the lastIndex
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
    let match;

    // Find all matches for this pattern
    while ((match = regex.exec(text)) !== null) {
      // Extract captured groups (everything except the full match)
      const args = match.slice(1) as string[];
      replacements.push({
        start: match.index,
        end: match.index + match[0].length,
        element: pattern.render(args, userMap),
      });
    }
  });

  // Early return if no markdown found
  if (replacements.length === 0) {
    return [text];
  }

  // Sort replacements by their position in the text
  replacements.sort((a, b) => a.start - b.start);

  // Remove overlapping matches - if two patterns match the same text,
  // keep the first one (by position) and discard overlapping ones
  const validReplacements = [];
  let lastEnd = 0;

  for (const replacement of replacements) {
    if (replacement.start >= lastEnd) {
      validReplacements.push(replacement);
      lastEnd = replacement.end;
    }
  }

  // Build the final result by combining plain text and formatted elements
  const parts: ReactNode[] = [];
  let textIndex = 0;

  validReplacements.forEach((replacement, index) => {
    // Add any plain text before this replacement
    if (replacement.start > textIndex) {
      parts.push(text.slice(textIndex, replacement.start));
    }
    // Add the formatted element
    parts.push(<span key={index}>{replacement.element}</span>);
    textIndex = replacement.end;
  });

  // Add any remaining plain text after the last replacement
  if (textIndex < text.length) {
    parts.push(text.slice(textIndex));
  }

  return parts;
}
