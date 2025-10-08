import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { logger } from './utils';
import connectDB from './config/db';
import { validateEnvVariables } from './utils/env-validator';
import { startTokenCleanupJob } from './utils/cleanup-expired-tokens';

// Validate environment variables before starting server
validateEnvVariables();

const PORT = process.env.PORT || 4000;

// Store cleanup job interval for graceful shutdown
let cleanupJobInterval: NodeJS.Timeout | null = null;

(async () => {
  await connectDB();
  app.listen({ port: Number(PORT), host: '0.0.0.0' }, (err, address) => {
    if (err) {
      logger.error(address, err);
      process.exit(1);
    }
  });
  logger.info(`🚀 Server is running on port ${PORT}`);
  logger.info(`📊 Health check available at: http://localhost:${PORT}/healthz`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);

  // Start background jobs
  cleanupJobInterval = startTokenCleanupJob();
})();

// Graceful shutdown handler
const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}, closing server gracefully...`);

  // Clear cleanup job interval
  if (cleanupJobInterval) {
    clearInterval(cleanupJobInterval);
    logger.info('Stopped token cleanup job');
  }

  // Close Fastify server
  try {
    await app.close();
    logger.info('Server closed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
