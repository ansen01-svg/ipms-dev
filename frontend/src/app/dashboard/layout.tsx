// import DashboardLayout from "@/components/dashboard/layout-components/layout";
// import { getCurrentUser } from "@/lib/rbac-config.ts/auth";
// import { User } from "@/types/user.types";

// export const dynamic = "force-dynamic";

// export default async function DashboardRootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const user = await getCurrentUser();

//   return <DashboardLayout user={user as User}>{children}</DashboardLayout>;
// }

"use client";

import RouteGuard from "@/components/auth/route-guard";
import DashboardLayout from "@/components/dashboard/layout-components/layout";
import { useAuth } from "@/contexts/auth-context";
import { User } from "@/types/user.types";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  return (
    <RouteGuard requireAuth={true}>
      <DashboardLayout user={user as User}>{children}</DashboardLayout>
    </RouteGuard>
  );
}
