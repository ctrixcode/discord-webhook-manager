export const createMessageTemplateSchema = {
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      content: { type: 'string' },
      avatar_ref: { type: 'string' },
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
      },
    },
    required: ['name'],
    anyOf: [{ required: ['content'] }, { required: ['embeds'] }],
  },
};

export const updateMessageTemplateSchema = {
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      description: { type: 'string' },
      content: { type: 'string' },
      avatar_ref: { type: 'string' },
      embeds: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            url: { type: 'string' },
            color: { type: 'string' },
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
      },
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

export const messageTemplateParamsSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
  },
};

export const getMessageTemplatesQuerySchema = {
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'string' },
      limit: { type: 'string' },
    },
  },
};

export interface IMessageTemplateParams {
  id: string;
}
