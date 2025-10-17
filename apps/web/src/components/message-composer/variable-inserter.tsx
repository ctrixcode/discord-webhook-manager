'use client';

import React, { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { AtSign, User, Users, Hash } from 'lucide-react';

interface VariableInserterProps {
  onInsert: (variable: string) => void;
}

interface Variable {
  label: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}

const VARIABLES: Variable[] = [
  // Mentions
  {
    label: '@user',
    value: '<@USER_ID>',
    description: 'Mention a user',
    icon: <User className="w-4 h-4" />,
    category: 'Mentions',
  },
  {
    label: '@role',
    value: '<@&ROLE_ID>',
    description: 'Mention a role',
    icon: <Users className="w-4 h-4" />,
    category: 'Mentions',
  },
  {
    label: '#channel',
    value: '<#CHANNEL_ID>',
    description: 'Mention a channel',
    icon: <Hash className="w-4 h-4" />,
    category: 'Mentions',
  },
  {
    label: '@everyone',
    value: '@everyone',
    description: 'Mention everyone',
    icon: <Users className="w-4 h-4" />,
    category: 'Mentions',
  },
];

export function VariableInserter({ onInsert }: VariableInserterProps) {
  const [open, setOpen] = useState(false);

  const handleInsert = (value: string) => {
    onInsert(value);
    setOpen(false);
  };

  const categories = Array.from(new Set(VARIABLES.map(v => v.category)));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 hover:bg-slate-700 text-slate-300"
          title="Insert Variable"
        >
          <AtSign className="w-3.5 h-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[320px] p-0 bg-slate-800 border-slate-700"
        align="end"
      >
        <div className="flex flex-col max-h-[400px]">
          <div className="p-3 border-b border-slate-700">
            <h3 className="text-sm font-semibold text-white">
              Insert Variable
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Add mentions and channels
            </p>
          </div>

          <div className="overflow-y-auto">
            {categories.map(category => (
              <div key={category} className="p-2">
                <div className="text-xs font-semibold text-slate-400 px-2 py-1">
                  {category}
                </div>
                <div className="space-y-1">
                  {VARIABLES.filter(v => v.category === category).map(
                    variable => (
                      <button
                        key={variable.value}
                        onClick={() => handleInsert(variable.value)}
                        className="w-full flex items-center gap-3 p-2 rounded hover:bg-slate-700/50 transition-colors text-left"
                      >
                        <div className="text-cyan-400 flex-shrink-0">
                          {variable.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-white">
                            {variable.label}
                          </div>
                          <div className="text-xs text-slate-400 truncate">
                            {variable.description}
                          </div>
                        </div>
                      </button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
