import dotenv from 'dotenv';
import { Db, MongoClient } from 'mongodb';
import app from '../src/app';
import { IncomingMessage, Server, ServerResponse } from 'http';
dotenv.config();

const uri = process.env.MONGO_URL || 'mongodb://localhost:27017/db_name_test';
let client: MongoClient;
let db: Db;

export async function globalSetup() {
  client = new MongoClient(uri);
  await client.connect();
  db = client.db();
  // Attach to global for Jest-style access
  (global as any).mongoClient = client;
  (global as any).mongoDb = db;
}

export async function globalTeardown() {
  if (client) {
    await client.db().dropDatabase();
    await client.close();
  }
  (global as any).mongoClient = undefined;
  (global as any).mongoDb = undefined;
}

export { client, db };

let server: Server<typeof IncomingMessage, typeof ServerResponse> | null = null;

beforeAll(async () => {
  try {
    server = app.server;
  } catch (err) {
    // ignore
  }
});

afterAll(async () => {
  if (server && server.close) server.close();
});
