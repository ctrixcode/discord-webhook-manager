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
            example: {
              success: true,
              message: 'User fetched successfully',
              data: {
                id: '68ea52307fcd6c887f459aa2',
                createdAt: '2025-10-11T12:48:48.101Z',
                updatedAt: '2025-10-12T07:26:46.723Z',
                display_name: 'John Doe',
                username: 'dsaasda23213',
                email: 'dsadasdasd@gmail.com',
                google_id: '987654321098765432',
                google_avatar: 'https://lh3.googleusercontent.com/a/example',
                discord_id: '1233423423423423',
                discord_avatar: 'https://cdn.discordapp.com/avatars/x/x9.png',
                accountType: 'free',
              },
            },
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
            example: {
              success: true,
              message: 'User usage fetched successfully',
              data: {
                webhookMessagesSentToday: 2,
                totalMediaStorageUsed: 0,
                dailyWebhookMessageLimit: 15,
                overallMediaStorageLimit: 15728640,
              },
            },
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
