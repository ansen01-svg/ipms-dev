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

import DashboardLayout from "@/components/dashboard/layout-components/layout";
import { useAuth } from "@/contexts/auth-context";
import { User } from "@/types/user.types";
import { useRouter } from "next/navigation";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user } = useAuth();

  if (!user) {
    router.replace("/login");
    return;
  }

  return <DashboardLayout user={user as User}>{children}</DashboardLayout>;
}
