import { User } from '@repo/shared-types';

export interface AuthUser extends User {
  isAuthenticated: boolean;
}
