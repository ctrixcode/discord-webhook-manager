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

export const createMessageTemplateHandler = async (
  request: FastifyRequest<{ Body: CreateMessageTemplateData }>,
  reply: FastifyReply
) => {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      return reply.code(401).send({ message: 'Unauthorized' });
    }
    const messageTemplate = await createMessageTemplate(userId, request.body);
    reply.code(201).send(messageTemplate);
  } catch (error) {
    logger.error('Error creating message template:', error);
    reply.code(500).send({ message: 'Internal Server Error' });
  }
};

export const getMessageTemplatesHandler = async (
  request: FastifyRequest<{ Querystring: { page?: string; limit?: string } }>,
  reply: FastifyReply
) => {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      return reply.code(401).send({ message: 'Unauthorized' });
    }
    const page = request.query.page ? parseInt(request.query.page, 10) : 1;
    const limit = request.query.limit ? parseInt(request.query.limit, 10) : 10;
    const { messageTemplates, total } = await getMessageTemplatesByUserId(
      userId,
      page,
      limit
    );
    reply.send({ messageTemplates, total, page, limit });
  } catch (error) {
    logger.error('Error getting message templates:', error);
    reply.code(500).send({ message: 'Internal Server Error' });
  }
};

export const getMessageTemplateHandler = async (
  request: FastifyRequest<{ Params: IMessageTemplateParams }>,
  reply: FastifyReply
) => {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      return reply.code(401).send({ message: 'Unauthorized' });
    }
    const messageTemplate = await getMessageTemplateById(
      request.params.id,
      userId
    );
    if (!messageTemplate) {
      return reply.code(404).send({ message: 'Message Template not found' });
    }
    reply.send(messageTemplate);
  } catch (error) {
    logger.error('Error getting message template:', error);
    reply.code(500).send({ message: 'Internal Server Error' });
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
      return reply.code(401).send({ message: 'Unauthorized' });
    }
    const messageTemplate = await updateMessageTemplate(
      request.params.id,
      request.body,
      userId
    );
    if (!messageTemplate) {
      return reply.code(404).send({ message: 'Message Template not found' });
    }
    reply.send(messageTemplate);
  } catch (error) {
    logger.error('Error updating message template:', error);
    reply.code(500).send({ message: 'Internal Server Error' });
  }
};

export const deleteMessageTemplateHandler = async (
  request: FastifyRequest<{ Params: IMessageTemplateParams }>,
  reply: FastifyReply
) => {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      return reply.code(401).send({ message: 'Unauthorized' });
    }
    const success = await deleteMessageTemplate(request.params.id, userId);
    if (!success) {
      return reply.code(404).send({ message: 'Message Template not found' });
    }
    reply.code(204).send();
  } catch (error) {
    logger.error('Error deleting message template:', error);
    reply.code(500).send({ message: 'Internal Server Error' });
  }
};
