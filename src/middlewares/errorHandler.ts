import fp from 'fastify-plugin';
import { logger } from '../utils';

export default fp(async fastify => {
  fastify.setNotFoundHandler((request, reply) => {
    logger.warn(`Route not found: ${request.url}`);
    reply.status(404).send({
      error: 'Route not found',
      path: request.url,
    });
  });

  fastify.setErrorHandler((error, request, reply) => {
    logger.error('Unhandled error:', {
      error: error.message,
      stack: error.stack,
    });
    reply.status(500).send({
      error: 'Internal server error',
      message:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Something went wrong',
    });
  });
});
