"use client";

import { DbProject } from "@/types/projects.types";
import { User, UserRole } from "@/types/user.types";
import { useEffect, useState } from "react";
import ProjectDetailsSkeleton from "./loading-skeleton";
import { ProjectNotFound } from "./not-found";
import { ProjectHeader } from "./project-header";
import { ProjectStats } from "./project-stats";
import { ProjectTabs } from "./project-tabs";
import { RoleActionSelector } from "./role-action-selector";

interface ProjectsContainerProps {
  project?: DbProject;
  user: User;
  activeTab: string;
  projectId: string;
}

// Local storage utilities
const PROJECTS_STORAGE_KEY = "projects_data";

const getProjectFromStorage = (projectId: string): DbProject | null => {
  try {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!stored) return null;

    const allProjects = JSON.parse(stored);
    return (
      allProjects.find((p: DbProject) => p.projectId === projectId) || null
    );
  } catch (error) {
    console.error("Error loading projects from storage:", error);
    return null;
  }
};

export default function ProjectContainer({
  project,
  user,
  activeTab,
  projectId,
}: ProjectsContainerProps) {
  const [currentProject, setCurrentProject] = useState<DbProject | null>(
    project || null
  );
  const [isLoading, setIsLoading] = useState(!project);

  useEffect(() => {
    // If we already have a project from the server, use it
    if (project) {
      setCurrentProject(project);
      setIsLoading(false);
      return;
    }

    // If no project from server, check localStorage
    const storedProject = getProjectFromStorage(projectId);
    setCurrentProject(storedProject);
    setIsLoading(false);
  }, [project, projectId]);

  // Show loading state while checking localStorage
  if (isLoading) {
    return (
      <ProjectDetailsSkeleton
        showHeader={true}
        showDetails={true}
        showStats={true}
      />
    );
  }

  // If no project found anywhere, show not found
  if (!currentProject) {
    return <ProjectNotFound />;
  }

  return (
    <div className="space-y-8">
      {/* Project Header */}
      <ProjectHeader project={currentProject} user={user} />

      {/* Role-Based Action Buttons */}
      <RoleActionSelector user={user} project={currentProject} />

      {/* Project Statistics Cards */}
      <ProjectStats project={currentProject} />

      {/* Project Tabs Content */}
      <ProjectTabs
        project={currentProject}
        userRole={user?.role as UserRole}
        activeTab={activeTab}
      />
    </div>
  );
}

// "use client";

// import { DbProject } from "@/types/projects.types";
// import { User, UserRole } from "@/types/user.types";
// import { fetchProjectById } from "@/utils/projects/fetchAllProjects";
// import { useEffect, useState } from "react";
// import ProjectDetailsSkeleton from "./loading-skeleton";
// import { ProjectNotFound } from "./not-found";
// import { ProjectHeader } from "./project-header";
// import { ProjectStats } from "./project-stats";
// import { ProjectTabs } from "./project-tabs";
// import { RoleActionSelector } from "./role-action-selector";

// interface ProjectsContainerProps {
//   project?: DbProject;
//   user: User;
//   activeTab: string;
//   projectId: string;
// }

// export default function ProjectContainer({
//   user,
//   activeTab,
//   projectId,
// }: ProjectsContainerProps) {
//   const [currentProject, setCurrentProject] = useState<DbProject | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const loadProject = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);

//         const fetchedProject = await fetchProjectById(projectId);
//         setCurrentProject(fetchedProject);
//       } catch (err) {
//         console.error("❌ Error loading project:", err);
//         setError(err instanceof Error ? err.message : "Failed to load project");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadProject();
//   }, [projectId]);

//   // Show loading state while fetching project
//   if (isLoading) {
//     return (
//       <ProjectDetailsSkeleton
//         showHeader={true}
//         showDetails={true}
//         showStats={true}
//       />
//     );
//   }

//   // Show error state with option to retry
//   if (error && !currentProject) {
//     return (
//       <div className="space-y-4">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//           <div className="flex items-center space-x-2">
//             <div className="text-red-600 font-medium">
//               Failed to load project
//             </div>
//           </div>
//           <div className="text-red-600 text-sm mt-1">{error}</div>
//           <button
//             onClick={() => window.location.reload()}
//             className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // If no project found anywhere, show not found
//   if (!currentProject) {
//     return <ProjectNotFound />;
//   }

//   return (
//     <div className="space-y-8">
//       {/* Show warning if using mock data */}
//       {currentProject.projectId === projectId &&
//         currentProject.projectName === "School Building Project" && (
//           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//             <div className="text-yellow-800 text-sm">
//               ⚠️ Displaying mock data - project not found in database
//             </div>
//           </div>
//         )}

//       {/* Project Header */}
//       <ProjectHeader project={currentProject} user={user} />

//       {/* Role-Based Action Buttons */}
//       <RoleActionSelector user={user} project={currentProject} />

//       {/* Project Statistics Cards */}
//       <ProjectStats project={currentProject} />

//       {/* Project Tabs Content */}
//       <ProjectTabs
//         project={currentProject}
//         userRole={user?.role as UserRole}
//         activeTab={activeTab}
//       />
//     </div>
//   );
// }
