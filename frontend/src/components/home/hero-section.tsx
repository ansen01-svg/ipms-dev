"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

/**
 * Hero section component props
 */
interface HeroSectionProps {
  className?: string;
}

/**
 * Hero Section Component
 */
export default function HeroSection({ className = "" }: HeroSectionProps) {
  return (
    <section
      id="top"
      className={`relative w-full h-[50vh] sm:h-[65vh] lg:h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden ${className}`}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/assets/images/pm2.jpg"
          alt="Project Management and Development"
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />

        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-60" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-full">
          {/* Left Content Area */}
          <div className="w-full lg:w-3/5 xl:w-1/2">
            {/* Main Heading */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-6xl font-bold leading-tight text-orange-400">
                INTEGRATED PROJECT MONITORING SYSTEM
              </h1>
            </div>

            {/* Description */}
            <div className="mb-8 sm:mb-12">
              <p className="text-gray-200 text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-2xl font-light">
                Streamline project management, enhance transparency, and drive
                efficient delivery of development initiatives across Assam
                Plains Tribes Development Corporation.
              </p>
            </div>

            {/* Login Button */}
            <div>
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold tracking-wide transition-all duration-200 hover:scale-105 shadow-lg rounded-full"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
