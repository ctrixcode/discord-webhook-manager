'use client';
import React from 'react';
import { useTranslations } from 'next-intl'; // Import useTranslations
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTheme } from 'next-themes';
import { Monitor, Moon, Sun } from 'lucide-react';

export function ThemeSelector() {
  const t = useTranslations('themeSelector'); // Initialize translations
  const { theme, setTheme } = useTheme();

  // Map theme values to their respective translation keys and icons
  const themes = [
    { value: 'light', labelKey: 'themes.light', icon: Sun },
    { value: 'dark', labelKey: 'themes.dark', icon: Moon },
    { value: 'system', labelKey: 'themes.system', icon: Monitor },
  ];

  return (
    <div className="space-y-3">
      {/* Translate Title */}
      <Label className="text-base font-medium text-white">{t('title')}</Label>
      {/* Translate Description */}
      <p className="text-sm text-slate-300 mb-3">{t('description')}</p>
      <div className="grid grid-cols-3 gap-3">
        {themes.map(({ value, labelKey, icon: Icon }) => (
          <Button
            key={value}
            variant={theme === value ? 'default' : 'outline'}
            onClick={() => setTheme(value)}
            className="flex items-center gap-2 h-12 bg-slate-800/50 border-slate-600 hover:bg-slate-700/50 text-white"
          >
            <Icon className="h-4 w-4" />
            {/* Translate Label */}
            {t(labelKey)}
          </Button>
        ))}
      </div>
    </div>
  );
}
