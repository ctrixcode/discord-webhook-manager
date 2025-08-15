import mongoose from 'mongoose';
import { logger } from '../utils';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URL || 'mongodb://localhost:27017/fastify_db';
    await mongoose.connect(mongoUri);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;