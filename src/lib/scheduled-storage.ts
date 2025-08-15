export interface ScheduledMessage {
  id: string;
  webhookId: string;
  webhookName: string;
  webhookUrl: string;
  content: string;
  embeds?: any[];
  scheduledFor: string;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  userId: string;
  createdAt: string;
  sentAt?: string;
  errorMessage?: string;
}

const SCHEDULED_KEY = 'discord-webhook-scheduled';

export const getScheduledMessages = (userId: string): ScheduledMessage[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(SCHEDULED_KEY);
  const allMessages: ScheduledMessage[] = stored ? JSON.parse(stored) : [];
  return allMessages.filter((message) => message.userId === userId);
};

export const addScheduledMessage = (
  message: Omit<ScheduledMessage, 'id' | 'createdAt'>,
): ScheduledMessage => {
  const newMessage: ScheduledMessage = {
    ...message,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  const stored = localStorage.getItem(SCHEDULED_KEY);
  const messages: ScheduledMessage[] = stored ? JSON.parse(stored) : [];
  messages.push(newMessage);
  localStorage.setItem(SCHEDULED_KEY, JSON.stringify(messages));

  return newMessage;
};

export const updateScheduledMessage = (
  id: string,
  updates: Partial<ScheduledMessage>,
): void => {
  const stored = localStorage.getItem(SCHEDULED_KEY);
  const messages: ScheduledMessage[] = stored ? JSON.parse(stored) : [];
  const index = messages.findIndex((m) => m.id === id);

  if (index !== -1) {
    messages[index] = { ...messages[index], ...updates };
    localStorage.setItem(SCHEDULED_KEY, JSON.stringify(messages));
  }
};

export const deleteScheduledMessage = (id: string): void => {
  const stored = localStorage.getItem(SCHEDULED_KEY);
  const messages: ScheduledMessage[] = stored ? JSON.parse(stored) : [];
  const filtered = messages.filter((m) => m.id !== id);
  localStorage.setItem(SCHEDULED_KEY, JSON.stringify(filtered));
};

export const cancelScheduledMessage = (id: string): void => {
  updateScheduledMessage(id, { status: 'cancelled' });
};

// Simulate sending scheduled messages (in a real app, this would be handled by a backend service)
export const processScheduledMessages = async (): Promise<void> => {
  const stored = localStorage.getItem(SCHEDULED_KEY);
  const messages: ScheduledMessage[] = stored ? JSON.parse(stored) : [];
  const now = new Date();

  const pendingMessages = messages.filter(
    (m) => m.status === 'pending' && new Date(m.scheduledFor) <= now,
  );

  for (const message of pendingMessages) {
    try {
      const response = await fetch(message.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: message.content,
          embeds: message.embeds,
          username: 'Webhook Manager (Scheduled)',
        }),
      });

      if (response.ok) {
        updateScheduledMessage(message.id, {
          status: 'sent',
          sentAt: new Date().toISOString(),
        });
      } else {
        updateScheduledMessage(message.id, {
          status: 'failed',
          errorMessage: `HTTP ${response.status}: ${response.statusText}`,
        });
      }
    } catch (error) {
      updateScheduledMessage(message.id, {
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
};

export const formatScheduledTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();

  if (diffMs < 0) {
    return 'Overdue';
  }

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
  } else if (diffHours > 0) {
    return `in ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
  } else if (diffMinutes > 0) {
    return `in ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
  } else {
    return 'very soon';
  }
};
