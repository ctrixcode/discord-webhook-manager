export const createAvatarSchema = {
  body: {
    type: 'object',
    required: ['username', 'avatar_url'],
    properties: {
      username: { type: 'string' },
      avatar_url: { type: 'string', format: 'uri' },
    },
  },
};

export const uploadAvatarSchema = {
  consumes: ['multipart/form-data'],
  body: {
    type: 'object',
    properties: {
      avatar: { type: 'string', format: 'binary' }, // Represents the file input
      username: { type: 'string' }, // The username for the avatar
    },
    required: ['avatar', 'username'],
  },
};

export const updateAvatarSchema = {
  body: {
    type: 'object',
    properties: {
      username: { type: 'string' },
      avatar_url: { type: 'string', format: 'uri' },
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

export interface IUploadAvatarBody {
  avatar: string; // This will be a string representing the file in the schema
  username: string;
}

export interface IUpdateAvatarBody {
  username?: string;
  avatar_url?: string;
  avatar_icon_url?: string;
}

export interface IAvatarParams {
  id: string;
}
