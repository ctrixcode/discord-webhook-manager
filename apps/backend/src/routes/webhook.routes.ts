import { FastifyInstance } from 'fastify';
import {
  createWebhookHandler,
  getWebhooksHandler,
  getWebhookHandler,
  updateWebhookHandler,
  deleteWebhookHandler,
  testWebhookHandler,
  sendMessageHandler,
} from '../controllers/webhook.controller';
import { authenticate } from '../middlewares';
import { SendMessageData } from '../services/webhook.service';
import {
  createWebhookSchema,
  updateWebhookSchema,
  webhookParamsSchema,
  getWebhooksQuerySchema,
  webhookSendMessageSchema,
} from '../schemas/webhook.schema';
import { CreateWebhookData, UpdateWebhookData } from '@repo/shared-types';

const webhookRoutes = async (server: FastifyInstance) => {
  server.post<{ Body: CreateWebhookData }>(
    '/',
    {
      preHandler: [authenticate],
      schema: {
        ...createWebhookSchema,
        summary: 'Create a new webhook',
        description: 'Creates a new webhook for the authenticated user.',
        tags: ['webhook'],
        response: {
          201: { description: 'Webhook created successfully.' },
          400: { description: 'Invalid data provided.' },
          401: { description: 'Error: Unauthorized.' },
          500: { description: 'Internal Server Error.' },
        },
      },
    },
    createWebhookHandler
  );

  server.get<{
    Querystring: { page?: string; limit?: string; status?: string };
  }>(
    '/',
    {
      preHandler: [authenticate],
      schema: {
        ...getWebhooksQuerySchema,
        summary: 'Get all user webhooks',
        description:
          'Retrieves a list of all webhooks belonging to the authenticated user, with pagination and status filtering.',
        tags: ['webhook'],
        response: {
          200: { description: 'A list of user webhooks.' },
          401: { description: 'Error: Unauthorized.' },
          500: { description: 'Internal Server Error.' },
        },
      },
    },
    getWebhooksHandler
  );

  server.get<{ Params: { id: string } }>(
    '/:id',
    {
      preHandler: [authenticate],
      schema: {
        ...webhookParamsSchema,
        summary: 'Get a specific webhook',
        description: 'Retrieves a single webhook by its ID.',
        tags: ['webhook'],
        response: {
          200: { description: 'Webhook details.' },
          401: { description: 'Error: Unauthorized.' },
          404: { description: 'Webhook not found.' },
          500: { description: 'Internal Server Error.' },
        },
      },
    },
    getWebhookHandler
  );

  server.put<{ Body: UpdateWebhookData; Params: { id: string } }>(
    '/:id',
    {
      preHandler: [authenticate],
      schema: {
        ...updateWebhookSchema,
        summary: 'Update a webhook',
        description: 'Updates the details of a specific webhook by its ID.',
        tags: ['webhook'],
        response: {
          200: { description: 'Webhook updated successfully.' },
          400: { description: 'Invalid data provided.' },
          401: { description: 'Error: Unauthorized.' },
          404: { description: 'Webhook not found.' },
          500: { description: 'Internal Server Error.' },
        },
      },
    },
    updateWebhookHandler
  );

  server.delete<{ Params: { id: string } }>(
    '/:id',
    {
      preHandler: [authenticate],
      schema: {
        ...webhookParamsSchema,
        summary: 'Delete a webhook',
        description: 'Deletes a specific webhook by its ID.',
        tags: ['webhook'],
        response: {
          200: { description: 'Webhook deleted successfully.' },
          401: { description: 'Error: Unauthorized.' },
          404: { description: 'Webhook not found.' },
          500: { description: 'Internal Server Error.' },
        },
      },
    },
    deleteWebhookHandler
  );

  server.post<{ Params: { id: string } }>(
    '/:id/test',
    {
      preHandler: [authenticate],
      schema: {
        ...webhookParamsSchema,
        summary: 'Test a webhook',
        description:
          'Sends a test message to the specified webhook to verify its functionality.',
        tags: ['webhook'],
        response: {
          200: { description: 'Test message sent successfully.' },
          401: { description: 'Error: Unauthorized.' },
          404: { description: 'Webhook not found.' },
        },
      },
    },
    testWebhookHandler
  );

  server.post<{ Body: { webhookIds: string[]; messageData: SendMessageData } }>(
    '/send-message',
    {
      preHandler: [authenticate],
      schema: {
        ...webhookSendMessageSchema,
        summary: 'Send a message via webhooks',
        description:
          'Sends a message to one or more specified webhooks using provided message data.',
        tags: ['webhook'],
        response: {
          200: { description: 'Message sent successfully.' },
          400: { description: 'Invalid data provided.' },
          401: { description: 'Error: Unauthorized.' },
          500: { description: 'Failed to send message.' },
        },
      },
    },
    sendMessageHandler
  );
};

export default webhookRoutes;
