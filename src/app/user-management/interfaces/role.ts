export interface Role {
  id: string;
  name: string;
  isInRole: boolean;
}

export interface EditUserRole {
  userId: string;
  roleId: string;
  roleName: string;
  checked: boolean;
}