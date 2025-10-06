// Avatar DTO - what frontend gets from API
export interface Avatar {
  id: string;
  user_id: string;
  username: string;
  avatar_url?: string;
  createdAt: string;
  updatedAt: string;
}

// Create avatar request data
export interface CreateAvatarData {
  username: string;
  avatar_url?: string;
  public_id?: string;
  size?: number;
}

// Update avatar request data
export interface UpdateAvatarData {
  username?: string;
  avatar_url?: string;
  public_id?: string;
  size?: number;
}
