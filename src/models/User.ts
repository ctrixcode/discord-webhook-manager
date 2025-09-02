import { Schema, model, Document } from 'mongoose';

export type AccountType = 'free' | 'paid' | 'premium'; // Re-add AccountType

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  discord_id: string;
  discord_avatar: string;
  guilds?: { id: string; name: string; icon: string | null }[];
  accountType: AccountType; // Change back to AccountType
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
    accountType: {
      type: String,
      enum: ['free', 'paid', 'premium'], // Use string literals
      default: 'free', // Use string literal
      required: true,
    },
    deleted_at: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

const UserModel = model<IUser>('user', UserSchema);

export default UserModel;
