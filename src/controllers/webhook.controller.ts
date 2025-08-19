import { FastifyRequest, FastifyReply } from 'fastify';
import {
  createWebhook,
  getWebhooksByUserId,
  getWebhookById,
  updateWebhook,
  deleteWebhook,
  CreateWebhookData,
  UpdateWebhookData,
} from '../services/webhook.service';
import { logger, toWebhookDto } from '../utils';

export const createWebhookHandler = async (
  request: FastifyRequest<{ Body: CreateWebhookData }>,
  reply: FastifyReply
) => {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      return reply.code(401).send({ message: 'Unauthorized' });
    }
    const webhook = await createWebhook(request.body, userId);
    reply.code(201).send(toWebhookDto(webhook));
  } catch (error) {
    logger.error('Error creating webhook:', error);
    reply.code(500).send({ message: 'Internal Server Error' });
  }
};

export const getWebhooksHandler = async (
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
    const { webhooks, total } = await getWebhooksByUserId(userId, page, limit);
    reply.send({ webhooks: webhooks.map(toWebhookDto), total, page, limit });
  } catch (error) {
    logger.error('Error getting webhooks:', error);
    reply.code(500).send({ message: 'Internal Server Error' });
  }
};

export const getWebhookHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      return reply.code(401).send({ message: 'Unauthorized' });
    }
    const webhook = await getWebhookById(request.params.id, userId);
    if (!webhook) {
      return reply.code(404).send({ message: 'Webhook not found' });
    }
    reply.send(toWebhookDto(webhook));
  } catch (error) {
    logger.error('Error getting webhook:', error);
    reply.code(500).send({ message: 'Internal Server Error' });
  }
};

export const updateWebhookHandler = async (
  request: FastifyRequest<{ Params: { id: string }; Body: UpdateWebhookData }>,
  reply: FastifyReply
) => {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      return reply.code(401).send({ message: 'Unauthorized' });
    }
    const webhook = await updateWebhook(
      request.params.id,
      request.body,
      userId
    );
    if (!webhook) {
      return reply.code(404).send({ message: 'Webhook not found' });
    }
    reply.send(toWebhookDto(webhook));
  } catch (error) {
    logger.error('Error updating webhook:', error);
    reply.code(500).send({ message: 'Internal Server Error' });
  }
};

export const deleteWebhookHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      return reply.code(401).send({ message: 'Unauthorized' });
    }
    const success = await deleteWebhook(request.params.id, userId);
    if (!success) {
      return reply.code(404).send({ message: 'Webhook not found' });
    }
    reply.code(204).send({
      success: true,
      message: 'Webhook deleted successfully',
      data: null,
    });
  } catch (error) {
    logger.error('Error deleting webhook:', error);
    reply.code(500).send({ message: 'Internal Server Error' });
  }
};
