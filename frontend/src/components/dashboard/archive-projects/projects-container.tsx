"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import {
  ArchiveProjectFilterOptions,
  ArchiveProjectFilters,
  ArchiveProjectsPaginationMeta,
  ArchiveProjectsResponse,
  DbArchiveProject,
} from "@/types/archive-projects.types";
import { User } from "@/types/user.types";
import {
  fetchAllArchiveProjects,
  fetchArchiveProjectFilterOptions,
} from "@/utils/archive-projects/fetchAllrchiveProjects";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  ArchiveFilterProvider,
  ArchiveProjectFiltersComponent as FiltersComponent,
  useArchiveFilters,
} from "./project-filters";
import { ArchiveProjectsTable } from "./projects-table";

// Types and Interface
interface ArchiveProjectsContainerProps {
  user?: User;
}

// Main Container Component with State Management
function ArchiveProjectsContainerContent({
  user,
}: ArchiveProjectsContainerProps) {
  // Use debounced values instead of immediate values
  const { debouncedFilters } = useArchiveFilters();

  const [projects, setProjects] = useState<DbArchiveProject[]>([]);
  const [pagination, setPagination] =
    useState<ArchiveProjectsPaginationMeta | null>(null);
  const [filterOptions, setFilterOptions] = useState<
    ArchiveProjectFilterOptions["data"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  // Function to fetch archive projects
  const loadArchiveProjects = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        setError(null);

        // Use debounced filters directly (search is already included)
        const searchFilters: ArchiveProjectFilters = {
          ...debouncedFilters,
        };

        const response: ArchiveProjectsResponse = await fetchAllArchiveProjects(
          searchFilters
        );

        setProjects(response.data);
        setPagination(response.pagination);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load archive projects"
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [debouncedFilters] // Only depend on debounced filters
  );

  // Function to load filter options
  const loadFilterOptions = async () => {
    try {
      const response = await fetchArchiveProjectFilterOptions();
      setFilterOptions(response.data);
    } catch (err) {
      console.error("Failed to load filter options:", err);
      // Provide fallback filter options
      setFilterOptions({
        financialYears: ["2024-2025", "2023-2024", "2022-2023", "2021-2022"],
        contractors: ["ABC Construction Ltd", "XYZ Infrastructure Pvt Ltd"],
        engineers: [
          "Junior Engineer - Civil",
          "Assistant Engineer",
          "Executive Engineer",
        ],
        locations: ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Nagaon"],
        progressStatuses: [
          "Not Started",
          "Just Started",
          "In Progress",
          "Halfway Complete",
          "Near Completion",
          "Completed",
        ],
      });
    }
  };

  // Load archive projects when debounced filters change
  useEffect(() => {
    loadArchiveProjects();
  }, [loadArchiveProjects]); // loadArchiveProjects already includes debouncedFilters in its dependencies

  // Load filter options on component mount
  useEffect(() => {
    loadFilterOptions();
  }, []);

  const handleNewArchiveProject = () => {
    router.push("/dashboard/archived-projects/create");
  };

  const handleViewProject = (project: DbArchiveProject) => {
    router.push(`/dashboard/archived-projects/${project.projectId}`);
  };

  // Loading state
  if (loading && !refreshing) {
    return (
      <div className="space-y-4">
        {/* Header skeleton */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
          </div>
          {user?.role === "JE" && (
            <div className="h-10 bg-gray-200 rounded animate-pulse w-40"></div>
          )}
        </div>

        {/* Summary cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 bg-gray-200 rounded animate-pulse"
            ></div>
          ))}
        </div>

        {/* Filters skeleton */}
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded animate-pulse w-full sm:w-60"></div>
          <div className="flex space-x-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
          </div>
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

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center space-x-2">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
            Archive Projects ({pagination?.totalDocuments || 0})
          </h1>
        </div>

        <div className="flex space-x-2">
          {user?.role === "OPERATOR" && (
            <Button
              onClick={handleNewArchiveProject}
              className="bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-sm hover:from-teal-700 hover:to-teal-800 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Archive Record
            </Button>
          )}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="text-yellow-600 font-medium">
              API Connection Issue
            </div>
          </div>
          <div className="text-yellow-700 text-sm mt-1">
            {error}. Showing sample data for demonstration.
          </div>
        </div>
      )}

      {/* Filters Section - Now below search and simplified */}
      <FiltersComponent filterOptions={filterOptions} />

      {/* Archive Projects Table */}
      <ArchiveProjectsTable
        projects={projects}
        pagination={pagination}
        loading={refreshing}
        onViewProject={handleViewProject}
      />
    </div>
  );
}

// Main Container Component with Provider
export function ArchiveProjectsContainer() {
  const { user } = useAuth();

  return (
    <ArchiveFilterProvider>
      <ArchiveProjectsContainerContent user={user as User} />
    </ArchiveFilterProvider>
  );
}
