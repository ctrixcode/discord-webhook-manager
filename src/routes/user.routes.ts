import { FastifyInstance } from 'fastify';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth';

const userRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/', { preHandler: [authenticate] }, userController.getUsers);
  fastify.get(
    '/:id',
    { preHandler: [authenticate] },
    userController.getUserById
  );
  fastify.put(
    '/:id',
    { preHandler: [authenticate] },
    userController.updateUser
  );
  fastify.delete(
    '/:id',
    { preHandler: [authenticate] },
    userController.deleteUser
  );
};

export default userRoutes;
