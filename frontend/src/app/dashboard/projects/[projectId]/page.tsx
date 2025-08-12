// import { ProjectNotFound } from "@/components/dashboard/project-details/not-found";
// import ProjectContainer from "@/components/dashboard/project-details/project-container";
// import { getCurrentUser } from "@/lib/rbac-config.ts/auth";
// import { User } from "@/types/user.types";
// import { MOCK_PROJECTS } from "@/utils/project-details/constants";

// interface ProjectDetailsPageProps {
//   params: { projectId: string };
//   searchParams: { tab?: string };
// }

// export default async function ProjectDetailsPage({
//   params,
//   searchParams,
// }: ProjectDetailsPageProps) {
//   const user = await getCurrentUser();
//   const project = MOCK_PROJECTS.find(
//     (project) => project.id === params.projectId
//   );

//   if (!project) {
//     return <ProjectNotFound />;
//   }

//   const activeTab = searchParams.tab || "overview";

//   return (
//     <div className="min-h-screen">
//       <div className="mx-auto mb-5">
//         <ProjectContainer
//           project={project}
//           user={user as User}
//           activeTab={activeTab}
//           projectId={params.projectId}
//         />
//       </div>
//     </div>
//   );
// }

import ProjectContainer from "@/components/dashboard/project-details/project-container";
import { getCurrentUser } from "@/lib/rbac-config.ts/auth";
import { Project } from "@/types/projects.types";
import { User } from "@/types/user.types";
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

  const activeTab = searchParams.tab || "overview";

  return (
    <div className="min-h-screen">
      <div className="mx-auto mb-5">
        <ProjectContainer
          project={project as Project}
          user={user as User}
          activeTab={activeTab}
          projectId={params.projectId}
        />
      </div>
    </div>
  );
}
