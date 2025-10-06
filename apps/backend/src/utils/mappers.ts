import mongoose from 'mongoose';
import { IUser } from '../models/User';
import { IWebhook } from '../models/Webhook';
import { IAvatar } from '../models/avatar';
import { User, Avatar, Webhook } from '@repo/shared-types';

export interface WebhookDto {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
  last_used?: Date | null;
}

export const toUserPayload = (user: IUser): User => {
  return {
    id: (user._id as mongoose.Types.ObjectId).toString(),
    username: user.username,
    email: user.email,
    discord_id: user.discord_id,
    discord_avatar: user.discord_avatar,
    accountType: user.accountType,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
};

export const toWebhookDto = (webhook: IWebhook): Webhook => {
  return {
    id: String(webhook._id),
    user_id: webhook.user_id,
    name: webhook.name,
    description: webhook.description,
    is_active: webhook.is_active,
    createdAt: webhook.createdAt.toISOString(),
    updatedAt: webhook.updatedAt.toISOString(),
    last_used: webhook.last_used ? webhook.last_used.toISOString() : null,
  };
};

export const toAvatarDto = (avatar: IAvatar): Avatar => {
  return {
    id: String(avatar._id),
    user_id: String(avatar.user_id),
    username: avatar.username,
    avatar_url: avatar.avatar_url,
    createdAt: avatar.createdAt.toISOString(),
    updatedAt: avatar.updatedAt.toISOString(),
  };
};
