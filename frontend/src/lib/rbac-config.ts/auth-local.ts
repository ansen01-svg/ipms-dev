import { User } from "@/types/user.types";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET_STRING =
  process.env.NEXT_PUBLIC_JWT_SECRET || "your-fallback-secret";
const JWT_SECRET: Uint8Array = new TextEncoder().encode(JWT_SECRET_STRING);
const JWT_ALGORITHM = "HS256";

const AUTH_TOKEN_KEY = "auth-token";
const USER_DATA_KEY = "user-data";

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
      console.log("💾 Setting auth token...", { tokenLength: token?.length });
      localStorage.setItem(AUTH_TOKEN_KEY, token);

      // Immediate verification
      const stored = localStorage.getItem(AUTH_TOKEN_KEY);
      if (stored !== token) {
        throw new Error("Failed to store token - verification failed");
      }
      console.log("✅ Auth token stored successfully");
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
      console.log("🔍 Getting auth token:", {
        hasToken: !!token,
        tokenLength: token?.length,
      });
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
      console.log("💾 Setting user data...", {
        userDataLength: userData.length,
      });
      localStorage.setItem(USER_DATA_KEY, userData);

      // Immediate verification
      const stored = localStorage.getItem(USER_DATA_KEY);
      if (stored !== userData) {
        throw new Error("Failed to store user data - verification failed");
      }
      console.log("✅ User data stored successfully");
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
      console.log("🔍 Getting user data:", { hasUserData: !!userData });

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
    console.log("🧹 Clearing auth data...");
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    sessionStorage.clear();
    console.log("✅ Auth data cleared");
  }
}

// IMPROVED getCurrentUser with better error handling
export async function getCurrentUser(): Promise<User | null> {
  try {
    console.log("🔍 getCurrentUser: Starting...");

    const token = getAuthToken();
    if (!token) {
      console.log("❌ getCurrentUser: No token found");
      return null;
    }

    // Get cached user data first
    const storedUser = getUserData();
    if (storedUser) {
      console.log("🔍 getCurrentUser: Found stored user, verifying token...");
      try {
        await verifyToken(token);
        console.log("✅ getCurrentUser: Token valid, returning stored user");
        return storedUser;
      } catch (error) {
        console.error("❌ getCurrentUser: Token verification failed:", error);
        clearAuthData();
        return null;
      }
    }

    // No stored user, extract from token
    console.log("🔍 getCurrentUser: No stored user, extracting from token...");
    const user = await verifyToken(token);
    setUserData(user);
    console.log("✅ getCurrentUser: User extracted and cached");
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
  console.log("🔍 isAuthenticated:", {
    hasToken: !!token,
    hasUser: !!user,
    result,
  });
  return result;
}
