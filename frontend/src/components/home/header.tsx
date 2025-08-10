"use client";

import logo from "@/assets/images/logo4.png";
import { Button } from "@/components/ui/button";
import { Calendar, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Header component props interface
 */
interface HeaderProps {
  className?: string;
}

/**
 * Navigation items configuration
 */
const navigationItems = [
  {
    label: "HOME",
    href: "#top",
    type: "scroll-top" as const,
  },
  {
    label: "ABOUT",
    href: "#about",
    type: "scroll" as const,
  },
];

/**
 * Format date to dd-mm-yy format
 */
const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  return `${day}-${month}-${year}`;
};

/**
 * Smooth scroll to element function
 */
const smoothScrollToElement = (elementId: string): void => {
  const element = document.getElementById(elementId);
  if (element) {
    const headerOffset = 100; // Adjust based on your header height
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
};

/**
 * Smooth scroll to top function
 */
const smoothScrollToTop = (): void => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

/**
 * Enhanced Header Component with Harmonized Color Scheme
 */
export default function Header({ className = "" }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState<string>("");

  /**
   * Update current date on component mount and daily
   */
  useEffect(() => {
    const updateDate = () => {
      setCurrentDate(formatDate(new Date()));
    };

    // Set initial date
    updateDate();

    // Update date at midnight every day
    const now = new Date();
    const msUntilMidnight =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        0,
        0
      ).getTime() - now.getTime();

    const midnightTimeout = setTimeout(() => {
      updateDate();
      // Set interval for every 24 hours after first midnight
      const dailyInterval = setInterval(updateDate, 24 * 60 * 60 * 1000);

      return () => clearInterval(dailyInterval);
    }, msUntilMidnight);

    return () => clearTimeout(midnightTimeout);
  }, []);

  /**
   * Toggle mobile menu visibility
   */
  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  /**
   * Close mobile menu when navigation item is clicked
   */
  const handleNavigationClick = (): void => {
    setIsMobileMenuOpen(false);
  };

  /**
   * Handle navigation item click with smooth scroll support
   */
  const handleNavItemClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: (typeof navigationItems)[0]
  ): void => {
    if (item.type === "scroll") {
      e.preventDefault();
      const elementId = item.href.replace("#", "");
      smoothScrollToElement(elementId);
      handleNavigationClick(); // Close mobile menu if open
    } else if (item.type === "scroll-top") {
      e.preventDefault();
      smoothScrollToTop();
      handleNavigationClick(); // Close mobile menu if open
    }
  };

  return (
    <header className={`w-full bg-white border-b border-gray-100 ${className}`}>
      {/* Date Display Section */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-end items-center py-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="w-4 h-4" />
              <span className="tracking-wide">
                {currentDate || formatDate(new Date())}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Main Header Content */}
        <div className="flex items-center justify-between py-4 md:py-4">
          {/* Left Side - Company Branding */}
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Image
                src={logo}
                alt="Government of Assam Logo"
                width={60}
                height={60}
                className="object-cover"
                priority
              />
            </div>

            {/* Company Name */}
            <div className="flex flex-col gap-2">
              {/* Desktop Version (Extra Large screens) - Hierarchical approach */}
              <div className="hidden xl:block">
                <h1 className="text-xl font-bold text-gray-900 tracking-wide leading-tight">
                  INTEGRATED PROJECT MONITORING SYSTEM
                </h1>
              </div>

              {/* Tablet Version (Medium to Large screens) */}
              <h1 className="hidden sm:block xl:hidden text-lg font-bold text-gray-900 tracking-wide leading-tight">
                INTEGRATED PROJECT MONITORING SYSTEM
              </h1>

              {/* Mobile Version (Small screens) */}
              <h1 className="sm:hidden text-sm font-bold text-gray-900 tracking-wide leading-tight">
                INTEGRATED PROJECT
              </h1>
              <h2 className="sm:hidden text-sm font-bold text-gray-900 tracking-wide leading-tight">
                MONITORING SYSTEM
              </h2>

              {/* Subtitle */}
              <p className="text-xs md:text-[16px] text-gray-600 font-medium tracking-wide">
                A GOVERNMENT OF ASSAM UNDERTAKING
              </p>
            </div>
          </div>

          {/* Right Side - Navigation */}
          <div className="flex items-center space-x-6 md:space-x-8">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-10">
              {navigationItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavItemClick(e, item)}
                  className="text-sm font-semibold text-gray-700 hover:text-blue-600 tracking-wider transition-colors duration-200 cursor-pointer"
                >
                  {item.label}
                </Link>
              ))}

              {/* Log In Button - Updated to teal theme */}
              <Link href="/login">
                <Button
                  variant="outline"
                  className="text-sm font-semibold tracking-wider border-blue-300 text-blue-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-800"
                >
                  LOG IN
                </Button>
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                aria-label="Toggle navigation menu"
              >
                <div className="relative w-5 h-5">
                  <Menu
                    className={`absolute w-5 h-5 transition-all duration-300 ease-in-out ${
                      isMobileMenuOpen
                        ? "opacity-0 rotate-45 scale-50"
                        : "opacity-100 rotate-0 scale-100"
                    }`}
                  />
                  <X
                    className={`absolute w-5 h-5 transition-all duration-300 ease-in-out ${
                      isMobileMenuOpen
                        ? "opacity-100 rotate-0 scale-100"
                        : "opacity-0 -rotate-45 scale-50"
                    }`}
                  />
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu with Enhanced Transitions */}
        <div
          className={`md:hidden border-t border-gray-100 bg-teal-50/40 backdrop-blur-sm overflow-hidden transition-all duration-300 ease-out ${
            isMobileMenuOpen
              ? "max-h-80 opacity-100 py-4"
              : "max-h-0 opacity-0 py-0"
          }`}
        >
          <nav className="flex flex-col space-y-4">
            {navigationItems.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  handleNavItemClick(e, item);
                  handleNavigationClick();
                }}
                className={`text-sm font-semibold text-gray-700 hover:text-blue-600 tracking-wider transition-all duration-300 ease-out py-2 cursor-pointer transform hover:translate-x-1 ${
                  isMobileMenuOpen
                    ? "translate-x-0 opacity-100"
                    : "translate-x-4 opacity-0"
                }`}
                style={{
                  transitionDelay: isMobileMenuOpen ? `${index * 75}ms` : "0ms",
                }}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Log In Button with Enhanced Animation */}
            <Link href="/login" onClick={handleNavigationClick}>
              <Button
                variant="outline"
                className={`w-full text-sm font-semibold tracking-wider border-blue-300 text-blue-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-800 mt-2 transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 ${
                  isMobileMenuOpen
                    ? "translate-x-0 opacity-100"
                    : "translate-x-4 opacity-0"
                }`}
                style={{
                  transitionDelay: isMobileMenuOpen ? "200ms" : "0ms",
                }}
              >
                LOG IN
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
