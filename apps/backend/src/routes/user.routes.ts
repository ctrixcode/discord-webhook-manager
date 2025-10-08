import { FastifyInstance } from 'fastify';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middlewares';

const userRoutes = async (fastify: FastifyInstance) => {
  fastify.get(
    '/',
    {
      preHandler: [authenticate],
      schema: {
        summary: 'Get current user profile',
        description:
          'Retrieves the profile information for the currently authenticated user.',
        tags: ['user'],
        response: {
          200: { description: 'Current user profile details.' },
          401: { description: 'Error: Unauthorized.' },
          500: { description: 'Error: Internal Server Error' },
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
        response: {
          200: { description: 'User API usage statistics.' },
          401: { description: 'Error: Unauthorized.' },
          500: { description: 'Error: Internal Server Error' },
        },
      },
    },
    userController.getUserUsageHandler
  );
};

export default userRoutes;
