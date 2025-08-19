export const createAvatarSchema = {
  body: {
    type: 'object',
    required: ['username', 'avatar_icon_url'],
    properties: {
      username: { type: 'string' },
      avatar_url: { type: 'string', format: 'uri' },
      avatar_icon_url: { type: 'string', format: 'uri' },
    },
  },
};

export const updateAvatarSchema = {
  body: {
    type: 'object',
    properties: {
      username: { type: 'string' },
      avatar_url: { type: 'string', format: 'uri' },
      avatar_icon_url: { type: 'string', format: 'uri' },
    },
  },
};

export const avatarParamsSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
  },
};

export interface ICreateAvatarBody {
  username: string;
  avatar_url?: string;
  avatar_icon_url: string;
}

export interface IUpdateAvatarBody {
  username?: string;
  avatar_url?: string;
  avatar_icon_url?: string;
}

export interface IAvatarParams {
  id: string;
}
