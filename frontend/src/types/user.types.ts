export type UserRole = "ADMIN" | "JE" | "AEE" | "CE" | "MD" | "VIEWER";

export interface User {
  id: string;
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  avatar?: string;
  createdAt?: string;
  lastLoginAt?: string;
}
