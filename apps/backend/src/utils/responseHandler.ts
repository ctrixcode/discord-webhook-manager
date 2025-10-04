import { FastifyReply } from 'fastify';

interface SuccessResponse<T = unknown> {
  success: true;
  message?: string;
  data?: T;
}

interface ErrorResponse {
  success: false;
  code?: string;
  message?: string;
  details?: unknown;
}

export const sendSuccessResponse = <T = unknown>(
  reply: FastifyReply,
  statusCode: number,
  message?: string,
  data?: T
): void => {
  const responseBody: SuccessResponse<T> = { success: true };
  if (message) responseBody.message = message;
  if (data !== undefined) responseBody.data = data;

  reply.status(statusCode).send(responseBody);
};

export const sendErrorResponse = (
  reply: FastifyReply,
  statusCode: number,
  errorCode?: string,
  message?: string,
  details?: unknown
): void => {
  const responseBody: ErrorResponse = { success: false };
  if (errorCode) responseBody.code = errorCode;
  if (message) responseBody.message = message;
  if (details !== undefined) responseBody.details = details;

  reply.status(statusCode).send(responseBody);
};
