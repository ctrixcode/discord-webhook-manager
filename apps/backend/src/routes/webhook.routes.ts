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
  successSchema,
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
            ...successSchema(webhookResponseSchema),
            example: {
              success: true,
              message: 'Webhook created successfully.',
              data: {
                id: '68ecb174e142f8399b831df5',
                user_id: '68ea52307fcd6c887f459aa2',
                name: 'My New Webhook',
                url: 'https://discord.com/api/webhooks/123456789/abcdef-ghijkl',
                status: 'active',
                createdAt: '2025-10-14T12:00:00.000Z',
                updatedAt: '2025-10-14T12:00:00.000Z',
              },
            },
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
              success: { type: 'boolean' },
              message: { type: 'string' },
              data: {
                type: 'object',
                properties: {
                  webhooks: {
                    type: 'array',
                    items: webhookResponseSchema,
                  },
                  total: { type: 'number' },
                  page: { type: 'number' },
                  limit: { type: 'number' },
                },
              },
            },
            example: {
              success: true,
              message: 'Webhooks fetched successfully',
              data: {
                webhooks: [
                  {
                    id: '68ecb174e142f8399b831df5',
                    user_id: '68ea52307fcd6c887f459aa2',
                    name: 'My New Webhook',
                    url: 'https://discord.com/api/webhooks/123456789/abcdef-ghijkl',
                    status: 'active',
                    createdAt: '2025-10-14T12:00:00.000Z',
                    updatedAt: '2025-10-14T12:00:00.000Z',
                  },
                ],
                total: 1,
                page: 1,
                limit: 10,
              },
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
          200: {
            description: 'Webhook details.',
            ...successSchema(webhookResponseSchema),
            example: {
              success: true,
              message: 'Webhook fetched successfully',
              data: {
                id: '68ecb174e142f8399b831df5',
                user_id: '68ea52307fcd6c887f459aa2',
                name: 'My New Webhook',
                url: 'https://discord.com/api/webhooks/123456789/abcdef-ghijkl',
                status: 'active',
                createdAt: '2025-10-14T12:00:00.000Z',
                updatedAt: '2025-10-14T12:30:00.000Z',
              },
            },
          },
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
            ...successSchema(webhookResponseSchema),
            example: {
              success: true,
              message: 'Webhook updated successfully',
              data: {
                id: '68ecb174e142f8399b831df5',
                user_id: '68ea52307fcd6c887f459aa2',
                name: 'My Updated Webhook',
                url: 'https://discord.com/api/webhooks/123456789/abcdef-ghijkl',
                status: 'inactive',
                createdAt: '2025-10-14T12:00:00.000Z',
                updatedAt: '2025-10-14T13:00:00.000Z',
              },
            },
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
          204: {
            description: 'Webhook deleted successfully.',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
            },
          },
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
              success: { type: 'boolean' },
              message: { type: 'string' },
            },
            example: {
              success: true,
              message: 'Webhook tested successfully',
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
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    webhookId: { type: 'string' },
                    status: { type: 'string', enum: ['success', 'failed'] },
                    error: { type: 'string', nullable: true },
                  },
                },
              },
            },
            example: {
              success: true,
              message: 'Message sent successfully',
              data: [
                {
                  webhookId: '68ecb174e142f8399b831df5',
                  status: 'success',
                  error: null,
                },
              ],
            },
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
