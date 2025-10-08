import { FastifyInstance } from 'fastify';
import * as authController from '../controllers/auth.controller';

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
          401: {
            description:
              'Unauthorized. The refresh token is invalid or expired.',
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Invalid or expired refresh token.',
              },
            },
          },
          500: {
            description: 'Internal Server Error. Could not refresh token.',
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
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
          401: {
            description: 'Unauthorized. No refresh token was provided.',
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Refresh token is required.',
              },
            },
          },
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
            description: 'Redirect to the frontend application with tokens.',
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
          400: {
            description: 'Bad Request. The authorization code is missing.',
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Authorization code is missing.',
              },
            },
          },
          500: {
            description:
              'Internal Server Error. Failed to exchange code for token.',
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Failed to exchange code for token.',
              },
            },
          },
        },
      },
    },
    authController.discordCallback
  );
};

export default authRoutes;
