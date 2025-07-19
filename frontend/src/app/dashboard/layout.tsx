'use client'

import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { useState, useEffect } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 640)
      if (window.innerWidth >= 640) {
        setMobileOpen(false)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      <Navbar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        isMobile={isMobile}
      />

      <div className="flex flex-1 pt-16 h-full overflow-hidden">
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          isMobile={isMobile}
        />
        <main
          className={`flex-1 p-4 overflow-auto transition-all duration-300 ${
            !isMobile ? (collapsed ? 'ml-20' : 'ml-64') : 'ml-0'
          }`}
          style={{ minWidth: 0 }}
        >
          {children}
        </main>
      </div>
    </>
  )
}
