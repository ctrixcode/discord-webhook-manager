import { IExample } from '../models/Example';
import { logger } from '../utils';
import { ObjectId, Db } from 'mongodb';

export interface CreateExampleData {
  name: string;
  description: string;
  isDeleted?: boolean;
  tags?: string[];
  price: number;
  metadata: {
    category: 'electronics' | 'clothing' | 'books' | 'food' | 'other';
    priority?: 'low' | 'medium' | 'high';
  };
}

export interface UpdateExampleData {
  name?: string;
  description?: string;
  isDeleted?: boolean;
  tags?: string[];
  price?: number;
  metadata?: {
    category?: 'electronics' | 'clothing' | 'books' | 'food' | 'other';
    priority?: 'low' | 'medium' | 'high';
  };
}

export interface ExampleFilter {
  'metadata.category'?: string;
  isDeleted?: boolean;
}

function toIExample(doc: any): IExample {
  // Map MongoDB _id to id if needed, and ensure all fields exist
  return {
    ...doc,
    // Optionally: id: doc._id?.toString(),
  };
}

/**
 * Create a new example item
 */
export const createExample = async (
  exampleData: CreateExampleData,
  db: Db
): Promise<IExample> => {
  try {
    logger.info('Creating new example item', { name: exampleData.name });
    const collection = db.collection('examples');
    const result = await collection.insertOne(exampleData);
    const savedExample = await collection.findOne({ _id: result.insertedId });
    if (!savedExample) throw new Error('Failed to fetch inserted example');
    return toIExample(savedExample);
  } catch (error) {
    logger.error('Error creating example item:', error);
    throw error;
  }
};

/**
 * Get all example items with pagination and filtering
 */
export const getExamples = async (
  db: Db,
  page: number = 1,
  limit: number = 10,
  category?: string,
  isDeleted?: boolean
): Promise<{ examples: IExample[]; total: number }> => {
  try {
    const collection = db.collection('examples');
    const skip = (page - 1) * limit;
    const filter: ExampleFilter = {};
    if (category) filter['metadata.category'] = category;
    if (isDeleted !== undefined) filter.isDeleted = isDeleted;
    const [docs, total] = await Promise.all([
      collection
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .toArray(),
      collection.countDocuments(filter),
    ]);
    const examples = docs.map(toIExample);
    logger.info('Example items retrieved successfully', {
      count: examples.length,
      page,
      limit,
    });
    return { examples, total };
  } catch (error) {
    logger.error('Error retrieving example items:', error);
    throw error;
  }
};

/**
 * Get example item by ID
 */
export const getExampleById = async (
  exampleId: string,
  db: Db
): Promise<IExample | null> => {
  try {
    const collection = db.collection('examples');
    const example = await collection.findOne({ _id: new ObjectId(exampleId) });
    if (!example) {
      logger.warn('Example item not found', { exampleId });
      return null;
    }
    logger.info('Example item retrieved successfully', { exampleId });
    return toIExample(example);
  } catch (error) {
    logger.error('Error retrieving example item:', error);
    throw error;
  }
};

/**
 * Update example item
 */
export const updateExample = async (
  exampleId: string,
  updateData: UpdateExampleData,
  db: Db
): Promise<IExample | null> => {
  try {
    const collection = db.collection('examples');
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(exampleId) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    if (!result || !result.value) {
      logger.warn('Example item not found for update', { exampleId });
      return null;
    }
    logger.info('Example item updated successfully', { exampleId });
    return toIExample(result.value);
  } catch (error) {
    logger.error('Error updating example item:', error);
    throw error;
  }
};

/**
 * Delete example item (soft delete)
 */
export const deleteExample = async (
  exampleId: string,
  db: Db
): Promise<boolean> => {
  try {
    const collection = db.collection('examples');
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(exampleId) },
      { $set: { isDeleted: true } },
      { returnDocument: 'after' }
    );
    if (!result || !result.value) {
      logger.warn('Example item not found for deletion', { exampleId });
      return false;
    }
    logger.info('Example item deleted successfully', { exampleId });
    return true;
  } catch (error) {
    logger.error('Error deleting example item:', error);
    throw error;
  }
};

/**
 * Get examples by category
 */
export const getExamplesByCategory = async (
  category: string,
  db: Db
): Promise<IExample[]> => {
  try {
    const collection = db.collection('examples');
    const docs = await collection
      .find({
        'metadata.category': category,
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .toArray();
    const examples = docs.map(toIExample);
    logger.info('Examples retrieved by category', {
      category,
      count: examples.length,
    });
    return examples;
  } catch (error) {
    logger.error('Error retrieving examples by category:', error);
    throw error;
  }
};

/**
 * Search examples by name or description
 */
export const searchExamples = async (
  searchTerm: string,
  db: Db
): Promise<IExample[]> => {
  try {
    const collection = db.collection('examples');
    const docs = await collection
      .find({
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
        ],
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .toArray();
    const examples = docs.map(toIExample);
    logger.info('Examples searched successfully', {
      searchTerm,
      count: examples.length,
    });
    return examples;
  } catch (error) {
    logger.error('Error searching examples:', error);
    throw error;
  }
};
