import { Schema, model, Document } from 'mongoose';
import { comparePassword } from '../utils/auth';

export type AccountType = 'free' | 'paid' | 'premium';

export interface IUser extends Document {
  display_name: string;
  username: string;
  email: string;
  password?: string;
  google_id?: string;
  google_avatar?: string;
  discord_id?: string;
  discord_avatar?: string;
  guilds?: { id: string; name: string; icon: string | null }[];
  accountType: AccountType;
  createdAt: Date;
  updatedAt: Date;
  deleted_at?: Date | null;
  checkPassword?: (password: string) => Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    display_name: { type: String, required: true },
    username: { type: String, required: true, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    google_id: { type: String, required: false, unique: true, sparse: true },
    google_avatar: { type: String, required: false },
    discord_id: { type: String, required: false, unique: true, sparse: true },
    discord_avatar: { type: String, required: false },
    guilds: [
      {
        id: { type: String, required: false },
        name: { type: String, required: false },
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

// Method to compare password using centralized utility
UserSchema.methods.checkPassword = async function (
  password: string
): Promise<boolean> {
  if (!this.password) {
    return false;
  }

  return comparePassword(password, this.password);
};

const UserModel = model<IUser>('user', UserSchema);

export default UserModel;
