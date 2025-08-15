'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AddWebhookDialog } from '@/components/add-webhook-dialog';
import { WebhookCard } from '@/components/webhook-card';
import { useAuth } from '@/contexts/auth-context';
import { getWebhooks, type Webhook } from '@/lib/webhook-storage';
import { Search, WebhookIcon } from 'lucide-react';

export default function WebhooksPage() {
  const { user } = useAuth();
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredWebhooks, setFilteredWebhooks] = useState<Webhook[]>([]);

  const loadWebhooks = () => {
    if (user) {
      const userWebhooks = getWebhooks(user.id);
      setWebhooks(userWebhooks);
    }
  };

  useEffect(() => {
    loadWebhooks();
  }, [user]);

  useEffect(() => {
    const filtered = webhooks.filter(
      (webhook) =>
        webhook.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        webhook.url.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredWebhooks(filtered);
  }, [webhooks, searchQuery]);

  const activeWebhooks = webhooks.filter((w) => w.isActive).length;
  const totalMessages = webhooks.reduce((sum, w) => sum + w.messageCount, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Webhooks
          </h2>
          <p className="text-slate-300">Manage your Discord webhooks</p>
        </div>
        <AddWebhookDialog onWebhookAdded={loadWebhooks} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">
              Total Webhooks
            </CardTitle>
            <WebhookIcon className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {webhooks.length}
            </div>
            <p className="text-xs text-slate-400">{activeWebhooks} active</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">
              Messages Sent
            </CardTitle>
            <WebhookIcon className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalMessages}</div>
            <p className="text-xs text-slate-400">Total across all webhooks</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/50 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">
              Active Webhooks
            </CardTitle>
            <WebhookIcon className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {activeWebhooks}
            </div>
            <p className="text-xs text-slate-400">Ready to send messages</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search webhooks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-slate-900/50 backdrop-blur-xl border-slate-700/50 text-white placeholder:text-slate-400 focus:border-purple-500/50"
          />
        </div>
      </div>

      {/* Webhooks List */}
      {filteredWebhooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWebhooks.map((webhook) => (
            <WebhookCard
              key={webhook.id}
              webhook={webhook}
              onWebhookUpdated={loadWebhooks}
            />
          ))}
        </div>
      ) : webhooks.length === 0 ? (
        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <WebhookIcon className="h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-white">
              No webhooks yet
            </h3>
            <p className="text-slate-300 text-center mb-4">
              Get started by adding your first Discord webhook
            </p>
            <AddWebhookDialog onWebhookAdded={loadWebhooks} />
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Search className="h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-white">
              No webhooks found
            </h3>
            <p className="text-slate-300 text-center">
              Try adjusting your search query
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
