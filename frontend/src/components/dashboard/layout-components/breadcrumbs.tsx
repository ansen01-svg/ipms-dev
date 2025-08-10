import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationItem } from "./layout";

// Types
interface BreadcrumbsProps {
  navigationItems: NavigationItem[];
}

interface BreadcrumbItem {
  label: string;
  href: string;
  isLast: boolean;
}

// Breadcrumbs Component
export default function Breadcrumbs({ navigationItems }: BreadcrumbsProps) {
  const pathname = usePathname();

  // Function to get label from navigation items or format path segment
  const getLabelFromPath = (path: string): string => {
    // Handle root/dashboard case
    if (path === "/dashboard") {
      return "Dashboard";
    }

    // Find matching navigation item first
    const navItem = navigationItems.find((item) => item.href === path);
    if (navItem) {
      return navItem.label;
    }

    // For sub-paths, get the last segment and format it
    const segments = path.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    // Handle common sub-pages
    const commonPages: Record<string, string> = {
      new: "New",
      create: "Create",
      edit: "Edit",
      view: "View",
      details: "Details",
      settings: "Settings",
      profile: "Profile",
    };

    if (commonPages[lastSegment]) {
      return commonPages[lastSegment];
    }

    // Convert kebab-case or snake_case to Title Case
    return lastSegment
      .replace(/[-_]/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Generate breadcrumb items from current path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split("/").filter((segment) => segment);

    // Always start with Dashboard/Home
    const breadcrumbs: BreadcrumbItem[] = [];

    // If we're on the root path, return just Dashboard
    if (pathname === "/" || pathname === "/dashboard") {
      breadcrumbs[0].isLast = true;
      return breadcrumbs;
    }

    // Build breadcrumbs from path segments
    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;

      breadcrumbs.push({
        label: getLabelFromPath(currentPath),
        href: currentPath,
        isLast,
      });
    });

    // Mark the last item as last and previous items as not last
    breadcrumbs.forEach((item, index) => {
      item.isLast = index === breadcrumbs.length - 1;
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-600 px-0 py-6">
      <div className="flex items-center space-x-2">
        {breadcrumbs.map((breadcrumb) => {
          return (
            <div key={breadcrumb.href} className="flex items-center space-x-2">
              {/* {index === 0 && <Home className="h-4 w-4 text-gray-500 mr-1" />} */}

              {breadcrumb.isLast ? (
                <span className="font-semibold text-gray-900 text-sm">
                  {breadcrumb.label}
                </span>
              ) : (
                <Link
                  href={breadcrumb.href}
                  className="hover:text-gray-900 transition-colors duration-200 font-medium text-gray-600 text-sm"
                >
                  {breadcrumb.label}
                </Link>
              )}

              {!breadcrumb.isLast && (
                <ChevronRight className="h-4 w-4 text-gray-400" />
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
