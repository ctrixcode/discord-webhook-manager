export interface DiscordEmbed {
  title?: string;
  description?: string;
  url?: string;
  color?: number;
  author?: {
    name: string;
    icon_url?: string;
    url?: string;
  };
  fields?: {
    name: string;
    value: string;
    inline?: boolean;
  }[];
  thumbnail?: {
    url: string;
  };
  image?: {
    url: string;
  };
  footer?: {
    text: string;
    icon_url?: string;
  };
  timestamp?: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  description?: string;
  content: string;
  username?: string;
  avatarUrl?: string;
  tts?: boolean;
  threadName?: string;
  embeds?: DiscordEmbed[];
  userId: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
}

const TEMPLATES_KEY = 'discord-webhook-templates';

export const getTemplates = (userId: string): MessageTemplate[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(TEMPLATES_KEY);
  const allTemplates: MessageTemplate[] = stored ? JSON.parse(stored) : [];
  return allTemplates.filter((template) => template.userId === userId);
};

export const getTemplate = (id: string): MessageTemplate | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(TEMPLATES_KEY);
  const templates: MessageTemplate[] = stored ? JSON.parse(stored) : [];
  return templates.find((t) => t.id === id) || null;
};

export const addTemplate = (
  template: Omit<
    MessageTemplate,
    'id' | 'createdAt' | 'updatedAt' | 'usageCount'
  >,
): MessageTemplate => {
  const newTemplate: MessageTemplate = {
    ...template,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 0,
  };

  const stored = localStorage.getItem(TEMPLATES_KEY);
  const templates: MessageTemplate[] = stored ? JSON.parse(stored) : [];
  templates.push(newTemplate);
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));

  return newTemplate;
};

export const updateTemplate = (
  id: string,
  updates: Partial<MessageTemplate>,
): void => {
  const stored = localStorage.getItem(TEMPLATES_KEY);
  const templates: MessageTemplate[] = stored ? JSON.parse(stored) : [];
  const index = templates.findIndex((t) => t.id === id);

  if (index !== -1) {
    templates[index] = {
      ...templates[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  }
};

export const deleteTemplate = (id: string): void => {
  const stored = localStorage.getItem(TEMPLATES_KEY);
  const templates: MessageTemplate[] = stored ? JSON.parse(stored) : [];
  const filtered = templates.filter((t) => t.id !== id);
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(filtered));
};

export const incrementTemplateUsage = (id: string): void => {
  const stored = localStorage.getItem(TEMPLATES_KEY);
  const templates: MessageTemplate[] = stored ? JSON.parse(stored) : [];
  const index = templates.findIndex((t) => t.id === id);

  if (index !== -1) {
    templates[index].usageCount += 1;
    templates[index].updatedAt = new Date().toISOString();
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  }
};

export const duplicateTemplate = (id: string): MessageTemplate | null => {
  const stored = localStorage.getItem(TEMPLATES_KEY);
  const templates: MessageTemplate[] = stored ? JSON.parse(stored) : [];
  const template = templates.find((t) => t.id === id);

  if (!template) return null;

  const duplicated = addTemplate({
    name: `${template.name} (Copy)`,
    description: template.description,
    content: template.content,
    username: template.username,
    avatarUrl: template.avatarUrl,
    tts: template.tts,
    threadName: template.threadName,
    embeds: template.embeds
      ? JSON.parse(JSON.stringify(template.embeds))
      : undefined,
    userId: template.userId,
  });

  return duplicated;
};

// Convert hex color to Discord color integer
export const hexToDiscordColor = (hex: string): number => {
  return Number.parseInt(hex.replace('#', ''), 16);
};

// Convert Discord color integer to hex
export const discordColorToHex = (color: number): string => {
  return `#${color.toString(16).padStart(6, '0')}`;
};
