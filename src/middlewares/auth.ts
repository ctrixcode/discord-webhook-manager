import { FastifyRequest, FastifyReply } from 'fastify';
import { TokenExpiredError } from 'jsonwebtoken';
import { verifyToken } from '../utils/jwt';

const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return reply.status(401).send({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return reply.status(401).send({ message: 'No token provided' });
  }

  try {
    const decoded = verifyToken(token);
    request.user = decoded;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return reply.status(401).send({ message: 'Access token expired' });
    }
    return reply.status(401).send({ message: 'Invalid token' });
  }
};
export default authenticate;
