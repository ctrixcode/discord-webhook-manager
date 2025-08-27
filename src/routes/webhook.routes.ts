import { FastifyInstance } from 'fastify';
import {
  createWebhookHandler,
  getWebhooksHandler,
  getWebhookHandler,
  updateWebhookHandler,
  deleteWebhookHandler,
  testWebhookHandler,
  sendMessageHandler,
} from '../controllers/webhook.controller';
import { authenticate } from '../middlewares';
import {
  CreateWebhookData,
  UpdateWebhookData,
  SendMessageData,
} from '../services/webhook.service';
import {
  createWebhookSchema,
  updateWebhookSchema,
  webhookParamsSchema,
  getWebhooksQuerySchema,
  webhookSendMessageSchema,
} from '../schemas/webhook.schema';

const webhookRoutes = async (server: FastifyInstance) => {
  server.post<{ Body: CreateWebhookData }>(
    '/',
    { schema: createWebhookSchema, preHandler: [authenticate] },
    createWebhookHandler
  );
  server.get<{ Querystring: { page?: string; limit?: string } }>(
    '/',
    { schema: getWebhooksQuerySchema, preHandler: [authenticate] },
    getWebhooksHandler
  );
  server.get<{ Params: { id: string } }>(
    '/:id',
    { schema: webhookParamsSchema, preHandler: [authenticate] },
    getWebhookHandler
  );
  server.put<{ Body: UpdateWebhookData; Params: { id: string } }>(
    '/:id',
    { schema: updateWebhookSchema, preHandler: [authenticate] },
    updateWebhookHandler
  );
  server.delete<{ Params: { id: string } }>(
    '/:id',
    { schema: webhookParamsSchema, preHandler: [authenticate] },
    deleteWebhookHandler
  );
  server.post<{ Params: { id: string } }>(
    '/:id/test',
    { schema: webhookParamsSchema, preHandler: [authenticate] },
    testWebhookHandler
  );
  server.post<{ Params: { id: string }; Body: SendMessageData }>(
    '/:id/send-message',
    { schema: webhookSendMessageSchema, preHandler: [authenticate] },
    sendMessageHandler
  );
};

export default webhookRoutes;
