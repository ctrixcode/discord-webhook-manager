import { FastifyInstance } from 'fastify';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth';
import {
  UserQuery,
  UserParams,
  UpdateUserData,
} from '../services/user.service';

const userRoutes = async (fastify: FastifyInstance) => {
  fastify.get<{ Querystring: UserQuery }>(
    '/',
    { preHandler: [authenticate] },
    userController.getCurrentUser
  );
  fastify.get<{ Params: UserParams }>(
    '/:id',
    { preHandler: [authenticate] },
    userController.getUserById
  );
  fastify.put<{ Params: UserParams; Body: UpdateUserData }>(
    '/:id',
    { preHandler: [authenticate] },
    userController.updateUser
  );
  fastify.delete<{ Params: UserParams }>(
    '/:id',
    { preHandler: [authenticate] },
    userController.deleteUser
  );
};

export default userRoutes;
