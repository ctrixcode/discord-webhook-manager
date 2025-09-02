import mongoose, { Schema, Document } from 'mongoose';

export interface IUserUsage extends Document {
  userId: mongoose.Types.ObjectId; // Reference to the User model
  // Webhook Message Usage
  webhookMessagesSentToday: number;
  lastWebhookMessageDate: Date;
  // Media Storage Usage
  totalMediaStorageUsed: number; // Cumulative size of ALL media uploaded by the user (in bytes)
  // Overrides (grouped into an object)
  overrides?: {
    // The entire overrides object is optional
    dailyWebhookMessageLimit?: number; // If set, overrides the default daily message limit
    overallMediaStorageLimit?: number; // If set, overrides the default overall media storage limit (in bytes)
    unlimitedWebhookMessages?: boolean; // If true, user has no webhook message limit
  };
}

const UserUsageSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  webhookMessagesSentToday: {
    type: Number,
    default: 0,
  },
  lastWebhookMessageDate: {
    type: Date,
    default: Date.now,
  },
  totalMediaStorageUsed: {
    type: Number, // Stored in bytes
    default: 0,
  },
  // Overrides object
  overrides: {
    type: {
      dailyWebhookMessageLimit: {
        type: Number,
        required: false,
      },
      overallMediaStorageLimit: {
        type: Number, // Stored in bytes
        required: false,
      },
      unlimitedWebhookMessages: {
        type: Boolean,
        default: false,
      },
    },
    required: false, // The entire overrides object is optional
  },
});

export default mongoose.model<IUserUsage>('user_usage', UserUsageSchema);
