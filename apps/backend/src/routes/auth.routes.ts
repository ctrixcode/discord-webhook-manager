import { FastifyInstance } from 'fastify';
import * as authController from '../controllers/auth.controller';
import { logger } from '../utils';

const authRoutes = async (fastify: FastifyInstance) => {
  fastify.post('/refresh', authController.refreshAccessToken);
  fastify.post('/logout', authController.logoutUser);

  // Rate limited email verification endpoint to prevent spam/abuse
  fastify.post(
    '/email/send-verification',
    {
      config: {
        rateLimit: {
          max: 3, // 3 requests
          timeWindow: '15 minutes', // per 15 minutes
          errorResponseBuilder: request => {
            logger.warn('Rate limit exceeded for email verification', {
              ip: request.ip,
              endpoint: '/email/send-verification',
            });
            return {
              success: false,
              message:
                'Too many verification emails sent. Please try again in 15 minutes.',
              code: 'RATE_LIMIT_EXCEEDED',
            };
          },
        },
      },
    },
    authController.sendEmailVerification
  );

  fastify.post('/email/login', authController.emailLogin);
  fastify.post('/email/verify', authController.verifyEmail);
  fastify.get('/discord', authController.discordLogin);
  fastify.get('/discord/callback', authController.discordCallback);
  fastify.get('/google', authController.googleLogin);
  fastify.get('/google/callback', authController.googleCallback);
};

export default authRoutes;
