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
          201: { description: 'Message template created successfully.' },
          400: { description: 'Invalid data provided.' },
          401: { description: 'Error: Unauthorized.' },
          500: { description: 'Error: Internal Server Error' },
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
          200: { description: 'A list of user message templates.' },
          401: { description: 'Error: Unauthorized.' },
          500: { description: 'Error: Internal Server Error' },
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
          200: { description: 'Message template details.' },
          401: { description: 'Error: Unauthorized.' },
          404: { description: 'Message template not found.' },
          500: { description: 'Error: Internal Server Error' },
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
          200: { description: 'Message template updated successfully.' },
          400: { description: 'Invalid data provided.' },
          401: { description: 'Error: Unauthorized.' },
          404: { description: 'Message template not found.' },
          500: { description: 'Error: Internal Server Error' },
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
          200: { description: 'Message template deleted successfully.' },
          401: { description: 'Error: Unauthorized.' },
          404: { description: 'Message template not found.' },
          500: { description: 'Error: Internal Server Error' },
        },
      },
    },
    deleteMessageTemplateHandler
  );
};

export default messageTemplateRoutes;
