export interface User {
  id: string;
  username: string;
  email: string;
  discord_id?: string;
  discord_avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
}
