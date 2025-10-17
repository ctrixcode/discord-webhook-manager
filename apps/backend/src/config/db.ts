import mongoose from 'mongoose';
import { logger } from '../utils';
import { env } from './env';

const connectDB = async () => {
  try {
    const mongoUri =
      env.MONGO_URL || 'mongodb://localhost:27017/discord-webhook-manager-test';
    await mongoose.connect(mongoUri);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
