import { FastifyInstance } from 'fastify';
import * as authController from '../controllers/auth.controller';
import { logger } from '../utils';
import { responseSchemas, successSchema } from '../schemas/shared.schema';
import authenticate from '../middlewares/auth';

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
            type: 'object',
            properties: {
              success: { type: 'boolean', default: true },
              message: { type: 'string' },
            },
            required: ['success', 'message'],
            example: {
              success: true,
              message: 'Logged out successfully',
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
            type: 'object',
            properties: {
              success: { type: 'boolean', default: true },
              message: { type: 'string' },
            },
            required: ['success', 'message'],
            example: {
              success: true,
              message: 'Verification email sent. Please check your inbox.',
            },
          },
          400: {
            description:
              'Bad request - validation errors (missing fields, email/username already in use, or email linked to another provider).',
            type: 'object',
            properties: {
              success: { type: 'boolean', default: false },
              message: { type: 'string' },
              code: { type: 'string' },
            },
          },
          429: {
            description: 'Too many requests - rate limit exceeded.',
            type: 'object',
            properties: {
              success: { type: 'boolean', default: false },
              message: { type: 'string' },
              code: { type: 'string' },
            },
            example: {
              success: false,
              message:
                'Too many verification emails sent. Please try again in 15 minutes.',
              code: 'RATE_LIMIT_EXCEEDED',
            },
          },
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
          400: {
            description:
              'Bad request - validation or authentication errors (missing credentials, invalid credentials, or email linked to another provider).',
            type: 'object',
            properties: {
              success: { type: 'boolean', default: false },
              message: { type: 'string' },
              code: { type: 'string' },
            },
          },
          404: {
            description: 'User not found.',
            type: 'object',
            properties: {
              success: { type: 'boolean', default: false },
              message: { type: 'string' },
              code: { type: 'string' },
            },
            example: {
              success: false,
              message: 'User not found.',
              code: 'USER_NOT_FOUND',
            },
          },
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
          400: {
            description:
              'Bad request - validation or token errors (missing token, invalid/expired token, token already used, email already in use, or user creation failed).',
            type: 'object',
            properties: {
              success: { type: 'boolean', default: false },
              message: { type: 'string' },
              code: { type: 'string' },
            },
          },
          500: responseSchemas[500]('Email verification failed.'),
        },
      },
    },
    authController.verifyEmail
  );

  fastify.get(
    '/discord',
    {
      preHandler: async (request, reply) => {
        // Only authenticate if state=link (for account linking)
        if (
          request.query &&
          (request.query as { state?: string; access_token?: string }).state ===
            'link'
        ) {
          // For browser redirects, we need to accept token from query parameter
          const queryParams = request.query as { access_token?: string };
          if (queryParams.access_token && !request.headers.authorization) {
            request.headers.authorization = `Bearer ${queryParams.access_token}`;
          }
          return authenticate(request, reply);
        }
      },
      schema: {
        summary: 'Discord login redirect',
        description:
          'Initiates the OAuth2 flow by redirecting the user to Discord for authentication. If state=link, requires authentication.',
        tags: ['auth'],
        querystring: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              description:
                'OAuth state - use "link" for account linking (requires authentication)',
            },
            access_token: {
              type: 'string',
              description:
                'Access token for authentication when state=link (required for browser redirects)',
            },
          },
        },
        response: {
          302: {
            description: 'Redirect to Discord for authentication.',
          },
          401: {
            description:
              'Unauthorized - authentication required for account linking.',
            type: 'object',
            properties: {
              success: { type: 'boolean', default: false },
              message: { type: 'string' },
              code: { type: 'string' },
            },
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
            description:
              'Bad request - missing authorization code or email already linked to another provider.',
            type: 'object',
            properties: {
              success: { type: 'boolean', default: false },
              message: { type: 'string' },
              code: { type: 'string' },
            },
          },
          500: {
            description:
              'Internal server error - failed to exchange code for token, fetch Discord user info, or create/update user.',
            type: 'object',
            properties: {
              success: { type: 'boolean', default: false },
              message: { type: 'string' },
              code: { type: 'string' },
            },
          },
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
          400: {
            description:
              'Bad request - missing authorization code, invalid email format, or email already linked to another provider.',
            type: 'object',
            properties: {
              success: { type: 'boolean', default: false },
              message: { type: 'string' },
              code: { type: 'string' },
            },
          },
          500: {
            description:
              'Internal server error - failed to exchange code for token, fetch Google user info, or create/update user.',
            type: 'object',
            properties: {
              success: { type: 'boolean', default: false },
              message: { type: 'string' },
              code: { type: 'string' },
            },
          },
        },
      },
    },
    authController.googleCallback
  );

  fastify.get(
    '/password/check',
    {
      preHandler: authenticate,
      schema: {
        summary: 'Check if user has password',
        description:
          'Returns whether the authenticated user has a password set, and their authentication methods.',
        tags: ['auth'],
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: 'Password status retrieved successfully.',
            ...successSchema({
              type: 'object',
              properties: {
                hasPassword: { type: 'boolean' },
              },
            }),
            example: {
              success: true,
              message: 'Password status retrieved successfully',
              data: {
                hasPassword: true,
              },
            },
          },
          401: responseSchemas[401],
          500: responseSchemas[500]('Could not check password status.'),
        },
      },
    },
    authController.checkPassword
  );

  fastify.post(
    '/password/change',
    {
      preHandler: authenticate,
      schema: {
        summary: 'Change or create password',
        description:
          'Changes the user password if one exists (requires current password), or creates a new password if none exists. All user sessions will be revoked after password change.',
        tags: ['auth'],
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['newPassword'],
          properties: {
            currentPassword: {
              type: 'string',
              description: 'Required if user already has a password',
            },
            newPassword: {
              type: 'string',
              minLength: 8,
              description: 'The new password (minimum 8 characters)',
            },
          },
        },
        response: {
          200: {
            description: 'Password changed or created successfully.',
            ...successSchema({
              type: 'object',
              properties: {},
            }),
            example: {
              success: true,
              message: 'Password changed successfully',
              data: {},
            },
          },
          400: {
            description:
              'Bad request - validation errors (missing fields, incorrect current password, or new password too short).',
            type: 'object',
            properties: {
              success: { type: 'boolean', default: false },
              message: { type: 'string' },
              code: { type: 'string' },
            },
          },
          401: responseSchemas[401],
          500: responseSchemas[500]('Could not change password.'),
        },
      },
    },
    authController.changePassword
  );
};

export default authRoutes;
