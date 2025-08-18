import mongoose from 'mongoose';
import { IUser } from '../models/User';

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
