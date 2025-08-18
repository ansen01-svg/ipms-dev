import ProjectContainer from "@/components/dashboard/project-details/project-container";
import { getCurrentUser } from "@/lib/rbac-config.ts/auth";
import { DbProject } from "@/types/projects.types";
import { User } from "@/types/user.types";
import { fetchProjectById } from "@/utils/projects/fetchAllProjects";

interface ProjectDetailsPageProps {
  params: { projectId: string };
  searchParams: { tab?: string };
}

export default async function ProjectDetailsPage({
  params,
  searchParams,
}: ProjectDetailsPageProps) {
  const user = await getCurrentUser();
  const project = await fetchProjectById(params.projectId);

  const activeTab = searchParams.tab || "overview";

  return (
    <div className="min-h-screen">
      <div className="mx-auto mb-5">
        <ProjectContainer
          project={project as DbProject}
          user={user as User}
          activeTab={activeTab}
          projectId={params.projectId}
        />
      </div>
    </div>
  );
}
