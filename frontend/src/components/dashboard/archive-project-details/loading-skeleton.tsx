import React from "react";

interface ArchiveProjectDetailsSkeletonProps {
  showHeader?: boolean;
  showStats?: boolean;
  showDetails?: boolean;
  className?: string;
}

export default function ArchiveProjectDetailsSkeleton({
  showHeader,
  showStats,
  showDetails,
  className = "",
}: ArchiveProjectDetailsSkeletonProps) {
  return (
    <div className={`space-y-8 animate-pulse ${className}`}>
      {/* Archive Project Header Skeleton */}
      {showHeader && (
        <div className="bg-teal-500 rounded-lg p-6 relative">
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              {/* Archive Project Title */}
              <div className="h-8 bg-teal-400 rounded w-64"></div>
              {/* AA Number */}
              <div className="h-4 bg-teal-400 rounded w-48"></div>
              {/* Description Text */}
              <div className="h-4 bg-teal-400 rounded w-96"></div>
            </div>
            {/* Status Badge */}
            <div className="h-8 bg-white/20 rounded-full w-32"></div>
          </div>
        </div>
      )}

      {/* Statistics Cards Skeleton */}
      {showStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* AA Amount Card */}
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-red-200 rounded"></div>
              <div className="h-3 bg-red-200 rounded w-16"></div>
            </div>
            <div className="h-8 bg-red-200 rounded w-24"></div>
            <div className="space-y-1">
              <div className="h-3 bg-red-200 rounded w-20"></div>
              <div className="h-3 bg-red-200 rounded w-24"></div>
            </div>
          </div>

          {/* Work Value Card */}
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-orange-200 rounded-full"></div>
              <div className="h-3 bg-orange-200 rounded w-16"></div>
            </div>
            <div className="h-8 bg-orange-200 rounded w-20"></div>
            <div className="space-y-1">
              <div className="h-3 bg-orange-200 rounded w-20"></div>
              <div className="h-3 bg-orange-200 rounded w-28"></div>
            </div>
          </div>

          {/* Progress Card */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-blue-200 rounded"></div>
              <div className="h-3 bg-blue-200 rounded w-16"></div>
            </div>
            <div className="h-8 bg-blue-200 rounded w-12"></div>
            <div className="space-y-1">
              <div className="h-3 bg-blue-200 rounded w-16"></div>
              <div className="h-3 bg-blue-200 rounded w-20"></div>
            </div>
          </div>

          {/* Location Card */}
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-green-200 rounded-full"></div>
              <div className="h-3 bg-green-200 rounded w-16"></div>
            </div>
            <div className="h-8 bg-green-200 rounded w-24"></div>
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
              {/* Concerned Engineer */}
              <div className="flex items-start space-x-3">
                <div className="h-5 w-5 bg-gray-200 rounded-full mt-0.5"></div>
                <div className="space-y-1 flex-1">
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-40"></div>
                </div>
              </div>

              {/* AA Date */}
              <div className="flex items-start space-x-3">
                <div className="h-5 w-5 bg-gray-200 rounded mt-0.5"></div>
                <div className="space-y-1 flex-1">
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>

              {/* FWO Date */}
              <div className="flex items-start space-x-3">
                <div className="h-5 w-5 bg-gray-200 rounded mt-0.5"></div>
                <div className="space-y-1 flex-1">
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Contract Details Section */}
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-32"></div>

            <div className="space-y-4">
              {/* Contractor */}
              <div className="flex items-start space-x-3">
                <div className="h-5 w-5 bg-gray-200 rounded mt-0.5"></div>
                <div className="space-y-1 flex-1">
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
                </div>
              </div>

              {/* FWO Number */}
              <div className="flex items-start space-x-3">
                <div className="h-5 w-5 bg-gray-200 rounded mt-0.5"></div>
                <div className="space-y-1 flex-1">
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-40"></div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start space-x-3">
                <div className="h-5 w-5 bg-gray-200 rounded-full mt-0.5"></div>
                <div className="space-y-1 flex-1">
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Details Section */}
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-32"></div>

            <div className="space-y-4">
              {/* Bill Submitted */}
              <div className="flex items-start space-x-3">
                <div className="h-5 w-5 bg-gray-200 rounded mt-0.5"></div>
                <div className="space-y-1 flex-1">
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>

              {/* Bill Number */}
              <div className="flex items-start space-x-3">
                <div className="h-5 w-5 bg-gray-200 rounded mt-0.5"></div>
                <div className="space-y-1 flex-1">
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>

              {/* Remaining Work Value */}
              <div className="flex items-start space-x-3">
                <div className="h-5 w-5 bg-gray-200 rounded mt-0.5"></div>
                <div className="space-y-1 flex-1">
                  <div className="h-3 bg-gray-200 rounded w-36"></div>
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
export const SimpleArchiveProjectSkeleton: React.FC<{ className?: string }> = ({
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
