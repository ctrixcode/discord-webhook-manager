import { FastifyInstance } from 'fastify';
import { logger } from '../utils';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';
import webhookRoutes from './webhook.routes';

const routes = async (fastify: FastifyInstance) => {
  fastify.get('/healthz', async (request, reply) => {
    logger.info('Health check requested');
    reply.status(200).send({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  fastify.register(userRoutes, { prefix: '/user' });
  fastify.register(authRoutes, { prefix: '/auth' });
  fastify.register(webhookRoutes, { prefix: '/webhook' });
};

export default routes;
