import mongoose from 'mongoose';
import { IUser } from '../models/User';
import { IWebhook } from '../models/Webhook';
import { IAvatar } from '../models/avatar';

export interface UserPayload {
  id: string;
  username: string;
  email: string;
  discord_id?: string;
  discord_avatar?: string;
  guilds?: { id: string; name: string; icon: string | null }[];
  createdAt: string;
  updatedAt: string;
}

export interface WebhookDto {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  url: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
  last_used?: Date | null;
}

export interface AvatarDto {
  id: string;
  user_id: string;
  username: string;
  avatar_url?: string;
  avatar_icon_url: string;
  createdAt: Date;
  updatedAt: Date;
}

export const toUserPayload = (user: IUser): UserPayload => {
  return {
    id: (user._id as mongoose.Types.ObjectId).toString(),
    username: user.username,
    email: user.email,
    discord_id: user.discord_id,
    discord_avatar: user.discord_avatar,
    guilds: user.guilds,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
};

export const toWebhookDto = (webhook: IWebhook): WebhookDto => {
  return {
    id: String(webhook._id),
    user_id: webhook.user_id,
    name: webhook.name,
    description: webhook.description,
    url: webhook.url,
    is_active: webhook.is_active,
    createdAt: webhook.createdAt,
    updatedAt: webhook.updatedAt,
    last_used: webhook.last_used,
  };
};

export const toAvatarDto = (avatar: IAvatar): AvatarDto => {
  return {
    id: String(avatar._id),
    user_id: String(avatar.user_id),
    username: avatar.username,
    avatar_url: avatar.avatar_url,
    avatar_icon_url: avatar.avatar_icon_url,
    createdAt: avatar.createdAt,
    updatedAt: avatar.updatedAt,
  };
};
