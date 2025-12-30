'use client';

import React from 'react';
import {
  Bold,
  Italic,
  Code,
  FileCode,
  Strikethrough,
  Underline,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmojiPicker } from './emoji-picker';

interface MarkdownToolbarProps {
  onBold: () => void;
  onItalic: () => void;
  onCode: () => void;
  onCodeBlock: () => void;
  onStrikethrough: () => void;
  onUnderline: () => void;
  onSpoiler: () => void;
  onEmojiSelect: (emoji: string) => void;
}

export function MarkdownToolbar({
  onBold,
  onItalic,
  onCode,
  onCodeBlock,
  onStrikethrough,
  onUnderline,
  onSpoiler,
  onEmojiSelect,
}: MarkdownToolbarProps) {
  return (
    <div className="flex items-center gap-1">
      <EmojiPicker onEmojiSelect={onEmojiSelect} />
      <div className="w-px h-4 bg-border mx-0.5" />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onBold}
        className="h-7 w-7 p-0 hover:bg-muted text-muted-foreground hover:text-foreground"
        title="Bold"
      >
        <Bold className="w-3.5 h-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onItalic}
        className="h-7 w-7 p-0 hover:bg-muted text-muted-foreground hover:text-foreground"
        title="Italic"
      >
        <Italic className="w-3.5 h-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onUnderline}
        className="h-7 w-7 p-0 hover:bg-muted text-muted-foreground hover:text-foreground"
        title="Underline"
      >
        <Underline className="w-3.5 h-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onStrikethrough}
        className="h-7 w-7 p-0 hover:bg-muted text-muted-foreground hover:text-foreground"
        title="Strikethrough"
      >
        <Strikethrough className="w-3.5 h-3.5" />
      </Button>
      <div className="w-px h-4 bg-border mx-0.5" />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onCode}
        className="h-7 w-7 p-0 hover:bg-muted text-muted-foreground hover:text-foreground"
        title="Inline Code"
      >
        <Code className="w-3.5 h-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onCodeBlock}
        className="h-7 w-7 p-0 hover:bg-muted text-muted-foreground hover:text-foreground"
        title="Code Block"
      >
        <FileCode className="w-3.5 h-3.5" />
      </Button>
      <div className="w-px h-4 bg-border mx-0.5" />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onSpoiler}
        className="h-7 w-7 p-0 hover:bg-muted text-muted-foreground hover:text-foreground"
        title="Spoiler"
      >
        <EyeOff className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}
