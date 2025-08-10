import { ProjectsContainer } from "@/components/dashboard/projects/projects-container";
import { getCurrentUser } from "@/lib/rbac-config.ts/auth";
import { MOCK_PROJECTS } from "@/utils/project-details/constants";
import { redirect } from "next/navigation";

export default async function ProjectsListPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Later this would fetch from an API
  const initialProjects = MOCK_PROJECTS;

  return (
    <div className="w-full mb-5 space-y-4 sm:space-y-6 bg-white p-4 sm:p-6 rounded-xl shadow">
      <ProjectsContainer initialProjects={initialProjects} />
    </div>
  );
}
