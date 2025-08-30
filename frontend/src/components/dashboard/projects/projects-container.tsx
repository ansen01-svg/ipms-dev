// "use client";

// import { Button } from "@/components/ui/button";
// import { DbProject } from "@/types/projects.types";
// import { User } from "@/types/user.types";
// import { fetchAllProjects } from "@/utils/projects/fetchAllProjects";
// import { Plus, RefreshCw } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { FilterProvider, ProjectFilters } from "./project-filters";
// import { ProjectsTable } from "./projects-table";

// // Types and Interface
// interface ProjectsContainerProps {
//   user: User;
// }

// // Filter and Sort types
// export interface FilterConfig {
//   status: string;
//   district: string;
// }

// export interface SortConfig {
//   key: keyof DbProject | null;
//   direction: "asc" | "desc";
// }

// export function ProjectsContainer({ user }: ProjectsContainerProps) {
//   const [projects, setProjects] = useState<DbProject[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [refreshing, setRefreshing] = useState(false);
//   const router = useRouter();

//   // Function to fetch projects
//   const loadProjects = async (isRefresh = false) => {
//     try {
//       if (isRefresh) {
//         setRefreshing(true);
//       } else {
//         setLoading(true);
//       }
//       setError(null);

//       const projectsData = await fetchAllProjects();
//       setProjects(projectsData);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to load projects");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   // Load projects on component mount
//   useEffect(() => {
//     loadProjects();
//   }, []);

//   // Refresh function for manual refresh
//   const handleRefresh = () => {
//     loadProjects(true);
//   };

//   const handleNewProject = () => {
//     router.push("/dashboard/projects/new");
//   };

//   const handleViewProject = (project: DbProject) => {
//     router.push(`/dashboard/projects/${project.projectId}`);
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="space-y-4">
//         {/* Header skeleton */}
//         <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
//           <div className="flex items-center space-x-2">
//             <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
//           </div>
//           {user.role === "JE" && (
//             <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
//           )}
//         </div>

//         {/* Filters skeleton */}
//         <div className="flex space-x-4">
//           <div className="h-10 bg-gray-200 rounded animate-pulse w-40"></div>
//           <div className="h-10 bg-gray-200 rounded animate-pulse w-40"></div>
//         </div>

//         {/* Table skeleton */}
//         <div className="space-y-2">
//           <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
//           <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
//           <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
//           <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="space-y-4">
//         {/* Header with error */}
//         <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
//           <div className="flex items-center space-x-2">
//             <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
//               Projects
//             </h1>
//           </div>
//           <div className="flex space-x-2">
//             {user.role === "JE" && (
//               <Button
//                 onClick={handleNewProject}
//                 className="bg-teal-600 hover:bg-teal-700 text-white w-full sm:w-auto"
//               >
//                 <Plus className="w-4 h-4 mr-2" />
//                 New Project
//               </Button>
//             )}
//           </div>
//         </div>

//         {/* Error message */}
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//           <div className="flex items-center space-x-2">
//             <div className="text-red-600 font-medium">
//               Failed to load projects
//             </div>
//           </div>
//           <div className="text-red-600 text-sm mt-1">{error}</div>
//           <Button
//             onClick={handleRefresh}
//             variant="outline"
//             size="sm"
//             disabled={refreshing}
//             className="mt-3"
//           >
//             <RefreshCw
//               className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
//             />
//             Try Again
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <FilterProvider>
//       {/* Header Section */}
//       <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
//         <div className="flex items-center space-x-2">
//           <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
//             Projects ({projects.length})
//           </h1>
//         </div>

//         <div className="flex space-x-2">
//           {user.role === "JE" && (
//             <Button
//               onClick={handleNewProject}
//               className="bg-teal-600 hover:bg-teal-700 text-white w-full sm:w-auto"
//             >
//               <Plus className="w-4 h-4 mr-2" />
//               New Project
//             </Button>
//           )}
//         </div>
//       </div>

//       {/* Filters Section */}
//       <ProjectFilters projects={projects} />

//       {/* Projects Table */}
//       <ProjectsTable projects={projects} onViewProject={handleViewProject} />

//       {/* Empty state */}
//       {/* {projects.length === 0 && !loading && !error && (
//         <div className="text-center py-12">
//           <div className="text-gray-500 text-lg mb-2">No projects found</div>
//           <div className="text-gray-400 text-sm mb-4">
//             {user.role === "JE"
//               ? "Create your first project to get started"
//               : "No projects are available for your role"}
//           </div>
//           {user.role === "JE" && (
//             <Button
//               onClick={handleNewProject}
//               className="bg-teal-600 hover:bg-teal-700 text-white"
//             >
//               <Plus className="w-4 h-4 mr-2" />
//               Create First Project
//             </Button>
//           )}
//         </div>
//       )} */}
//     </FilterProvider>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { DbProject } from "@/types/projects.types";
// import { User } from "@/types/user.types";
import { fetchAllProjects } from "@/utils/projects/fetchAllProjects";
import { Plus, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FilterProvider, ProjectFilters } from "./project-filters";
import { ProjectsTable } from "./projects-table";

// Types and Interface
// interface ProjectsContainerProps {
//   user?: User;
// }

// Filter and Sort types
export interface FilterConfig {
  status: string;
  district: string;
}

export interface SortConfig {
  key: keyof DbProject | null;
  direction: "asc" | "desc";
}

export function ProjectsContainer() {
  const [projects, setProjects] = useState<DbProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  // Function to fetch projects
  const loadProjects = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const projectsData = await fetchAllProjects();
      setProjects(projectsData);

      console.log(`Loaded ${projectsData.length} projects successfully`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load projects";
      setError(errorMessage);
      console.error("Error loading projects:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  // Refresh function for manual refresh
  const handleRefresh = () => {
    loadProjects(true);
  };

  const handleNewProject = () => {
    router.push("/dashboard/projects/new");
  };

  const handleViewProject = (project: DbProject) => {
    console.log("Navigating to project:", project);
    router.push(`/dashboard/projects/${project.projectId}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">
        {/* Header skeleton */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
          </div>
          {user?.role === "JE" && (
            <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
          )}
        </div>

        {/* Filters skeleton */}
        <div className="flex space-x-4">
          <div className="h-10 bg-gray-200 rounded animate-pulse w-40"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse w-40"></div>
        </div>

        {/* Table skeleton */}
        <div className="space-y-2">
          <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-4">
        {/* Header with error */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center space-x-2">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              Projects
            </h1>
          </div>
          <div className="flex space-x-2">
            {user?.role === "JE" && (
              <Button
                onClick={handleNewProject}
                className="bg-teal-600 hover:bg-teal-700 text-white w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            )}
          </div>
        </div>

        {/* Error message */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="text-red-600 font-medium">
              Failed to load projects
            </div>
          </div>
          <div className="text-red-600 text-sm mt-1">{error}</div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={refreshing}
            className="mt-3"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <FilterProvider>
      {/* Header Section */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center space-x-2">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
            Projects ({projects.length})
          </h1>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={refreshing}
            className="text-gray-600 border-gray-300"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          {user?.role === "JE" && (
            <Button
              onClick={handleNewProject}
              className="bg-teal-600 hover:bg-teal-700 text-white w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          )}
        </div>
      </div>

      {/* Filters Section */}
      <ProjectFilters projects={projects} />

      {/* Projects Table */}
      <ProjectsTable projects={projects} onViewProject={handleViewProject} />

      {/* Empty state */}
      {projects.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No projects found</div>
          <div className="text-gray-400 text-sm mb-4">
            {user?.role === "JE"
              ? "Create your first project to get started"
              : "No projects are available for your role"}
          </div>
          {user?.role === "JE" && (
            <Button
              onClick={handleNewProject}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Project
            </Button>
          )}
        </div>
      )}
    </FilterProvider>
  );
}
