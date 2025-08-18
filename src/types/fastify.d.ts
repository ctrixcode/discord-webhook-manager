import 'fastify';
import '@fastify/cookie';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      userId: string;
      email: string;
    };
    cookies: { [key: string]: string | undefined };
  }
}
