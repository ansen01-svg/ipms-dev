"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { User } from "@/types/user.types";
import {
  BookOpen,
  FilePlus,
  FolderOpen,
  LayoutDashboard,
  Package,
  Users,
} from "lucide-react";
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
    {
      id: "projects",
      label: "Projects",
      href: `/dashboard/projects`,
      icon: FolderOpen,
    },
    {
      id: "archived-projects",
      label: "Archived Projects",
      href: `/dashboard/archived-projects`,
      icon: Package,
    },
    {
      id: "mb",
      label: "Measurement Book",
      href: `/dashboard/mb`,
      icon: BookOpen,
    },
  ];

  const operatorNavItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      href: `/dashboard/${baseRole}`,
      icon: LayoutDashboard,
    },
    {
      id: "archived-projects",
      label: "Archived Projects",
      href: `/dashboard/archived-projects`,
      icon: Package,
    },
    {
      id: "create-archived-projects",
      label: "Create Archived Projects",
      href: `/dashboard/archived-projects/create`,
      icon: FilePlus,
    },
  ];

  switch (role) {
    case "JE":
      return [...commonItems];

    case "AEE":
      return [...commonItems];

    case "CE":
      return [...commonItems];

    case "MD":
      return [...commonItems];

    case "OPERATOR":
      return [...operatorNavItems];

    case "VIEWER":
      return [...commonItems];

    case "ADMIN":
      return [
        ...commonItems,
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
    </div>
  );
}
