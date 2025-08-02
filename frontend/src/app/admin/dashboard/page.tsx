// app/dashboard/page.tsx
"use client";

import Dashboard from "@/app/admin/dashboard/Dashboard"; // or wherever it is
import Navbar from "@/components/dashboards/admin/Navbar";
import Sidebar from "@/components/dashboards/admin/Sidebar";
import { ThemeProvider } from "@/context/ThemeContext";
import { useEffect, useRef, useState } from "react";

export default function DashboardPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use ResizeObserver instead of window resize
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        const newIsMobile = width < 640;
        setIsMobile(newIsMobile);
        if (!newIsMobile) setMobileOpen(false);
      }
    });

    resizeObserver.observe(container);

    // Initial check using container's current width
    const initialWidth = container.getBoundingClientRect().width;
    const initialIsMobile = initialWidth < 640;
    setIsMobile(initialIsMobile);
    if (!initialIsMobile) setMobileOpen(false);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <ThemeProvider>
      <div
        ref={containerRef}
        className="min-h-screen flex flex-col bg-gray-100 w-full"
      >
        <Navbar
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          isMobile={isMobile}
        />

        <div className="flex flex-1 overflow-hidden pt-16">
          <Sidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
            isMobile={isMobile}
          />
          <main
            className={`flex-1 p-4 overflow-auto bg-gray-100 transition-all duration-300 ${
              !isMobile ? (collapsed ? "ml-20" : "ml-64") : "ml-0"
            }`}
          >
            <Dashboard />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
