import { FastifyInstance } from 'fastify';
import {
  createWebhookHandler,
  getWebhooksHandler,
  getWebhookHandler,
  updateWebhookHandler,
  deleteWebhookHandler,
} from '../controllers/webhook.controller';
import { authenticate } from '../middlewares';
import { CreateWebhookData, UpdateWebhookData } from '../services/webhook.service';
import {
  createWebhookSchema,
  updateWebhookSchema,
  webhookParamsSchema,
  getWebhooksQuerySchema,
} from '../schemas/webhook.schema';

const webhookRoutes = async (server: FastifyInstance) => {
  server.post<{ Body: CreateWebhookData }>('/', { schema: createWebhookSchema, preHandler: [authenticate] }, createWebhookHandler);
  server.get<{ Querystring: { page?: string, limit?: string } }>('/', { schema: getWebhooksQuerySchema, preHandler: [authenticate] }, getWebhooksHandler);
  server.get<{ Params: { id: string } }>('/:id', { schema: webhookParamsSchema, preHandler: [authenticate] }, getWebhookHandler);
  server.put<{ Body: UpdateWebhookData, Params: { id: string } }>('/:id', { schema: updateWebhookSchema, preHandler: [authenticate] }, updateWebhookHandler);
  server.delete<{ Params: { id: string } }>('/:id', { schema: webhookParamsSchema, preHandler: [authenticate] }, deleteWebhookHandler);
};

export default webhookRoutes;