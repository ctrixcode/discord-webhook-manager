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

interface MarkdownToolbarProps {
  onBold: () => void;
  onItalic: () => void;
  onCode: () => void;
  onCodeBlock: () => void;
  onStrikethrough: () => void;
  onUnderline: () => void;
  onSpoiler: () => void;
}

export function MarkdownToolbar({
  onBold,
  onItalic,
  onCode,
  onCodeBlock,
  onStrikethrough,
  onUnderline,
  onSpoiler,
}: MarkdownToolbarProps) {
  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onBold}
        className="h-7 w-7 p-0 hover:bg-slate-700 text-slate-300"
        title="Bold"
      >
        <Bold className="w-3.5 h-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onItalic}
        className="h-7 w-7 p-0 hover:bg-slate-700 text-slate-300"
        title="Italic"
      >
        <Italic className="w-3.5 h-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onUnderline}
        className="h-7 w-7 p-0 hover:bg-slate-700 text-slate-300"
        title="Underline"
      >
        <Underline className="w-3.5 h-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onStrikethrough}
        className="h-7 w-7 p-0 hover:bg-slate-700 text-slate-300"
        title="Strikethrough"
      >
        <Strikethrough className="w-3.5 h-3.5" />
      </Button>
      <div className="w-px h-4 bg-slate-600 mx-0.5" />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onCode}
        className="h-7 w-7 p-0 hover:bg-slate-700 text-slate-300"
        title="Inline Code"
      >
        <Code className="w-3.5 h-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onCodeBlock}
        className="h-7 w-7 p-0 hover:bg-slate-700 text-slate-300"
        title="Code Block"
      >
        <FileCode className="w-3.5 h-3.5" />
      </Button>
      <div className="w-px h-4 bg-slate-600 mx-0.5" />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onSpoiler}
        className="h-7 w-7 p-0 hover:bg-slate-700 text-slate-300"
        title="Spoiler"
      >
        <EyeOff className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}
