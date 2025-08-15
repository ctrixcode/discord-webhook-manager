import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import * as exampleService from '../services/example.service';
import { logger } from '../utils';
import {
  CreateExampleData,
  UpdateExampleData,
} from '../services/example.service';

interface ExampleParams {
  id?: string;
  category?: string;
}

interface ExampleQuery {
  page?: string;
  limit?: string;
  category?: string;
  isDeleted?: string;
  q?: string;
}

/**
 * Create a new example item
 * POST /api/examples
 */
export const createExample = async (
  request: FastifyRequest<{ Body: CreateExampleData }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const exampleData = request.body;
    if (
      !exampleData.name ||
      !exampleData.description ||
      !exampleData.price ||
      !exampleData.metadata?.category
    ) {
      reply.status(400).send({
        success: false,
        message:
          'Missing required fields: name, description, price, and metadata.category are required',
      });
      return;
    }
    const db = (request.server as FastifyInstance & { mongo: any }).mongo.db;
    if (!db) throw new Error('MongoDB not initialized');
    const example = await exampleService.createExample(exampleData, db);
    reply.status(201).send({
      success: true,
      data: example,
      message: 'Example item created successfully',
    });
  } catch (error: any) {
    logger.error('Error in createExample controller:', error);
    if (error.name === 'ValidationError') {
      reply.status(400).send({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map((err: any) => err.message),
      });
      return;
    }
    reply.status(500).send({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Get all example items with pagination and filtering
 * GET /api/examples
 */
export const getExamples = async (
  request: FastifyRequest<{ Querystring: ExampleQuery }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const page = parseInt(request.query.page || '1', 10);
    const limit = parseInt(request.query.limit || '10', 10);
    const category = request.query.category;
    const isDeleted =
      request.query.isDeleted !== undefined
        ? request.query.isDeleted === 'true'
        : undefined;
    const db = (request.server as FastifyInstance & { mongo: any }).mongo.db;
    if (!db) throw new Error('MongoDB not initialized');
    const result = await exampleService.getExamples(
      db,
      page,
      limit,
      category,
      isDeleted
    );
    reply.status(200).send({
      success: true,
      data: result.examples,
      pagination: {
        page,
        limit,
        total: result.total,
        pages: Math.ceil(result.total / limit),
      },
    });
  } catch (error) {
    logger.error('Error in getExamples controller:', error);
    reply.status(500).send({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Get example item by ID
 * GET /api/examples/:id
 */
export const getExampleById = async (
  request: FastifyRequest<{ Params: ExampleParams }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { id } = request.params;
    if (!id) {
      reply.status(400).send({
        success: false,
        message: 'Example ID is required',
      });
      return;
    }
    const db = (request.server as FastifyInstance & { mongo: any }).mongo.db;
    if (!db) throw new Error('MongoDB not initialized');
    const example = await exampleService.getExampleById(id, db);
    if (!example) {
      reply.status(404).send({
        success: false,
        message: 'Example item not found',
      });
      return;
    }
    reply.status(200).send({
      success: true,
      data: example,
    });
  } catch (error) {
    logger.error('Error in getExampleById controller:', error);
    reply.status(500).send({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Update example item
 * PUT /api/examples/:id
 */
export const updateExample = async (
  request: FastifyRequest<{ Params: ExampleParams; Body: UpdateExampleData }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { id } = request.params;
    const updateData = request.body;
    if (!id) {
      reply.status(400).send({
        success: false,
        message: 'Example ID is required',
      });
      return;
    }
    const db = (request.server as FastifyInstance & { mongo: any }).mongo.db;
    if (!db) throw new Error('MongoDB not initialized');
    const example = await exampleService.updateExample(id, updateData, db);
    if (!example) {
      reply.status(404).send({
        success: false,
        message: 'Example item not found',
      });
      return;
    }
    reply.status(200).send({
      success: true,
      data: example,
      message: 'Example item updated successfully',
    });
  } catch (error: any) {
    logger.error('Error in updateExample controller:', error);
    if (error.name === 'ValidationError') {
      reply.status(400).send({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map((err: any) => err.message),
      });
      return;
    }
    reply.status(500).send({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Delete example item (soft delete)
 * DELETE /api/examples/:id
 */
export const deleteExample = async (
  request: FastifyRequest<{ Params: ExampleParams }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { id } = request.params;
    if (!id) {
      reply.status(400).send({
        success: false,
        message: 'Example ID is required',
      });
      return;
    }
    const db = (request.server as FastifyInstance & { mongo: any }).mongo.db;
    if (!db) throw new Error('MongoDB not initialized');
    const success = await exampleService.deleteExample(id, db);
    if (!success) {
      reply.status(404).send({
        success: false,
        message: 'Example item not found',
      });
      return;
    }
    reply.status(200).send({
      success: true,
      message: 'Example item deleted successfully',
    });
  } catch (error) {
    logger.error('Error in deleteExample controller:', error);
    reply.status(500).send({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Get examples by category
 * GET /api/examples/category/:category
 */
export const getExamplesByCategory = async (
  request: FastifyRequest<{ Params: ExampleParams }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { category } = request.params;
    if (!category) {
      reply.status(400).send({
        success: false,
        message: 'Category is required',
      });
      return;
    }
    const db = (request.server as FastifyInstance & { mongo: any }).mongo.db;
    if (!db) throw new Error('MongoDB not initialized');
    const examples = await exampleService.getExamplesByCategory(category, db);
    reply.status(200).send({
      success: true,
      data: examples,
    });
  } catch (error) {
    logger.error('Error in getExamplesByCategory controller:', error);
    reply.status(500).send({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Search examples by name or description
 * GET /api/examples/search
 */
export const searchExamples = async (
  request: FastifyRequest<{ Querystring: ExampleQuery }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const q = request.query.q || '';
    const db = (request.server as FastifyInstance & { mongo: any }).mongo.db;
    if (!db) throw new Error('MongoDB not initialized');
    const examples = await exampleService.searchExamples(q, db);
    reply.status(200).send({
      success: true,
      data: examples,
    });
  } catch (error) {
    logger.error('Error in searchExamples controller:', error);
    reply.status(500).send({
      success: false,
      message: 'Internal server error',
    });
  }
};
