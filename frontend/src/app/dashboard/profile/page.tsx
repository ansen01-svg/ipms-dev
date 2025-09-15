"use client";

import { ProfileForm } from "../../../components/dashboard/profile/ProfileForm";
import { ProfileSkeleton } from "../../../components/dashboard/profile/ProfileSkeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function ProfilePage() {
  const { user, loading, updating, error, fetchProfile, updateProfile } =
    useProfile();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <ProfileSkeleton />
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="w-full max-w-md space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={fetchProfile} className="w-full" variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No user data available. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProfileForm user={user} onSubmit={updateProfile} loading={updating} />
    </div>
  );
}
