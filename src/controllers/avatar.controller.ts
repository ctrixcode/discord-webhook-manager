import { FastifyRequest, FastifyReply } from 'fastify';
import { AvatarService } from '../services/avatar.service';
import { IAvatarParams } from '../schemas/avatar.schema';
import { IAvatar } from '../models/avatar';

const avatarService = new AvatarService();

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
    const avatar = await avatarService.createAvatar(userId, avatarData);
    reply.code(201).send(avatar);
  } catch (error: unknown) {
    if (error instanceof Error) {
      reply
        .code(500)
        .send({ message: 'Error creating avatar', error: error.message });
    } else {
      reply
        .code(500)
        .send({
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
    const avatar = await avatarService.getAvatar(userId, id);
    if (!avatar) {
      return reply
        .code(404)
        .send({ message: 'Avatar not found or not owned by user' });
    }
    reply.code(200).send(avatar);
  } catch (error: unknown) {
    if (error instanceof Error) {
      reply
        .code(500)
        .send({ message: 'Error fetching avatar', error: error.message });
    } else {
      reply
        .code(500)
        .send({
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
    const avatars = await avatarService.getAvatars(userId);
    reply.code(200).send(avatars);
  } catch (error: unknown) {
    if (error instanceof Error) {
      reply
        .code(500)
        .send({ message: 'Error fetching avatars', error: error.message });
    } else {
      reply
        .code(500)
        .send({
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
    const updatedAvatar = await avatarService.updateAvatar(
      userId,
      id,
      updateData
    );
    if (!updatedAvatar) {
      return reply
        .code(404)
        .send({ message: 'Avatar not found or not owned by user' });
    }
    reply.code(200).send(updatedAvatar);
  } catch (error: unknown) {
    if (error instanceof Error) {
      reply
        .code(500)
        .send({ message: 'Error updating avatar', error: error.message });
    } else {
      reply
        .code(500)
        .send({
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
    const deletedAvatar = await avatarService.deleteAvatar(userId, id);
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
      reply
        .code(500)
        .send({
          message: 'Error deleting avatar',
          error: 'An unknown error occurred.',
        });
    }
  }
};
