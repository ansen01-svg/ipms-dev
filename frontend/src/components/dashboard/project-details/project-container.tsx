// "use client";

// import { Project } from "@/types/projects.types";
// import { User, UserRole } from "@/types/user.types";
// import { useEffect, useState } from "react";
// import { ProjectHeader } from "./project-header";
// import { ProjectStats } from "./project-stats";
// import { ProjectTabs } from "./project-tabs";
// import { RoleActionSelector } from "./role-action-selector";

// interface ProjectsContainerProps {
//   project: Project;
//   user: User;
//   activeTab: string;
//   projectId: string;
// }

// // Local storage utilities
// const PROJECTS_STORAGE_KEY = "projects_data";

// const getProjectFromStorage = (
//   fallback: Project,
//   projectId: string
// ): Project => {
//   try {
//     if (typeof window === "undefined") return fallback;
//     const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
//     const allProjects = stored ? [...JSON.parse(stored)] : [];
//     console.log(allProjects);

//     return allProjects.find((p) => p.id === projectId) || fallback;
//   } catch (error) {
//     console.error("Error loading projects from storage:", error);
//     return fallback;
//   }
// };

// export default function ProjectContainer({
//   project,
//   user,
//   activeTab,
//   projectId,
// }: ProjectsContainerProps) {
//   const [initialProject, setInitialProject] = useState<Project>(project);
//   console.log(project);

//   // Load project from localStorage on mount
//   useEffect(() => {
//     const loadedProjects = getProjectFromStorage(initialProject, projectId);
//     setInitialProject(loadedProjects);
//   }, [initialProject, projectId]);

//   return (
//     <div className="space-y-8">
//       {/* Project Header */}
//       <ProjectHeader project={project} user={user as User} />

//       {/* Role-Based Action Buttons */}
//       <RoleActionSelector user={user as User} project={project} />

//       {/* Project Statistics Cards */}
//       <ProjectStats project={project} />

//       {/* Project Tabs Content */}
//       <ProjectTabs
//         project={project}
//         userRole={user?.role as UserRole}
//         activeTab={activeTab}
//       />
//     </div>
//   );
// }

"use client";

import { Project } from "@/types/projects.types";
import { User, UserRole } from "@/types/user.types";
import { useEffect, useState } from "react";
import ProjectDetailsSkeleton from "./loading-skeleton";
import { ProjectNotFound } from "./not-found";
import { ProjectHeader } from "./project-header";
import { ProjectStats } from "./project-stats";
import { ProjectTabs } from "./project-tabs";
import { RoleActionSelector } from "./role-action-selector";

interface ProjectsContainerProps {
  project?: Project;
  user: User;
  activeTab: string;
  projectId: string;
}

// Local storage utilities
const PROJECTS_STORAGE_KEY = "projects_data";

const getProjectFromStorage = (projectId: string): Project | null => {
  try {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!stored) return null;

    const allProjects = JSON.parse(stored);
    return allProjects.find((p: Project) => p.id === projectId) || null;
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
  const [currentProject, setCurrentProject] = useState<Project | null>(
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
