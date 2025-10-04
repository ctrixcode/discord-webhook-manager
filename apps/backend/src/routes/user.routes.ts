import { FastifyInstance } from 'fastify';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middlewares';
import { getUsersQuerySchema } from '../schemas/user.schema';

const userRoutes = async (fastify: FastifyInstance) => {
  fastify.get(
    '/',
    { schema: getUsersQuerySchema, preHandler: [authenticate] },
    userController.getCurrentUser
  );
  fastify.get(
    '/me/usage',
    {
      preHandler: [authenticate],
    },
    userController.getUserUsageHandler
  );
};

export default userRoutes;
