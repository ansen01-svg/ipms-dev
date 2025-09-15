import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const ProfileSkeleton = () => {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse mx-auto" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar skeleton */}
        <div className="flex justify-center">
          <div className="h-24 w-24 bg-gray-200 rounded-full animate-pulse" />
        </div>

        {/* Form fields skeleton */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
          </div>
        </div>

        {/* Button skeleton */}
        <div className="flex gap-4 pt-4">
          <div className="h-10 flex-1 bg-gray-200 rounded-md animate-pulse" />
          <div className="h-10 flex-1 bg-gray-200 rounded-md animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
};
