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
  {
    label: "TINDER CLONE",
    href: "/tinder",
    type: "link" as const,
  },
];

/**
 * Font size options
 */
const fontSizes = {
  small: 0.875, // 14px equivalent
  normal: 1, // 16px equivalent (base)
  large: 1.125, // 18px equivalent
};

/**
 * Format date to full format
 */
const formatDate = (date: Date): string => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const day = date.getDate().toString();
  const year = date.getFullYear().toString();

  const hours24 = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours24 >= 12 ? "PM" : "AM";

  const hours12 = (hours24 % 12).toString();
  const displayHours = hours12 === "0" ? "12" : hours12;

  return `${dayName}, ${monthName} ${day}, ${year} ${displayHours}:${minutes} ${ampm}`;
};

/**
 * Smooth scroll to element function
 */
const smoothScrollToElement = (elementId: string): void => {
  const element = document.getElementById(elementId);
  if (element) {
    const headerOffset = 100;
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
 * Enhanced Header Component with Font Size Controls
 */
export default function Header({ className = "" }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState<string>("");
  const [fontSize, setFontSize] = useState<keyof typeof fontSizes>("normal");

  /**
   * Load saved font size from localStorage and apply it
   */
  useEffect(() => {
    const savedFontSize = localStorage.getItem(
      "fontSize"
    ) as keyof typeof fontSizes;
    if (savedFontSize && fontSizes[savedFontSize]) {
      setFontSize(savedFontSize);
      applyFontSize(savedFontSize);
    }
  }, []);

  /**
   * Apply font size to document root
   */
  const applyFontSize = (size: keyof typeof fontSizes): void => {
    document.documentElement.style.fontSize = `${fontSizes[size]}rem`;
  };

  /**
   * Handle font size decrease
   */
  const decreaseFontSize = (): void => {
    const newSize =
      fontSize === "normal"
        ? "small"
        : fontSize === "large"
        ? "normal"
        : "small";
    setFontSize(newSize);
    applyFontSize(newSize);
    localStorage.setItem("fontSize", newSize);
  };

  /**
   * Handle font size reset to normal
   */
  const resetFontSize = (): void => {
    setFontSize("normal");
    applyFontSize("normal");
    localStorage.setItem("fontSize", "normal");
  };

  /**
   * Handle font size increase
   */
  const increaseFontSize = (): void => {
    const newSize =
      fontSize === "small"
        ? "normal"
        : fontSize === "normal"
        ? "large"
        : "large";
    setFontSize(newSize);
    applyFontSize(newSize);
    localStorage.setItem("fontSize", newSize);
  };

  /**
   * Update current date on component mount and daily
   */
  useEffect(() => {
    const updateDate = () => {
      setCurrentDate(formatDate(new Date()));
    };

    updateDate();

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
      handleNavigationClick();
    } else if (item.type === "scroll-top") {
      e.preventDefault();
      smoothScrollToTop();
      handleNavigationClick();
    } else if (item.type === "link") {
      // Let Next.js handle the navigation
      handleNavigationClick();
    }
  };

  return (
    <header className={`w-full bg-white border-b border-gray-100 ${className}`}>
      {/* Date Display Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="w-4 h-4" />
              <span className="tracking-wide">
                {currentDate || formatDate(new Date())}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={decreaseFontSize}
                className={`px-2 py-1 text-sm font-medium hover:bg-gray-200 rounded-full transition-colors duration-200 ${
                  fontSize === "small" ? "bg-blue-100 text-blue-700" : ""
                }`}
                title="Decrease font size"
              >
                A-
              </button>
              <button
                onClick={resetFontSize}
                className={`px-2 py-1 text-sm font-medium hover:bg-gray-200 rounded-full transition-colors duration-200 ${
                  fontSize === "normal" ? "bg-blue-100 text-blue-700" : ""
                }`}
                title="Normal font size"
              >
                A
              </button>
              <button
                onClick={increaseFontSize}
                className={`px-2 py-1 text-sm font-medium hover:bg-gray-200 rounded-full transition-colors duration-200 ${
                  fontSize === "large" ? "bg-blue-100 text-blue-700" : ""
                }`}
                title="Increase font size"
              >
                A+
              </button>
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

              {/* Log In Button */}
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

        {/* Mobile Navigation Menu */}
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

            {/* Mobile Log In Button */}
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
