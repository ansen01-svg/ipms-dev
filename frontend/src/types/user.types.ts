export type UserRole = "ADMIN" | "JE" | "AEE" | "CE" | "MD" | "VIEWER";

// export interface User {
//   userId: string;
//   email: string;
//   name: string;
//   role: UserRole;
//   department?: string;
//   avatar?: string;
//   createdAt?: string;
//   lastLoginAt?: string;
// }

export interface User {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  avatar?: string;
  createdAt?: string;
  lastLoginAt?: string;
  id: string;
  _id: string;
  fullName?: string;
  username?: string;
  phoneNumber: string;
  roleId?: string;
  departmentName?: string;
  departmentId?: string;
  designation: string;
  officeLocation?: string;

  isFirstLogin: boolean;
  lastPasswordChange: string;

  updatedAt: string;
}

export interface UpdateProfileData {
  avatar?: string;
  username?: string;
  phoneNumber?: string;
  email?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  error?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}
