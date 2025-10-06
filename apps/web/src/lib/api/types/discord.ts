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
