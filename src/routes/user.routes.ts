import { FastifyInstance } from 'fastify';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middlewares';
import { UpdateUserData } from '../services/user.service';
import {
  updateUserSchema,
  userParamsSchema,
  getUsersQuerySchema,
} from '../schemas/user.schema';
import { userUsageResponseSchema } from '../schemas/user-usage.schema';

const userRoutes = async (fastify: FastifyInstance) => {
  fastify.get(
    '/',
    { schema: getUsersQuerySchema, preHandler: [authenticate] },
    userController.getCurrentUser
  );
  fastify.get<{ Params: { id: string } }>(
    '/:id',
    { schema: userParamsSchema, preHandler: [authenticate] },
    userController.getUserById
  );
  fastify.put<{ Body: UpdateUserData; Params: { id: string } }>(
    '/:id',
    { schema: updateUserSchema, preHandler: [authenticate] },
    userController.updateUser
  );
  fastify.delete<{ Params: { id: string } }>(
    '/:id',
    { schema: userParamsSchema, preHandler: [authenticate] },
    userController.deleteUser
  );

  fastify.get(
    '/me/usage',
    {
      preHandler: [authenticate], // Authentication is required
      schema: {
        response: {
          200: userUsageResponseSchema, // Add response schema
        },
      },
    },
    userController.getUserUsageHandler
  );
};

export default userRoutes;
