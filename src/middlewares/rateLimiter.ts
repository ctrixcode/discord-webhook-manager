import fp from 'fastify-plugin';
import rateLimit from '@fastify/rate-limit';

const rateLimiterPlugin = fp(async fastify => {
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '15 minutes',
    errorResponseBuilder: () => ({
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: '15 minutes',
    }),
  });
});

export default rateLimiterPlugin;
