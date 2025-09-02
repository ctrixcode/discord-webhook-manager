import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import multipart from '@fastify/multipart';
import dotenv from 'dotenv';
import cookie from '@fastify/cookie';
import {
  corsPlugin,
  rateLimiterPlugin,
  loggingPlugin,
  errorHandlerPlugin,
  sanitizerPlugin,
} from './middlewares';
import routes from './routes/index';

dotenv.config();

const app = Fastify({ logger: false, requestTimeout: 30000 });

// Register plugins
app.register(helmet);
app.register(multipart);
app.register(loggingPlugin);
app.register(corsPlugin);
app.register(rateLimiterPlugin);
app.register(sanitizerPlugin);
app.register(errorHandlerPlugin);
app.register(cookie);

// Register routes
app.register(routes, { prefix: '/api' });

export default app;
