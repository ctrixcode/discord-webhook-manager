import { FastifyReply } from 'fastify';

export const setRefreshTokenCookie = (reply: FastifyReply, token: string) => {
  reply.setCookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    domain:
      process.env.NODE_ENV === 'production'
        ? 'ctrix-webhook-manager.vercel.app'
        : 'localhost',
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
};

export const clearRefreshTokenCookie = (reply: FastifyReply) => {
  reply.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
};
