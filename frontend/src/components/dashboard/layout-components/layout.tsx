"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { User } from "@/types/user.types";
import { FolderOpen, LayoutDashboard, Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Breadcrumbs from "./breadcrumbs";
import Header from "./header";
import { DesktopSidebar, MobileSidebar } from "./sidebar";

// Types
export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  href: string;
}

type DashboardLayoutProps = {
  children: React.ReactNode;
  user: User;
};

// Function to get navigation items based on user role
const getNavigationItems = (role: string) => {
  const baseRole = role.toLowerCase();

  const commonItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      href: `/dashboard/${baseRole}`,
      icon: LayoutDashboard,
    },
  ];

  switch (role) {
    case "JE":
      return [
        ...commonItems,
        {
          id: "my-projects",
          label: "Projects",
          href: `/dashboard/projects`,
          icon: FolderOpen,
        },
        // {
        //   id: "create-project",
        //   label: "Create Project",
        //   href: `/dashboard/je/projects/create`,
        //   icon: Building,
        // },
        // {
        //   id: "my-tasks",
        //   label: "My Tasks",
        //   href: `/dashboard/je/tasks`,
        //   icon: CheckSquare,
        // },
      ];

    case "AEE":
      return [
        ...commonItems,
        {
          id: "my-projects",
          label: "Projects",
          href: `/dashboard/projects`,
          icon: FolderOpen,
        },
        // {
        //   id: "review-queue",
        //   label: "Review Queue",
        //   href: `/dashboard/aee/projects`,
        //   icon: FolderOpen,
        // },
        // {
        //   id: "team-management",
        //   label: "Team Management",
        //   href: `/dashboard/aee/team`,
        //   icon: Users,
        // },
        // {
        //   id: "reports",
        //   label: "Reports",
        //   href: `/dashboard/aee/reports`,
        //   icon: FileText,
        // },
      ];

    case "CE":
      return [
        ...commonItems,
        {
          id: "my-projects",
          label: "Projects",
          href: `/dashboard/projects`,
          icon: FolderOpen,
        },
        // {
        //   id: "approval-queue",
        //   label: "Approval Queue",
        //   href: `/dashboard/ce/projects`,
        //   icon: FolderOpen,
        // },
        // {
        //   id: "budget-review",
        //   label: "Budget Review",
        //   href: `/dashboard/ce/budget`,
        //   icon: BarChart3,
        // },
        // {
        //   id: "reports",
        //   label: "Reports",
        //   href: `/dashboard/ce/reports`,
        //   icon: FileText,
        // },
      ];

    case "MD":
      return [
        ...commonItems,
        {
          id: "my-projects",
          label: "Projects",
          href: `/dashboard/projects`,
          icon: FolderOpen,
        },
        // {
        //   id: "sanction-queue",
        //   label: "Sanction Queue",
        //   href: `/dashboard/md/projects`,
        //   icon: FolderOpen,
        // },
        // {
        //   id: "executive-reports",
        //   label: "Executive Reports",
        //   href: `/dashboard/md/reports`,
        //   icon: FileText,
        // },
        // {
        //   id: "policy-management",
        //   label: "Policy Management",
        //   href: `/dashboard/md/policy`,
        //   icon: Settings,
        // },
      ];

    case "EXECUTOR":
      return [
        ...commonItems,
        {
          id: "my-projects",
          label: "Projects",
          href: `/dashboard/projects`,
          icon: FolderOpen,
        },
        // {
        //   id: "implementation",
        //   label: "Implementation",
        //   href: `/dashboard/executor/projects`,
        //   icon: FolderOpen,
        // },
        // {
        //   id: "progress-tracking",
        //   label: "Progress Tracking",
        //   href: `/dashboard/executor/progress`,
        //   icon: BarChart3,
        // },
        // {
        //   id: "team-&-resources",
        //   label: "Team & Resources",
        //   href: `/dashboard/executor/team`,
        //   icon: Users,
        // },
      ];

    case "VIEWER":
      return [
        ...commonItems,
        {
          id: "my-projects",
          label: "Projects",
          href: `/dashboard/projects`,
          icon: FolderOpen,
        },
        // {
        //   id: "all-projects",
        //   label: "All Projects",
        //   href: `/dashboard/viewer/projects`,
        //   icon: Eye,
        // },
        // {
        //   id: "public-reports",
        //   label: "Public Reports",
        //   href: `/dashboard/viewer/reports`,
        //   icon: FileText,
        // },
        // {
        //   id: "district-view",
        //   label: "District View",
        //   href: `/dashboard/viewer/district`,
        //   icon: BarChart3,
        // },
      ];

    case "ADMIN":
      return [
        ...commonItems,
        {
          id: "my-projects",
          label: "Projects",
          href: `/dashboard/projects`,
          icon: FolderOpen,
        },
        {
          id: "users",
          label: "Users",
          href: `/dashboard/admin/users`,
          icon: Users,
        },
      ];

    default:
      return commonItems;
  }
};

// Main Layout Component
export default function DashboardLayout({
  children,
  user,
}: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  const pathname = usePathname();
  const router = useRouter();

  const navigationItems = getNavigationItems(user.role);

  const handleMobileMenuClick = () => {
    setMobileMenuOpen(true);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleItemClick = (href: string) => {
    router.push(href);
  };

  return (
    <div className="h-screen bg-gray-50 overflow-hidden relative">
      <SidebarProvider>
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <DesktopSidebar
            navigationItems={navigationItems}
            onItemClick={handleItemClick}
            currentPath={pathname}
            isCollapsed={sidebarCollapsed}
          />
        </div>

        {/* Mobile Sidebar */}
        <MobileSidebar
          navigationItems={navigationItems}
          onItemClick={handleItemClick}
          isOpen={mobileMenuOpen}
          onClose={handleMobileMenuClose}
          currentPath={pathname}
        />

        {/* Main Content Area - Absolute positioning to ensure full width */}
        <div
          className={cn(
            "absolute top-0 right-0 bottom-0 flex flex-col transition-all duration-300 ease-in-out",
            sidebarCollapsed
              ? "lg:left-20" // Collapsed: left 4rem (96px)
              : "lg:left-64", // Expanded: left 16rem (256px)
            "left-0" // Mobile: full width
          )}
        >
          {/* Header */}
          <Header
            user={user}
            onMobileMenuClick={handleMobileMenuClick}
            onSidebarToggle={handleSidebarToggle}
            isCollapsed={sidebarCollapsed}
          />

          {/* Breadcrumbs */}

          {/* Main Content - Scrollable */}
          <main className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <div className="min-h-screen px-6 bg-gray-100">
                <Breadcrumbs navigationItems={navigationItems} />
                <div className="py-2">{children}</div>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>

      {/* Footer - Fixed at bottom with higher z-index to appear over sidebar */}
      {/* <div className="fixed bottom-0 left-0 right-0 z-50">
        <Footer />
      </div> */}
    </div>
  );
}
