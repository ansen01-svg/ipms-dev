import CreateArchiveProjectForm from "@/components/dashboard/create-archive-project/create-archive-project-form";
import { ArchiveProjectPageHeader } from "@/components/dashboard/create-archive-project/page-header";

export default async function CreateArchiveProjectPage() {
  return (
    <div className="w-full mb-5 space-y-4 sm:space-y-6">
      {/* Main Content */}
      <div className="w-full">
        {/* Page Header */}
        <ArchiveProjectPageHeader />

        {/* Multi-Step Create Archive Project Form */}
        <CreateArchiveProjectForm />
      </div>
    </div>
  );
}
