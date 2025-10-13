import { FastifyInstance } from 'fastify';
import { logger } from '../utils';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';
import webhookRoutes from './webhook.routes';
import avatarRoutes from './avatar.routes';
import messageTemplateRoutes from './message-template.routes';

const routes = async (fastify: FastifyInstance) => {
  fastify.get(
    '/healthz',
    {
      schema: {
        summary: 'Health Check',
        description:
          'Provides the health status of the server, including uptime and environment.',
        tags: ['server status'],
        response: {
          200: {
            description: 'Successful health check response.',
            type: 'object',
            properties: {
              status: { type: 'string' },
              timestamp: { type: 'string', format: 'date-time' },
              uptime: {
                type: 'number',
                description: 'Server uptime in seconds.',
              },
              environment: { type: 'string' },
            },
            example: {
              status: 'ok',
              timestamp: '2025-10-26T10:00:00.000Z',
              uptime: 120.5,
              environment: 'development',
            },
          },
        },
      },
    },
    async (request, reply) => {
      logger.info('Health check requested');
      reply.status(200).send({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
      });
    }
  );

  fastify.get(
    '/',
    {
      schema: {
        summary: 'Starting point',
        description: 'A simple endpoint to check if the server is live.',
        tags: ['server status'],
        response: {
          200: {
            description: 'Server is live message.',
            type: 'string',
            example: 'Server is live!',
          },
        },
      },
    },
    async (request, reply) => {
      reply.status(200).send('Server is live!');
    }
  );

  fastify.register(userRoutes, { prefix: '/user' });
  fastify.register(authRoutes, { prefix: '/auth' });
  fastify.register(webhookRoutes, { prefix: '/webhook' });
  fastify.register(avatarRoutes, { prefix: '/avatar' });
  fastify.register(messageTemplateRoutes, { prefix: '/message-template' });
};

export default routes;
