"use client";

import Link from "next/link";

/**
 * Footer component props interface
 */
interface FooterProps {
  className?: string;
}

/**
 * Essential navigation links
 */
const footerLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About Us",
    href: "/about",
  },
];

/**
 * Footer Component
 */
export default function Footer({ className = "" }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-white border-t border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-8 lg:py-12">
          {/* Navigation Links */}
          <div className="flex justify-center gap-8 mb-8">
            {footerLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-gray-700 hover:text-orange-500 transition-colors duration-200 font-medium text-lg"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Company Information */}
          <div className="text-center space-y-4">
            {/* iPMS Information */}
            <div>
              <p className="text-base text-gray-600 font-medium">
                INTEGRATED PROJECT MONITORING SYSTEM (iPMS)
              </p>
            </div>

            {/* Copyright */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                © {currentYear} ASSAM PLAINS TRIBES DEVELOPMENT CORPORATION
                LIMITED. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
