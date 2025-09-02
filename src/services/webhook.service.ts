import {
  createWebhook,
  Message,
  Embed,
  Field,
  WebhookError,
} from 'discord-webhook-library';
import WebhookModel, { IWebhook } from '../models/Webhook';
import { logger } from '../utils';
import mongoose from 'mongoose';
import { IAvatar } from '../models/avatar';
import { IEmbedSchemaDocument, IFields } from '../models/embed';
import { getAvatar } from './avatar.service';
import { createMessageHistory } from './messageHistory.service';

export interface CreateWebhookData {
  name: string;
  description?: string;
  url: string;
}

export interface UpdateWebhookData {
  name?: string;
  description?: string;
  is_active?: boolean;
}

export interface SendMessageData {
  message: string;
  avatarRefID?: string;
  tts: boolean;
  embeds?: IEmbedSchemaDocument[];
  message_replace_url?: string; // Optional: ID of the message to edit
}

interface IWebhookQuery {
  user_id: string;
  deleted_at: Date | null;
  is_active?: boolean;
}

/**
 * Create a new webhook
 */
export const createWebhookService = async (
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
  limit: number = 10,
  status?: string
): Promise<{ webhooks: IWebhook[]; total: number }> => {
  try {
    const skip = (page - 1) * limit;
    const query: IWebhookQuery = {
      user_id: userId,
      deleted_at: null,
    };

    if (status === 'active') {
      query.is_active = true;
    } else if (status === 'inactive') {
      query.is_active = false;
    }

    const webhooks = await WebhookModel.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const total = await WebhookModel.countDocuments(query);
    logger.info('Webhooks retrieved successfully for user', {
      userId,
      count: webhooks.length,
      page,
      limit,
      status,
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
    const webhook = await WebhookModel.findOne({
      _id: webhookId,
      user_id: userId,
      deleted_at: null,
    });
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

export const testWebhook = async (webhook: IWebhook) => {
  try {
    const webhookClient = createWebhook(webhook.url);
    const msg = new Message();
    msg.setUsername('Zoro Prasad');
    msg.setAvatarURL(
      'https://imgs.search.brave.com/rI8gzGw8eKnYbQyjE1WO4bjwAt39LMUWY1iSLNm-0Rw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzRmLzI0/L2FmLzRmMjRhZjEw/OTlhMWFjYzZhNDNj/MDgxMDViNmQ3NzYy/LmpwZw'
    );
    webhookClient.addMessage(msg);
    const embed = new Embed();
    embed.setDescription('Test message');
    msg.addEmbed(embed);
    await webhookClient.send();
  } catch (error) {
    logger.error('Error testing webhook:', error);
    throw error;
  }
};

/**
 * Get multiple webhooks by their IDs for a user
 */
export const getWebhooksByIds = async (
  webhookIds: string[],
  userId: string
): Promise<IWebhook[]> => {
  try {
    const webhooks = await WebhookModel.find({
      _id: { $in: webhookIds },
      user_id: userId,
      deleted_at: null,
    });
    logger.info(`Retrieved ${webhooks.length} webhooks for user ${userId}`, {
      webhookIds,
    });
    return webhooks;
  } catch (error) {
    logger.error('Error retrieving multiple webhooks:', error);
    throw error;
  }
};

export const sendMessage = async (
  webhookIds: string[], // Keep this for initial query and results tracking
  userId: string,
  messageData: SendMessageData
) => {
  const results: { webhookId: string; status: string; error?: string }[] = [];

  const fetchedWebhooks = await getWebhooksByIds(webhookIds, userId);

  // Track webhooks that were requested but not found/authorized
  const foundWebhookIds = new Set(fetchedWebhooks.map(w => w.id));
  for (const requestedWebhookId of webhookIds) {
    if (!foundWebhookIds.has(requestedWebhookId)) {
      results.push({
        webhookId: requestedWebhookId,
        status: 'failed',
        error: 'Webhook not found or not authorized',
      });
    }
  }

  const webhookPromises: { webhookId: string; promise: Promise<void> }[] = [];
  for (const webhook of fetchedWebhooks) {
    // Existing message sending logic
    const webhookClient = createWebhook(webhook.url);
    const msg = new Message();
    msg.setContent(messageData.message);
    msg.setTTS(messageData.tts);

    let avatar: IAvatar | null;

    if (messageData.avatarRefID) {
      avatar = await getAvatar(userId, messageData.avatarRefID);
      if (avatar) {
        msg.setUsername(avatar.username);
        msg.setAvatarURL(avatar.avatar_url);
      }
    }

    if (messageData.embeds) {
      messageData.embeds.forEach((embedData: IEmbedSchemaDocument) => {
        const embed = new Embed();
        if (embedData.title) embed.setTitle(embedData.title);
        if (embedData.description) embed.setDescription(embedData.description);
        if (embedData.url) embed.setURL(embedData.url);
        if (embedData.timestamp)
          embed.setTimestamp(new Date(embedData.timestamp));
        if (embedData.color) embed.setColor(Number(embedData.color));
        if (embedData.footer)
          embed.setFooter({
            text: embedData.footer.text,
            icon_url: embedData.footer.icon_url,
          });
        if (embedData.image) embed.setImage(embedData.image.url);
        if (embedData.thumbnail) embed.setThumbnail(embedData.thumbnail.url);
        if (embedData.author)
          embed.setAuthor({
            name: embedData.author.name,
            url: embedData.author.url,
            icon_url: embedData.author.icon_url,
          });
        if (embedData.fields) {
          embedData.fields.forEach((field: IFields) => {
            embed.addField(
              new Field(field.name, field.value, field.inline) as Field
            );
          });
        }
        msg.addEmbed(embed);
      });
    }

    if (messageData.message_replace_url) {
      msg.setEditTarget(messageData.message_replace_url);
    }
    webhookClient.addMessage(msg);
    webhookPromises.push({
      webhookId: webhook.id,
      promise: webhookClient.send(),
    });
  }
  const settledResults = await Promise.allSettled(
    webhookPromises.map(p => p.promise)
  );

  for (let i = 0; i < settledResults.length; i++) {
    const result = settledResults[i];
    const { webhookId } = webhookPromises[i];

    if (result.status === 'fulfilled') {
      logger.info(`Message sent successfully to webhook ID: ${webhookId}`, {
        userId,
      });
      results.push({ webhookId: webhookId, status: 'success' });

      await createMessageHistory(
        new mongoose.Types.ObjectId(webhookId),
        new mongoose.Types.ObjectId(userId),
        messageData.message,
        messageData.embeds || [],
        'success'
      );
    } else {
      let errorMessage: string;
      const error = result.reason; // The error object from the rejected promise

      if (error instanceof WebhookError) {
        errorMessage = `Webhook Error: ${(error as Error).message}`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = String(error);
      }

      logger.error(
        `Error sending message to webhook ID: ${webhookId}:`,
        errorMessage
      );
      results.push({
        webhookId: webhookId,
        status: 'failed',
        error: errorMessage,
      });

      await createMessageHistory(
        new mongoose.Types.ObjectId(webhookId),
        new mongoose.Types.ObjectId(userId),
        messageData.message,
        messageData.embeds || [],
        'failed',
        errorMessage
      );
    }
  }

  return results;
};
