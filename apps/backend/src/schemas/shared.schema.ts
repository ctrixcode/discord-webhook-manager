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
  500: (example = 'Internal Server Error.') =>
    errorSchema('Internal Server Error.', example),
};

export const successSchema = (dataSchema: object) => ({
  type: 'object',
  properties: {
    success: { type: 'boolean', default: true },
    data: dataSchema,
    message: { type: 'string' },
  },
  required: ['success', 'data', 'message'],
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
    ...baseEntitySchema,
    user_id: { type: 'string' },
    username: { type: 'string' },
    avatar_url: {
      type: 'string',
    },
  },
};

export const messageTemplateResponseSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' }, // ...baseEntity is not used because _id v/s id generates error
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    user_id: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string', nullable: true },
    content: { type: 'string' },
    avatar_ref: {
      type: 'string',
      nullable: true,
    },
    embeds: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          url: { type: 'string' },
          color: { type: 'number' },
          timestamp: { type: 'string', format: 'date-time' },
          image: { type: 'object', properties: { url: { type: 'string' } } },
          thumbnail: {
            type: 'object',
            properties: { url: { type: 'string' } },
          },
          author: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              url: { type: 'string' },
              icon_url: { type: 'string' },
            },
          },
          fields: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                value: { type: 'string' },
                inline: { type: 'boolean' },
              },
            },
          },
          footer: {
            type: 'object',
            properties: {
              text: { type: 'string' },
              icon_url: { type: 'string' },
            },
          },
        },
      },
    },
    attachments: {
      type: 'array',
      items: { type: 'string' },
      nullable: true,
    },
  },
};

export const webhookResponseSchema = {
  type: 'object',
  properties: {
    ...baseEntitySchema,
    user_id: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string', nullable: true },
    url: { type: 'string', format: 'uri' },
    is_active: { type: 'boolean' },
    avatar_url: {
      type: 'string',
      format: 'uri',
      nullable: true,
    },
    last_used: {
      type: 'string',
      format: 'date-time',
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
