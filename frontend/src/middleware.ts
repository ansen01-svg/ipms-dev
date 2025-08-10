import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/rbac-config.ts/auth";

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/forgot-password",
  "/reset-password",
  "/verify-otp",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  const isPublicRoute = publicRoutes.includes(pathname);

  // If accessing public route, allow through
  if (isPublicRoute) {
    // If user is already logged in and tries to access login, redirect to dashboard
    if (token && pathname === "/login") {
      try {
        const user = await verifyToken(token);
        const dashboardPath = getRoleDashboardPath(user.role);
        return NextResponse.redirect(new URL(dashboardPath, request.url));
      } catch (error) {
        console.log(error);
        // Token invalid, continue to login
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // Protected routes - require authentication
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const user = await verifyToken(token);

    // Handle dashboard root redirect
    if (pathname === "/dashboard") {
      const dashboardPath = getRoleDashboardPath(user.role);
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }

    // Role-based access control for specific dashboard routes
    if (pathname.startsWith("/dashboard/")) {
      const pathSegments = pathname.split("/");
      const roleInPath = pathSegments[2]; // /dashboard/[role]/...

      // Allow shared routes (projects, reports, etc.)
      const sharedRoutes = ["projects", "reports", "settings"];
      const isSharedRoute = sharedRoutes.includes(roleInPath);

      if (!isSharedRoute && roleInPath !== user.role.toLowerCase()) {
        // User trying to access another role's dashboard
        const userDashboardPath = getRoleDashboardPath(user.role);
        return NextResponse.redirect(new URL(userDashboardPath, request.url));
      }
    }

    // Add user context to headers for server components
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", user.id);
    requestHeaders.set("x-user-role", user.role);
    requestHeaders.set("x-user-name", user.name);
    requestHeaders.set("x-user-department", user.department || "");

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.log(error);
    // Invalid token, redirect to login
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("auth-token");
    return response;
  }
}

// Helper function to get role-specific dashboard path
function getRoleDashboardPath(role: string): string {
  const roleDashboardMap = {
    JE: "/dashboard/je",
    AEE: "/dashboard/aee",
    CE: "/dashboard/ce",
    MD: "/dashboard/md",
    EXECUTOR: "/dashboard/executor",
    VIEWER: "/dashboard/viewer",
  };

  return (
    roleDashboardMap[role as keyof typeof roleDashboardMap] || "/dashboard/je"
  );
}

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   return NextResponse.redirect(new URL(pathname, request.url));
// }

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
