import { FastifyInstance } from 'fastify';
import * as userController from '../controllers/user.controller';

const userRoutes = async (
  fastify: FastifyInstance
) => {
  fastify.post('/', userController.createUser);
  fastify.get('/', userController.getUsers);
  fastify.get('/:id', userController.getUserById);
  fastify.put('/:id', userController.updateUser);
  fastify.delete('/:id', userController.deleteUser);
};

export default userRoutes;
