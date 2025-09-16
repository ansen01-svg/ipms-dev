"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import { AlertCircle, RefreshCw } from "lucide-react";
import { ProfileForm } from "../../../components/dashboard/profile/ProfileForm";
import { ProfileSkeleton } from "../../../components/dashboard/profile/ProfileSkeleton";

export default function ProfilePage() {
  const { user, loading, updating, error, fetchProfile, updateProfile } =
    useProfile();

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-6 space-y-4">
            <div className="text-center space-y-4">
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Unable to Load Profile
                </h3>
                <Alert variant="destructive" className="text-left">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
              <Button
                onClick={fetchProfile}
                className="w-full bg-teal-600 hover:bg-teal-700"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Profile Data
                </h3>
                <Alert>
                  <AlertDescription>
                    No user data available. Please try refreshing the page or
                    contact support.
                  </AlertDescription>
                </Alert>
              </div>
              <Button
                onClick={fetchProfile}
                variant="outline"
                className="w-full"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ProfileForm user={user} onSubmit={updateProfile} loading={updating} />
  );
}
