import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import * as exampleController from '../controllers/example.controller';

const exampleRoutes = async (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
) => {
  fastify.post('/', exampleController.createExample);
  fastify.get('/', exampleController.getExamples);
  fastify.get('/search', exampleController.searchExamples);
  fastify.get('/category/:category', exampleController.getExamplesByCategory);
  fastify.get('/:id', exampleController.getExampleById);
  fastify.put('/:id', exampleController.updateExample);
  fastify.delete('/:id', exampleController.deleteExample);
};

export default exampleRoutes;
