export type UserRole =
  | "visitor"
  | "donor"
  | "campaign_creator"
  | "moderator"
  | "finance_manager"
  | "super_admin";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  avatarUrl: string | null;
  roles: UserRole[];
  permissions: string[];
  accountStatus: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  accountStatus: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
}

export interface AuthTokens {
  user: AuthUser;
  accessToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
