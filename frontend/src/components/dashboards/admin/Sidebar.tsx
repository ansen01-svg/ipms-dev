'use client'

import {
  Home,
  PlusCircle,
  UserPlus,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ArrowLeftCircle,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { label: 'Dashboard', href: '/dashboard', icon: Home },
  { label: 'Create Project', href: '/create-project', icon: PlusCircle },
  { label: 'Create User', href: '/create-user', icon: UserPlus },
  { label: 'Project Details', href: '/project-details', icon: FileText },
  { label: 'Setting', href: '/setting', icon: Settings },
]

const bottomItems = [
  { label: 'Back', href: '/back', icon: ArrowLeftCircle },
  { label: 'Logout', href: '/logout', icon: LogOut },
]

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  isMobile,
}: {
  collapsed: boolean
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
  mobileOpen: boolean
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>
  isMobile: boolean
}) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && (
        <div
          tabIndex={-1}
          aria-hidden={!mobileOpen}
          className={`fixed inset-0 z-40 bg-black/40 transition-opacity sm:hidden ${mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`
          fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] bg-white/30 backdrop-blur-md
          border-r border-white/40 shadow-lg flex flex-col justify-between
          transition-transform duration-300 ease-in-out
          ${isMobile ? 'w-56' : collapsed ? 'w-20' : 'w-56'}
          ${isMobile ? (mobileOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
        `}
      >
        {/* Top Section */}
        <div className="flex flex-col gap-2 p-3">
          {/* Close button (mobile) */}
          {isMobile && (
            <button
              className="mb-2 p-1 hover:bg-gray-100 rounded-md self-end"
              onClick={() => setMobileOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={24} />
            </button>
          )}

          {/* Collapse toggle (desktop only) */}
          {!isMobile && (
            <button
              className="self-end mb-2 p-1 hover:bg-gray-100 rounded-md"
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          )}

          {/* Menu Items */}
          {menuItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={label}
                href={href}
                onClick={() => isMobile && setMobileOpen(false)}
                aria-current={isActive ? 'page' : undefined}
                className={`
        flex items-center gap-3 rounded-md px-3 py-2 border transition
        ${isActive ? 'bg-white text-black' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
        ${collapsed ? 'justify-center' : ''}
        focus:outline-none focus:ring-2 focus:ring-indigo-500
      `}
              >
                <Icon className="w-5 h-5" />
                {!collapsed && <span className="text-sm">{label}</span>}
              </Link>
            )
          })}

        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col gap-2 p-3">
          {bottomItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              onClick={() => isMobile && setMobileOpen(false)}
              className={`
      flex items-center gap-3 rounded-md px-3 py-2 border transition
      bg-gray-200 text-gray-700 hover:bg-gray-300
      ${collapsed ? 'justify-center' : ''}
    `}
            >
              <Icon className="w-5 h-5" />
              {!collapsed && <span className="text-sm">{label}</span>}
            </Link>
          ))}

        </div>
      </aside>
    </>
  )
}
