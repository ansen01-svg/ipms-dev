import {
  ArchiveProjectFilters,
  DbArchiveProject,
} from "@/types/archive-projects.types";
import { fetchAllArchiveProjects } from "@/utils/archive-projects/fetchAllrchiveProjects";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface UseArchiveProjectsReturn {
  projects: DbArchiveProject[];
  loading: boolean;
  error: string | null;
  refreshProjects: () => Promise<void>;
  loadProjects: (filters?: ArchiveProjectFilters) => Promise<void>;
}

export const useArchiveProjects = (
  initialFilters: ArchiveProjectFilters = { limit: 100, page: 1 }
): UseArchiveProjectsReturn => {
  const [projects, setProjects] = useState<DbArchiveProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log(projects);

  const loadProjects = useCallback(
    async (filters: ArchiveProjectFilters = initialFilters) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchAllArchiveProjects(filters);
        setProjects(response.data);

        console.log(
          `Loaded ${response.data.length} archive projects successfully`
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load archive projects";
        setError(errorMessage);
        console.error("Error loading archive projects:", err);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [initialFilters]
  );

  const refreshProjects = async () => {
    await loadProjects(initialFilters);
  };

  // Load projects on hook initialization
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return {
    projects,
    loading,
    error,
    refreshProjects,
    loadProjects,
  };
};

// Hook for getting archive projects suitable for dropdowns/selection
export const useArchiveProjectsForSelection = () => {
  const [projects, setProjects] = useState<
    Array<{
      id: string;
      name: string;
      workOrderNumber: string;
      location: string;
      contractor: string;
      workValue: number;
      progress: number;
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjectsForSelection = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchAllArchiveProjects({
        limit: 200,
        page: 1,
        sortBy: "nameOfWork",
        sortOrder: "asc",
      });

      const mappedProjects = response.data.map((project) => ({
        id: project._id,
        projectId: project.projectId,
        name: project.nameOfWork,
        workOrderNumber: project.FWONumberAndDate,
        location: project.location,
        contractor: project.nameOfContractor,
        workValue: project.workValue,
        progress: project.progress,
      }));

      setProjects(mappedProjects);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to load projects for selection";
      setError(errorMessage);
      console.error("Error loading projects for selection:", err);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectsForSelection();
  }, []);

  return {
    projects,
    loading,
    error,
    refresh: loadProjectsForSelection,
  };
};
