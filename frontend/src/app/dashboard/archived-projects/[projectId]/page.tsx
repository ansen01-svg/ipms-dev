import ProjectContainer from "@/components/dashboard/archive-project-details/project-container";
import { getCurrentUser } from "@/lib/rbac-config.ts/auth";
import { User } from "@/types/user.types";

interface ProjectDetailsPageProps {
  params: { projectId: string };
  searchParams: { tab?: string };
}

export default async function ProjectDetailsPage({
  params,
  searchParams,
}: ProjectDetailsPageProps) {
  const user = await getCurrentUser();

  const activeTab = searchParams.tab || "overview";

  return (
    <div className="min-h-screen">
      <div className="mx-auto mb-5">
        <ProjectContainer
          user={user as User}
          activeTab={activeTab}
          projectId={params.projectId}
        />
      </div>
    </div>
  );
}
