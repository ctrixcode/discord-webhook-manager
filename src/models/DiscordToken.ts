import { Schema, model, Document } from 'mongoose';

export interface IDiscordToken extends Document {
  user_id: Schema.Types.ObjectId;
  access_token: string;
  refresh_token: string;
  iv: string;
  expires_at: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DiscordTokenSchema = new Schema<IDiscordToken>(
  {
    user_id: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    access_token: { type: String, required: true },
    refresh_token: { type: String, required: true },
    iv: { type: String, required: true },
    expires_at: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

const DiscordTokenModel = model<IDiscordToken>(
  'DiscordToken',
  DiscordTokenSchema
);

export default DiscordTokenModel;
