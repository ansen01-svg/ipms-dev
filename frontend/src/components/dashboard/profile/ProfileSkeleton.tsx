import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-gray-300 rounded-t-xl animate-pulse px-6 py-8">
        <div className="">
          <div className="h-8 w-48 bg-gray-400 rounded mb-2"></div>
          <div className="h-4 w-72 bg-gray-400 rounded"></div>
        </div>
      </div>

      <div className="px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Profile Card Skeleton */}
          <div className="lg:col-span-1">
            <Card className="shadow-sm border border-gray-200 bg-white">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  {/* Avatar skeleton */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="h-20 w-20 bg-gray-200 rounded-full animate-pulse border-2 border-gray-200"></div>
                    <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </div>

                  {/* User info skeleton */}
                  <div className="space-y-4">
                    <div>
                      <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mx-auto mb-2"></div>
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mx-auto"></div>
                    </div>

                    <div className="space-y-3">
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mx-auto"></div>
                      <div className="h-4 w-28 bg-gray-200 rounded animate-pulse mx-auto"></div>
                      <div className="h-4 w-36 bg-gray-200 rounded animate-pulse mx-auto"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Form Card Skeleton */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm border border-gray-200 bg-white">
              <CardHeader className="border-b border-gray-100 pb-4">
                <div className="flex items-center">
                  <div className="h-5 w-5 bg-gray-200 rounded animate-pulse mr-2"></div>
                  <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mt-1"></div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-8">
                  {/* Organization Details Section */}
                  <div className="space-y-4">
                    <div className="h-6 w-40 bg-gray-200 rounded animate-pulse border-b border-gray-100 pb-2"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  {/* Editable Information Section */}
                  <div className="space-y-4">
                    <div className="h-6 w-36 bg-gray-200 rounded animate-pulse border-b border-gray-100 pb-2"></div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons skeleton */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                    <div className="h-10 flex-1 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 flex-1 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
