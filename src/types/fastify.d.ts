import 'fastify';
import { MongoClient, Db, ObjectId } from 'mongodb';
import '@fastify/cookie'; // Import to extend FastifyRequest

declare module 'fastify' {
  interface FastifyInstance {
    mongo: {
      client: MongoClient;
      db: Db;
      ObjectId: typeof ObjectId;
    };
  }

  interface FastifyRequest {
    cookies: { [key: string]: string | undefined };
  }
}