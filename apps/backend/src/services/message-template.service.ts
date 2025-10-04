import MessageTemplateModel, {
  IMessageTemplate,
} from '../models/message_template';
import mongoose, { Types } from 'mongoose';
import { logger } from '../utils';

import { IEmbedSchemaDocument } from '../models/embed';
import { BadRequestError, InternalServerError } from '../utils/errors';
import { ErrorMessages } from '../utils/errorMessages';

export interface CreateMessageTemplateData {
  name: string;
  description?: string;
  content: string;
  avatar_ref: string;
  embeds?: IEmbedSchemaDocument[];
  attachments?: string[];
}

export interface UpdateMessageTemplateData {
  name?: string;
  description?: string;
  content?: string;
  avatar_ref?: string;
  embeds?: IEmbedSchemaDocument[];
  attachments?: string[];
}

/**
 * Creates a new message template for a specific user.
 * @param userId The ID of the user creating the template.
 * @param templateData The data for the new message template.
 * @returns The created message template document.
 */
export const createMessageTemplate = async (
  userId: string,
  templateData: CreateMessageTemplateData
): Promise<IMessageTemplate> => {
  try {
    logger.info('Creating new message template', {
      name: templateData.name,
      userId,
    });
    const newMessageTemplate = new MessageTemplateModel({
      ...templateData,
      user_id: new Types.ObjectId(userId),
      avatar_ref: templateData.avatar_ref
        ? new Types.ObjectId(templateData.avatar_ref)
        : null,
    });
    await newMessageTemplate.save();
    return newMessageTemplate;
  } catch (error) {
    logger.error('Error creating message template:', error);
    throw new BadRequestError(
      ErrorMessages.MessageTemplate.CREATION_ERROR.message,
      ErrorMessages.MessageTemplate.CREATION_ERROR.code
    );
  }
};

/**
 * Retrieves a single message template by its ID, ensuring it belongs to the specified user.
 * @param templateId The ID of the message template to retrieve.
 * @param userId The ID of the user.
 * @returns The message template document, or null if not found or not owned by the user.
 */
export const getMessageTemplateById = async (
  templateId: string,
  userId: string
): Promise<IMessageTemplate | null> => {
  try {
    const messageTemplate = await MessageTemplateModel.findOne({
      _id: templateId,
      user_id: new Types.ObjectId(userId),
    });
    if (!messageTemplate) {
      logger.warn('Message template not found or not owned by user', {
        templateId,
        userId,
      });
      return null;
    }
    logger.info('Message template retrieved successfully', {
      templateId,
      userId,
    });
    return messageTemplate;
  } catch (error) {
    logger.error('Error retrieving message template:', error);
    if (error instanceof mongoose.Error.CastError) {
      logger.error('Cast error retrieving message template:', error);
      throw new BadRequestError(
        ErrorMessages.MessageTemplate.FETCH_ERROR.message,
        ErrorMessages.MessageTemplate.FETCH_ERROR.code
      );
    }
    throw new InternalServerError(
      ErrorMessages.MessageTemplate.FETCH_ERROR.message,
      ErrorMessages.MessageTemplate.FETCH_ERROR.code
    );
  }
};

/**
 * Retrieves all message templates belonging to a specific user with pagination.
 * @param userId The ID of the user.
 * @param page The page number for pagination.
 * @param limit The number of items per page.
 * @returns An object containing an array of message template documents and the total count.
 */
export const getMessageTemplatesByUserId = async (
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<{ messageTemplates: IMessageTemplate[]; total: number }> => {
  try {
    const skip = (page - 1) * limit;
    const messageTemplates = await MessageTemplateModel.find({
      user_id: new Types.ObjectId(userId),
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const total = await MessageTemplateModel.countDocuments({
      user_id: new Types.ObjectId(userId),
    });
    logger.info('Message templates retrieved successfully for user', {
      userId,
      count: messageTemplates.length,
      page,
      limit,
    });
    return { messageTemplates, total };
  } catch (error) {
    logger.error('Error retrieving message templates for user:', error);
    if (error instanceof mongoose.Error.CastError) {
      logger.error('Cast error retrieving message templates for user:', error);
      throw new BadRequestError(
        ErrorMessages.MessageTemplate.FETCH_ERROR.message,
        ErrorMessages.MessageTemplate.FETCH_ERROR.code
      );
    }
    throw new InternalServerError(
      ErrorMessages.MessageTemplate.FETCH_ERROR.message,
      ErrorMessages.MessageTemplate.FETCH_ERROR.code
    );
  }
};

/**
 * Updates an existing message template by its ID, ensuring it belongs to the specified user.
 * @param templateId The ID of the message template to update.
 * @param updateData The data to update the message template with.
 * @param userId The ID of the user.
 * @returns The updated message template document, or null if not found or not owned by the user.
 */
export const updateMessageTemplate = async (
  templateId: string,
  updateData: UpdateMessageTemplateData,
  userId: string
): Promise<IMessageTemplate | null> => {
  try {
    const messageTemplate = await MessageTemplateModel.findOneAndUpdate(
      { _id: templateId, user_id: new Types.ObjectId(userId) },
      { $set: updateData },
      { new: true }
    );
    if (!messageTemplate) {
      logger.warn(
        'Message template not found for update or not owned by user',
        { templateId, userId }
      );
      return null;
    }
    logger.info('Message template updated successfully', {
      templateId,
      userId,
    });
    return messageTemplate;
  } catch (error) {
    logger.error('Error updating message template:', error);
    if (error instanceof mongoose.Error.CastError) {
      logger.error('Cast error updating message template:', error);
      throw new BadRequestError(
        ErrorMessages.MessageTemplate.UPDATE_ERROR.message,
        ErrorMessages.MessageTemplate.UPDATE_ERROR.code
      );
    }
    throw new InternalServerError(
      ErrorMessages.MessageTemplate.UPDATE_ERROR.message,
      ErrorMessages.MessageTemplate.UPDATE_ERROR.code
    );
  }
};

/**
 * Deletes a message template by its ID, ensuring it belongs to the specified user.
 * @param templateId The ID of the message template to delete.
 * @param userId The ID of the user.
 * @returns True if the message template was deleted successfully, false otherwise.
 */
export const deleteMessageTemplate = async (
  templateId: string,
  userId: string
): Promise<boolean> => {
  try {
    const result = await MessageTemplateModel.findOneAndDelete({
      _id: templateId,
      user_id: new Types.ObjectId(userId),
    });
    if (!result) {
      logger.warn(
        'Message template not found for deletion or not owned by user',
        { templateId, userId }
      );
      return false;
    }
    logger.info('Message template deleted successfully', {
      templateId,
      userId,
    });
    return true;
  } catch (error) {
    logger.error('Error deleting message template:', error);
    if (error instanceof mongoose.Error.CastError) {
      logger.error('Cast error deleting message template:', error);
      throw new BadRequestError(
        ErrorMessages.MessageTemplate.DELETE_ERROR.message,
        ErrorMessages.MessageTemplate.DELETE_ERROR.code
      );
    }
    throw new InternalServerError(
      ErrorMessages.MessageTemplate.DELETE_ERROR.message,
      ErrorMessages.MessageTemplate.DELETE_ERROR.code
    );
  }
};
