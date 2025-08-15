import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { logger } from '../utils';
import userRoutes from './user.routes';

const routes = async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
  fastify.get('/healthz', async (request, reply) => {
    logger.info('Health check requested');
    reply.status(200).send({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  fastify.register(userRoutes, { prefix: '/users' });
};

export default routes;
