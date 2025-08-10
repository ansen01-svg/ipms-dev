"use client";

import banner from "@/assets/images/banner2.jpg";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/**
 * Hero section component props
 */
interface HeroSectionProps {
  className?: string;
}

/**
 * Hero Section Component with Enhanced Visual Options
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
          src={banner}
          alt="Project Management and Development"
          fill
          className="object-cover object-center"
          priority
          quality={90}
          sizes="100vw"
        />

        {/* Enhanced Overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/60 to-black/45" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-full">
          {/* Left Content Area */}
          <div className="w-full lg:w-3/5 xl:w-1/2">
            {/* OPTION 1: Warm Golden Gradient (Recommended) */}
            {/* <div className="mb-6 sm:mb-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-6xl font-bold leading-tight bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent drop-shadow-2xl">
                INTEGRATED PROJECT MONITORING SYSTEM
              </h1>
            </div> */}

            {/* OPTION 2: Teal to White Gradient (Alternative) */}

            {/* <div className="mb-6 sm:mb-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-6xl font-bold leading-tight bg-gradient-to-r from-teal-300 via-white to-teal-200 bg-clip-text text-transparent drop-shadow-2xl">
                INTEGRATED PROJECT MONITORING SYSTEM
              </h1>
            </div> */}

            {/* OPTION 3: Vibrant Cultural Colors (Bold Choice) */}

            {/* <div className="mb-6 sm:mb-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-6xl font-bold leading-tight bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-300 bg-clip-text text-transparent drop-shadow-2xl">
                INTEGRATED PROJECT MONITORING SYSTEM
              </h1>
            </div> */}

            {/* OPTION 4: Elegant Single Color with Enhanced Shadow */}

            <div className="mb-6 sm:mb-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-6xl font-bold leading-tight text-amber-300 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_80%)]">
                INTEGRATED PROJECT MONITORING SYSTEM
              </h1>
            </div>

            {/* Description - Enhanced with better contrast */}
            <div className="mb-8 sm:mb-12">
              <p className="text-gray-100 text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-2xl font-light drop-shadow-lg">
                Streamline project management, enhance transparency, and drive
                efficient delivery of development initiatives across Assam
                Plains Tribes Development Corporation.
              </p>
            </div>

            {/* Login Button - Keeping the harmonized teal */}
            <div>
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold tracking-wide transition-all duration-200 hover:scale-105 shadow-xl rounded-full border-2 border-blue-600 hover:border-blue-700"
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
