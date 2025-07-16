"use client";

import Image from "next/image";
import {
  Monitor,
  DollarSign,
  Users,
  BarChart3,
  Clock,
  MapPin,
} from "lucide-react";

/**
 * About Us section component props
 */
interface AboutUsSectionProps {
  className?: string;
}

/**
 * About Us Section Component
 */
export default function AboutUsSection({
  className = "",
}: AboutUsSectionProps) {
  return (
    <section id="about" className={`bg-white ${className}`}>
      {/* iPMS Introduction Section */}
      <div className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-6 sm:mb-8">
              Integrated Project Monitoring System
            </h2>
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
              <p className="text-base lg:text-lg leading-relaxed text-gray-600">
                The Integrated Project Monitoring System (iPMS) is a
                cutting-edge digital platform designed to revolutionize how
                APTDC Limited manages and monitors development projects. This
                comprehensive system provides real-time tracking, financial
                oversight, and transparent reporting across all our tribal
                development initiatives.
              </p>
              <p className="text-base lg:text-lg leading-relaxed text-gray-600">
                With features like live progress updates, geo-tagged photo
                uploads, milestone tracking, and interactive dashboards, iPMS
                ensures accountability and efficiency at every level. From field
                engineers to executives, everyone stays connected and informed,
                making data-driven decisions that accelerate project success and
                community impact.
              </p>
            </div>
          </div>

          {/* Professional Key Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Monitor className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-base lg:text-lg">
                Real-Time Monitoring
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                Instant project progress tracking
              </p>
            </div>
            <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-base lg:text-lg">
                Financial Oversight
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                Budget tracking and management
              </p>
            </div>
            <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-base lg:text-lg">
                User Activity Logs
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                Comprehensive user engagement tracking
              </p>
            </div>
            <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-base lg:text-lg">
                Data Visualization
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                Interactive charts and reports
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* iPMS Capabilities Section */}
      <div className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              iPMS Standardizes and Streamlines Project Management Needs
            </h2>
            <p className="text-base lg:text-lg text-gray-600 max-w-3xl mx-auto">
              One Platform and one dashboard for tribal development projects in
              real-time
            </p>
          </div>

          {/* Content Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
            {/* Left Content */}
            <div className="space-y-4 sm:space-y-6">
              <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
                {`One dashboard for the project's budget and financial movements.
                One screen displaying the project's progress, milestone
                tracking, and real-time analytics over the project's lifetime.`}
              </p>

              <div className="space-y-6 sm:space-y-8">
                {/* Simple Bullet Points with proper alignment */}
                <ul className="space-y-3 sm:space-y-4 text-base lg:text-lg text-gray-700 leading-relaxed">
                  <li className="flex">
                    <span className="text-gray-600 mr-3 flex-shrink-0 w-4">
                      •
                    </span>
                    <span>
                      Project activities vs Budget allocation and utilization
                      tracking
                    </span>
                  </li>
                  <li className="flex">
                    <span className="text-gray-600 mr-3 flex-shrink-0 w-4">
                      •
                    </span>
                    <span>
                      Real-time field updates with geo-tagged photo and video
                      documentation
                    </span>
                  </li>
                  <li className="flex">
                    <span className="text-gray-600 mr-3 flex-shrink-0 w-4">
                      •
                    </span>
                    <span>
                      Milestone tracking with automated alert system for delayed
                      projects
                    </span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4 sm:space-y-6 mt-8 sm:mt-10">
                <h4 className="font-semibold text-lg lg:text-xl text-gray-900 mb-4 sm:mb-5">
                  Benefits:
                </h4>
                {/* Simple Numbering with proper alignment */}
                <ol className="space-y-4 sm:space-y-5 text-base lg:text-lg text-gray-700 leading-relaxed">
                  <li className="flex">
                    <span className="text-gray-600 mr-3 flex-shrink-0 w-6 font-medium">
                      1.
                    </span>
                    <span>
                      Real-time viewing of any project activity and progress
                      updates.
                    </span>
                  </li>
                  <li className="flex">
                    <span className="text-gray-600 mr-3 flex-shrink-0 w-6 font-medium">
                      2.
                    </span>
                    <span>
                      Immediate budget management against allocated funds and
                      expenditure tracking.
                    </span>
                  </li>
                  <li className="flex">
                    <span className="text-gray-600 mr-3 flex-shrink-0 w-6 font-medium">
                      3.
                    </span>
                    <span>
                      Enhanced transparency and accountability across all
                      project stakeholders.
                    </span>
                  </li>
                </ol>
              </div>
            </div>

            {/* Right Content - Dashboard Images with Workflow Below */}
            <div className="space-y-6 sm:space-y-8">
              <div className="relative h-[200px] sm:h-[250px] md:h-[300px] rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/assets/images/dashboard.jpg"
                  alt="iPMS Dashboard Interface"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Project Workflow Right Below Dashboard */}
              <div className="bg-white p-4 sm:p-6">
                <div className="relative">
                  {/* Connection Line */}
                  <div className="hidden md:block absolute top-6 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 via-blue-500 to-green-500"></div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 relative">
                    {/* Planning */}
                    <div className="text-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 relative z-10">
                        <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1 text-base lg:text-lg">
                        Planning
                      </h4>
                      <p className="text-sm lg:text-base text-gray-600 mb-1 sm:mb-2">
                        Project Initiation
                      </p>
                      <p className="text-xs lg:text-sm text-gray-500">
                        Comprehensive project planning and resource allocation
                      </p>
                    </div>

                    {/* Scheduling */}
                    <div className="text-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 relative z-10">
                        <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1 text-base lg:text-lg">
                        Scheduling
                      </h4>
                      <p className="text-sm lg:text-base text-gray-600 mb-1 sm:mb-2">
                        Timeline Management
                      </p>
                      <p className="text-xs lg:text-sm text-gray-500">
                        Milestone setting and progress tracking implementation
                      </p>
                    </div>

                    {/* Performance */}
                    <div className="text-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 relative z-10">
                        <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1 text-base lg:text-lg">
                        Performance
                      </h4>
                      <p className="text-sm lg:text-base text-gray-600 mb-1 sm:mb-2">
                        Budget & Analytics
                      </p>
                      <p className="text-xs lg:text-sm text-gray-500">
                        Real-time monitoring and performance evaluation
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
