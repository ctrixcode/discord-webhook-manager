import { Schema, model, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IEmailVerificationToken extends Document {
  email: string;
  password: string;
  display_name: string;
  username: string;
  token: string;
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EmailVerificationTokenSchema = new Schema<IEmailVerificationToken>(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    display_name: { type: String, required: true },
    username: { type: String, required: true },
    token: { type: String, required: true, unique: true, default: uuidv4 },
    expiresAt: { type: Date, required: true },
    isUsed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

EmailVerificationTokenSchema.index({ email: 1, token: 1 });
EmailVerificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const EmailVerificationTokenModel = model<IEmailVerificationToken>(
  'email_verification_token',
  EmailVerificationTokenSchema
);

export default EmailVerificationTokenModel;
