import { FastifyRequest, FastifyReply } from 'fastify';
import * as userService from '../services/user.service';
import * as userUsageService from '../services/user-usage.service';
import { UpdateUserData } from '../services/user.service';
import { getDiscordAvatarURL } from '../utils/discord-api';
import { toUserPayload } from '../utils/mappers';
import { ErrorMessages } from '../utils/errorMessages';
import {
  AuthenticationError,
  BadRequestError,
  NotFoundError,
} from '../utils/errors';
import { sendSuccessResponse } from '../utils/responseHandler';
import { HttpStatusCode } from '../utils/httpcode';
import { createPagination } from '../utils/helper';

/**
 * Get current authenticated user
 * GET /api/users/me
 */
export const getCurrentUser = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  if (!request.user || !request.user.userId) {
    throw new AuthenticationError(
      ErrorMessages.User.NOT_FOUND_ERROR.message,
      ErrorMessages.User.NOT_FOUND_ERROR.code
    );
  }
  const user = await userService.getUserById(request.user.userId);
  if (!user) {
    throw new NotFoundError(
      ErrorMessages.User.NOT_FOUND_ERROR.message,
      ErrorMessages.User.NOT_FOUND_ERROR.code
    );
  }

  // Attach discord avatar url
  user.discord_avatar = user.discord_id
    ? getDiscordAvatarURL(user.discord_id, user.discord_avatar)
    : user.discord_avatar;

  // attach discord guilds icon urls
  if (user.guilds) {
    user.guilds = user.guilds.sort((a, b) => a.name.localeCompare(b.name));
  }

  sendSuccessResponse(reply, HttpStatusCode.OK, 'User fetched successfully', {
    data: toUserPayload(user),
  });
};

export const getUsers = async (
  request: FastifyRequest<{ Querystring: { page?: string; limit?: string } }>,
  reply: FastifyReply
): Promise<void> => {
  const page = parseInt(request.query.page || '1', 10);
  const limit = parseInt(request.query.limit || '10', 10);
  const result = await userService.getUsers(page, limit);

  sendSuccessResponse(reply, HttpStatusCode.OK, 'Users fetched successfully', {
    data: result.users.map(toUserPayload),
    pagination: createPagination({
      page,
      limit,
      totalItems: result.total,
    }),
  });
};

/**
 * Update user
 * PUT /api/users/:id
 */
export const updateUser = async (
  request: FastifyRequest<{ Params: { id: string }; Body: UpdateUserData }>,
  reply: FastifyReply
): Promise<void> => {
  const { id } = request.params;
  const updateData = request.body;
  if (!id) {
    throw new BadRequestError(
      ErrorMessages.Generic.INVALID_INPUT_ERROR.message,
      ErrorMessages.Generic.INVALID_INPUT_ERROR.code
    );
  }
  const user = await userService.updateUser(id, updateData);
  if (!user) {
    throw new NotFoundError(
      ErrorMessages.User.NOT_FOUND_ERROR.message,
      ErrorMessages.User.NOT_FOUND_ERROR.code
    );
  }
  sendSuccessResponse(reply, HttpStatusCode.OK, 'User updated successfully', {
    data: toUserPayload(user),
  });
};

/**
 * Get user usage and limits
 * GET /api/users/me/usage
 */
export const getUserUsageHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  if (!request.user || !request.user.userId) {
    throw new AuthenticationError(
      ErrorMessages.User.NOT_FOUND_ERROR.message,
      ErrorMessages.User.NOT_FOUND_ERROR.code
    );
  }
  const userId = request.user.userId;
  const { currentUsage, limits } =
    await userUsageService.getUserUsageAndLimits(userId);

  sendSuccessResponse(
    reply,
    HttpStatusCode.OK,
    'User usage fetched successfully',
    {
      webhookMessagesSentToday: currentUsage.webhookMessagesSentToday,
      totalMediaStorageUsed: currentUsage.totalMediaStorageUsed,
      dailyWebhookMessageLimit: limits.dailyWebhookMessageLimit,
      overallMediaStorageLimit: limits.overallMediaStorageLimit,
    }
  );
};
