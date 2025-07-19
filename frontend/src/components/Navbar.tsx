'use client'

import { Bell, MessageCircleMore, UserCircle, Menu } from 'lucide-react'
import Image from 'next/image'

interface NavbarProps {
  mobileOpen: boolean
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>
  isMobile: boolean
}

export default function Navbar({
  mobileOpen,
  setMobileOpen,
  isMobile,
}: NavbarProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 h-16 bg-white/20 backdrop-blur-md border-b border-white/30
                 flex items-center justify-between px-4 z-50"
    >
      {/* Mobile hamburger */}
      {isMobile && (
        <button
          className="p-2 rounded hover:bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label={mobileOpen ? 'Close sidebar' : 'Open sidebar'}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Image src="/assets/images/logo.png" alt="Logo" width={100} height={100} />
      </div>

      {/* Welcome text */}
      <h1 className="text-xl font-bold text-white flex-1 text-center">
        Welcome, Admin
      </h1>

      {/* Icons */}
      <div className="flex items-center space-x-4">
        <button
          aria-label="Notifications"
          className="p-2 bg-yellow-400 rounded-full hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          <Bell className="w-6 h-6 text-white" />
        </button>
        <button
          aria-label="Messages"
          className="p-2 bg-yellow-400 rounded-full hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          <MessageCircleMore className="w-6 h-6 text-white" />
        </button>
        <button
          aria-label="User Profile"
          className="p-2 bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <UserCircle className="w-6 h-6 text-white" />
        </button>
      </div>
    </header>
  )
}
