import { FastifyInstance } from 'fastify';
import * as authController from '../controllers/auth.controller';
import authenticate from '../middlewares/auth'; // New import

const authRoutes = async (fastify: FastifyInstance) => {
  fastify.post('/refresh', authController.refreshAccessToken);
  fastify.post('/logout', { preHandler: [authenticate] }, authController.logoutUser); // Modified
  fastify.get('/discord', authController.discordLogin);
  fastify.get('/discord/callback', authController.discordCallback);
};

export default authRoutes;
