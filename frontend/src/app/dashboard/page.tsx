import { getCurrentUser } from "@/lib/rbac-config.ts/auth";
import { ROLE_DASHBOARD_PATHS } from "@/lib/rbac-config.ts/constants";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Redirect to role-specific dashboard
  type Role = keyof typeof ROLE_DASHBOARD_PATHS;
  const dashboardPath = ROLE_DASHBOARD_PATHS[user.role as Role];
  redirect(dashboardPath);
}
