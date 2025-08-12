import React from "react";

interface ProjectDetailsSkeletonProps {
  showHeader?: boolean;
  showStats?: boolean;
  showDetails?: boolean;
  className?: string;
}

export default function ProjectDetailsSkeleton({
  showHeader,
  showStats,
  showDetails,
  className = "",
}: ProjectDetailsSkeletonProps) {
  return (
    <div className={`space-y-8 animate-pulse ${className}`}>
      {/* Project Header Skeleton */}
      {showHeader && (
        <div className="bg-teal-500 rounded-lg p-6 relative">
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              {/* Project Title */}
              <div className="h-8 bg-teal-400 rounded w-48"></div>
              {/* Project ID */}
              <div className="h-4 bg-teal-400 rounded w-64"></div>
              {/* Description Text */}
              <div className="h-4 bg-teal-400 rounded w-80"></div>
            </div>
            {/* Status Badge */}
            <div className="h-8 bg-white/20 rounded-full w-32"></div>
          </div>
        </div>
      )}

      {/* Statistics Cards Skeleton */}
      {showStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Estimated Cost Card */}
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-red-200 rounded"></div>
              <div className="h-3 bg-red-200 rounded w-16"></div>
            </div>
            <div className="h-8 bg-red-200 rounded w-20"></div>
            <div className="space-y-1">
              <div className="h-3 bg-red-200 rounded w-24"></div>
              <div className="h-3 bg-red-200 rounded w-16"></div>
            </div>
          </div>

          {/* Project Duration Card */}
          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-yellow-200 rounded-full"></div>
              <div className="h-3 bg-yellow-200 rounded w-16"></div>
            </div>
            <div className="h-8 bg-yellow-200 rounded w-12"></div>
            <div className="space-y-1">
              <div className="h-3 bg-yellow-200 rounded w-28"></div>
              <div className="h-3 bg-yellow-200 rounded w-16"></div>
            </div>
          </div>

          {/* Sub-Projects Card */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-blue-200 rounded"></div>
              <div className="h-3 bg-blue-200 rounded w-16"></div>
            </div>
            <div className="h-8 bg-blue-200 rounded w-8"></div>
            <div className="space-y-1">
              <div className="h-3 bg-blue-200 rounded w-24"></div>
              <div className="h-3 bg-blue-200 rounded w-20"></div>
            </div>
          </div>

          {/* Primary Beneficiary Card */}
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-green-200 rounded-full"></div>
              <div className="h-3 bg-green-200 rounded w-16"></div>
            </div>
            <div className="h-8 bg-green-200 rounded w-20"></div>
            <div className="space-y-1">
              <div className="h-3 bg-green-200 rounded w-16"></div>
              <div className="h-3 bg-green-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      )}

      {/* Details Sections Skeleton */}
      {showDetails && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Project Details Section */}
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-32"></div>

            <div className="space-y-4">
              {/* Created by */}
              <div className="flex items-start space-x-3">
                <div className="h-5 w-5 bg-gray-200 rounded-full mt-0.5"></div>
                <div className="space-y-1 flex-1">
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>

              {/* Start Date */}
              <div className="flex items-start space-x-3">
                <div className="h-5 w-5 bg-gray-200 rounded mt-0.5"></div>
                <div className="space-y-1 flex-1">
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>

              {/* Expected Completion */}
              <div className="flex items-start space-x-3">
                <div className="h-5 w-5 bg-gray-200 rounded mt-0.5"></div>
                <div className="space-y-1 flex-1">
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Location Details Section */}
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-32"></div>

            <div className="space-y-4">
              {/* District */}
              <div className="flex items-start space-x-3">
                <div className="h-5 w-5 bg-gray-200 rounded mt-0.5"></div>
                <div className="space-y-1 flex-1">
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>

              {/* Locality */}
              <div className="flex items-start space-x-3">
                <div className="h-5 w-5 bg-gray-200 rounded-full mt-0.5"></div>
                <div className="space-y-1 flex-1">
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>

              {/* Ward/ULB */}
              <div className="flex items-start space-x-3">
                <div className="h-5 w-5 bg-gray-200 rounded-full mt-0.5"></div>
                <div className="space-y-1 flex-1">
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-28"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Administration Section */}
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-28"></div>

            <div className="space-y-4">
              {/* Owning Department */}
              <div className="flex items-start space-x-3">
                <div className="h-5 w-5 bg-gray-200 rounded mt-0.5"></div>
                <div className="space-y-1 flex-1">
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>

              {/* Executing Department */}
              <div className="flex items-start space-x-3">
                <div className="h-5 w-5 bg-gray-200 rounded mt-0.5"></div>
                <div className="space-y-1 flex-1">
                  <div className="h-3 bg-gray-200 rounded w-36"></div>
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
                </div>
              </div>

              {/* Letter Reference */}
              <div className="flex items-start space-x-3">
                <div className="h-5 w-5 bg-gray-200 rounded mt-0.5"></div>
                <div className="space-y-1 flex-1">
                  <div className="h-3 bg-gray-200 rounded w-28"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simplified skeleton for basic loading states
export const SimpleProjectSkeleton: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div className={`space-y-6 animate-pulse ${className}`}>
      {/* Header skeleton */}
      <div className="bg-gray-200 rounded-lg h-32"></div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-gray-100 rounded-lg h-24"></div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-100 rounded"></div>
              <div className="h-4 bg-gray-100 rounded w-3/4"></div>
              <div className="h-4 bg-gray-100 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Example usage:
// Default - shows all sections
// <ProjectDetailsSkeleton />

// Only header and stats
// <ProjectDetailsSkeleton showDetails={false} />

// Only details section
// <ProjectDetailsSkeleton showHeader={false} showStats={false} />

// Custom styling
// <ProjectDetailsSkeleton className="bg-white p-6 rounded-lg shadow-sm" />

// Simple version
// <SimpleProjectSkeleton />
