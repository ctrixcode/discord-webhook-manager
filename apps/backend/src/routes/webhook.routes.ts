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
import {
  responseSchemas,
  webhookResponseSchema,
} from '../schemas/shared.schema';

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
        security: [{ bearerAuth: [] }],
        response: {
          201: {
            description: 'Webhook created successfully.',
            ...webhookResponseSchema,
          },
          400: responseSchemas[400](),
          401: responseSchemas[401],
          500: responseSchemas[500]('Error creating webhook'),
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
        security: [{ bearerAuth: [] }],
        description:
          'Retrieves a list of all webhooks belonging to the authenticated user, with pagination and status filtering.',
        tags: ['webhook'],
        response: {
          200: {
            description: 'A list of user webhooks.',
            type: 'object',
            properties: {
              data: {
                webhooks: {
                  type: 'array',
                  items: webhookResponseSchema,
                },
              },
              total: { type: 'number' },
              page: { type: 'number' },
              limit: { type: 'number' },
              success: { type: 'boolean', default: true },
            },
          },
          401: responseSchemas[401],
          500: responseSchemas[500]('Error fetching webhooks'),
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
        security: [{ bearerAuth: [] }],
        description: 'Retrieves a single webhook by its ID.',
        tags: ['webhook'],
        response: {
          200: { description: 'Webhook details.', ...webhookResponseSchema },
          401: responseSchemas[401],
          404: responseSchemas[404]('Webhook not found'),
          500: responseSchemas[500]('Error fetching webhook'),
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
        security: [{ bearerAuth: [] }],
        description: 'Updates the details of a specific webhook by its ID.',
        tags: ['webhook'],
        response: {
          200: {
            description: 'Webhook updated successfully.',
            ...webhookResponseSchema,
          },
          400: responseSchemas[400](),
          401: responseSchemas[401],
          404: responseSchemas[404]('Webhook not found'),
          500: responseSchemas[500]('Error updating webhook'),
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
        security: [{ bearerAuth: [] }],
        description: 'Deletes a specific webhook by its ID.',
        tags: ['webhook'],
        response: {
          204: { description: 'Webhook deleted successfully.', type: 'null' },
          401: responseSchemas[401],
          404: responseSchemas[404]('Webhook not found'),
          500: responseSchemas[500]('Error deleting webhook'),
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
        security: [{ bearerAuth: [] }],
        description:
          'Sends a test message to the specified webhook to verify its functionality.',
        tags: ['webhook'],
        response: {
          200: {
            description: 'Test message sent successfully.',
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Test message sent successfully',
              },
            },
          },
          401: responseSchemas[401],
          404: responseSchemas[404]('Webhook not found'),
          500: responseSchemas[500]('Error sending test message'),
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
        security: [{ bearerAuth: [] }],
        description:
          'Sends a message to one or more specified webhooks using provided message data.',
        tags: ['webhook'],
        response: {
          200: {
            description: 'Message sent successfully.',
            type: 'object',
            properties: { message: { type: 'string' } },
          },
          400: responseSchemas[400](),
          401: responseSchemas[401],
          500: responseSchemas[500]('Failed to send message'),
        },
      },
    },
    sendMessageHandler
  );
};

export default webhookRoutes;
