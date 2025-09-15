import { User, UserRole } from "@/types/user.types";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET_STRING = process.env.JWT_SECRET;
const JWT_SECRET: Uint8Array = new TextEncoder().encode(JWT_SECRET_STRING);
const JWT_ALGORITHM = "HS256";

export async function verifyToken(token: string): Promise<User> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: [JWT_ALGORITHM],
    });
    return payload as unknown as User;
  } catch (error) {
    console.error("Error verifying token:", error);
    throw new Error("Invalid token");
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    return await verifyToken(token);
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}

export function getUserFromHeaders(request: NextRequest): User | null {
  const userId = request.headers.get("x-user-id");
  const userRole = request.headers.get("x-user-role");
  const userName = request.headers.get("x-user-name");
  const userDepartment = request.headers.get("x-user-department");

  if (!userId || !userRole || !userName) {
    return null;
  }

  return {
    id: userId,
    userId: userId,
    _id: userId, // Placeholder, adjust as needed
    role: userRole as UserRole,
    name: userName,
    department: userDepartment || undefined,
    email: "", // Would be set from token in real implementation
    phoneNumber: "", // Placeholder
    designation: "", // Placeholder
    isFirstLogin: false, // Placeholder
    lastPasswordChange: new Date().toISOString(), // Placeholder, adjust as needed
    updatedAt: new Date().toISOString(), // Placeholder, adjust as needed
    // Add any other required properties with default values here
  };
}
