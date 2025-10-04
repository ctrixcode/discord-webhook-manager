'use client';

import type React from 'react';

import { useRouter, useSearchParams } from 'next/navigation';
import { useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';

import { templateQueries } from '@/lib/api/queries/message-template';
import type {
  MessageTemplate,
  CreateMessageTemplateRequest,
  UpdateMessageTemplateRequest,
} from '@/lib/api/types/message-template';
import { TemplateForm } from '@/components/template-form';
import { ArrowLeft, Save } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/hooks/use-toast';

export default function CreateTemplatePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('edit');
  interface TemplateFormRef {
    submit: () => void;
  }
  const templateFormRef = useRef<TemplateFormRef>(null);

  const { data: existingTemplate, isLoading } = useQuery<MessageTemplate>({
    queryKey: ['template', templateId],
    queryFn: () => templateQueries.getTemplateById(templateId!),
    enabled: !!templateId,
  });

  const { mutate: saveTemplate, isPending } = useMutation({
    mutationFn: (
      templateData: CreateMessageTemplateRequest | UpdateMessageTemplateRequest
    ) => {
      if (templateId) {
        return templateQueries.updateTemplate(
          templateId,
          templateData as UpdateMessageTemplateRequest
        );
      }
      return templateQueries.createTemplate(
        templateData as CreateMessageTemplateRequest
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      router.push('/dashboard/templates');
      toast({
        title: 'Template saved',
        description: 'Template saved successfully!',
      });
    },
    onError: error => {
      toast({
        title: 'Error saving template',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = () => {
    if (templateFormRef.current) {
      templateFormRef.current.submit();
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex justify-center items-center p-4 gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-white hover:bg-slate-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-white">
              {templateId ? 'Edit Template' : 'Create Template'}
            </h1>
            <p className="text-sm text-slate-300">
              Design your Discord message with live preview
            </p>
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={isPending}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {isPending ? 'Saving...' : templateId ? 'Update' : 'Save'}
        </Button>
      </div>

      {templateId && isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <Spinner size={48} className="text-primary" />
        </div>
      ) : (
        <TemplateForm
          ref={templateFormRef}
          initialData={existingTemplate}
          onSave={saveTemplate}
          isSaving={isPending}
        />
      )}
    </div>
  );
}
