import { FastifyInstance } from 'fastify';
import { logger } from '../utils';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';
import webhookRoutes from './webhook.routes';
import avatarRoutes from './avatar.routes';
import messageTemplateRoutes from './message-template.routes';

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

  fastify.get('/', async (request, reply) => {
    reply.status(200).send('Server is live!');
  });

  fastify.register(userRoutes, { prefix: '/user' });
  fastify.register(authRoutes, { prefix: '/auth' });
  fastify.register(webhookRoutes, { prefix: '/webhook' });
  fastify.register(avatarRoutes, { prefix: '/avatar' });
  fastify.register(messageTemplateRoutes, { prefix: '/message-template' });
};

export default routes;
