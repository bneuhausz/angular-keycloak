export interface User {
  id: string;
  username: string;
  enabled: boolean;
}

export interface GetUserResponse {
  users: User[];
  count: number;
}