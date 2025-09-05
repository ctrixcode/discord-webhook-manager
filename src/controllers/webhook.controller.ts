import { FastifyRequest, FastifyReply } from 'fastify';
import {
  createWebhookService as createWebhook,
  getWebhooksByUserId,
  getWebhookById,
  updateWebhook,
  deleteWebhook,
  CreateWebhookData,
  UpdateWebhookData,
  testWebhook,
  sendMessage,
  SendMessageData,
} from '../services/webhook.service';
import { toWebhookDto } from '../utils';
import {
  AuthenticationError,
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from '../utils/errors';
import { ErrorMessages } from '../utils/errorMessages';
import { sendSuccessResponse } from '../utils/responseHandler';
import { HttpStatusCode } from '../utils/httpcode';

export const createWebhookHandler = async (
  request: FastifyRequest<{ Body: CreateWebhookData }>,
  reply: FastifyReply
) => {
  const userId = request.user?.userId;
  if (!userId) {
    throw new AuthenticationError(
      ErrorMessages.User.NOT_FOUND_ERROR.message,
      ErrorMessages.User.NOT_FOUND_ERROR.code
    );
  }
  const webhook = await createWebhook(request.body, userId);
  sendSuccessResponse(
    reply,
    HttpStatusCode.CREATED,
    'Webhook created successfully',
    toWebhookDto(webhook)
  );
};

export const getWebhooksHandler = async (
  request: FastifyRequest<{
    Querystring: { page?: string; limit?: string; status?: string };
  }>,
  reply: FastifyReply
) => {
  const userId = request.user?.userId;
  if (!userId) {
    throw new AuthenticationError(
      ErrorMessages.User.NOT_FOUND_ERROR.message,
      ErrorMessages.User.NOT_FOUND_ERROR.code
    );
  }
  const page = request.query.page ? parseInt(request.query.page, 10) : 1;
  const limit = request.query.limit ? parseInt(request.query.limit, 10) : 10;
  const status = request.query.status;
  const { webhooks, total } = await getWebhooksByUserId(
    userId,
    page,
    limit,
    status
  );
  sendSuccessResponse(
    reply,
    HttpStatusCode.OK,
    'Webhooks fetched successfully',
    { webhooks: webhooks.map(toWebhookDto), total, page, limit }
  );
};

export const getWebhookHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const userId = request.user?.userId;
  if (!userId) {
    throw new AuthenticationError(
      ErrorMessages.User.NOT_FOUND_ERROR.message,
      ErrorMessages.User.NOT_FOUND_ERROR.code
    );
  }
  const webhook = await getWebhookById(request.params.id, userId);

  sendSuccessResponse(
    reply,
    HttpStatusCode.OK,
    'Webhook fetched successfully',
    toWebhookDto(webhook)
  );
};

export const updateWebhookHandler = async (
  request: FastifyRequest<{ Params: { id: string }; Body: UpdateWebhookData }>,
  reply: FastifyReply
) => {
  const userId = request.user?.userId;
  if (!userId) {
    throw new AuthenticationError(
      ErrorMessages.User.NOT_FOUND_ERROR.message,
      ErrorMessages.User.NOT_FOUND_ERROR.code
    );
  }
  const webhook = await updateWebhook(request.params.id, request.body, userId);
  if (!webhook) {
    throw new NotFoundError(
      ErrorMessages.Webhook.NOT_FOUND_ERROR.message,
      ErrorMessages.Webhook.NOT_FOUND_ERROR.code
    );
  }
  reply.send(toWebhookDto(webhook));
};

export const deleteWebhookHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const userId = request.user?.userId;
  if (!userId) {
    throw new AuthenticationError(
      ErrorMessages.User.NOT_FOUND_ERROR.message,
      ErrorMessages.User.NOT_FOUND_ERROR.code
    );
  }
  const success = await deleteWebhook(request.params.id, userId);
  if (!success) {
    throw new NotFoundError(
      ErrorMessages.Webhook.NOT_FOUND_ERROR.message,
      ErrorMessages.Webhook.NOT_FOUND_ERROR.code
    );
  }
  sendSuccessResponse(reply, HttpStatusCode.NO_CONTENT);
};

export const testWebhookHandler = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const userId = request.user?.userId;
  if (!userId) {
    throw new AuthenticationError(
      ErrorMessages.User.NOT_FOUND_ERROR.message,
      ErrorMessages.User.NOT_FOUND_ERROR.code
    );
  }
  const webhook = await getWebhookById(request.params.id, userId);

  await testWebhook(webhook);

  sendSuccessResponse(reply, HttpStatusCode.OK, 'Webhook tested successfully');
};

export const sendMessageHandler = async (
  request: FastifyRequest<{
    Body: { webhookIds: string[]; messageData: SendMessageData };
  }>,
  reply: FastifyReply
) => {
  const userId = request.user?.userId;
  if (!userId) {
    throw new AuthenticationError(
      ErrorMessages.User.NOT_FOUND_ERROR.message,
      ErrorMessages.User.NOT_FOUND_ERROR.code
    );
  }

  const { webhookIds, messageData } = request.body;

  if (!webhookIds || !Array.isArray(webhookIds) || webhookIds.length === 0) {
    throw new BadRequestError(
      ErrorMessages.Generic.INVALID_INPUT_ERROR.message,
      ErrorMessages.Generic.INVALID_INPUT_ERROR.code
    );
  }

  const results = await sendMessage(webhookIds, userId, messageData);
  if (results.every(result => result.status === 'failed')) {
    throw new InternalServerError(
      ErrorMessages.Webhook.SEND_FAILED_ALL_ERROR.message,
      ErrorMessages.Webhook.SEND_FAILED_ALL_ERROR.code
    );
  }

  sendSuccessResponse(
    reply,
    HttpStatusCode.OK,
    'Message sent successfully',
    results
  );
};
