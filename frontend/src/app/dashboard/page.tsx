// import { getCurrentUser } from "@/lib/rbac-config.ts/auth";
// import { ROLE_DASHBOARD_PATHS } from "@/lib/rbac-config.ts/constants";
// import { redirect } from "next/navigation";

// export default async function DashboardPage() {
//   const user = await getCurrentUser();

//   if (!user) {
//     redirect("/login");
//   }

//   // Redirect to role-specific dashboard
//   type Role = keyof typeof ROLE_DASHBOARD_PATHS;
//   const dashboardPath = ROLE_DASHBOARD_PATHS[user.role as Role];
//   redirect(dashboardPath);
// }

"use client";

import { useAuth } from "@/contexts/auth-context";
import { ROLE_DASHBOARD_PATHS } from "@/lib/rbac-config.ts/constants";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    // Redirect to role-specific dashboard
    type Role = keyof typeof ROLE_DASHBOARD_PATHS;
    const dashboardPath = ROLE_DASHBOARD_PATHS[user.role as Role];
    router.replace(dashboardPath);
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return null;
}
