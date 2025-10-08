import { FastifyInstance } from 'fastify';
import * as authController from '../controllers/auth.controller';
import { responseSchemas } from '../schemas/shared.schema';

const authRoutes = async (fastify: FastifyInstance) => {
  fastify.post(
    '/refresh',
    {
      schema: {
        summary: 'Refresh access token',
        description:
          'Uses a refresh token from the request body to generate a new access token and a new refresh token.',
        tags: ['auth'],
        body: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: { type: 'string' },
          },
        },
        response: {
          200: {
            description: 'Successfully refreshed token.',
            type: 'object',
            properties: {
              accessToken: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              },
              refreshToken: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              },
            },
          },
          401: responseSchemas[401],
          500: responseSchemas[500]('Could not refresh token.'),
        },
      },
    },
    authController.refreshAccessToken
  );

  fastify.post(
    '/logout',
    {
      schema: {
        summary: 'Logout user',
        description:
          'Logs out the user by invalidating the provided refresh token.',
        tags: ['auth'],
        body: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: { type: 'string' },
          },
        },
        response: {
          200: {
            description: 'Successfully logged out.',
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Logged out' },
            },
          },
          401: responseSchemas[400]('Refresh token is required.'),
        },
      },
    },
    authController.logoutUser
  );

  fastify.get(
    '/discord',
    {
      schema: {
        summary: 'Discord login redirect',
        description:
          'Initiates the OAuth2 flow by redirecting the user to Discord for authentication.',
        tags: ['auth'],
        response: {
          302: {
            description: 'Redirect to Discord for authentication.',
          },
        },
      },
    },
    authController.discordLogin
  );

  fastify.get(
    '/discord/callback',
    {
      schema: {
        summary: 'Discord OAuth2 callback',
        description:
          'Handles the callback from Discord after successful authentication. Exchanges the authorization code for tokens and redirects to the frontend.',
        tags: ['auth'],
        querystring: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'The authorization code provided by Discord.',
            },
          },
          required: ['code'],
        },
        response: {
          302: {
            description: 'Redirect to the frontend application with tokens.',
          },
          400: responseSchemas[400]('Authorization code is missing.'),
          500: responseSchemas[500]('Failed to exchange code for token.'),
        },
      },
    },
    authController.discordCallback
  );
};

export default authRoutes;
