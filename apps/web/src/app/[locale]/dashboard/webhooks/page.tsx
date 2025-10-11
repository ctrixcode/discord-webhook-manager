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
import { useTranslations } from 'next-intl';

export default function WebhooksPage() {
  const { user } = useAuth();
  const router = useRouter();
  const t = useTranslations('dashboard');

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
          <h2 className="text-3xl font-bold tracking-tight text-white">
            {t('title')}
          </h2>
          <p className="text-slate-300">{t('subtitle')}</p>
        </div>
        <AddWebhookDialog />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">
              {t('stats.total')}
            </CardTitle>
            <WebhookIcon className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Spinner size={24} className="text-primary" />
            ) : (
              <div className="text-2xl font-bold text-white">
                {webhooks.length}
              </div>
            )}
            <p className="text-xs text-slate-400">
              {t('stats.active', { count: activeWebhooks })}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">
              {t('stats.activeTitle')}
            </CardTitle>
            <WebhookIcon className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Spinner size={24} className="text-primary" />
            ) : (
              <div className="text-2xl font-bold text-white">
                {activeWebhooks}
              </div>
            )}
            <p className="text-xs text-slate-400">{t('stats.ready')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full md:max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder={t('search.placeholder')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-8 bg-slate-900/50 backdrop-blur-xl border-slate-700/50 text-white placeholder:text-slate-400 focus:border-purple-500/50"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('all')}
            className={
              filterStatus === 'all'
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent'
            }
          >
            {t('filters.all')}
          </Button>
          <Button
            variant={filterStatus === 'active' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('active')}
            className={
              filterStatus === 'active'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent'
            }
          >
            {t('filters.active')}
          </Button>
          <Button
            variant={filterStatus === 'inactive' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('inactive')}
            className={
              filterStatus === 'inactive'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent'
            }
          >
            {t('filters.inactive')}
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
        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            {searchQuery || filterStatus !== 'all' ? (
              <>
                <Search className="h-12 w-12 text-slate-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-white">
                  {t('empty.noResultsTitle')}
                </h3>
                <p className="text-slate-300 text-center">
                  {t('empty.noResultsSubtitle')}
                </p>
              </>
            ) : (
              <>
                <WebhookIcon className="h-12 w-12 text-slate-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-white">
                  {t('empty.noWebhooks.title')}
                </h3>
                <p className="text-slate-300 text-center mb-4">
                  {t('empty.noWebhooks.desc')}
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
