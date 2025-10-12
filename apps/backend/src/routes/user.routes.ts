import { FastifyInstance } from 'fastify';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middlewares';
import { getUsersQuerySchema } from '../schemas/user.schema';
import {
  responseSchemas,
  userProfileResponseSchema,
  userUsageResponseSchema,
} from '../schemas/shared.schema';

const userRoutes = async (fastify: FastifyInstance) => {
  fastify.get(
    '/',
    {
      preHandler: [authenticate],
      schema: {
        ...getUsersQuerySchema,
        summary: 'Get current user profile',
        security: [{ bearerAuth: [] }],
        description:
          'Retrieves the profile information for the currently authenticated user.',
        tags: ['user'],
        response: {
          200: {
            description: 'Current user profile details.',
            ...userProfileResponseSchema,
          },
          401: responseSchemas[401],
          500: responseSchemas[500]('Error fetching user profile'),
        },
      },
    },
    userController.getCurrentUser
  );

  fastify.get(
    '/me/usage',
    {
      preHandler: [authenticate],
      schema: {
        summary: 'Get user API usage',
        description:
          'Retrieves the API usage statistics for the currently authenticated user (e.g., number of webhooks, avatars).',
        tags: ['user'],
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: 'User API usage statistics.',
            ...userUsageResponseSchema,
          },
          401: responseSchemas[401],
          500: responseSchemas[500]('Error fetching user usage'),
        },
      },
    },
    userController.getUserUsageHandler
  );
};

export default userRoutes;
