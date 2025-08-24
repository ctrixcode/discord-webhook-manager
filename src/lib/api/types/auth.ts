import { User } from './user';

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface AuthUser extends User {
  isAuthenticated: boolean;
}
