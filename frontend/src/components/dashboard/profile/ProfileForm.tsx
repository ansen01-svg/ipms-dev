"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ProfileUpdateFormData,
  validateForm,
} from "@/schema/profile/validations";
import { UpdateProfileData, User } from "@/types/user.types";
import {
  AlertCircle,
  Building,
  MapPin,
  RotateCcw,
  Save,
  UserCheck,
  User as UserIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AvatarUpload } from "./AvatarUpload";

interface ProfileFormProps {
  user: User;
  onSubmit: (
    data: UpdateProfileData
  ) => Promise<{ success: boolean; error?: string }>;
  loading?: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  user,
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState<ProfileUpdateFormData>({
    username: user.username || "",
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
    avatar: user.avatar || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Check for changes
  useEffect(() => {
    const hasChanges =
      formData.username !== (user.username || "") ||
      formData.email !== (user.email || "") ||
      formData.phoneNumber !== (user.phoneNumber || "") ||
      formData.avatar !== (user.avatar || "");

    setHasChanges(hasChanges);
  }, [formData, user]);

  const handleInputChange =
    (field: keyof ProfileUpdateFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };

  const handleBlur = (field: keyof ProfileUpdateFormData) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Validate single field
    const fieldData = { [field]: formData[field] };
    const validation = validateForm(fieldData as ProfileUpdateFormData);
    if (!validation.isValid && validation.errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validation.errors[field] }));
    }
  };

  const handleAvatarChange = (avatarUrl: string) => {
    setFormData((prev) => ({ ...prev, avatar: avatarUrl }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      username: true,
      email: true,
      phoneNumber: true,
    });

    // Validate form
    const validation = validateForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Prepare data for submission (only changed fields)
    const submitData: UpdateProfileData = {};

    if (formData.username !== (user.username || "")) {
      submitData.username = formData.username;
    }
    if (formData.email !== (user.email || "")) {
      submitData.email = formData.email;
    }
    if (formData.phoneNumber !== (user.phoneNumber || "")) {
      submitData.phoneNumber = formData.phoneNumber;
    }
    if (formData.avatar !== (user.avatar || "")) {
      submitData.avatar = formData.avatar;
    }

    const result = await onSubmit(submitData);
    if (result.success) {
      setTouched({});
      setErrors({});
    }
  };

  const resetForm = () => {
    setFormData({
      username: user.username || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      avatar: user.avatar || "",
    });
    setErrors({});
    setTouched({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-teal-600 rounded-t-xl text-white px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Profile Settings</h1>
          <p className="text-teal-100">
            Manage your personal information and account preferences
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Profile Card */}
          <div className="lg:col-span-1">
            <Card className="shadow-sm border border-gray-200 bg-white">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  {/* Avatar Section */}
                  <div className="space-y-4">
                    <AvatarUpload
                      currentAvatar={formData.avatar}
                      userName={formData.username || user.fullName}
                      onAvatarChange={handleAvatarChange}
                      disabled={loading}
                    />
                  </div>

                  {/* User Info Section */}
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {user.fullName || formData.username || "N/A"}
                    </h2>

                    {/* Role Badge */}
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800 mt-2">
                      <UserCheck className="h-3 w-3 mr-1" />
                      {user.designation || "N/A"}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-gray-200"></div>

                  {/* Details Section */}
                  <div className="space-y-4">
                    {/* Department */}
                    {(user.departmentName || user.officeLocation) && (
                      <div className="space-y-3">
                        {user.departmentName && (
                          <div className="flex items-center text-sm">
                            <Building className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                            <span className="text-gray-700 text-left">
                              {user.departmentName}
                            </span>
                          </div>
                        )}

                        {user.officeLocation && (
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                            <span className="text-gray-700 text-left">
                              {user.officeLocation}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* User ID */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            User ID
                          </span>
                        </div>
                        <span className="font-mono text-sm font-semibold text-gray-900">
                          {user.userId}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm border border-gray-200 bg-white">
              <CardHeader className="border-b border-gray-100 pb-4">
                <div className="flex items-center">
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Personal Information
                  </CardTitle>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Update your profile information below. Fields marked with *
                  are required.
                </p>
              </CardHeader>

              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Organization Details */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Full Name
                        </Label>
                        <Input
                          value={user.fullName || "N/A"}
                          disabled
                          className="bg-gray-50 border-gray-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Designation
                        </Label>
                        <Input
                          value={user.designation || "N/A"}
                          disabled
                          className="bg-gray-50 border-gray-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Department
                        </Label>
                        <Input
                          value={user.departmentName || "N/A"}
                          disabled
                          className="bg-gray-50 border-gray-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          User ID
                        </Label>
                        <Input
                          value={user.userId}
                          disabled
                          className="bg-gray-50 border-gray-200 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Editable Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-2">
                      Editable Information
                    </h3>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="username"
                          className="text-sm font-medium text-gray-700"
                        >
                          Username <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={handleInputChange("username")}
                          onBlur={handleBlur("username")}
                          placeholder="Enter your username"
                          disabled={loading}
                          className={`transition-colors ${
                            errors.username && touched.username
                              ? "border-red-500 focus:border-red-500"
                              : "border-gray-300 focus:border-teal-500"
                          }`}
                        />
                        {errors.username && touched.username && (
                          <div className="flex items-center gap-2 text-sm text-red-600">
                            <AlertCircle className="h-4 w-4" />
                            {errors.username}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-sm font-medium text-gray-700"
                        >
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange("email")}
                          onBlur={handleBlur("email")}
                          placeholder="Enter your email"
                          disabled={loading}
                          className={`transition-colors ${
                            errors.email && touched.email
                              ? "border-red-500 focus:border-red-500"
                              : "border-gray-300 focus:border-teal-500"
                          }`}
                        />
                        {errors.email && touched.email && (
                          <div className="flex items-center gap-2 text-sm text-red-600">
                            <AlertCircle className="h-4 w-4" />
                            {errors.email}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="phoneNumber"
                          className="text-sm font-medium text-gray-700"
                        >
                          Phone Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange("phoneNumber")}
                          onBlur={handleBlur("phoneNumber")}
                          placeholder="Enter your phone number"
                          disabled={loading}
                          className={`transition-colors ${
                            errors.phoneNumber && touched.phoneNumber
                              ? "border-red-500 focus:border-red-500"
                              : "border-gray-300 focus:border-teal-500"
                          }`}
                        />
                        {errors.phoneNumber && touched.phoneNumber && (
                          <div className="flex items-center gap-2 text-sm text-red-600">
                            <AlertCircle className="h-4 w-4" />
                            {errors.phoneNumber}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                    <Button
                      type="submit"
                      disabled={loading || !hasChanges}
                      className="bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      disabled={loading || !hasChanges}
                      className="border-gray-300 hover:border-gray-400 disabled:opacity-50"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                  </div>

                  {!hasChanges && (
                    <Alert className="bg-blue-50 border-blue-200">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        {`Make changes to your profile information and click "Save
                        Changes" to update.`}
                      </AlertDescription>
                    </Alert>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
