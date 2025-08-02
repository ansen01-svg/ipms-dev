"use client";

import {
  Bell,
  Menu,
  MessageCircleMore,
  Search,
  UserCircle,
} from "lucide-react";
import Image from "next/image";

interface NavbarProps {
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;

  onSearch?: (term: string) => void; // new prop
}

export default function Navbar({
  mobileOpen,
  setMobileOpen,
  isMobile,
}: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg z-50">
      {/* Desktop & Tablet layout */}
      <div className="hidden sm:flex items-center justify-between px-4 py-2 h-16 relative">
        {/* Left: Hamburger & Logo */}
        <div className="flex items-center gap-4 z-10">
          {isMobile && (
            <button
              className="p-2 rounded-md hover:bg-purple-700 transition focus:outline-none focus:ring-2 focus:ring-pink-300"
              aria-label={mobileOpen ? "Close sidebar" : "Open sidebar"}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
          )}
          <Image
            src="/assets/images/logo.png"
            alt="Logo"
            width={90}
            height={90}
            className="object-contain"
            priority
          />
        </div>

        {/* Center: Welcome message */}
        <div className="absolute left-1/2 transform -translate-x-1/2 text-white text-lg font-semibold whitespace-nowrap"></div>

        {/* Right: Search bar & Icons */}
        <div className="flex items-center gap-4 ml-auto max-w-[400px] w-full">
          <div className="relative flex-grow max-w-[280px]">
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-full pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-pink-400 pointer-events-none" />
          </div>

          <button
            aria-label="Notifications"
            className="p-2 rounded-full bg-white/30 hover:bg-white/50 text-white transition hover:scale-110"
            type="button"
          >
            <Bell className="w-5 h-5" />
          </button>
          <button
            aria-label="Messages"
            className="p-2 rounded-full bg-white/30 hover:bg-white/50 text-white transition hover:scale-110"
            type="button"
          >
            <MessageCircleMore className="w-5 h-5" />
          </button>
          <button
            aria-label="User Profile"
            className="p-2 rounded-full bg-white/30 hover:bg-white/50 text-white transition hover:scale-110"
            type="button"
          >
            <UserCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="sm:hidden flex flex-col px-4 py-2 gap-2">
        {/* Top: Hamburger, Logo, Icons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-md hover:bg-purple-700 transition"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
            <Image
              src="/assets/images/logo.png"
              alt="Logo"
              width={70}
              height={70}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full bg-white/30 text-white">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full bg-white/30 text-white">
              <MessageCircleMore className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full bg-white/30 text-white">
              <UserCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bottom: Welcome & Search */}
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-white text-sm font-semibold text-center"></h1>
          <div className="relative w-full max-w-[220px]">
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-full pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <Search className="absolute left-2.5 top-2 w-4 h-4 text-pink-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </header>
  );
}
