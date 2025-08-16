import { FastifyInstance } from 'fastify';
import * as authController from '../controllers/auth.controller';

const authRoutes = async (fastify: FastifyInstance) => {
  fastify.post('/register', authController.registerUser);
  fastify.post('/login', authController.loginUser);
  fastify.post('/refresh', authController.refreshAccessToken);
  fastify.post('/logout', authController.logoutUser);
};

export default authRoutes;
