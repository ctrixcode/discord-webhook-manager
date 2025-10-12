import { FastifyInstance } from 'fastify';
import {
  createAvatar,
  getAvatar,
  getAvatars,
  updateAvatar,
  deleteAvatar,
  uploadAvatar,
} from '../controllers/avatar.controller';
import authenticate from '../middlewares/auth';
import {
  createAvatarSchema,
  updateAvatarSchema,
  avatarParamsSchema,
  uploadAvatarSchema,
} from '../schemas/avatar.schema';
import {
  responseSchemas,
  avatarResponseSchema,
  successSchema,
} from '../schemas/shared.schema';

async function avatarRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/',
    {
      preHandler: [authenticate],
      schema: {
        ...createAvatarSchema,
        summary: 'Create a new avatar from URL',
        security: [{ bearerAuth: [] }],
        description:
          'Creates a new avatar for the authenticated user using a provided image URL.',
        tags: ['avatar'],
        response: {
          201: {
            description: 'Avatar created successfully.',
            ...avatarResponseSchema,
            example: {
              success: true,
              message: 'Avatars fetched',
              data: [
                {
                  id: '68eab174e142f8399b831de8',
                  user_id: '68ea52307fcd6c887f459aa2',
                  username: 'bot1',
                  avatar_url: 'https://i.pravatar.cc/',
                  createdAt: '2025-10-11T19:35:17.007Z',
                  updatedAt: '2025-10-11T19:35:17.007Z',
                },
              ],
            },
          },

          400: responseSchemas[400]('Invalid username or avatar_url.'),
          401: responseSchemas[401],
          500: responseSchemas[500](
            'An unexpected error occurred while creating the avatar.'
          ),
        },
      },
    },
    createAvatar
  );

  fastify.post(
    '/upload',
    {
      preHandler: [authenticate],
      schema: {
        ...(() => {
          const { body, ...rest } = uploadAvatarSchema;
          return rest;
        })(),
        summary: 'Upload a new avatar file',
        security: [{ bearerAuth: [] }],
        description:
          'Uploads an avatar file for the authenticated user. The request must be multipart/form-data.',
        tags: ['avatar'],
        response: {
          201: {
            description: 'Avatar uploaded successfully.',
            ...successSchema(avatarResponseSchema),
            example: {
              success: true,
              data: {
                id: 'fsdfsdfsdfsd',
                createdAt: '2025-10-12T10:57:18.661Z',
                updatedAt: '2025-10-12T10:57:18.661Z',
                user_id: 'fdsffsdfsdfsdfsdf',
                username: 'dsads',
                avatar_url: '/uploads/avatars/68eb898baf62d378adc5d702-2.png',
              },
              message: 'Avatar created successfully',
            },
          },
          400: responseSchemas[400]('No file uploaded or file is too large.'),
          401: responseSchemas[401],
          500: responseSchemas[500](
            'An unexpected error occurred while uploading the avatar.'
          ),
        },
      },
    },
    uploadAvatar
  );

  fastify.get(
    '/',
    {
      preHandler: [authenticate],
      schema: {
        summary: 'Get all user avatars',
        description:
          'Retrieves a list of all avatars belonging to the authenticated user.',
        tags: ['avatar'],
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: 'A list of user avatars.',
            ...successSchema({ avatarResponseSchema }),

            example: {
              success: true,
              message: 'Avatars fetched',
              data: [
                {
                  id: '68eab174e142f8399b831de8',
                  user_id: '68ea52307fcd6c887f459aa2',
                  username: 'bot1',
                  avatar_url: 'https://i.pravatar.cc/',
                  createdAt: '2025-10-11T19:35:17.007Z',
                  updatedAt: '2025-10-11T19:35:17.007Z',
                },
              ],
            },
          },
          401: responseSchemas[401],
          500: responseSchemas[500](
            'An unexpected error occurred while fetching avatars.'
          ),
        },
      },
    },
    getAvatars
  );

  fastify.get(
    '/:id',
    {
      preHandler: [authenticate],
      schema: {
        ...avatarResponseSchema,
        summary: 'Get a specific avatar',
        description: 'Retrieves a single avatar by its ID.',
        tags: ['avatar'],
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: 'Avatar details.',
            ...successSchema(avatarResponseSchema),
            example: {
              success: true,
              message: 'Avatar fetched successfully',
              data: {
                id: '68eab174e142f8399b831de8',
                user_id: '68ea52307fcd6c887f459aa2',
                username: 'Avatar 1',
                avatar_url: 'https://i.pravatar.cc/',
                createdAt: '2025-10-11T19:35:17.007Z',
                updatedAt: '2025-10-12T04:57:56.825Z',
              },
            },
          },
          401: responseSchemas[401],
          404: responseSchemas[404]('Avatar not found'),
          500: responseSchemas[500](
            'An unexpected error occurred while fetching the avatar.'
          ),
        },
      },
    },
    getAvatar
  );

  fastify.put(
    '/:id',
    {
      preHandler: [authenticate],
      schema: {
        ...updateAvatarSchema,
        summary: 'Update an avatar',
        description: 'Updates the details of a specific avatar by its ID.',
        tags: ['avatar'],
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: 'Avatar updated successfully.',
            ...successSchema(avatarResponseSchema),
            example: {
              success: true,
              message: 'Avatar updated successfully',
              data: {
                id: '68eab174e142f8399b831de8',
                user_id: '68ea52307fcd6c887f459aa2',
                username: 'bot2',
                avatar_url: 'https://i.pravatar.cc/',
                createdAt: '2025-10-11T19:35:17.007Z',
                updatedAt: '2025-10-12T04:57:56.825Z',
              },
            },
          },
          400: responseSchemas[400]('Invalid username or avatar_url.'),
          401: responseSchemas[401],
          404: responseSchemas[404]('Avatar not found'),
          500: responseSchemas[500](
            'An unexpected error occurred while updating the avatar.'
          ),
        },
      },
    },
    updateAvatar
  );

  fastify.delete(
    '/:id',
    {
      preHandler: [authenticate],
      schema: {
        ...avatarParamsSchema,
        summary: 'Delete an avatar',
        description: 'Deletes a specific avatar by its ID.',
        tags: ['avatar'],
        security: [{ bearerAuth: [] }],
        response: {
          204: { type: 'null', description: 'Avatar deleted successfully.' },
          401: responseSchemas[401],
          404: responseSchemas[404]('Avatar not found'),
          500: responseSchemas[500](
            'An unexpected error occurred while deleting the avatar.'
          ),
        },
      },
    },
    deleteAvatar
  );
}

export default avatarRoutes;
