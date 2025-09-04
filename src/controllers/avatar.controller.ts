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
import { UsageLimitExceededError } from '../utils/errors'; // Import UsageLimitExceededError

export const createAvatar = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    if (!request.user) {
      return reply
        .code(401)
        .send({ message: 'Unauthorized: User not authenticated.' });
    }
    const userId = request.user.userId;
    const avatarData = request.body as Partial<IAvatar>;
    const avatar = await createAvatarService(userId, avatarData);
    reply.code(201).send(toAvatarDto(avatar));
  } catch (error: unknown) {
    if (error instanceof Error) {
      reply
        .code(500)
        .send({ message: 'Error creating avatar', error: error.message });
    } else {
      reply.code(500).send({
        message: 'Error creating avatar',
        error: 'An unknown error occurred.',
      });
    }
  }
};

export const uploadAvatar = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  let tempFilePath: string | undefined;
  try {
    if (!request.user) {
      return reply
        .code(401)
        .send({ message: 'Unauthorized: User not authenticated.' });
    }

    if (!request.isMultipart()) {
      return reply.code(400).send({ message: 'Request is not multipart' });
    }

    const data = await request.file();

    if (!data) {
      return reply.code(400).send({ message: 'No file data received' });
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
      return reply.code(400).send({ message: 'No file uploaded' });
    }

    if (!avatarUsername) {
      return reply.code(400).send({ message: 'Username field is missing' });
    }

    const userId = request.user.userId;

    const tempDir = path.join(__dirname, '..', '..', 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    let fileBuffer: Buffer;
    try {
      fileBuffer = await data.toBuffer();
    } catch (bufferError: unknown) {
      return reply.code(500).send({
        message: 'Error processing file',
        error: (bufferError as Error).message,
      });
    }

    tempFilePath = path.join(tempDir, filename);
    await fs.promises.writeFile(tempFilePath as string, fileBuffer);

    const avatar = await uploadAvatarService(
      userId,
      avatarUsername,
      avatarUsername,
      tempFilePath,
      fileBuffer.byteLength // Pass fileSize
    );

    reply.code(201).send(toAvatarDto(avatar));
  } catch (error: unknown) {
    if (error instanceof UsageLimitExceededError) {
      // Handle custom error
      reply.status(error.statusCode).send({
        success: false,
        message: error.message,
        code: error.errorCode,
      });
    } else if (error instanceof Error) {
      reply
        .code(500)
        .send({ message: 'Error uploading avatar', error: error.message });
    } else {
      reply.code(500).send({
        message: 'Error uploading avatar',
        error: 'An unknown error occurred.',
      });
    }
  } finally {
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath); // Ensure temporary file is cleaned up
    }
  }
};

export const getAvatar = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    if (!request.user) {
      return reply
        .code(401)
        .send({ message: 'Unauthorized: User not authenticated.' });
    }
    const userId = request.user.userId;
    const { id } = request.params as IAvatarParams;
    const avatar = await getAvatarService(userId, id);
    if (!avatar) {
      return reply
        .code(404)
        .send({ message: 'Avatar not found or not owned by user' });
    }
    reply.code(200).send(toAvatarDto(avatar));
  } catch (error: unknown) {
    if (error instanceof Error) {
      reply
        .code(500)
        .send({ message: 'Error fetching avatar', error: error.message });
    } else {
      reply.code(500).send({
        message: 'Error fetching avatar',
        error: 'An unknown error occurred.',
      });
    }
  }
};

export const getAvatars = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    if (!request.user) {
      return reply
        .code(401)
        .send({ message: 'Unauthorized: User not authenticated.' });
    }
    const userId = request.user.userId;
    const avatars = await getAvatarsService(userId);
    reply.code(200).send(avatars.map(toAvatarDto));
  } catch (error: unknown) {
    if (error instanceof Error) {
      reply
        .code(500)
        .send({ message: 'Error fetching avatars', error: error.message });
    } else {
      reply.code(500).send({
        message: 'Error fetching avatars',
        error: 'An unknown error occurred.',
      });
    }
  }
};

export const updateAvatar = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    if (!request.user) {
      return reply
        .code(401)
        .send({ message: 'Unauthorized: User not authenticated.' });
    }
    const userId = request.user.userId;
    const { id } = request.params as IAvatarParams;
    const updateData = request.body as Partial<IAvatar>;
    const updatedAvatar = await updateAvatarService(userId, id, updateData);
    if (!updatedAvatar) {
      return reply
        .code(404)
        .send({ message: 'Avatar not found or not owned by user' });
    }
    reply.code(200).send(toAvatarDto(updatedAvatar));
  } catch (error: unknown) {
    if (error instanceof Error) {
      reply
        .code(500)
        .send({ message: 'Error updating avatar', error: error.message });
    } else {
      reply.code(500).send({
        message: 'Error updating avatar',
        error: 'An unknown error occurred.',
      });
    }
  }
};

export const deleteAvatar = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    if (!request.user) {
      return reply
        .code(401)
        .send({ message: 'Unauthorized: User not authenticated.' });
    }
    const userId = request.user.userId;
    const { id } = request.params as IAvatarParams;
    const deletedAvatar = await deleteAvatarService(userId, id);
    if (!deletedAvatar) {
      return reply
        .code(404)
        .send({ message: 'Avatar not found or not owned by user' });
    }
    reply.code(204).send(); // No content for successful deletion
  } catch (error: unknown) {
    if (error instanceof Error) {
      reply
        .code(500)
        .send({ message: 'Error deleting avatar', error: error.message });
    } else {
      reply.code(500).send({
        message: 'Error deleting avatar',
        error: 'An unknown error occurred.',
      });
    }
  }
};
