
export interface DiscordEmbed {
  title?: string;
  description?: string;
  url?: string;
  color?: number;
  author?: {
    name: string;
    url?: string;
    icon_url?: string;
  };
  footer?: {
    text: string;
    icon_url?: string;
  };
  thumbnail?: {
    url: string;
  };
  image?: {
    url: string;
  };
  fields?: {
    name: string;
    value: string;
    inline?: boolean;
  }[];
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
}

const TEMPLATES_STORAGE_KEY = 'discord-webhook-templates';

function getTemplates(): MessageTemplate[] {
  if (typeof window === 'undefined') {
    return [];
  }
  const storedTemplates = localStorage.getItem(TEMPLATES_STORAGE_KEY);
  return storedTemplates ? JSON.parse(storedTemplates) : [];
}

function saveTemplates(templates: MessageTemplate[]): void {
    if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
}

export function addTemplate(template: Omit<MessageTemplate, 'id'>): MessageTemplate {
  const templates = getTemplates();
  const newTemplate: MessageTemplate = {
    ...template,
    id: new Date().toISOString(),
  };
  const updatedTemplates = [...templates, newTemplate];
  saveTemplates(updatedTemplates);
  return newTemplate;
}

export function updateTemplate(id: string, updates: Partial<Omit<MessageTemplate, 'id'>>): MessageTemplate | undefined {
  const templates = getTemplates();
  const templateIndex = templates.findIndex((t) => t.id === id);
  if (templateIndex === -1) {
    return undefined;
  }
  const updatedTemplate = { ...templates[templateIndex], ...updates };
  templates[templateIndex] = updatedTemplate;
  saveTemplates(templates);
  return updatedTemplate;
}

export function deleteTemplate(id: string): void {
  const templates = getTemplates();
  const updatedTemplates = templates.filter((t) => t.id !== id);
  saveTemplates(updatedTemplates);
}
