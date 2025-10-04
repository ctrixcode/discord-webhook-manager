import fp from 'fastify-plugin';

type Sanitizable =
  | string
  | number
  | boolean
  | null
  | undefined
  | { [key: string]: Sanitizable }
  | Sanitizable[]
  | Record<string, unknown>;

const sanitizeObject = (obj: Sanitizable): Sanitizable => {
  if (obj === null || typeof obj === 'undefined') {
    return obj;
  }
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  if (typeof obj === 'object') {
    const sanitized: { [key: string]: Sanitizable } = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value as Sanitizable); // Type assertion here
    }
    return sanitized;
  }
  return obj;
};

const sanitizeString = (str: string): string => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/<[a-zA-Z\/][^>]*>/g, '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/\0/g, '')
    .trim();
};

const sanitizerPlugin = fp(async fastify => {
  fastify.addHook('preValidation', async request => {
    if (request.body !== undefined && request.body !== null)
      request.body = sanitizeObject(request.body as Sanitizable);
    if (request.query !== undefined && request.query !== null)
      request.query = sanitizeObject(request.query as Sanitizable);
    if (request.params !== undefined && request.params !== null)
      request.params = sanitizeObject(request.params as Sanitizable);
  });
});

export default sanitizerPlugin;
