'use client';

import type React from 'react';

import { useRouter, useSearchParams } from 'next/navigation';
import { useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';

import { templateQueries } from '@/lib/api/queries/template';
import type { MessageTemplate } from '@/lib/api/types';
import { TemplateForm } from '@/components/template-form';
import { ArrowLeft, Save } from 'lucide-react';

export default function CreateTemplatePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('edit');

  const templateFormRef = useRef<any>(null);

  const { data: existingTemplate } = useQuery({
    queryKey: ['template', templateId],
    queryFn: () => templateQueries.getTemplateById(templateId!),
    enabled: !!templateId,
  });

  const {
    mutate: saveTemplate,
    isPending,
    error,
  } = useMutation({
    mutationFn: (
      templateData: Omit<
        MessageTemplate,
        'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'userId'
      >,
    ) => {
      if (templateId) {
        return templateQueries.updateTemplate(templateId, templateData);
      }
      return templateQueries.createTemplate(templateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      router.push('/dashboard/templates');
    },
  });

  const handleSubmit = () => {
    if (templateFormRef.current) {
      templateFormRef.current.submit();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
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
      </div>

      <TemplateForm
        ref={templateFormRef}
        initialData={existingTemplate}
        onSave={saveTemplate}
        isSaving={isPending}
        saveError={error}
      />
    </div>
  );
}
