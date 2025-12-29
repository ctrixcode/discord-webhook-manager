import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import React, { type ReactNode } from 'react';
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
        'bg-card/50 backdrop-blur-xl border-border shadow-xl',
        variant === 'danger' && 'border-destructive/50',
        className
      )}
    >
      <CardHeader>
        <CardTitle
          className={cn(
            'flex items-center gap-2 text-foreground',
            variant === 'danger' && 'text-destructive'
          )}
        >
          {icon}
          {title}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
