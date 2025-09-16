"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { apiService } from "@/utils/profile/api";
import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface AvatarUploadProps {
  currentAvatar?: string;
  userName?: string;
  onAvatarChange: (avatarUrl: string) => void;
  disabled?: boolean;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  userName,
  onAvatarChange,
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    uploadAvatar(file);
  };

  const uploadAvatar = async (file: File) => {
    try {
      setUploading(true);
      const response = await apiService.uploadAvatar(file);
      onAvatarChange(response.url);
      setPreview(null);
      toast.success("Avatar updated successfully");
    } catch (error) {
      console.log(error);
      setPreview(null);
      toast.error("Avatar upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";

    // Split the name and get first letter of each word
    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length === 1) {
      // Single name, take first two characters
      return nameParts[0].substring(0, 2).toUpperCase();
    }

    // Multiple names, take first letter of first two words
    return nameParts
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const displayAvatar = preview || currentAvatar;

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Avatar Display */}
      <div className="relative group">
        <Avatar className="h-20 w-20 border-2 border-gray-200">
          <AvatarImage
            src={displayAvatar}
            alt={userName || "User Avatar"}
            className="object-cover"
          />
          <AvatarFallback className="text-xl font-semibold bg-teal-500 text-white">
            {getInitials(userName)}
          </AvatarFallback>
        </Avatar>

        {/* Upload Overlay */}
        {!uploading && (
          <div
            className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={triggerFileInput}
          >
            <Upload className="h-6 w-6 text-white" />
          </div>
        )}

        {/* Loading Overlay */}
        {uploading && (
          <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-white" />
          </div>
        )}
      </div>

      {/* Change Avatar Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={triggerFileInput}
        disabled={disabled || uploading}
        className="text-sm font-medium border-gray-300 hover:border-teal-500 hover:text-teal-600 transition-colors"
      >
        <Upload className="mr-2 h-4 w-4" />
        {uploading ? "Uploading..." : "Change Avatar"}
      </Button>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />

      {/* Upload Info */}
      <p className="text-xs text-gray-500 text-center max-w-xs">
        Click to upload a new avatar. Maximum file size: 5MB
      </p>
    </div>
  );
};
