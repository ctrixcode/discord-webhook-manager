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
} from '../schemas/avatar.schema';

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
          201: { description: 'Avatar created successfully.' },
          400: { description: 'Invalid data provided.' },
          401: { description: 'Unauthorized.' },
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
        summary: 'Upload a new avatar file',
        description:
          'Uploads an avatar file for the authenticated user. The request must be multipart/form-data.',
        tags: ['avatar'],
        consumes: ['multipart/form-data'],
        response: {
          201: { description: 'Avatar uploaded successfully.' },
          400: { description: 'No file uploaded or file is too large.' },
          401: { description: 'Unauthorized.' },
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
          200: { description: 'A list of user avatars.' },
          401: { description: 'Unauthorized.' },
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
          200: { description: 'Avatar details.' },
          401: { description: 'Unauthorized.' },
          404: { description: 'Avatar not found.' },
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
          200: { description: 'Avatar updated successfully.' },
          400: { description: 'Invalid data provided.' },
          401: { description: 'Unauthorized.' },
          404: { description: 'Avatar not found.' },
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
          200: { description: 'Avatar deleted successfully.' },
          401: { description: 'Unauthorized.' },
          404: { description: 'Avatar not found.' },
        },
      },
    },
    deleteAvatar
  );
}

export default avatarRoutes;
