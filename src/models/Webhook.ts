import { Schema, model, Document } from 'mongoose';

export interface IWebhook extends Document {
  user_id: string;
  name: string;
  description?: string;
  url: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deleted_at?: Date | null;
}

const UserSchema = new Schema<IWebhook>(
  {
    user_id: { type: String, required: true, ref: 'User' },
    name: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String, required: false },
    is_active: { type: Boolean, required: true, default: true },
    deleted_at: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

const UserModel = model<IWebhook>('webhook', UserSchema);

export default UserModel;
