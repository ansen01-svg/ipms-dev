import logo from "@/assets/images/logo4.png";
import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/**
 * Footer component props interface
 */
interface FooterProps {
  className?: string;
}

/**
 * Policy links
 */
const policyLinks = [
  {
    label: "Terms of Use",
    href: "/terms",
  },
  {
    label: "Site Map",
    href: "/sitemap",
  },
  {
    label: "Login",
    href: "/login",
  },
];

/**
 * Quick links
 */
const quickLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Privacy Policy",
    href: "/privacy",
  },
  {
    label: "Help",
    href: "/help",
  },
];

/**
 * Enhanced Footer Component
 */
export default function Footer({ className = "" }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const currentDate = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <footer className={`bg-white ${className}`}>
      {/* Main Footer Section */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Logo and Contact Information */}
            <div className="lg:col-span-2">
              {/* Logo */}
              <div className="flex items-center mb-6">
                <Image
                  src={logo}
                  alt="iPMS logo"
                  width={60}
                  height={60}
                  className="mr-4"
                />
                <span className="text-xl font-bold">iPMS</span>
              </div>

              {/* Contact Information */}
              <div className="space-y-4 text-sm">
                {/* Location */}
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white font-semibold mb-1">Location :</p>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      5Q2M+5W5 Dispur Post Office, GS Rd, Chariali, Ganeshguri,
                      <br />
                      Guwahati, Assam 781005
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="text-white font-semibold">Email :</p>
                    <a
                      href="mailto:info@aptdcl.com"
                      className="text-gray-300 text-sm hover:text-white transition-colors duration-200"
                    >
                      info@aptdcl.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white font-semibold mb-1">Phone :</p>
                    <p className="text-gray-300 text-sm">
                      87610 47635, Mon - Sat (10:00 AM - 05:00 PM)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Policies Column */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Policies
              </h3>
              <ul className="space-y-3">
                {policyLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links Column */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-2 lg:space-y-0">
              {/* Copyright and Credits */}
              <div className="text-center lg:text-left">
                <p className="text-gray-400 text-sm">
                  © {currentYear} All rights reserved
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Design and Developed by{" "}
                  <span className="text-white font-medium">
                    Gratia Technology Pvt. Ltd.
                  </span>
                </p>
              </div>

              {/* Last Updated */}
              <div className="text-center lg:text-right">
                <p className="text-gray-400 text-sm">
                  Last Updated On : {currentDate}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
