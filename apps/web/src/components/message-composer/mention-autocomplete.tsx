'use client';

import React, { useEffect, useRef } from 'react';
import { User, Users, Hash } from 'lucide-react';

interface MentionOption {
  label: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}

interface MentionAutocompleteProps {
  isOpen: boolean;
  position: { top: number; left: number };
  onSelect: (value: string) => void;
  onClose: () => void;
}

const MENTION_OPTIONS: MentionOption[] = [
  {
    label: '@user',
    value: '<@>',
    description: 'Mention a user',
    icon: <User className="w-4 h-4" />,
  },
  {
    label: '@role',
    value: '<@&>',
    description: 'Mention a role',
    icon: <Users className="w-4 h-4" />,
  },
  {
    label: '#channel',
    value: '<#>',
    description: 'Mention a channel',
    icon: <Hash className="w-4 h-4" />,
  },
  {
    label: '@everyone',
    value: '@everyone',
    description: 'Mention everyone',
    icon: <Users className="w-4 h-4" />,
  },
];

export function MentionAutocomplete({
  isOpen,
  position,
  onSelect,
  onClose,
}: MentionAutocompleteProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  // Reset selected index when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex(prev =>
            prev < MENTION_OPTIONS.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
          break;
        case 'Enter':
          event.preventDefault();
          if (MENTION_OPTIONS[selectedIndex]) {
            onSelect(MENTION_OPTIONS[selectedIndex].value);
          }
          break;
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, selectedIndex, onSelect, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="fixed z-50 w-[280px] bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div className="max-h-[300px] overflow-y-auto">
        {MENTION_OPTIONS.map((option, index) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            onMouseEnter={() => setSelectedIndex(index)}
            className={`w-full flex items-center gap-3 p-3 transition-colors text-left ${
              index === selectedIndex
                ? 'bg-slate-700/70'
                : 'hover:bg-slate-700/50'
            }`}
          >
            <div className="text-cyan-400 flex-shrink-0">{option.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white">
                {option.label}
              </div>
              <div className="text-xs text-slate-400 truncate">
                {option.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
