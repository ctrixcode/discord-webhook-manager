'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/auth-context';
import { templateQueries } from '@/lib/api/queries/message-template';
import type { MessageTemplate } from '@/lib/api/types/message-template';
import {
  Search,
  FileText,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function TemplatesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogTemplate, setDeleteDialogTemplate] = useState<MessageTemplate | null>(null);

  const { data: templates = [], isLoading } = useQuery<MessageTemplate[]>({
    queryKey: ['templates'],
    queryFn: templateQueries.getAllTemplates,
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: templateQueries.deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast({ title: 'Template deleted', description: `"${deleteDialogTemplate?.name}" has been removed` });
      setDeleteDialogTemplate(null);
    },
  });

  const filteredTemplates = useMemo(() => {
    return templates.filter(
      (template) =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (template.description && template.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        template.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [templates, searchQuery]);

  const handleCreateTemplate = () => {
    router.push('/dashboard/templates/create');
  };

  const handleEditTemplate = (templateId: string) => {
    router.push(`/dashboard/templates/create?edit=${templateId}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Message Templates
          </h2>
          <p className="text-gray-300">
            Create and manage reusable message templates
          </p>
        </div>
        <Button
          onClick={handleCreateTemplate}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-gray-400 focus:border-purple-500/50 focus:ring-purple-500/20"
          />
        </div>
      </div>

      {/* Templates List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-lg" />)}
        </div>
      ) : filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card
              key={template._id}
              className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium text-white">
                  {template.name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-purple-500/20 text-purple-200 border-purple-500/30"
                  >
                    TODO uses
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/10"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-slate-800/95 backdrop-blur-md border-white/20 text-white"
                    >
                      <DropdownMenuItem
                        onClick={() => handleEditTemplate(template._id)}
                        className="hover:bg-white/10 focus:bg-white/10"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeleteDialogTemplate(template)}
                        className="text-red-400 hover:bg-red-500/10 focus:bg-red-500/10"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {template.description && (
                    <p className="text-sm text-gray-300">
                      {template.description}
                    </p>
                  )}

                  <div className="text-sm">
                    <div className="font-medium mb-2 text-white">
                      Content Preview:
                    </div>
                    <div className="text-gray-300 bg-black/20 border border-white/10 p-3 rounded text-xs font-mono">
                      {template.content.length > 120
                        ? `${template.content.substring(0, 120)}...`
                        : template.content || 'No content'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    {template.embeds && template.embeds.length > 0 && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-blue-500/20 text-blue-200 border-blue-500/30"
                      >
                        {template.embeds.length} embed
                        {template.embeds.length > 1 ? 's' : ''}
                      </Badge>
                    )}
                    <div className="text-xs text-gray-400">
                      {new Date(template.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : templates.length === 0 ? (
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-12 w-12 text-purple-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-white">
              No templates yet
            </h3>
            <p className="text-gray-300 text-center mb-4">
              Create your first message template to get started
            </p>
            <Button
              onClick={handleCreateTemplate}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Search className="h-12 w-12 text-purple-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-white">
              No templates found
            </h3>
            <p className="text-gray-300 text-center">
              Try adjusting your search query
            </p>
          </CardContent>
        </Card>
      )}

      <AlertDialog
        open={!!deleteDialogTemplate}
        onOpenChange={() => setDeleteDialogTemplate(null)}
      >
        <AlertDialogContent className="bg-slate-800/95 backdrop-blur-md border-white/20 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete template?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              This action cannot be undone. This will permanently delete the
              template &quot;{deleteDialogTemplate?.name}&quot; from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialogTemplate && deleteMutation.mutate(deleteDialogTemplate._id)}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
