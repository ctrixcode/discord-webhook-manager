import { FastifyRequest, FastifyReply } from 'fastify';
import {
  createMessageTemplate,
  getMessageTemplateById,
  getMessageTemplatesByUserId,
  updateMessageTemplate,
  deleteMessageTemplate,
  CreateMessageTemplateData,
  UpdateMessageTemplateData,
} from '../services/message-template.service';
import { logger } from '../utils';
import { IMessageTemplateParams } from '../schemas/message-template.schema';
import { sendSuccessResponse } from '../utils/responseHandler';
import { HttpStatusCode } from '../utils/httpcode';
import {
  AuthenticationError,
  BadRequestError,
  NotFoundError,
} from '../utils/errors';
import { ErrorMessages } from '../utils/errorMessages';

export const createMessageTemplateHandler = async (
  request: FastifyRequest<{ Body: CreateMessageTemplateData }>,
  reply: FastifyReply
) => {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      throw new AuthenticationError(
        ErrorMessages.User.NOT_FOUND_ERROR.message,
        ErrorMessages.User.NOT_FOUND_ERROR.code
      );
    }
    const messageTemplate = await createMessageTemplate(userId, request.body);
    sendSuccessResponse(
      reply,
      HttpStatusCode.CREATED,
      'Message Template created',
      messageTemplate
    );
  } catch (error) {
    logger.error('Error creating message template:', error);
    throw error;
  }
};

export const getMessageTemplatesHandler = async (
  request: FastifyRequest<{ Querystring: { page?: string; limit?: string } }>,
  reply: FastifyReply
) => {
  const userId = request.user?.userId;
  if (!userId) {
    throw new AuthenticationError(
      ErrorMessages.User.NOT_FOUND_ERROR.message,
      ErrorMessages.User.NOT_FOUND_ERROR.code
    );
  }
  if (!request.query.page && !request.query.limit) {
    throw new BadRequestError(
      ErrorMessages.Generic.INVALID_INPUT_ERROR.message,
      ErrorMessages.Generic.INVALID_INPUT_ERROR.code
    );
  }
  const page = request.query.page ? parseInt(request.query.page, 10) : 1;
  const limit = request.query.limit ? parseInt(request.query.limit, 10) : 10;
  const { messageTemplates, total } = await getMessageTemplatesByUserId(
    userId,
    page,
    limit
  );
  sendSuccessResponse(reply, HttpStatusCode.OK, 'Message Templates fetched', {
    messageTemplates,
    total,
    page,
    limit,
  });
};

export const getMessageTemplateHandler = async (
  request: FastifyRequest<{ Params: IMessageTemplateParams }>,
  reply: FastifyReply
) => {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      throw new AuthenticationError(
        ErrorMessages.User.NOT_FOUND_ERROR.message,
        ErrorMessages.User.NOT_FOUND_ERROR.code
      );
    }
    const messageTemplate = await getMessageTemplateById(
      request.params.id,
      userId
    );
    if (!messageTemplate) {
      throw new NotFoundError(
        ErrorMessages.MessageTemplate.NOT_FOUND_ERROR.message,
        ErrorMessages.MessageTemplate.NOT_FOUND_ERROR.code
      );
    }
    sendSuccessResponse(
      reply,
      HttpStatusCode.OK,
      'Message Template fetched',
      messageTemplate
    );
  } catch (error) {
    logger.error('Error getting message template:', error);
    throw error;
  }
};

export const updateMessageTemplateHandler = async (
  request: FastifyRequest<{
    Params: IMessageTemplateParams;
    Body: UpdateMessageTemplateData;
  }>,
  reply: FastifyReply
) => {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      throw new AuthenticationError(
        ErrorMessages.User.NOT_FOUND_ERROR.message,
        ErrorMessages.User.NOT_FOUND_ERROR.code
      );
    }
    const messageTemplate = await updateMessageTemplate(
      request.params.id,
      request.body,
      userId
    );
    if (!messageTemplate) {
      throw new NotFoundError(
        ErrorMessages.MessageTemplate.NOT_FOUND_ERROR.message,
        ErrorMessages.MessageTemplate.NOT_FOUND_ERROR.code
      );
    }
    sendSuccessResponse(
      reply,
      HttpStatusCode.OK,
      'Message Template updated successfully',
      messageTemplate
    );
  } catch (error) {
    logger.error('Error updating message template:', error);
    throw error;
  }
};

export const deleteMessageTemplateHandler = async (
  request: FastifyRequest<{ Params: IMessageTemplateParams }>,
  reply: FastifyReply
) => {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      throw new AuthenticationError(
        ErrorMessages.User.NOT_FOUND_ERROR.message,
        ErrorMessages.User.NOT_FOUND_ERROR.code
      );
    }
    const success = await deleteMessageTemplate(request.params.id, userId);
    if (!success) {
      throw new NotFoundError(
        ErrorMessages.MessageTemplate.NOT_FOUND_ERROR.message,
        ErrorMessages.MessageTemplate.NOT_FOUND_ERROR.code
      );
    }
    sendSuccessResponse(reply, HttpStatusCode.NO_CONTENT);
  } catch (error) {
    logger.error('Error deleting message template:', error);
    throw error;
  }
};
