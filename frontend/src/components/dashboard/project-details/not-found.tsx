"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Home, Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProjectNotFoundProps {
  projectId?: string;
}

export function ProjectNotFound({ projectId }: ProjectNotFoundProps) {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoToProjects = () => {
    router.push("/dashboard/projects");
  };

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen space-y-6">
      {/* Main Content */}
      <Card className="bg-white border border-gray-100 shadow-sm rounded-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-teal-600 px-8 py-12 text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-2">
            Project Not Found
          </h1>
          <p className="text-teal-100">
            {projectId
              ? `The project with ID "${projectId}" could not be found.`
              : "The requested project could not be found."}
          </p>
        </div>

        {/* Content Section */}
        <CardContent className="p-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                What might have happened?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-start text-gray-600">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="font-medium text-gray-900 mb-2">
                    Project may have been:
                  </div>
                  <ul className="space-y-1 text-left">
                    <li>• Moved or deleted</li>
                    <li>• Archived</li>
                    <li>• Restricted access</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="font-medium text-gray-900 mb-2">
                    URL might be:
                  </div>
                  <ul className="space-y-1 text-left">
                    <li>• Incorrectly typed</li>
                    <li>• From an old bookmark</li>
                    <li>• Expired link</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="flex items-center gap-2 text-teal-600 border-teal-600 hover:bg-teal-50 hover:text-teal-700 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>

              <Button
                onClick={handleGoToProjects}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white transition-all duration-200"
              >
                <Search className="h-4 w-4" />
                Browse Projects
              </Button>

              <Button
                onClick={handleGoToDashboard}
                variant="outline"
                className="flex items-center gap-2 hover:bg-gray-50 transition-all duration-200"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
            </div>

            {/* Help Section */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-4">
                Still having trouble?{" "}
                <span className="text-teal-600 hover:text-teal-700">
                  Contact support
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
