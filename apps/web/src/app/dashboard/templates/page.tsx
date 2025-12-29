'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Avatar as AvatarComponent,
  AvatarImage,
  AvatarFallback,
} from '@/components/ui/avatar';
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
import { getAllAvatars } from '@/lib/api/queries/avatar';
import type { MessageTemplate, Avatar } from '@repo/shared-types';
import {
  Search,
  FileText,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';

export default function TemplatesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogTemplate, setDeleteDialogTemplate] =
    useState<MessageTemplate | null>(null);

  const { data: templates = [], isLoading } = useQuery<MessageTemplate[]>({
    queryKey: ['messageTemplates'],
    queryFn: templateQueries.getAllTemplates,
    enabled: !!user,
  });

  const { data: avatars = [] } = useQuery<Avatar[]>({
    queryKey: ['avatars'],
    queryFn: getAllAvatars,
    enabled: !!user,
  });

  const getAvatarById = (avatarId?: string) => {
    if (!avatarId) return null;
    return avatars.find(avatar => avatar.id === avatarId);
  };

  const deleteMutation = useMutation({
    mutationFn: templateQueries.deleteTemplate,
    onSuccess: () => {
      toast({
        title: 'Template deleted',
        description: 'Template has been removed',
      });
      setDeleteDialogTemplate(null);
      queryClient.invalidateQueries({ queryKey: ['messageTemplates'] });
    },
  });

  const filteredTemplates = useMemo(() => {
    return templates.filter(
      template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (template.description &&
          template.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
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
    <div className="min-h-screen p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Message Templates
          </h2>
          <p className="text-muted-foreground">
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
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-8 bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-ring"
          />
        </div>
      </div>

      {/* Templates List */}
      {isLoading ? (
        <div className="flex min-h-[50vh] items-center justify-center">
          <Spinner size={48} className="text-primary" />
        </div>
      ) : filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <Card
              key={template._id}
              className="bg-card/50 backdrop-blur-xl border-border hover:bg-card/80 transition-all duration-200 hover:shadow-lg cursor-pointer"
              onClick={() =>
                router.push(`/dashboard/send?template=${template._id}`)
              }
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium text-foreground">
                  {template.name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {/* <Badge
                    variant="secondary"
                    className="bg-purple-500/20 text-purple-200 border-purple-500/30"
                  >
                    TODO uses
                  </Badge> */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                        onClick={e => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-popover border-border text-popover-foreground"
                    >
                      <DropdownMenuItem
                        onClick={e => {
                          e.stopPropagation();
                          handleEditTemplate(template._id);
                        }}
                        className="hover:bg-accent focus:bg-accent"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={e => {
                          e.stopPropagation();
                          setDeleteDialogTemplate(template);
                        }}
                        className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
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
                    <p className="text-sm text-muted-foreground">
                      {template.description}
                    </p>
                  )}

                  <div className="text-sm">
                    <div className="font-medium mb-2 text-foreground">
                      Content Preview:
                    </div>
                    <div className="text-muted-foreground bg-muted/30 border border-border p-3 rounded text-xs font-mono">
                      {template.content.length > 120
                        ? `${template.content.substring(0, 120)}...`
                        : template.content || 'No content'}
                    </div>
                  </div>

                  {template.avatar_ref &&
                    (() => {
                      const avatar = getAvatarById(template.avatar_ref);
                      return avatar ? (
                        <div className="flex items-center gap-2">
                          <AvatarComponent className="size-8">
                            <AvatarImage
                              src={avatar.avatar_url || ''}
                              alt={avatar.username}
                            />
                            <AvatarFallback className="bg-primary/20 text-primary text-sm">
                              {avatar.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </AvatarComponent>
                          <span className="text-sm text-muted-foreground font-medium">
                            {avatar.username}
                          </span>
                        </div>
                      ) : null;
                    })()}

                  <div className="flex items-center justify-between">
                    {template.embeds && template.embeds.length > 0 && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-primary/20 text-primary border-primary/30"
                      >
                        {template.embeds.length} embed
                        {template.embeds.length > 1 ? 's' : ''}
                      </Badge>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {new Date(template.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : templates.length === 0 ? (
        <Card className="bg-card/50 backdrop-blur-xl border-border">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-foreground">
              No templates yet
            </h3>
            <p className="text-muted-foreground text-center mb-4">
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
        <Card className="bg-card/50 backdrop-blur-xl border-border">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Search className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-foreground">
              No templates found
            </h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your search query
            </p>
          </CardContent>
        </Card>
      )}

      <AlertDialog
        open={!!deleteDialogTemplate}
        onOpenChange={() => setDeleteDialogTemplate(null)}
      >
        <AlertDialogContent className="bg-popover border-border text-popover-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Delete template?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This action cannot be undone. This will permanently delete the
              template &quot;{deleteDialogTemplate?.name}&quot; from your
              account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-muted text-foreground border-border hover:bg-accent">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteDialogTemplate &&
                deleteMutation.mutate(deleteDialogTemplate._id)
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
