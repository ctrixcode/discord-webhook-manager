import mongoose, { Document, Schema } from 'mongoose';
import { IEmbedSchemaDocument } from './embed';

export interface IMessageHistory extends Document {
  webhookId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  messageContent: string;
  embeds: IEmbedSchemaDocument[]; // You might want to define a more specific type for embeds
  timestamp: Date;
  status: 'success' | 'failed';
  error?: string;
}

const MessageHistorySchema: Schema = new Schema({
  webhookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Webhook',
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messageContent: { type: String, required: true },
  embeds: { type: Array, default: [] },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['success', 'failed'], required: true },
  error: { type: String },
});

const MessageHistory = mongoose.model<IMessageHistory>(
  'message_history',
  MessageHistorySchema
);

export default MessageHistory;
