import fp from 'fastify-plugin';

const sanitizeObject = (obj: any): any => {
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  }
  return obj;
};

const sanitizeString = (str: string): string => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/<[^>]*>/g, '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/\0/g, '')
    .trim();
};

const sanitizerPlugin = fp(async fastify => {
  fastify.addHook('preValidation', async request => {
    if (request.body) request.body = sanitizeObject(request.body);
    if (request.query) request.query = sanitizeObject(request.query);
    if (request.params) request.params = sanitizeObject(request.params);
  });
});

export default sanitizerPlugin;
