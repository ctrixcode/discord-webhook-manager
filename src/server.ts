import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { logger } from './utils';

const PORT = process.env.PORT || 4000;

(async () => {
  await app.listen({ port: Number(PORT), host: '0.0.0.0' }, (err, address) => {
    if (err) {
      logger.error(address, err);
      process.exit(1);
    }
  });
  logger.info(`🚀 Server is running on port ${PORT}`);
  logger.info(`📊 Health check available at: http://localhost:${PORT}/healthz`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
})();
