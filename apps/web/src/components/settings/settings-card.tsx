import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SettingsCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'danger';
}

export function SettingsCard({
  title,
  description,
  icon,
  children,
  className,
  variant = 'default',
}: SettingsCardProps) {
  return (
    <Card
      className={cn(
        'bg-slate-900/20 backdrop-blur-xl border-slate-700/50 shadow-xl',
        variant === 'danger' && 'border-red-500/50',
        className
      )}
    >
      <CardHeader>
        <CardTitle
          className={cn(
            'flex items-center gap-2 text-white',
            variant === 'danger' && 'text-red-400'
          )}
        >
          {icon}
          {title}
        </CardTitle>
        <CardDescription className="text-slate-300">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
