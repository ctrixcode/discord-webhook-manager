export interface DiscordEmbed {
  title?: string;
  description?: string;
  url?: string;
  color?: number;
  author?: {
    name: string;
    icon_url?: string;
    url?: string;
  };
  fields?: {
    name: string;
    value: string;
    inline?: boolean;
  }[];
  thumbnail?: {
    url: string;
  };
  image?: {
    url: string;
  };
  footer?: {
    text: string;
    icon_url?: string;
  };
  timestamp?: string;
}

export interface DiscordToken {
  id: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiscordTokenRequest {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user_id: string;
}

export interface UpdateDiscordTokenRequest {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
}
