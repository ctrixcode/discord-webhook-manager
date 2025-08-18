import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  discord_id: string;
  discord_avatar: string;
  guilds?: { id: string; name: string; icon: string | null }[];
  createdAt: Date;
  updatedAt: Date;
  deleted_at?: Date | null;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    discord_id: { type: String, required: true, unique: true, sparse: true },
    discord_avatar: { type: String, required: true },
    guilds: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        icon: { type: String, required: false },
      },
    ],
    deleted_at: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

const UserModel = model<IUser>('User', UserSchema);

export default UserModel;
