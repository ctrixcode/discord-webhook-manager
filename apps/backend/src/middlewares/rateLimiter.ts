import fp from 'fastify-plugin';
import rateLimit from '@fastify/rate-limit';

const rateLimiterPlugin = fp(async fastify => {
  await fastify.register(rateLimit, {
    global: false, // Disable global rate limiting to allow per-route configuration
    max: 100,
    timeWindow: '15 minutes',
    errorResponseBuilder: (_req, context) => ({
      error: `Too many requests from this IP, please try again after ${context.after}.`,
      retryAfter: context.after,
    }),
  });
});

export default rateLimiterPlugin;
