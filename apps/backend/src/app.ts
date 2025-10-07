import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import multipart from '@fastify/multipart';
import cookie from '@fastify/cookie';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import {
  corsPlugin,
  rateLimiterPlugin,
  loggingPlugin,
  errorHandlerPlugin,
  sanitizerPlugin,
} from './middlewares';
import routes from './routes/index';
import { FILE_SIZE_UPLOAD_LIMIT } from './config/usage';

const app = Fastify({ logger: false, requestTimeout: 30000 });

app.register(swagger, {
  openapi: {
    info: {
      title: 'Discord Webhook Manager API',
      description:
        'Auto-generated API documentation for Discord Webhook Manager API',
      version: '1.0.0',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3001}`,
        description: 'Development Server',
      },
    ],
  },
});

app.register(swaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: true,
  },
});

// Register plugins
app.register(helmet);
app.register(multipart, {
  limits: {
    fileSize: FILE_SIZE_UPLOAD_LIMIT,
  },
});
app.register(loggingPlugin);
app.register(corsPlugin);
app.register(rateLimiterPlugin);
app.register(sanitizerPlugin);
app.register(errorHandlerPlugin);
app.register(cookie);

// Register routes
app.register(routes, { prefix: '/api' });

export default app;
