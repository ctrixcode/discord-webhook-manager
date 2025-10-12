import { FastifyInstance } from 'fastify';
import * as authController from '../controllers/auth.controller';
import { responseSchemas, successSchema } from '../schemas/shared.schema';

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
          example: {
            refreshToken:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2Njg5N2M5YjYyNjM5OTc3M2U3NjQyOWMiLCJpYXQiOjE3MjA0MTg5MDgsImV4cCI6MTcyMTAyMzcwOH0.somerandomrefreshtoken',
          },
        },
        response: {
          200: {
            description: 'Successfully refreshed token.',
            ...successSchema({
              type: 'object',
              properties: {
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' },
              },
            }),
            example: {
              success: true,
              message: 'Access token refreshed successfully',
              data: {
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
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
          example: {
            refreshToken:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2Njg5N2M5YjYyNjM5OTc3M2U3NjQyOWMiLCJpYXQiOjE3MjA0MTg5MDgsImV4cCI6MTcyMTAyMzcwOH0.somerandomrefreshtoken',
          },
        },
        response: {
          200: {
            description: 'Successfully logged out.',
            ...successSchema({
              type: 'object',
              properties: {},
            }),
            example: {
              success: true,
              message: 'Logged out successfully',
              data: {},
            },
          },
          401: responseSchemas[401],
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