"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AvatarUpload } from "./AvatarUpload";
import { User, UpdateProfileData } from "@/types/user.types";
import {
  validateForm,
  ProfileUpdateFormData,
} from "@/schema/profile/validations";
import {
  Save,
  AlertCircle,
  User as UserIcon,
  Mail,
  Phone,
  Building,
  Badge,
  MapPin,
  RotateCcw,
} from "lucide-react";

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
    <div className="mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 text-white shadow-xl">
          <h1 className="text-2xl font-bold mb-2">Profile Settings</h1>
          <p className="text-teal-100 text-md">
            Manage your personal information and account preferences
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Avatar and Quick Info */}
        <div className="lg:col-span-1">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <AvatarUpload
                  currentAvatar={formData.avatar}
                  userName={formData.username || user.fullName}
                  onAvatarChange={handleAvatarChange}
                  disabled={loading}
                />

                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {user.fullName || "N/A"}
                  </h3>
                  <div className="flex items-center justify-center text-gray-600">
                    <Badge className="h-4 w-4 mr-2 text-teal-600" />
                    <span className="text-sm">{user.designation || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-center text-gray-600">
                    <Building className="h-4 w-4 mr-2 text-teal-600" />
                    <span className="text-sm">
                      {user.departmentName || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-center text-gray-600">
                    <UserIcon className="h-4 w-4 mr-2 text-teal-600" />
                    <span className="text-sm font-mono">{user.userId}</span>
                  </div>
                  {user.officeLocation && (
                    <div className="flex items-center justify-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-teal-600" />
                      <span className="text-sm">{user.officeLocation}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                <UserIcon className="h-6 w-6 mr-3 text-teal-500" />
                Personal Information
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Update your profile information below. Fields marked with * are
                required.
              </p>
            </CardHeader>

            <CardContent className="space-y-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Read-only Information */}
                <div className="space-y-6">
                  <div className="border-l-4 border-teal-500 pl-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Organization Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="fullName"
                          className="text-sm font-medium text-gray-700"
                        >
                          Full Name
                        </Label>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="fullName"
                            value={user.fullName || "N/A"}
                            disabled
                            className="pl-10 bg-gray-50/80 border-gray-200 focus:border-teal-500 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="designation"
                          className="text-sm font-medium text-gray-700"
                        >
                          Designation
                        </Label>
                        <div className="relative">
                          <Badge className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="designation"
                            value={user.designation || "N/A"}
                            disabled
                            className="pl-10 bg-gray-50/80 border-gray-200 focus:border-teal-500 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="department"
                          className="text-sm font-medium text-gray-700"
                        >
                          Department
                        </Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="department"
                            value={user.departmentName || "N/A"}
                            disabled
                            className="pl-10 bg-gray-50/80 border-gray-200 focus:border-teal-500 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="userId"
                          className="text-sm font-medium text-gray-700"
                        >
                          User ID
                        </Label>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="userId"
                            value={user.userId}
                            disabled
                            className="pl-10 bg-gray-50/80 border-gray-200 focus:border-teal-500 transition-colors font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Editable Fields */}
                <div className="space-y-6">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Editable Information
                    </h4>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="username"
                          className="text-sm font-medium text-gray-700"
                        >
                          Username <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="username"
                            value={formData.username}
                            onChange={handleInputChange("username")}
                            onBlur={handleBlur("username")}
                            placeholder="Enter your username"
                            disabled={loading}
                            className={`pl-10 border-2 transition-all duration-200 focus:ring-2 focus:ring-teal-500/20 ${
                              errors.username && touched.username
                                ? "border-red-500 focus:border-red-500"
                                : "border-gray-200 focus:border-teal-500"
                            }`}
                          />
                        </div>
                        {errors.username && touched.username && (
                          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-md">
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
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange("email")}
                            onBlur={handleBlur("email")}
                            placeholder="Enter your email"
                            disabled={loading}
                            className={`pl-10 border-2 transition-all duration-200 focus:ring-2 focus:ring-teal-500/20 ${
                              errors.email && touched.email
                                ? "border-red-500 focus:border-red-500"
                                : "border-gray-200 focus:border-teal-500"
                            }`}
                          />
                        </div>
                        {errors.email && touched.email && (
                          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-md">
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
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange("phoneNumber")}
                            onBlur={handleBlur("phoneNumber")}
                            placeholder="Enter your phone number"
                            disabled={loading}
                            className={`pl-10 border-2 transition-all duration-200 focus:ring-2 focus:ring-teal-500/20 ${
                              errors.phoneNumber && touched.phoneNumber
                                ? "border-red-500 focus:border-red-500"
                                : "border-gray-200 focus:border-teal-500"
                            }`}
                          />
                        </div>
                        {errors.phoneNumber && touched.phoneNumber && (
                          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-md">
                            <AlertCircle className="h-4 w-4" />
                            {errors.phoneNumber}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                  <Button
                    type="submit"
                    disabled={loading || !hasChanges}
                    className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>

                {!hasChanges && (
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      Make changes to your profile information and click "Save
                      Changes" to update.
                    </AlertDescription>
                  </Alert>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
