import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { NavigationItem } from "./layout";

// Types
type DesktopSidebarProps = {
  navigationItems: NavigationItem[];
  onItemClick: (href: string) => void;
  currentPath: string;
  isCollapsed: boolean;
};

type MobileSidebarProps = {
  navigationItems: NavigationItem[];
  onItemClick: (href: string) => void;
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
};

// Desktop Sidebar Component
export function DesktopSidebar({
  navigationItems,
  onItemClick,
  currentPath,
  isCollapsed,
}: DesktopSidebarProps) {
  const isActiveRoute = (href: string) => {
    if (href === "/" && (currentPath === "/" || currentPath === "/dashboard")) {
      return true;
    }
    return currentPath === href;
  };

  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        "fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col z-40",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <SidebarHeader className="mt-2 flex items-center justify-center px-4 relative">
        <div className="w-full flex items-center justify-center gap-2">
          {isCollapsed ? (
            <>
              {/* Collapsed state - Small logo */}
              <div className="relative">
                {/* <Image
                  src="/assets/images/logo4.png"
                  alt="HCMS Logo"
                  width={36}
                  height={36}
                  className="rounded-sm"
                  priority
                /> */}
                <h1 className="font-bold text-xl text-teal-600">iPMS</h1>
              </div>
            </>
          ) : (
            <>
              {/* Expanded state - Full logo */}
              <div className="relative">
                {/* <Image
                  src="/assets/images/logo4.png"
                  alt="HCMS Logo"
                  width={80}
                  height={80}
                  className="rounded-sm"
                  priority
                /> */}
                <h1 className="font-bold text-xl text-teal-600">iPMS</h1>
              </div>
            </>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-10 flex-1 overflow-y-auto">
        <div className="space-y-2">
          <SidebarMenu className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);

              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onItemClick(item.href)}
                    className={cn(
                      "w-full flex items-center transition-all duration-200 group relative h-10 rounded-lg cursor-pointer",
                      isCollapsed
                        ? "justify-center px-5"
                        : "justify-start space-x-3 px-4",
                      isActive
                        ? "bg-gray-200 text-teal-600 hover:bg-gray-300"
                        : "hover:bg-gray-100 hover:text-gray-800"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5 transition-colors duration-200",
                        isActive
                          ? "text-teal-600"
                          : "text-gray-500 group-hover:text-gray-700"
                      )}
                      style={{ width: "20px", height: "20px" }}
                    />
                    {!isCollapsed && (
                      <span
                        className={cn(
                          "font-medium text-sm transition-colors duration-200",
                          isActive
                            ? "text-teal-600"
                            : "text-gray-600 group-hover:text-gray-800"
                        )}
                      >
                        {item.label}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </div>
      </SidebarContent>

      {/* Bottom padding to ensure footer doesn't overlap sidebar content */}
      <div className="h-12 flex-shrink-0" />
    </Sidebar>
  );
}

// Mobile Sidebar Component
export function MobileSidebar({
  navigationItems,
  onItemClick,
  isOpen,
  onClose,
  currentPath,
}: MobileSidebarProps) {
  const isActiveRoute = (href: string) => {
    if (href === "/" && (currentPath === "/" || currentPath === "/dashboard")) {
      return true;
    }
    return currentPath === href;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-64 p-0 z-50">
        <SheetHeader className="border-b border-gray-200 px-6 py-[18px]">
          <SheetTitle className="flex items-center space-x-2">
            <div className="relative">
              {/* <Image
                src="/assets/images/logo4.png"
                alt="HCMS Logo"
                width={70}
                height={70}
                className="rounded-sm"
                priority
              /> */}
              <h1 className="font-bold text-xl text-teal-600">iPMS</h1>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="px-4 py-2 flex-1 overflow-y-auto">
          <div>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.href);

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => {
                        onItemClick(item.href);
                        onClose();
                      }}
                      className={cn(
                        "w-full flex items-center justify-start space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group relative h-auto cursor-pointer",
                        isActive
                          ? "bg-gray-200 text-teal-600 hover:bg-gray-300"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5 transition-colors duration-200",
                          isActive
                            ? "text-teal-600"
                            : "text-gray-500 group-hover:text-gray-700"
                        )}
                        style={{ width: "18px", height: "18px" }}
                      />
                      <span
                        className={cn(
                          "font-medium text-sm transition-colors duration-200",
                          isActive
                            ? "text-teal-600"
                            : "text-gray-600 group-hover:text-gray-800"
                        )}
                      >
                        {item.label}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </div>
        </div>

        {/* Bottom padding to ensure footer doesn't overlap mobile sidebar content */}
        <div className="h-12 flex-shrink-0" />
      </SheetContent>
    </Sheet>
  );
}
