import { User, UserRole } from "@/types/user.types";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const JWT_ALGORITHM = "HS256";

export async function createToken(user: User): Promise<string> {
  return await new SignJWT({
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    department: user.department,
  })
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<User> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as User;
  } catch (error) {
    console.error("Error verifying token:", error);
    throw new Error("Invalid token");
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

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
    role: userRole as UserRole,
    name: userName,
    department: userDepartment || undefined,
    email: "", // Would be set from token in real implementation
  };
}
