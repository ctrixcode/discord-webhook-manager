'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AddWebhookDialog } from '@/components/add-webhook-dialog';
import { WebhookCard } from '@/components/webhook-card';
import { useAuth } from '@/contexts/auth-context';
import { getAllWebhooks } from '@/lib/api/queries/webhook';
import { type Webhook } from '@repo/shared-types';
import { Search, WebhookIcon } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';

export default function WebhooksPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'active' | 'inactive'
  >('all');

  const queryClient = useQueryClient();

  const { data: webhooks = [], isLoading } = useQuery<Webhook[]>({
    queryKey: [
      'webhooks',
      {
        isActive:
          filterStatus === 'active'
            ? true
            : filterStatus === 'inactive'
              ? false
              : undefined,
      },
    ],
    queryFn: ({ queryKey }) =>
      getAllWebhooks({
        queryKey: queryKey as [string, { isActive?: boolean }],
      }),
    enabled: !!user,
  });

  const filteredWebhooks = useMemo(() => {
    if (!webhooks) return [];
    return webhooks.filter(webhook =>
      webhook.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [webhooks, searchQuery]);

  const activeWebhooks = webhooks.filter(w => w.is_active).length;

  const handleCardClick = (webhook: Webhook) => {
    router.push(`/dashboard/send?webhookId=${webhook.id}`);
  };

  return (
    <div className="min-h-screen p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Webhooks
          </h2>
          <p className="text-muted-foreground">Manage your Discord webhooks</p>
        </div>
        <AddWebhookDialog />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/50 backdrop-blur-xl border-border hover:bg-card/80 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Total Webhooks
            </CardTitle>
            <WebhookIcon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Spinner size={24} className="text-primary" />
            ) : (
              <div className="text-2xl font-bold text-foreground">
                {webhooks.length}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {activeWebhooks} active
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-xl border-border hover:bg-card/80 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Active Webhooks
            </CardTitle>
            <WebhookIcon className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Spinner size={24} className="text-primary" />
            ) : (
              <div className="text-2xl font-bold text-foreground">
                {activeWebhooks}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Ready to send messages
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full md:max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search webhooks..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-8 bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-ring"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('all')}
            className={
              filterStatus === 'all'
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                : 'border-input text-muted-foreground hover:bg-muted bg-transparent'
            }
          >
            All
          </Button>
          <Button
            variant={filterStatus === 'active' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('active')}
            className={
              filterStatus === 'active'
                ? 'bg-success hover:bg-success/90 text-white'
                : 'border-input text-muted-foreground hover:bg-muted bg-transparent'
            }
          >
            Active
          </Button>
          <Button
            variant={filterStatus === 'inactive' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('inactive')}
            className={
              filterStatus === 'inactive'
                ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
                : 'border-input text-muted-foreground hover:bg-muted bg-transparent'
            }
          >
            Inactive
          </Button>
        </div>
      </div>

      {/* Webhooks List */}
      {isLoading ? (
        <div className="flex min-h-[50vh] items-center justify-center">
          <Spinner size={48} className="text-primary" />
        </div>
      ) : filteredWebhooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWebhooks.map(webhook => (
            <WebhookCard
              key={webhook.id}
              webhook={webhook}
              onWebhookUpdated={() =>
                queryClient.invalidateQueries({
                  queryKey: [
                    'webhooks',
                    {
                      isActive:
                        filterStatus === 'active'
                          ? true
                          : filterStatus === 'inactive'
                            ? false
                            : undefined,
                    },
                  ],
                })
              }
              onCardClick={handleCardClick}
            />
          ))}
        </div>
      ) : (
        <Card className="bg-card/50 backdrop-blur-xl border-border">
          <CardContent className="flex flex-col items-center justify-center py-16">
            {searchQuery || filterStatus !== 'all' ? (
              <>
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  No webhooks found
                </h3>
                <p className="text-muted-foreground text-center">
                  Try adjusting your search query or filters
                </p>
              </>
            ) : (
              <>
                <WebhookIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  No webhooks yet
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  Get started by adding your first Discord webhook
                </p>
                <AddWebhookDialog />
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
