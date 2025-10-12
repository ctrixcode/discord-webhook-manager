import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

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
  skipPasswordHash?: boolean; // Flag to skip password hashing in pre-save hook
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

// Pre-save hook to hash password if modified
UserSchema.pre<IUser>('save', async function (next) {
  // Skip hashing if the password is already hashed (flagged by skipPasswordHash)
  if (this.skipPasswordHash) {
    this.skipPasswordHash = undefined; // Clear the flag after use
    return next();
  }

  if (this.isModified('password') && this.password) {
    try {
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error as Error);
    }
  } else {
    next();
  }
});

// Method to compare password
UserSchema.methods.checkPassword = async function (
  password: string
): Promise<boolean> {
  if (!this.password) {
    return false;
  }

  return bcrypt.compare(password, this.password);
};

const UserModel = model<IUser>('user', UserSchema);

export default UserModel;
