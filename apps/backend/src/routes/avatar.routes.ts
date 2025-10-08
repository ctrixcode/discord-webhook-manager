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
} from '../schemas/shared.schema';

async function avatarRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/',
    {
      preHandler: [authenticate],
      schema: {
        ...createAvatarSchema,
        summary: 'Create a new avatar from URL',
        description:
          'Creates a new avatar for the authenticated user using a provided image URL.',
        tags: ['avatar'],
        response: {
          201: {
            description: 'Avatar created successfully.',
            ...avatarResponseSchema,
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
        ...uploadAvatarSchema,
        summary: 'Upload a new avatar file',
        description:
          'Uploads an avatar file for the authenticated user. The request must be multipart/form-data.',
        tags: ['avatar'],
        response: {
          201: {
            description: 'Avatar uploaded successfully.',
            ...avatarResponseSchema,
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
        response: {
          200: {
            description: 'A list of user avatars.',
            type: 'array',
            items: avatarResponseSchema,
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
        ...avatarParamsSchema,
        summary: 'Get a specific avatar',
        description: 'Retrieves a single avatar by its ID.',
        tags: ['avatar'],
        response: {
          200: { description: 'Avatar details.', ...avatarResponseSchema },
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
        response: {
          200: {
            description: 'Avatar updated successfully.',
            ...avatarResponseSchema,
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
