import { FastifyRequest, FastifyReply } from 'fastify';
import {
  createAvatar as createAvatarService,
  getAvatar as getAvatarService,
  getAvatars as getAvatarsService,
  updateAvatar as updateAvatarService,
  deleteAvatar as deleteAvatarService,
} from '../services/avatar.service';
import { IAvatarParams } from '../schemas/avatar.schema';
import { IAvatar } from '../models/avatar';
import { toAvatarDto } from '../utils/mappers';

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
