export type UserRole =
  | "Administrator"
  | "JE"
  | "AEE"
  | "CE"
  | "MD"
  | "EXECUTOR"
  | "VIEWER";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  avatar?: string;
  createdAt?: string;
  lastLoginAt?: string;
}
