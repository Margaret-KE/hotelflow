export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  tenantId: string;
  roleId: string;
  firstName: string;
  lastName: string;
  email: string;
}