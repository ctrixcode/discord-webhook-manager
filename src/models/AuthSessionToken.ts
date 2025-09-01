import { Schema, model, Document } from 'mongoose';

export interface IAuthSessionToken extends Document {
  userId: Schema.Types.ObjectId; // Reference to the User who owns this refresh token
  jti: string; // Unique JWT ID for the refresh token, used for single-use validation
  expiresAt: Date; // The expiration date of the refresh token
  isUsed: boolean; // Flag to indicate if this refresh token has already been used
  userAgent: string; // User agent string associated with the refresh token
  createdAt: Date;
  updatedAt: Date;
}

const AuthSessionTokenSchema = new Schema<IAuthSessionToken>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    jti: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    isUsed: { type: Boolean, default: false },
    userAgent: { type: String, required: true },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

const AuthSessionTokenModel = model<IAuthSessionToken>(
  'auth_session_token',
  AuthSessionTokenSchema
);

export default AuthSessionTokenModel;
