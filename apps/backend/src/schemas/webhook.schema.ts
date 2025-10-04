export const createWebhookSchema = {
  body: {
    type: 'object',
    required: ['name', 'url'],
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      url: { type: 'string', format: 'uri' },
    },
  },
};

export const updateWebhookSchema = {
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      is_active: { type: 'boolean' },
    },
  },
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
  },
};

export const webhookParamsSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
  },
};

export const getWebhooksQuerySchema = {
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'string' },
      limit: { type: 'string' },
      status: { type: 'string', enum: ['active', 'inactive'] },
    },
  },
};

export const webhookSendMessageSchema = {
  body: {
    type: 'object',
    required: ['webhookIds', 'messageData'],
    properties: {
      webhookIds: {
        type: 'array',
        items: { type: 'string' },
        minItems: 1,
      },
      messageData: {
        type: 'object',
        required: ['message'],
        properties: {
          message: { type: 'string' },
          avatarRefID: { type: 'string' },
          embeds: { type: 'array', items: { type: 'object' } },
          message_replace_url: { type: 'string' }, // Optional: ID of the message to edit
        },
      },
    },
  },
};
