'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface DangerActionProps {
  title: string;
  description: string;
  buttonText: string;
  onAction?: () => void;
}

export function DangerAction({
  title,
  description,
  buttonText,
  onAction,
}: DangerActionProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label className="text-base text-white">{title}</Label>
        <p className="text-sm text-slate-300">{description}</p>
      </div>
      <Button
        variant="destructive"
        size="sm"
        onClick={onAction}
        className="bg-red-600 hover:bg-red-700"
      >
        {buttonText}
      </Button>
    </div>
  );
}
