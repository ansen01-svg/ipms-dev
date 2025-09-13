"use client";

import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

interface EditProjectPageHeaderProps {
  projectId: string;
}

export default function EditProjectPageHeader({
  projectId,
}: EditProjectPageHeaderProps) {
  const router = useRouter();

  const handleViewProject = () => {
    router.push(`/dashboard/projects/${projectId}`);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              Edit Project
            </h1>
            <p className="text-sm text-gray-600">
              Make changes to project details and information
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleViewProject}
          className="flex items-center gap-2 border-teal-600 text-teal-600 hover:bg-teal-50"
        >
          <Eye className="w-4 h-4" />
          View Project
        </Button>
      </div>
    </div>
  );
}
