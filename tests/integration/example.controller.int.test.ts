import request from 'supertest';
import { client, db as sharedDb } from '../setup';
import { Db } from 'mongodb';
import app from '../../src/app';

let db: Db = sharedDb || (global as any).mongoDb;

describe('Example Controller Integration', () => {
  let server: any;

  beforeAll(async () => {
    db = sharedDb || (global as any).mongoDb;
    await db.collection('examples').deleteMany({});
    // Use the same server as in setup.ts
    // @ts-ignore
    server = global.server || app.listen(0);
  });

  afterAll(async () => {
    await db.collection('examples').deleteMany({});
    if (server && server.close) server.close();
  });

  afterEach(async () => {
    await db.collection('examples').deleteMany({});
  });

  describe('POST /api/examples', () => {
    it('should create a new example item', async () => {
      const exampleData = {
        name: 'Test Item',
        description: 'A test item',
        price: 99.99,
        metadata: { category: 'electronics' },
      };
      const res = await request(server)
        .post('/api/examples')
        .send(exampleData)
        .expect(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.name).toBe('Test Item');
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(server)
        .post('/api/examples')
        .send({})
        .expect(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Missing required fields/);
    });
  });

  describe('GET /api/examples', () => {
    it('should return a list of example items', async () => {
      await db.collection('examples').insertMany([
        {
          name: 'Item 1',
          description: 'First',
          price: 10,
          metadata: { category: 'books' },
        },
        {
          name: 'Item 2',
          description: 'Second',
          price: 20,
          metadata: { category: 'electronics' },
        },
      ]);
      const res = await request(server).get('/api/examples').expect(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    });
  });
});
