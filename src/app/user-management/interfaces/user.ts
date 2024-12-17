import { Credential } from './credential';

export interface User {
  id: string;
  username: string;
  enabled: boolean;
}

export type CreateUser = Omit<User, 'id'>;

export type ResetUserPassword = { id: User['id']; data: Credential };

export interface GetUserResponse {
  users: User[];
  count: number;
}