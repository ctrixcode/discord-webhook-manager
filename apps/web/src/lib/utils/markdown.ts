/**
 * Utility functions for markdown text formatting
 */

export interface MarkdownInsertOptions {
  content: string;
  selectionStart: number;
  selectionEnd: number;
  before: string;
  after: string;
  placeholder?: string;
}

export interface MarkdownInsertResult {
  newContent: string;
  newCursorPosition: number;
}

/**
 * Insert markdown formatting around selected text or at cursor position
 */
export function insertMarkdown({
  content,
  selectionStart,
  selectionEnd,
  before,
  after,
  placeholder = '',
}: MarkdownInsertOptions): MarkdownInsertResult {
  const selectedText = content.substring(selectionStart, selectionEnd);
  const textToInsert = selectedText || placeholder;

  const newContent =
    content.substring(0, selectionStart) +
    before +
    textToInsert +
    after +
    content.substring(selectionEnd);

  const newCursorPosition =
    selectionStart + before.length + textToInsert.length;

  return {
    newContent,
    newCursorPosition,
  };
}

/**
 * Markdown formatting presets
 */
export const markdownFormats = {
  bold: { before: '**', after: '**', placeholder: '' },
  italic: { before: '*', after: '*', placeholder: '' },
  code: { before: '`', after: '`', placeholder: '' },
  codeBlock: { before: '```\n', after: '\n```', placeholder: '' },
  strikethrough: { before: '~~', after: '~~', placeholder: '' },
  underline: { before: '__', after: '__', placeholder: '' },
  spoiler: { before: '||', after: '||', placeholder: '' },
} as const;
