import { FastifyRequest, FastifyReply } from 'fastify';
import * as userService from '../services/user.service';
import { logger } from '../utils';
import { UpdateUserData } from '../services/user.service';

/**
 * Get current authenticated user
 * GET /api/users/me
 */
export const getCurrentUser = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    if (!request.user || !request.user.userId) {
      reply.status(401).send({
        success: false,
        message: 'Unauthorized: User information not found in request',
      });
      return;
    }
    const user = await userService.getUserById(request.user.userId);
    if (!user) {
      reply.status(404).send({
        success: false,
        message: 'Current user not found',
      });
      return;
    }
    reply.status(200).send({
      success: true,
      data: user,
    });
  } catch (error: unknown) {
    logger.error('Error in getCurrentUser controller:', error);
    if (error instanceof Error) {
      reply.status(500).send({
        success: false,
        message: error.message,
      });
    } else {
      reply.status(500).send({
        success: false,
        message: 'Internal server error',
      });
    }
  }
};

export const getUsers = async (
  request: FastifyRequest<{ Querystring: { page?: string, limit?: string } }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const page = parseInt(request.query.page || '1', 10);
    const limit = parseInt(request.query.limit || '10', 10);
    const result = await userService.getUsers(page, limit);
    reply.status(200).send({
      success: true,
      data: result.users,
      pagination: {
        page,
        limit,
        total: result.total,
        pages: Math.ceil(result.total / limit),
      },
    });
  } catch (error: unknown) {
    logger.error('Error in getUsers controller:', error);
    if (error instanceof Error) {
      reply.status(500).send({
        success: false,
        message: error.message,
      });
    } else {
      reply.status(500).send({
        success: false,
        message: 'Internal server error',
      });
    }
  }
};

/**
 * Get user by ID
 * GET /api/users/:id
 */
export const getUserById = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { id } = request.params;
    if (!id) {
      reply.status(400).send({
        success: false,
        message: 'User ID is required',
      });
      return;
    }
    const user = await userService.getUserById(id);
    if (!user) {
      reply.status(404).send({
        success: false,
        message: 'User not found',
      });
      return;
    }
    reply.status(200).send({
      success: true,
      data: user,
    });
  } catch (error: unknown) {
    logger.error('Error in getUserById controller:', error);
    if (error instanceof Error) {
      reply.status(500).send({
        success: false,
        message: error.message,
      });
    } else {
      reply.status(500).send({
        success: false,
        message: 'Internal server error',
      });
    }
  }
};

/**
 * Update user
 * PUT /api/users/:id
 */
export const updateUser = async (
  request: FastifyRequest<{ Params: { id: string }; Body: UpdateUserData }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { id } = request.params;
    const updateData = request.body;
    if (!id) {
      reply.status(400).send({
        success: false,
        message: 'User ID is required',
      });
      return;
    }
    const user = await userService.updateUser(id, updateData);
    if (!user) {
      reply.status(404).send({
        success: false,
        message: 'User not found',
      });
      return;
    }
    reply.status(200).send({
      success: true,
      data: user,
      message: 'User updated successfully',
    });
  } catch (error: unknown) {
    logger.error('Error in updateUser controller:', error);
    if (error instanceof Error) {
      reply.status(500).send({
        success: false,
        message: error.message,
      });
    } else {
      reply.status(500).send({
        success: false,
        message: 'Internal server error',
      });
    }
  }
};

/**
 * Delete user
 * DELETE /api/users/:id
 */
export const deleteUser = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { id } = request.params;
    if (!id) {
      reply.status(400).send({
        success: false,
        message: 'User ID is required',
      });
      return;
    }
    const success = await userService.deleteUser(id);
    if (!success) {
      reply.status(404).send({
        success: false,
        message: 'User not found',
      });
      return;
    }
    reply.status(200).send({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error: unknown) {
    logger.error('Error in deleteUser controller:', error);
    if (error instanceof Error) {
      reply.status(500).send({
        success: false,
        message: error.message,
      });
    } else {
      reply.status(500).send({
        success: false,
        message: 'Internal server error',
      });
    }
  }
};