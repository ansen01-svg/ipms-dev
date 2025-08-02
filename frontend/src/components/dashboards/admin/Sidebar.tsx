"use client";

import {
  ArrowLeftCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  Home,
  LogOut,
  Moon,
  PlusCircle,
  Search,
  Settings,
  Sun,
  UserPlus,
  X,
} from "lucide-react";

import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const adminSections = [
  {
    title: "GENERAL",
    items: [{ label: "Dashboard", href: "/admin/dashboard", icon: Home }],
  },
  {
    title: "MANAGEMENT",
    items: [
      { label: "Create Project", href: "/projects/create", icon: PlusCircle },
      { label: "Create User", href: "/admin/user/new", icon: UserPlus },
      { label: "Project Details", href: "/project-details", icon: FileText },
    ],
  },
  {
    title: "SUPPORT",
    items: [{ label: "Settings", href: "/setting", icon: Settings }],
  },
];

const bottomItems = [
  { label: "Back", href: "/back", icon: ArrowLeftCircle },
  { label: "Logout", href: "/logout", icon: LogOut },
];

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  isMobile,
}: {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
}) {
  const pathname = usePathname();
  const { darkMode, setDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");

  const isActiveRoute = (href: string) =>
    pathname === href || pathname.startsWith(href.split("[id]")[0]);

  const filteredSections = adminSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <>
      {isMobile && (
        <div
          className={`fixed top-16 left-0 right-0 bottom-0 z-30 bg-black/50 transition-opacity sm:hidden ${
            mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-16 h-[calc(100vh-4rem)] z-40 bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-900 text-white shadow-xl flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isMobile ? "w-64" : collapsed ? "w-20" : "w-64"
        } ${
          isMobile
            ? mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        }`}
      >
        {/* Top Section */}
        <div className="flex flex-col p-4 gap-5 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-indigo-900">
          {isMobile && (
            <button
              className="self-end mb-1 p-2 hover:bg-indigo-700 rounded-md transition"
              onClick={() => setMobileOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={24} />
            </button>
          )}

          {!isMobile && (
            <button
              className="self-end mb-1 p-2 hover:bg-indigo-700 rounded-md transition"
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </button>
          )}
          {!collapsed && (
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md py-2 pl-10 pr-4 text-indigo-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-600"
                size={20}
              />
            </div>
          )}

          {filteredSections.map(({ title, items }) => (
            <div key={title}>
              {!collapsed && (
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-indigo-300 mb-3 select-none">
                  {title}
                </h3>
              )}
              <nav className="flex flex-col gap-2">
                {items.map(({ label, href, icon: Icon }) => {
                  const isActive = isActiveRoute(href);
                  return (
                    <Link
                      key={label}
                      href={href}
                      onClick={() => isMobile && setMobileOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-lg px-4 py-2 transition shadow-md ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-indigo-700"
                          : "hover:bg-indigo-700 hover:shadow-indigo-600 text-indigo-100"
                      } ${
                        collapsed ? "justify-center" : "justify-start"
                      } focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                    >
                      <Icon className="w-5 h-5" />
                      {!collapsed && (
                        <span
                          className="text-xs font-medium truncate block w-full"
                          title={label}
                        >
                          {label}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col p-4 gap-3 border-t border-indigo-700">
          {/* Dark Mode Toggle */}
          <div
            className={`flex items-center gap-3 rounded-lg px-4 py-2 cursor-pointer select-none transition ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <button
              onClick={() => setDarkMode(false)}
              className={`p-2 rounded-md transition ${
                !darkMode ? "bg-indigo-600 shadow-md" : "hover:bg-indigo-700"
              }`}
              aria-label="Light mode"
              type="button"
            >
              <Sun size={20} />
            </button>
            {!collapsed && (
              <span className="text-indigo-200 text-xs font-medium">Light</span>
            )}
          </div>
          <div
            className={`flex items-center gap-3 rounded-lg px-4 py-2 cursor-pointer select-none transition ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <button
              onClick={() => setDarkMode(true)}
              className={`p-2 rounded-md transition ${
                darkMode ? "bg-indigo-600 shadow-md" : "hover:bg-indigo-700"
              }`}
              aria-label="Dark mode"
              type="button"
            >
              <Moon size={20} />
            </button>
            {!collapsed && (
              <span className="text-indigo-200 text-xs font-medium">Dark</span>
            )}
          </div>

          {/* Bottom Links */}
          {bottomItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              onClick={() => isMobile && setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-4 py-2 transition shadow-md text-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-600 ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <Icon className="w-5 h-5" />
              {!collapsed && (
                <span
                  className="text-xs font-medium truncate block w-full"
                  title={label}
                >
                  {label}
                </span>
              )}
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
}
