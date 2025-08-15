'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScheduleMessageDialog } from '@/components/schedule-message-dialog';
import { ScheduledMessageCard } from '@/components/scheduled-message-card';
import { useAuth } from '@/contexts/auth-context';
import {
  getScheduledMessages,
  processScheduledMessages,
  type ScheduledMessage,
} from '@/lib/scheduled-storage';
import {
  Search,
  Clock,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ScheduledPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ScheduledMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [filteredMessages, setFilteredMessages] = useState<ScheduledMessage[]>(
    [],
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const loadMessages = () => {
    if (user) {
      const userMessages = getScheduledMessages(user.id);
      setMessages(userMessages);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [user]);

  useEffect(() => {
    let filtered = messages;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (message) =>
          message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          message.webhookName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((message) => message.status === statusFilter);
    }

    // Sort by scheduled time (newest first)
    filtered.sort(
      (a, b) =>
        new Date(b.scheduledFor).getTime() - new Date(a.scheduledFor).getTime(),
    );

    setFilteredMessages(filtered);
  }, [messages, searchQuery, statusFilter]);

  const handleProcessMessages = async () => {
    setIsProcessing(true);
    try {
      await processScheduledMessages();
      loadMessages();
      toast({
        title: 'Messages processed',
        description: 'Checked for messages ready to send',
      });
    } catch (error) {
      toast({
        title: 'Processing failed',
        description: 'Failed to process scheduled messages',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const pendingMessages = messages.filter((m) => m.status === 'pending').length;
  const sentMessages = messages.filter((m) => m.status === 'sent').length;
  const failedMessages = messages.filter((m) => m.status === 'failed').length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Scheduled Messages
          </h2>
          <p className="text-muted-foreground">
            Manage your scheduled Discord messages
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleProcessMessages}
            disabled={isProcessing}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`}
            />
            {isProcessing ? 'Processing...' : 'Process Messages'}
          </Button>
          <ScheduleMessageDialog onMessageScheduled={loadMessages} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">
              Total Scheduled
            </CardTitle>
            <Clock className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {messages.length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">
              Pending
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {pendingMessages}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">
              Sent
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{sentMessages}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">
              Failed
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {failedMessages}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-slate-900/20 backdrop-blur-sm border-slate-700/50 text-white placeholder:text-slate-400"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] bg-slate-900/20 backdrop-blur-sm border-slate-700/50 text-white">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900/95 backdrop-blur-sm border-slate-700/50">
            <SelectItem
              value="all"
              className="text-white hover:bg-slate-800/50"
            >
              All statuses
            </SelectItem>
            <SelectItem
              value="pending"
              className="text-white hover:bg-slate-800/50"
            >
              Pending
            </SelectItem>
            <SelectItem
              value="sent"
              className="text-white hover:bg-slate-800/50"
            >
              Sent
            </SelectItem>
            <SelectItem
              value="failed"
              className="text-white hover:bg-slate-800/50"
            >
              Failed
            </SelectItem>
            <SelectItem
              value="cancelled"
              className="text-white hover:bg-slate-800/50"
            >
              Cancelled
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Messages List */}
      {filteredMessages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMessages.map((message) => (
            <ScheduledMessageCard
              key={message.id}
              message={message}
              onMessageUpdated={loadMessages}
            />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-700/50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Clock className="h-12 w-12 text-purple-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-white">
              No scheduled messages
            </h3>
            <p className="text-slate-300 text-center mb-4">
              Schedule your first message to get started
            </p>
            <ScheduleMessageDialog onMessageScheduled={loadMessages} />
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-700/50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Search className="h-12 w-12 text-purple-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-white">
              No messages found
            </h3>
            <p className="text-slate-300 text-center">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
