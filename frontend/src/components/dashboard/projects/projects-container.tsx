"use client";

import { Button } from "@/components/ui/button";
import { Project } from "@/types/projects.types";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FilterProvider, ProjectFilters } from "./project-filters";
import { ProjectsTable } from "./projects-table";

// Props interface
interface ProjectsContainerProps {
  initialProjects: Project[];
}

// Filter and Sort types (exported for use in other components)
export interface FilterConfig {
  status: string;
  district: string;
}

export interface SortConfig {
  key: keyof Project | null;
  direction: "asc" | "desc";
}

// Local storage utilities
const PROJECTS_STORAGE_KEY = "projects_data";

const getProjectsFromStorage = (fallback: Project[]): Project[] => {
  try {
    if (typeof window === "undefined") return fallback;
    const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
    return stored ? [...JSON.parse(stored), ...fallback] : fallback;
  } catch (error) {
    console.error("Error loading projects from storage:", error);
    return fallback;
  }
};

export function ProjectsContainer({ initialProjects }: ProjectsContainerProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const router = useRouter();

  // Load projects from localStorage on mount
  useEffect(() => {
    const loadedProjects = getProjectsFromStorage(initialProjects);
    setProjects(loadedProjects);
  }, [initialProjects]);

  const handleNewProject = () => {
    router.push("/dashboard/projects/new");
  };

  const handleViewProject = (project: Project) => {
    router.push(`/dashboard/projects/${project.id}`);
  };

  return (
    <FilterProvider>
      {/* Header Section */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center space-x-2">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
            Projects ({projects.length})
          </h1>
        </div>
        <Button
          onClick={handleNewProject}
          className="bg-teal-600 hover:bg-teal-700 text-white w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Filters Section */}
      <ProjectFilters projects={projects} />

      {/* Projects Table */}
      <ProjectsTable projects={projects} onViewProject={handleViewProject} />
    </FilterProvider>
  );
}
