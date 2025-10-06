export interface Webhook {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  last_used?: string | null;
}

export interface CreateWebhookData {
  name: string;
  url: string;
  description?: string;
  defaultAvatarId?: string;
}

export interface UpdateWebhookData {
  name?: string;
  description?: string;
  is_active?: boolean;
}
