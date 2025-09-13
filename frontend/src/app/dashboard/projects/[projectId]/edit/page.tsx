import EditProjectForm from "@/components/dashboard/edit-project/edit-project-form";
import EditProjectPageHeader from "@/components/dashboard/edit-project/page-header";

interface EditProjectPageProps {
  params: {
    projectId: string;
  };
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const { projectId } = params;
  console.log("Editing project with ID:", projectId);

  return (
    <div className="w-full mb-5 space-y-4 sm:space-y-6">
      {/* Main Content */}
      <div className="w-full">
        {/* Page Header */}
        <EditProjectPageHeader projectId={projectId} />

        {/* Edit Project Form */}
        <EditProjectForm projectId={projectId} />
      </div>
    </div>
  );
}
