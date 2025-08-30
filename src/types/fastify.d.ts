import 'fastify';
import '@fastify/cookie';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      userId: string;
      email: string;
      refreshTokenJti?: string; // Added for single session logout
    };
    cookies: { [key: string]: string | undefined };
  }
}
