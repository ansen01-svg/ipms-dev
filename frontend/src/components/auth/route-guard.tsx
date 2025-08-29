"use client";

import { useAuth } from "@/contexts/auth-context";
import { ROLE_DASHBOARD_PATHS } from "@/lib/rbac-config.ts/constants";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireAuth?: boolean;
}

export default function RouteGuard({
  children,
  allowedRoles,
  requireAuth = true,
}: RouteGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    // Public routes
    const publicRoutes = [
      "/",
      "/login",
      "/forgot-password",
      "/reset-password",
      "/verify-otp",
    ];
    const isPublicRoute = publicRoutes.includes(pathname);

    // If user is logged in and trying to access login page
    if (user && pathname === "/login") {
      const dashboardPath =
        ROLE_DASHBOARD_PATHS[user.role as keyof typeof ROLE_DASHBOARD_PATHS];
      router.replace(dashboardPath);
      return;
    }

    // If route requires auth and user is not logged in
    if (requireAuth && !user && !isPublicRoute) {
      router.replace("/login");
      return;
    }

    // Role-based access control
    if (user && allowedRoles && !allowedRoles.includes(user.role)) {
      const dashboardPath =
        ROLE_DASHBOARD_PATHS[user.role as keyof typeof ROLE_DASHBOARD_PATHS];
      router.replace(dashboardPath);
      return;
    }

    // Handle dashboard root redirect
    if (user && pathname === "/dashboard") {
      const dashboardPath =
        ROLE_DASHBOARD_PATHS[user.role as keyof typeof ROLE_DASHBOARD_PATHS];
      router.replace(dashboardPath);
      return;
    }

    // Handle role-specific dashboard access
    if (user && pathname.startsWith("/dashboard/")) {
      const pathSegments = pathname.split("/");
      const roleInPath = pathSegments[2];

      const sharedRoutes = [
        "projects",
        "reports",
        "settings",
        "archived-projects",
        "mb",
      ];
      const isSharedRoute = sharedRoutes.includes(roleInPath);

      if (!isSharedRoute && roleInPath !== user.role.toLowerCase()) {
        const userDashboardPath =
          ROLE_DASHBOARD_PATHS[user.role as keyof typeof ROLE_DASHBOARD_PATHS];
        router.replace(userDashboardPath);
        return;
      }
    }
  }, [user, loading, pathname, router, allowedRoles, requireAuth]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
