import { FastifyInstance } from 'fastify';
import * as authController from '../controllers/auth.controller';
import { logger } from '../utils';
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

  // Rate limited email verification endpoint to prevent spam/abuse
  fastify.post(
    '/email/send-verification',
    {
      schema: {
        summary: 'Send email verification',
        description:
          'Sends a verification email to the provided email address with signup details. Rate limited to 3 requests per 15 minutes.',
        tags: ['auth'],
        body: {
          type: 'object',
          required: ['email', 'password', 'displayName', 'username'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
            displayName: { type: 'string' },
            username: { type: 'string' },
          },
        },
        response: {
          200: {
            description: 'Verification email sent successfully.',
            ...successSchema({
              type: 'object',
              properties: {},
            }),
            example: {
              success: true,
              message: 'Verification email sent. Please check your inbox.',
              data: {},
            },
          },
          400: responseSchemas[400]('Missing required signup fields.'),
          500: responseSchemas[500]('Could not send verification email.'),
        },
      },
      config: {
        rateLimit: {
          max: 3, // 3 requests
          timeWindow: '15 minutes', // per 15 minutes
          errorResponseBuilder: request => {
            logger.warn('Rate limit exceeded for email verification', {
              ip: request.ip,
              endpoint: '/email/send-verification',
            });
            return {
              success: false,
              message:
                'Too many verification emails sent. Please try again in 15 minutes.',
              code: 'RATE_LIMIT_EXCEEDED',
            };
          },
        },
      },
    },
    authController.sendEmailVerification
  );

  fastify.post(
    '/email/login',
    {
      schema: {
        summary: 'Email login',
        description:
          'Authenticates a user with email and password and returns access and refresh tokens.',
        tags: ['auth'],
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
        response: {
          200: {
            description: 'Successfully logged in.',
            ...successSchema({
              type: 'object',
              properties: {
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' },
              },
            }),
            example: {
              success: true,
              message: 'Login successful',
              data: {
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              },
            },
          },
          400: responseSchemas[400]('Missing email or password.'),
          401: responseSchemas[401],
          500: responseSchemas[500]('Login failed.'),
        },
      },
    },
    authController.emailLogin
  );

  fastify.post(
    '/email/verify',
    {
      schema: {
        summary: 'Verify email',
        description:
          'Verifies a user email address using the verification token sent via email and returns access and refresh tokens.',
        tags: ['auth'],
        body: {
          type: 'object',
          required: ['token'],
          properties: {
            token: { type: 'string' },
          },
        },
        response: {
          200: {
            description: 'Email verified successfully.',
            ...successSchema({
              type: 'object',
              properties: {
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' },
              },
            }),
            example: {
              success: true,
              message: 'Email verified successfully',
              data: {
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              },
            },
          },
          400: responseSchemas[400]('Missing verification token.'),
          500: responseSchemas[500]('Email verification failed.'),
        },
      },
    },
    authController.verifyEmail
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

  fastify.get(
    '/google',
    {
      schema: {
        summary: 'Google login redirect',
        description:
          'Initiates the OAuth2 flow by redirecting the user to Google for authentication.',
        tags: ['auth'],
        response: {
          302: {
            description: 'Redirect to Google for authentication.',
          },
        },
      },
    },
    authController.googleLogin
  );

  fastify.get(
    '/google/callback',
    {
      schema: {
        summary: 'Google OAuth2 callback',
        description:
          'Handles the callback from Google after successful authentication. Exchanges the authorization code for tokens and redirects to the frontend.',
        tags: ['auth'],
        querystring: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'The authorization code provided by Google.',
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
    authController.googleCallback
  );
};

export default authRoutes;