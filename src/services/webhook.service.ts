import WebhookModel, { IWebhook } from '../models/Webhook';
import { logger } from '../utils';

export interface CreateWebhookData {
  name: string;
  description?: string;
  url: string;
}

export interface UpdateWebhookData {
  name?: string;
  description?: string;
  url?: string;
  is_active?: boolean;
}

/**
 * Create a new webhook
 */
export const createWebhook = async (
  webhookData: CreateWebhookData,
  userId: string
): Promise<IWebhook> => {
  try {
    logger.info('Creating new webhook', { name: webhookData.name, userId });
    const webhook = new WebhookModel({ ...webhookData, user_id: userId });
    await webhook.save();
    return webhook;
  } catch (error) {
    logger.error('Error creating webhook:', error);
    throw error;
  }
};

/**
 * Get all webhooks for a user with pagination
 */
export const getWebhooksByUserId = async (
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<{ webhooks: IWebhook[]; total: number }> => {
  try {
    const skip = (page - 1) * limit;
    const webhooks = await WebhookModel.find({ user_id: userId, deleted_at: null })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const total = await WebhookModel.countDocuments({ user_id: userId, deleted_at: null });
    logger.info('Webhooks retrieved successfully for user', {
      userId,
      count: webhooks.length,
      page,
      limit,
    });
    return { webhooks, total };
  } catch (error) {
    logger.error('Error retrieving webhooks for user:', error);
    throw error;
  }
};

/**
 * Get webhook by ID for a user
 */
export const getWebhookById = async (
  webhookId: string,
  userId: string
): Promise<IWebhook | null> => {
  try {
    const webhook = await WebhookModel.findOne({ _id: webhookId, user_id: userId, deleted_at: null });
    if (!webhook) {
      logger.warn('Webhook not found', { webhookId, userId });
      return null;
    }
    logger.info('Webhook retrieved successfully', { webhookId, userId });
    return webhook;
  } catch (error) {
    logger.error('Error retrieving webhook:', error);
    throw error;
  }
};

/**
 * Update webhook for a user
 */
export const updateWebhook = async (
  webhookId: string,
  updateData: UpdateWebhookData,
  userId: string
): Promise<IWebhook | null> => {
  try {
    const webhook = await WebhookModel.findOneAndUpdate(
      { _id: webhookId, user_id: userId, deleted_at: null },
      updateData,
      { new: true }
    );
    if (!webhook) {
      logger.warn('Webhook not found for update', { webhookId, userId });
      return null;
    }
    logger.info('Webhook updated successfully', { webhookId, userId });
    return webhook;
  } catch (error) {
    logger.error('Error updating webhook:', error);
    throw error;
  }
};

/**
 * Soft delete webhook by setting deleted_at timestamp for a user
 */
export const deleteWebhook = async (
  webhookId: string,
  userId: string
): Promise<boolean> => {
  try {
    const result = await WebhookModel.findOneAndUpdate(
      { _id: webhookId, user_id: userId, deleted_at: null },
      { deleted_at: new Date() },
      { new: true }
    );
    if (!result) {
      logger.warn('Webhook not found for deletion', { webhookId, userId });
      return false;
    }
    logger.info('Webhook deleted successfully', { webhookId, userId });
    return true;
  } catch (error) {
    logger.error('Error deleting webhook:', error);
    throw error;
  }
};