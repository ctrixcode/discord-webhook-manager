import fp from 'fastify-plugin';
import rateLimit from '@fastify/rate-limit';

const rateLimiterPlugin = fp(async fastify => {
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    errorResponseBuilder: (req, context) => ({
      error: `Too many requests from this IP, please try again after ${context.after}.`,
      retryAfter: context.after,
    }),
  });
});

export default rateLimiterPlugin;
