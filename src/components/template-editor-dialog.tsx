'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EmbedBuilder } from '@/components/embed-builder';
import { DiscordMessagePreview } from '@/components/discord-message-preview';

import { templateQueries } from '@/lib/api/queries/template';
import type { MessageTemplate, DiscordEmbed } from '@/lib/api/types';
import { TemplateForm } from '@/components/template-form';
import { Plus, FileText, AlertCircle, Eye, Settings } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TemplateEditorDialogProps {
  template?: MessageTemplate;
  onTemplateSaved?: () => void;
  triggerButton?: React.ReactNode;
}

export function TemplateEditorDialog({
  template,
  onTemplateSaved,
  triggerButton,
}: TemplateEditorDialogProps) {
  
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { mutate: saveTemplate, isPending, error } = useMutation({
    mutationFn: (templateData: Omit<MessageTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'userId'>) => {
      if (template) {
        return templateQueries.updateTemplate(template.id, templateData);
      }
      return templateQueries.createTemplate(templateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      setOpen(false);
      onTemplateSaved?.();
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] bg-slate-900/95 backdrop-blur-xl border-slate-700/50 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">
            {template ? 'Edit Template' : 'Create Template'}
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Create reusable message templates with full Discord webhook support.
          </DialogDescription>
        </DialogHeader>

        <TemplateForm
          initialData={template}
          onSave={saveTemplate}
          isSaving={isPending}
          saveError={error}
        />

        <DialogFooter className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="bg-slate-800/50 border-slate-600/50 text-slate-200 hover:bg-slate-700/50 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            onClick={handleSubmit}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
          >
            {isPending
              ? 'Saving...'
              : template
                ? 'Update Template'
                : 'Create Template'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
