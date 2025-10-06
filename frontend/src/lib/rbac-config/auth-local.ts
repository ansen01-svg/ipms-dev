import { User } from "@/types/user.types";
import { jwtVerify } from "jose";

const JWT_SECRET_STRING =
  process.env.NEXT_PUBLIC_JWT_SECRET || "your-fallback-secret";
const JWT_SECRET: Uint8Array = new TextEncoder().encode(JWT_SECRET_STRING);
const JWT_ALGORITHM = "HS256";

const AUTH_TOKEN_KEY = "auth-token";
const USER_DATA_KEY = "user-data";

export async function verifyToken(token: string): Promise<User> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: [JWT_ALGORITHM],
    });
    return payload as unknown as User;
  } catch (error) {
    console.error("❌ Token verification failed:", error);
    throw new Error("Invalid token");
  }
}

// IMPROVED storage functions with better error handling
export function setAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, token);

      // Immediate verification
      const stored = localStorage.getItem(AUTH_TOKEN_KEY);
      if (stored !== token) {
        throw new Error("Failed to store token - verification failed");
      }
    } catch (error) {
      console.error("❌ Failed to set auth token:", error);
      throw error; // Re-throw to handle in calling code
    }
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      return token;
    } catch (error) {
      console.error("❌ Failed to get auth token:", error);
      return null;
    }
  }
  return null;
}

export function setUserData(user: User): void {
  if (typeof window !== "undefined") {
    try {
      const userData = JSON.stringify(user);
      localStorage.setItem(USER_DATA_KEY, userData);

      // Immediate verification
      const stored = localStorage.getItem(USER_DATA_KEY);
      if (stored !== userData) {
        throw new Error("Failed to store user data - verification failed");
      }
    } catch (error) {
      console.error("❌ Failed to set user data:", error);
      throw error;
    }
  }
}

export function getUserData(): User | null {
  if (typeof window !== "undefined") {
    try {
      const userData = localStorage.getItem(USER_DATA_KEY);

      if (userData) {
        const parsed = JSON.parse(userData);
        return parsed;
      }
    } catch (error) {
      console.error("❌ Failed to get/parse user data:", error);
      // Clear corrupted data
      localStorage.removeItem(USER_DATA_KEY);
    }
  }
  return null;
}

export function clearAuthData(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    sessionStorage.clear();
  }
}

// IMPROVED getCurrentUser with better error handling
export async function getCurrentUser(): Promise<User | null> {
  try {
    const token = getAuthToken();
    if (!token) {
      return null;
    }

    // Get cached user data first
    const storedUser = getUserData();
    if (storedUser) {
      try {
        await verifyToken(token);
        return storedUser;
      } catch (error) {
        console.error("❌ getCurrentUser: Token verification failed:", error);
        clearAuthData();
        return null;
      }
    }

    // No stored user, extract from token
    const user = await verifyToken(token);
    setUserData(user);
    return user;
  } catch (error) {
    console.error("❌ getCurrentUser: Failed:", error);
    clearAuthData();
    return null;
  }
}

export function isAuthenticated(): boolean {
  const token = getAuthToken();
  const user = getUserData();
  const result = !!(token && user);
  return result;
}
