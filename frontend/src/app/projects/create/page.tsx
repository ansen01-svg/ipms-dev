"use client";

import { useRouter } from "next/navigation";
import CreateProjectForm from "@/components/create-project/create-project-form";
import PageHeader from "@/components/create-project/page-header";
import BreadCrumbHolder from "@/components/create-project/breadcrumb-holder";
import { Toaster } from "@/components/ui/sonner";

export default function CreateProjectPage() {
  const router = useRouter();

  const handleSuccess = () => {
    // Navigate to projects list after successful submission
    console.log("Project created successfully");
    // Uncomment the line below to enable navigation after success
    // router.push("/dashboard/projects");
  };

  const handleCancel = () => {
    // Navigate back to projects list
    router.push("/dashboard/projects");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="sm:max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb Navigation */}
        <BreadCrumbHolder />

        {/* Page Header */}
        <PageHeader />

        {/* Multi-Step Create Project Form */}
        <CreateProjectForm onSuccess={handleSuccess} onCancel={handleCancel} />

        {/* Toast Notifications */}
        <Toaster position="top-center" />
      </div>
    </div>
  );
}
