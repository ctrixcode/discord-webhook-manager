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
    logger.error('Unhandled error:', error); // Log the entire error object
    reply.status(500).send({
      error: 'Internal server error',
      message:
        process.env.NODE_ENV === 'development'
          ? (error instanceof Error ? error.message : 'An unknown error occurred') // Safely access message
          : 'Something went wrong',
    });
  });
});
