import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/rbac-config/logout";
import { User } from "@/types/user.types";
import {
  LogOut,
  Menu,
  PanelLeft,
  PanelLeftClose,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";

// Types
type HeaderProps = {
  user: User;
  onMobileMenuClick: () => void;
  onSidebarToggle: () => void;
  isCollapsed: boolean;
};

// Header Component
export default function Header({
  user,
  onMobileMenuClick,
  onSidebarToggle,
  isCollapsed,
}: HeaderProps) {
  const handleLogout = () => {
    logout();
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 px-4 lg:px-6 py-4 relative z-30 flex-shrink-0">
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMobileMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100"
          >
            <Menu
              className="text-gray-600"
              style={{ width: "18px", height: "18px" }}
            />
          </Button>

          {/* Toggle button for expanded state */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onSidebarToggle}
            className="hidden lg:flex p-2 hover:bg-gray-100"
          >
            {isCollapsed ? (
              <PanelLeft
                className="text-gray-600"
                style={{ width: "20px", height: "20px" }}
              />
            ) : (
              <PanelLeftClose
                className="text-gray-600"
                style={{ width: "20px", height: "20px" }}
              />
            )}
          </Button>
        </div>

        {/* Center - Search (hidden on mobile) */}
        {/* <div className="hidden md:flex flex-1 max-w-lg mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search"
              className="pl-10 pr-16 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1 text-xs text-gray-400">
              <Command className="h-3 w-3" />
              <span>F</span>
            </div>
          </div>
        </div> */}

        {/* Right section */}
        <div className="flex items-center space-x-4 mr-4">
          {/* User profile with dropdown */}
          <div className="flex items-center justify-center space-x-5 pl-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium leading-none text-gray-900">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>

            {/* Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full p-0 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {(user?.name || "User")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-56 mt-2 bg-white border border-gray-200 shadow-xl rounded-lg"
                align="end"
                forceMount
              >
                {/* User info header */}
                <DropdownMenuLabel className="font-normal py-[10px]">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs leading-none text-gray-500">
                      {user.role}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-gray-200" />

                {/* Profile option */}
                <DropdownMenuItem className="p-0">
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 cursor-pointer w-full"
                  >
                    <UserIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Profile</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-gray-200" />

                {/* Logout option */}
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 hover:bg-red-50 cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile search button */}
          {/* <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2 hover:bg-gray-100"
          >
            <Search
              className="text-gray-600"
              style={{ width: "18px", height: "18px" }}
            />
          </Button> */}
        </div>
      </div>
    </header>
  );
}
