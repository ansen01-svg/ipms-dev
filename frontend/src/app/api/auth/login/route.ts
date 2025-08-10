import { createToken } from "@/lib/rbac-config.ts/auth";
import { User } from "@/types/user.types";
import { NextRequest, NextResponse } from "next/server";

// Mock user database - replace with real database
const MOCK_USERS: User[] = [
  {
    id: "je123",
    email: "je@government.in",
    name: "Junior Engineer",
    role: "JE",
    department: "Civil Engineering",
  },
  {
    id: "aee123",
    email: "aee@government.in",
    name: "Assistant Executive Engineer",
    role: "AEE",
    department: "Engineering",
  },
  {
    id: "ce123",
    email: "ce@government.in",
    name: "Chief Engineer",
    role: "CE",
    department: "Engineering",
  },
  {
    id: "md123",
    email: "md@government.in",
    name: "Managing Director",
    role: "MD",
    department: "Engineering",
  },
  {
    id: "admin123",
    email: "admin@government.in",
    name: "Admin",
    role: "ADMIN",
    department: "Engineering/IT",
  },
  {
    id: "viewer123",
    email: "viewer@government.in",
    name: "Viewer",
    role: "VIEWER",
    department: "Minister Office",
  },
  {
    id: "executor123",
    email: "executor@government.in",
    name: "Executor",
    role: "EXECUTOR",
    department: "PWD",
  },
];

export async function POST(request: NextRequest) {
  try {
    const { userId, password } = await request.json();
    console.log("Login attempt:", { userId, password });
    // Mock authentication - replace with real auth
    const user = MOCK_USERS.find((u) => u.id === userId);

    if (!user || password !== "password@123") {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = await createToken(user);

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
