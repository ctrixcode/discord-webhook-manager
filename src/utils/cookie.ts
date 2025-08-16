import { FastifyReply } from 'fastify';

export const setRefreshTokenCookie = (reply: FastifyReply, token: string) => {
  reply.setCookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    path: '/', // Accessible across the entire domain
    sameSite: 'lax', // CSRF protection
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });
};

export const clearRefreshTokenCookie = (reply: FastifyReply) => {
  reply.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  });
};