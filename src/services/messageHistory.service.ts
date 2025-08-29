import { IEmbedSchemaDocument } from '../models/embed';
import MessageHistory, { IMessageHistory } from '../models/MessageHistory';
import { logger } from '../utils';
import mongoose from 'mongoose';

export const createMessageHistory = async (
  webhookId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  messageContent: string,
  embeds: IEmbedSchemaDocument[],
  status: 'success' | 'failed',
  error?: string
): Promise<IMessageHistory> => {
  try {
    const messageHistory = new MessageHistory({
      webhookId,
      userId,
      messageContent,
      embeds,
      status,
      error,
    });
    await messageHistory.save();
    logger.info('Message history saved successfully', {
      webhookId,
      userId,
      status,
    });
    return messageHistory;
  } catch (err) {
    logger.error('Error saving message history:', err);
    throw err;
  }
};
