// API Response Types based on the integration guide

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface ApiError {
  success: false;
  message: string;
}

// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  discord_id?: string;
  discord_avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
}

// Webhook Types
export interface Webhook {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  url: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWebhookRequest {
  name: string;
  url: string;
  description?: string;
}

export interface UpdateWebhookRequest {
  name?: string;
  url?: string;
  description?: string;
  lastUsed?: string;
  messageCount?: number;
  isActive?: boolean;
}

// Discord Token Types
export interface DiscordToken {
  id: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user_id: string;
  createdAt: string;
  updatedAt: string;
}

// Discord Embed Types (for message templates and previews)
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

// Message Template Types
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

// Scheduled Message Types
export interface ScheduledMessage {
  id: string;
  webhookId: string;
  webhookName: string;
  webhookUrl: string;
  content: string;
  embeds?: DiscordEmbed[];
  scheduledFor: string;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  userId: string;
  createdAt: string;
  sentAt?: string;
  errorMessage?: string;
}

// Avatar Types
export interface PredefinedAvatar {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiscordTokenRequest {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user_id: string;
}

export interface UpdateDiscordTokenRequest {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
}

// Auth Types
export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface AuthUser extends User {
  isAuthenticated: boolean;
}