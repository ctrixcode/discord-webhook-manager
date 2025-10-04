import { FastifyInstance } from 'fastify';
import {
  createMessageTemplateHandler,
  getMessageTemplatesHandler,
  getMessageTemplateHandler,
  updateMessageTemplateHandler,
  deleteMessageTemplateHandler,
} from '../controllers/message-template.controller';
import { authenticate } from '../middlewares';
import {
  CreateMessageTemplateData,
  UpdateMessageTemplateData,
} from '../services/message-template.service';
import {
  createMessageTemplateSchema,
  updateMessageTemplateSchema,
  messageTemplateParamsSchema,
  getMessageTemplatesQuerySchema,
  IMessageTemplateParams,
} from '../schemas/message-template.schema';

const messageTemplateRoutes = async (server: FastifyInstance) => {
  server.post<{ Body: CreateMessageTemplateData }>(
    '/',
    { schema: createMessageTemplateSchema, preHandler: [authenticate] },
    createMessageTemplateHandler
  );

  server.get<{ Querystring: { page?: string; limit?: string } }>(
    '/',
    { schema: getMessageTemplatesQuerySchema, preHandler: [authenticate] },
    getMessageTemplatesHandler
  );

  server.get<{ Params: IMessageTemplateParams }>(
    '/:id',
    { schema: messageTemplateParamsSchema, preHandler: [authenticate] },
    getMessageTemplateHandler
  );

  server.put<{
    Params: IMessageTemplateParams;
    Body: UpdateMessageTemplateData;
  }>(
    '/:id',
    { schema: updateMessageTemplateSchema, preHandler: [authenticate] },
    updateMessageTemplateHandler
  );

  server.delete<{ Params: IMessageTemplateParams }>(
    '/:id',
    { schema: messageTemplateParamsSchema, preHandler: [authenticate] },
    deleteMessageTemplateHandler
  );
};

export default messageTemplateRoutes;
