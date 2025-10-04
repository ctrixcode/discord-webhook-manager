import fp from 'fastify-plugin';
import { logger } from '../utils';

const loggingPlugin = fp(async fastify => {
  fastify.addHook('onRequest', async request => {
    const clientIP = request.ip === '::1' ? 'localhost' : request.ip;
    logger.http(`${request.method} ${request.url} - ${clientIP}`);
  });
});

export default loggingPlugin;
