// "use client";

// import { DbArchiveProject } from "@/types/archive-projects.types";
// import { User, UserRole } from "@/types/user.types";
// import { fetchArchiveProjectById } from "@/utils/archive-projects/fetchAllrchiveProjects";
// import { useEffect, useState } from "react";
// import ArchiveProjectDetailsSkeleton from "./loading-skeleton";
// import { ArchiveProjectNotFound } from "./not-found";
// import { ArchiveProjectHeader } from "./project-header";
// import { ArchiveProjectStats } from "./project-stats";
// import { ArchiveProjectTabs } from "./project-tabs";
// import { ArchiveRoleActionSelector } from "./role-action-selector";

// interface ArchiveProjectsContainerProps {
//   user: User;
//   activeTab: string;
//   projectId: string;
// }

// export default function ArchiveProjectContainer({
//   user,
//   activeTab,
//   projectId,
// }: ArchiveProjectsContainerProps) {
//   const [currentProject, setCurrentProject] = useState<DbArchiveProject | null>(
//     null
//   );
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const loadProject = async () => {
//       if (!projectId) {
//         setError("Archive project ID is required");
//         setIsLoading(false);
//         return;
//       }

//       try {
//         setIsLoading(true);
//         setError(null);

//         const fetchedProject = await fetchArchiveProjectById(projectId);
//         setCurrentProject(fetchedProject ?? null);
//       } catch (err) {
//         console.error("Error loading archive project:", err);
//         setError(
//           err instanceof Error ? err.message : "Failed to load archive project"
//         );
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadProject();
//   }, [projectId]);

//   // Show loading state while fetching project
//   if (isLoading) {
//     return (
//       <ArchiveProjectDetailsSkeleton
//         showHeader={true}
//         showDetails={true}
//         showStats={true}
//       />
//     );
//   }

//   // Show error state with option to retry
//   if (error) {
//     return (
//       <div className="space-y-4">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//           <div className="flex items-center space-x-2">
//             <div className="text-red-600 font-medium">
//               Failed to load archive project
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

//   // If no project found, show not found
//   if (!currentProject) {
//     return <ArchiveProjectNotFound projectId={projectId} />;
//   }

//   return (
//     <div className="space-y-8">
//       {/* Archive Project Header */}
//       <ArchiveProjectHeader project={currentProject} user={user} />

//       {/* Role-Based Action Buttons */}
//       <ArchiveRoleActionSelector user={user} project={currentProject} />

//       {/* Archive Project Statistics Cards */}
//       <ArchiveProjectStats project={currentProject} />

//       {/* Archive Project Tabs Content */}
//       <ArchiveProjectTabs
//         project={currentProject}
//         userRole={user?.role as UserRole}
//         activeTab={activeTab}
//       />
//     </div>
//   );
// }

"use client";

import { DbArchiveProject } from "@/types/archive-projects.types";
import { User, UserRole } from "@/types/user.types";
import { fetchArchiveProjectById } from "@/utils/archive-projects/fetchAllrchiveProjects";
import { useCallback, useEffect, useState } from "react";
import ArchiveProjectDetailsSkeleton from "./loading-skeleton";
import { ArchiveProjectNotFound } from "./not-found";
import { ArchiveProjectHeader } from "./project-header";
import { ArchiveProjectStats } from "./project-stats";
import { ArchiveProjectTabs } from "./project-tabs";
import { ArchiveRoleActionSelector } from "./role-action-selector";

interface ArchiveProjectsContainerProps {
  user: User;
  activeTab: string;
  projectId: string;
}

export default function ArchiveProjectContainer({
  user,
  activeTab,
  projectId,
}: ArchiveProjectsContainerProps) {
  const [currentProject, setCurrentProject] = useState<DbArchiveProject | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProject = useCallback(async () => {
    if (!projectId) {
      setError("Archive project ID is required");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const fetchedProject = await fetchArchiveProjectById(projectId);
      setCurrentProject(fetchedProject ?? null);
    } catch (err) {
      console.error("Error loading archive project:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load archive project"
      );
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadProject();
  }, [projectId, loadProject]);

  const handleProjectUpdate = (updatedProject: DbArchiveProject) => {
    setCurrentProject(updatedProject);
  };

  // Show loading state while fetching project
  if (isLoading) {
    return (
      <ArchiveProjectDetailsSkeleton
        showHeader={true}
        showDetails={true}
        showStats={true}
      />
    );
  }

  // Show error state with option to retry
  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="text-red-600 font-medium">
              Failed to load archive project
            </div>
          </div>
          <div className="text-red-600 text-sm mt-1">{error}</div>
          <button
            onClick={loadProject}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If no project found, show not found
  if (!currentProject) {
    return <ArchiveProjectNotFound projectId={projectId} />;
  }

  return (
    <div className="space-y-8">
      {/* Archive Project Header */}
      <ArchiveProjectHeader project={currentProject} user={user} />

      {/* Role-Based Action Buttons */}
      <ArchiveRoleActionSelector
        user={user}
        project={currentProject}
        onProjectUpdate={handleProjectUpdate}
      />

      {/* Archive Project Statistics Cards */}
      <ArchiveProjectStats project={currentProject} />

      {/* Archive Project Tabs Content */}
      <ArchiveProjectTabs
        project={currentProject}
        userRole={user?.role as UserRole}
        activeTab={activeTab}
      />
    </div>
  );
}
