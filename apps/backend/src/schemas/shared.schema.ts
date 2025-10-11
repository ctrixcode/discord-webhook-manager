export const errorSchema = (description: string, example: string) => ({
  description,
  type: 'object',
  properties: {
    message: { type: 'string', example },
  },
});

export const responseSchemas = {
  400: (example = 'Invalid data provided.') =>
    errorSchema('Invalid data provided.', example),
  401: errorSchema('No token provided.', 'No token provided'),
  404: (example = 'Resource not found.') =>
    errorSchema('Resource not found.', example),
  500: (example: string) => errorSchema('Internal Server Error.', example),
};

export const successSchema = (dataSchema: object) => ({
  type: 'object',
  properties: {
    success: { type: 'boolean', default: true },
    data: dataSchema,
  },
  required: ['success', 'data'],
});

const baseEntitySchema = {
  id: { type: 'string' },
  createdAt: {
    type: 'string',
    format: 'date-time',
  },
  updatedAt: {
    type: 'string',
    format: 'date-time',
  },
};

export const avatarResponseSchema = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    avatar_url: {
      type: 'string',
      format: 'uri',
    },
  },
};

export const messageTemplateResponseSchema = {
  type: 'object',
  properties: {
    ...baseEntitySchema,
    name: { type: 'string' },
    content: { type: 'string' },
  },
};

export const webhookResponseSchema = {
  type: 'object',
  properties: {
    ...baseEntitySchema,
    name: { type: 'string' },
    url: { type: 'string', format: 'uri' },
    status: {
      type: 'string',
      enum: ['active', 'inactive'],
    },
    avatar_url: {
      type: 'string',
      format: 'uri',
      nullable: true,
    },
  },
};

export const userProfileResponseSchema = successSchema({
  type: 'object',
  properties: {
    ...baseEntitySchema,
    username: { type: 'string' },
    email: { type: 'string', format: 'email' },
    discord_id: { type: 'string' },
    discord_avatar: {
      type: 'string',
      nullable: true,
    },
    accountType: {
      type: 'string',
      enum: ['free', 'paid', 'premium'],
    },
  },
});

export const userUsageResponseSchema = successSchema({
  type: 'object',
  properties: {
    webhookMessagesSentToday: { type: 'number' },
    totalMediaStorageUsed: { type: 'number' },
    dailyWebhookMessageLimit: { type: 'number' },
    overallMediaStorageLimit: { type: 'number' },
  },
});
