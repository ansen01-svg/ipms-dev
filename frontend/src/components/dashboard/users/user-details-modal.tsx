// src/components/dashboard/users/user-detail-modal.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/utils/users/fetch-users";
import {
  Building,
  Calendar,
  CheckCircle2,
  Key,
  Mail,
  MapPin,
  Phone,
  User as UserIcon,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { DesignationBadge } from "./designation-badge";

interface UserDetailModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserDetailModal({
  user,
  isOpen,
  onClose,
}: UserDetailModalProps) {
  const [imageError, setImageError] = useState(false);

  if (!user) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const InfoRow = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: React.ElementType;
    label: string;
    value: string | React.ReactNode;
  }) => (
    <div className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-0">
      <div className="flex-shrink-0">
        <Icon className="w-5 h-5 text-gray-400 mt-0.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-sm text-gray-900 mt-0.5 break-words">{value}</p>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            User Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Avatar and Name Section */}
          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg">
            <div className="flex-shrink-0">
              {user.avatar && !imageError ? (
                <Image
                  src={user.avatar as string}
                  alt={user.fullName}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                  onError={() => setImageError(true)}
                  unoptimized
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-md">
                  {user.fullName?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">
                {user.fullName || "N/A"}
              </h3>
              <p className="text-sm text-gray-600 mt-1">@{user.username}</p>
              <div className="mt-2">
                <DesignationBadge designation={user.designation} />
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Basic Information
            </h4>
            <div className="space-y-1">
              <InfoRow
                icon={UserIcon}
                label="User ID"
                value={user.userId || "N/A"}
              />
              <InfoRow
                icon={Mail}
                label="Email"
                value={
                  <a
                    href={`mailto:${user.email}`}
                    className="text-teal-600 hover:underline"
                  >
                    {user.email}
                  </a>
                }
              />
              <InfoRow
                icon={Phone}
                label="Phone Number"
                value={
                  <a
                    href={`tel:${user.phoneNumber}`}
                    className="text-teal-600 hover:underline"
                  >
                    {user.phoneNumber}
                  </a>
                }
              />
            </div>
          </div>

          {/* Department & Location */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Department & Location
            </h4>
            <div className="space-y-1">
              <InfoRow
                icon={Building}
                label="Department"
                value={user.departmentName || "N/A"}
              />
              <InfoRow
                icon={MapPin}
                label="Office Location"
                value={user.officeLocation || "N/A"}
              />
              <InfoRow
                icon={Building}
                label="Department ID"
                value={user.departmentId || "N/A"}
              />
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Account Status
            </h4>
            <div className="space-y-1">
              <InfoRow
                icon={user.isFirstLogin ? XCircle : CheckCircle2}
                label="Login Status"
                value={
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.isFirstLogin
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.isFirstLogin ? "First Login Pending" : "Active"}
                  </span>
                }
              />
              <InfoRow
                icon={Key}
                label="Last Password Change"
                value={formatDate(user.lastPasswordChange)}
              />
              <InfoRow
                icon={Calendar}
                label="Account Created"
                value={formatDate(user.createdAt)}
              />
              <InfoRow
                icon={Calendar}
                label="Last Updated"
                value={formatDate(user.updatedAt)}
              />
            </div>
          </div>

          {/* Role Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Role Information
            </h4>
            <div className="space-y-1">
              <InfoRow
                icon={UserIcon}
                label="Designation"
                value={<DesignationBadge designation={user.designation} />}
              />
              <InfoRow
                icon={UserIcon}
                label="Role ID"
                value={user.roleId || "N/A"}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
