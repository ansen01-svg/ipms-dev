// "use client";

// import { useAuth } from "@/contexts/auth-context";
// import { ROLE_DASHBOARD_PATHS } from "@/lib/rbac-config.ts/constants";
// import { usePathname, useRouter } from "next/navigation";
// import { useEffect } from "react";

// interface RouteGuardProps {
//   children: React.ReactNode;
//   allowedRoles?: string[];
//   requireAuth?: boolean;
// }

// export default function RouteGuard({
//   children,
//   allowedRoles,
//   requireAuth = true,
// }: RouteGuardProps) {
//   const { user, loading } = useAuth();
//   const router = useRouter();
//   const pathname = usePathname();

//   useEffect(() => {
//     if (loading) return;

//     // Public routes
//     const publicRoutes = [
//       "/",
//       "/login",
//       "/forgot-password",
//       "/reset-password",
//       "/verify-otp",
//     ];
//     const isPublicRoute = publicRoutes.includes(pathname);

//     // REQUIREMENT 1: If user is logged in and trying to access any public route, redirect to dashboard
//     if (user && isPublicRoute) {
//       const dashboardPath =
//         ROLE_DASHBOARD_PATHS[user.role as keyof typeof ROLE_DASHBOARD_PATHS];
//       router.replace(dashboardPath);
//       return;
//     }

//     // REQUIREMENT 3: If route requires auth and user is not logged in (including /dashboard)
//     if (requireAuth && !user && !isPublicRoute) {
//       router.replace("/login");
//       return;
//     }

//     // Role-based access control
//     if (user && allowedRoles && !allowedRoles.includes(user.role)) {
//       const dashboardPath =
//         ROLE_DASHBOARD_PATHS[user.role as keyof typeof ROLE_DASHBOARD_PATHS];
//       router.replace(dashboardPath);
//       return;
//     }

//     // Handle dashboard root redirect
//     if (user && pathname === "/dashboard") {
//       const dashboardPath =
//         ROLE_DASHBOARD_PATHS[user.role as keyof typeof ROLE_DASHBOARD_PATHS];
//       router.replace(dashboardPath);
//       return;
//     }

//     // Handle role-specific dashboard access
//     if (user && pathname.startsWith("/dashboard/")) {
//       const pathSegments = pathname.split("/");
//       const roleInPath = pathSegments[2];

//       const sharedRoutes = ["projects", "archived-projects", "mb"];
//       const isSharedRoute = sharedRoutes.includes(roleInPath);

//       // REQUIREMENT 2: Check for JE-only sub-routes within shared routes
//       if (isSharedRoute) {
//         const jeOnlyRoutes = [
//           "/dashboard/projects/new",
//           "/dashboard/archived-projects/create",
//           "/dashboard/mb/new",
//         ];

//         // Check for dynamic routes that should be JE-only
//         const isDynamicJeRoute =
//           pathname.match(/^\/dashboard\/projects\/[^\/]+$/) || // /dashboard/projects/[id]
//           pathname.match(/^\/dashboard\/archived-projects\/[^\/]+$/); // /dashboard/archived-projects/[id]

//         const isJeOnlyRoute =
//           jeOnlyRoutes.includes(pathname) || isDynamicJeRoute;

//         if (isJeOnlyRoute && user.role !== "JE") {
//           const userDashboardPath =
//             ROLE_DASHBOARD_PATHS[
//               user.role as keyof typeof ROLE_DASHBOARD_PATHS
//             ];
//           router.replace(userDashboardPath);
//           return;
//         }
//       } else if (roleInPath !== user.role.toLowerCase()) {
//         // For non-shared routes, enforce role-based access
//         const userDashboardPath =
//           ROLE_DASHBOARD_PATHS[user.role as keyof typeof ROLE_DASHBOARD_PATHS];
//         router.replace(userDashboardPath);
//         return;
//       }
//     }
//   }, [user, loading, pathname, router, allowedRoles, requireAuth]);

//   // Show loading spinner while checking auth
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
//       </div>
//     );
//   }

//   return <>{children}</>;
// }

"use client";
import { useAuth } from "@/contexts/auth-context";
import { ROLE_DASHBOARD_PATHS } from "@/lib/rbac-config/constants";
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

    // REQUIREMENT 1: If user is logged in and trying to access any public route
    if (user && isPublicRoute) {
      const dashboardPath =
        ROLE_DASHBOARD_PATHS[user.role as keyof typeof ROLE_DASHBOARD_PATHS];
      router.replace(dashboardPath);
      return;
    }

    // REQUIREMENT 3: If route requires auth and user is not logged in (including /dashboard)
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

    // REQUIREMENT 2: JE-only sub-routes within shared routes
    if (user && pathname.startsWith("/dashboard/")) {
      const pathSegments = pathname.split("/");
      const roleInPath = pathSegments[2];

      const sharedRoutes = ["projects", "archived-projects", "mb", "profile"];
      const isSharedRoute = sharedRoutes.includes(roleInPath);

      // JE-only sub-routes
      const jeOnlyRoutes = [
        "/dashboard/projects/new",
        "/dashboard/archived-projects/create",
        "/dashboard/mb/new",
      ];
      const isJeOnlyRoute = jeOnlyRoutes.includes(pathname);

      // Check if current route is JE-only and user is not JE
      if (isJeOnlyRoute && user.role.toLowerCase() !== "je") {
        const userDashboardPath =
          ROLE_DASHBOARD_PATHS[user.role as keyof typeof ROLE_DASHBOARD_PATHS];
        router.replace(userDashboardPath);
        return;
      }

      // Handle role-specific dashboard access for non-shared routes
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
