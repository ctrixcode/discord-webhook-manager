import { FastifyInstance } from 'fastify';
import {
  createMessageTemplateHandler,
  getMessageTemplatesHandler,
  getMessageTemplateHandler,
  updateMessageTemplateHandler,
  deleteMessageTemplateHandler,
} from '../controllers/message-template.controller';
import { authenticate } from '../middlewares';
import {
  CreateMessageTemplateRequest,
  UpdateMessageTemplateRequest,
} from '@repo/shared-types';
import {
  createMessageTemplateSchema,
  updateMessageTemplateSchema,
  messageTemplateParamsSchema,
  getMessageTemplatesQuerySchema,
  IMessageTemplateParams,
} from '../schemas/message-template.schema';

import {
  responseSchemas,
  messageTemplateResponseSchema,
} from '../schemas/shared.schema';

const messageTemplateRoutes = async (server: FastifyInstance) => {
  server.post<{ Body: CreateMessageTemplateRequest }>(
    '/',
    {
      preHandler: [authenticate],
      schema: {
        ...createMessageTemplateSchema,
        summary: 'Create a new message template',
        description:
          'Creates a new message template for the authenticated user.',
        tags: ['message-template'],
        response: {
          201: {
            description: 'Message template created successfully.',
            ...messageTemplateResponseSchema,
          },
          400: responseSchemas[400](),
          401: responseSchemas[401],
          500: responseSchemas[500]('Error creating message template'),
        },
      },
    },

    createMessageTemplateHandler
  );

  server.get<{ Querystring: { page?: string; limit?: string } }>(
    '/',
    {
      preHandler: [authenticate],
      schema: {
        ...getMessageTemplatesQuerySchema,
        summary: 'Get all message templates',
        description:
          'Retrieves a list of all message templates belonging to the authenticated user, with pagination.',
        tags: ['message-template'],
        response: {
          200: {
            description: 'A paginated list of user message templates.',
            type: 'object',
            properties: {
              data: {
                messageTemplates: {
                  type: 'array',
                  items: messageTemplateResponseSchema,
                },
              },
              total: { type: 'number' },
              page: { type: 'number' },
              limit: { type: 'number' },
            },
          },
          401: responseSchemas[401],
          500: responseSchemas[500]('Error fetching message templates'),
        },
      },
    },
    getMessageTemplatesHandler
  );

  server.get<{ Params: IMessageTemplateParams }>(
    '/:id',
    {
      preHandler: [authenticate],
      schema: {
        ...messageTemplateParamsSchema,
        summary: 'Get a specific message template',
        description: 'Retrieves a single message template by its ID.',
        tags: ['message-template'],
        response: {
          200: {
            description: 'Message template details.',
            ...messageTemplateResponseSchema,
          },
          401: responseSchemas[401],
          404: responseSchemas[404]('Message template not found'),
          500: responseSchemas[500]('Error fetching message template'),
        },
      },
    },
    getMessageTemplateHandler
  );

  server.put<{
    Params: IMessageTemplateParams;
    Body: UpdateMessageTemplateRequest;
  }>(
    '/:id',
    {
      preHandler: [authenticate],
      schema: {
        ...updateMessageTemplateSchema,
        summary: 'Update a message template',
        description:
          'Updates the details of a specific message template by its ID.',
        tags: ['message-template'],
        response: {
          200: {
            description: 'Message template updated successfully.',
            ...messageTemplateResponseSchema,
          },
          400: responseSchemas[400](),
          401: responseSchemas[401],
          404: responseSchemas[404]('Message template not found'),
          500: responseSchemas[500]('Error updating message template'),
        },
      },
    },
    updateMessageTemplateHandler
  );

  server.delete<{ Params: IMessageTemplateParams }>(
    '/:id',
    {
      preHandler: [authenticate],
      schema: {
        ...messageTemplateParamsSchema,
        summary: 'Delete a message template',
        description: 'Deletes a specific message template by its ID.',
        tags: ['message-template'],
        response: {
          204: {
            description: 'Message template deleted successfully.',
            type: 'null',
          },
          401: responseSchemas[401],
          404: responseSchemas[404]('Message template not found'),
          500: responseSchemas[500]('Error deleting message template'),
        },
      },
    },
    deleteMessageTemplateHandler
  );
};

export default messageTemplateRoutes;
