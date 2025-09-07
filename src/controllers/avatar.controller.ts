import { FastifyRequest, FastifyReply } from 'fastify';
import * as fs from 'fs';
import * as path from 'path';
import {
  createAvatar as createAvatarService,
  getAvatar as getAvatarService,
  getAvatars as getAvatarsService,
  updateAvatar as updateAvatarService,
  deleteAvatar as deleteAvatarService,
  uploadAvatar as uploadAvatarService,
} from '../services/avatar.service';
import { IAvatarParams } from '../schemas/avatar.schema';
import { IAvatar } from '../models/avatar';
import { toAvatarDto } from '../utils/mappers';
import {
  AuthenticationError,
  BadRequestError,
  NotFoundError,
} from '../utils/errors';
import { sendSuccessResponse } from '../utils/responseHandler';
import { HttpStatusCode } from '../utils/httpcode';
import { ErrorMessages } from '../utils/errorMessages';

export const createAvatar = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (!request.user) {
    throw new AuthenticationError(
      ErrorMessages.Auth.NO_TOKEN_ERROR.message,
      ErrorMessages.Auth.NO_TOKEN_ERROR.code
    );
  }
  const userId = request.user.userId;
  const avatarData = request.body as Partial<IAvatar>;
  const avatar = await createAvatarService(userId, avatarData);
  sendSuccessResponse(
    reply,
    HttpStatusCode.CREATED,
    'Avatar created successfully',
    toAvatarDto(avatar)
  );
};

export const uploadAvatar = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (!request.user) {
    throw new AuthenticationError(
      ErrorMessages.Auth.NO_TOKEN_ERROR.message,
      ErrorMessages.Auth.NO_TOKEN_ERROR.code
    );
  }

  if (!request.isMultipart())
    throw new BadRequestError(
      ErrorMessages.Generic.INVALID_INPUT_ERROR.message,
      ErrorMessages.Generic.INVALID_INPUT_ERROR.code
    );

  const data = await request.file();

  if (!data) {
    throw new BadRequestError(
      ErrorMessages.Generic.NO_FILE_DATA_ERROR.message,
      ErrorMessages.Generic.NO_FILE_DATA_ERROR.code
    );
  }

  const { filename, fields } = data;
  let avatarUsername: string | undefined;

  if (fields.username && !Array.isArray(fields.username)) {
    // Check if it's a MultipartField (non-file field) and has a value property
    if ('value' in fields.username) {
      avatarUsername = fields.username.value as string;
    }
  }

  if (!filename) {
    throw new BadRequestError(
      ErrorMessages.Generic.FILE_PROCESSING_ERROR.message,
      ErrorMessages.Generic.FILE_PROCESSING_ERROR.code
    );
  }

  if (!avatarUsername) {
    throw new BadRequestError(
      ErrorMessages.Avatar.UPDATE_ERROR.message,
      ErrorMessages.Avatar.UPDATE_ERROR.code
    );
  }

  const userId = request.user.userId;

  const tempDir = path.join(__dirname, '..', '..', 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const fileBuffer: Buffer = await data.toBuffer();

  const tempFilePath: string | undefined = path.join(tempDir, filename);
  await fs.promises.writeFile(tempFilePath as string, fileBuffer);

  const avatar = await uploadAvatarService(
    userId,
    avatarUsername,
    avatarUsername,
    tempFilePath,
    fileBuffer.byteLength // Pass fileSize
  );
  sendSuccessResponse(
    reply,
    HttpStatusCode.CREATED,
    'Avatar created successfully',
    toAvatarDto(avatar)
  );
};

export const getAvatar = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (!request.user) {
    throw new AuthenticationError(
      ErrorMessages.Auth.NO_TOKEN_ERROR.message,
      ErrorMessages.Auth.NO_TOKEN_ERROR.code
    );
  }
  const userId = request.user.userId;
  const { id } = request.params as IAvatarParams;
  const avatar = await getAvatarService(userId, id);
  if (!avatar) {
    throw new NotFoundError(
      ErrorMessages.Avatar.NOT_FOUND_ERROR.message,
      ErrorMessages.Avatar.NOT_FOUND_ERROR.code
    );
  }
  sendSuccessResponse(
    reply,
    HttpStatusCode.OK,
    'Avatar fetched successfully',
    toAvatarDto(avatar)
  );
};

export const getAvatars = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (!request.user) {
    throw new AuthenticationError(
      ErrorMessages.Auth.NO_TOKEN_ERROR.message,
      ErrorMessages.Auth.NO_TOKEN_ERROR.code
    );
  }
  const userId = request.user.userId;
  const avatars = await getAvatarsService(userId);
  sendSuccessResponse(
    reply,
    HttpStatusCode.OK,
    'Avatars fetched',
    avatars.map(toAvatarDto)
  );
};

export const updateAvatar = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (!request.user) {
    throw new AuthenticationError(
      ErrorMessages.Auth.NO_TOKEN_ERROR.message,
      ErrorMessages.Auth.NO_TOKEN_ERROR.code
    );
  }
  const userId = request.user.userId;
  const { id } = request.params as IAvatarParams;
  const updateData = request.body as Partial<IAvatar>;
  const updatedAvatar = await updateAvatarService(userId, id, updateData);
  if (!updatedAvatar) {
    throw new NotFoundError(
      ErrorMessages.Avatar.NOT_FOUND_ERROR.message,
      ErrorMessages.Avatar.NOT_FOUND_ERROR.code
    );
  }
  sendSuccessResponse(
    reply,
    HttpStatusCode.OK,
    'Avatar updated successfully',
    toAvatarDto(updatedAvatar)
  );
};

export const deleteAvatar = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (!request.user) {
    throw new AuthenticationError(
      ErrorMessages.Auth.NO_TOKEN_ERROR.message,
      ErrorMessages.Auth.NO_TOKEN_ERROR.code
    );
  }
  const userId = request.user.userId;
  const { id } = request.params as IAvatarParams;
  const deletedAvatar = await deleteAvatarService(userId, id);
  if (!deletedAvatar) {
    throw new NotFoundError(
      ErrorMessages.Avatar.NOT_FOUND_ERROR.message,
      ErrorMessages.Avatar.NOT_FOUND_ERROR.code
    );
  }
  sendSuccessResponse(reply, HttpStatusCode.NO_CONTENT);
};
