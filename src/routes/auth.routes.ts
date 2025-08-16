import { FastifyInstance } from 'fastify';
import * as authController from '../controllers/auth.controller';

const authRoutes = async (fastify: FastifyInstance) => {
  fastify.post('/refresh', authController.refreshAccessToken);
  fastify.post('/logout', authController.logoutUser);
  fastify.get('/discord', authController.discordLogin);
  fastify.get('/discord/callback', authController.discordCallback);
};

export default authRoutes;
