import { ProjectNotFound } from "@/components/dashboard/project-details/not-found";
import { ProjectHeader } from "@/components/dashboard/project-details/project-header";
import { ProjectStats } from "@/components/dashboard/project-details/project-stats";
import { ProjectTabs } from "@/components/dashboard/project-details/project-tabs";
import { RoleActionSelector } from "@/components/dashboard/project-details/role-action-selector";
import { getCurrentUser } from "@/lib/rbac-config.ts/auth";
import { User, UserRole } from "@/types/user.types";
import { MOCK_PROJECTS } from "@/utils/project-details/constants";

interface ProjectDetailsPageProps {
  params: { projectId: string };
  searchParams: { tab?: string };
}

export default async function ProjectDetailsPage({
  params,
  searchParams,
}: ProjectDetailsPageProps) {
  const user = await getCurrentUser();
  const project = MOCK_PROJECTS.find(
    (project) => project.id === params.projectId
  );

  if (!project) {
    return <ProjectNotFound />;
  }

  const activeTab = searchParams.tab || "overview";

  return (
    <div className="min-h-screen">
      <div className="mx-auto mb-5">
        <div className="space-y-8">
          {/* Project Header */}
          <ProjectHeader project={project} user={user as User} />

          {/* Role-Based Action Buttons */}
          <RoleActionSelector user={user as User} project={project} />

          {/* Project Statistics Cards */}
          <ProjectStats project={project} />

          {/* Project Tabs Content */}
          <ProjectTabs
            project={project}
            userRole={user?.role as UserRole}
            activeTab={activeTab}
          />
        </div>
      </div>
    </div>
  );
}
