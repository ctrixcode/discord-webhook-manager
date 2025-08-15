import 'fastify';
import { MongoClient, Db, ObjectId } from 'mongodb';

declare module 'fastify' {
  interface FastifyInstance {
    mongo: {
      client: MongoClient;
      db: Db;
      ObjectId: typeof ObjectId;
    };
  }
}