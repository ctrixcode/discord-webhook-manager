export interface Webhook {
  id: string;
  name: string;
  url: string;
  userId: string;
  createdAt: string;
  lastUsed?: string;
  messageCount: number;
  isActive: boolean;
}

const WEBHOOKS_KEY = 'discord-webhook-webhooks';

export const getWebhooks = (userId: string): Webhook[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(WEBHOOKS_KEY);
  const allWebhooks: Webhook[] = stored ? JSON.parse(stored) : [];
  return allWebhooks.filter((webhook) => webhook.userId === userId);
};

export const addWebhook = (
  webhook: Omit<Webhook, 'id' | 'createdAt' | 'messageCount'>,
): Webhook => {
  const newWebhook: Webhook = {
    ...webhook,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    messageCount: 0,
  };

  const stored = localStorage.getItem(WEBHOOKS_KEY);
  const webhooks: Webhook[] = stored ? JSON.parse(stored) : [];
  webhooks.push(newWebhook);
  localStorage.setItem(WEBHOOKS_KEY, JSON.stringify(webhooks));

  return newWebhook;
};

export const updateWebhook = (id: string, updates: Partial<Webhook>): void => {
  const stored = localStorage.getItem(WEBHOOKS_KEY);
  const webhooks: Webhook[] = stored ? JSON.parse(stored) : [];
  const index = webhooks.findIndex((w) => w.id === id);

  if (index !== -1) {
    webhooks[index] = { ...webhooks[index], ...updates };
    localStorage.setItem(WEBHOOKS_KEY, JSON.stringify(webhooks));
  }
};

export const deleteWebhook = (id: string): void => {
  const stored = localStorage.getItem(WEBHOOKS_KEY);
  const webhooks: Webhook[] = stored ? JSON.parse(stored) : [];
  const filtered = webhooks.filter((w) => w.id !== id);
  localStorage.setItem(WEBHOOKS_KEY, JSON.stringify(filtered));
};

export const validateWebhookUrl = (url: string): boolean => {
  const webhookRegex = /^https:\/\/discord\.com\/api\/webhooks\/\d+\/[\w-]+$/;
  return webhookRegex.test(url);
};

export const sendTestMessage = async (
  webhookUrl: string,
  message: string,
): Promise<boolean> => {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: message,
        username: 'Webhook Manager',
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to send test message:', error);
    return false;
  }
};
