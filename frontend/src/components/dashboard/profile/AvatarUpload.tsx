"use client";

import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Upload } from "lucide-react";
import { apiService } from "../../../lib/profile/api";
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
    } catch (error) {
      setPreview(null);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage
            src={preview || currentAvatar}
            alt={userName || "User"}
          />
          <AvatarFallback className="text-lg">
            {getInitials(userName)}
          </AvatarFallback>
        </Avatar>

        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
          onClick={triggerFileInput}
          disabled={disabled || uploading}
        >
          {uploading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </Button>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={triggerFileInput}
        disabled={disabled || uploading}
        className="w-full max-w-xs"
      >
        <Upload className="mr-2 h-4 w-4" />
        {uploading ? "Uploading..." : "Change Avatar"}
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />
    </div>
  );
};
