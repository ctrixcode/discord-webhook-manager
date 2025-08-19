import { FastifyInstance } from 'fastify';
import {
  createAvatar,
  getAvatar,
  getAvatars,
  updateAvatar,
  deleteAvatar,
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
      schema: createAvatarSchema,
    },
    createAvatar
  );

  fastify.get('/', { preHandler: [authenticate] }, getAvatars);

  fastify.get(
    '/:id',
    {
      preHandler: [authenticate],
      schema: avatarParamsSchema,
    },
    getAvatar
  );

  fastify.put(
    '/:id',
    {
      preHandler: [authenticate],
      schema: updateAvatarSchema,
    },
    updateAvatar
  );

  fastify.delete(
    '/:id',
    {
      preHandler: [authenticate],
      schema: avatarParamsSchema,
    },
    deleteAvatar
  );
}

export default avatarRoutes;
