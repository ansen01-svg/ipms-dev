"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/auth-context";
import useDebounce from "@/hooks/useDebounce";
import {
  ArchiveProjectFilters,
  ProgressStatus,
} from "@/types/archive-projects.types";
import { Search, X } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";

// Simplified filter interface for just the 5 required filters
interface SimplifiedArchiveFilters {
  financialYear?: string;
  progressStatus?: string;
  location?: string;
  concernedEngineer?: string;
  nameOfContractor?: string;
}

// Types and Interfaces
interface FilterContextType {
  // Immediate states (for UI binding)
  searchQuery: string;
  localFilters: SimplifiedArchiveFilters;

  // Debounced states (for API calls)
  debouncedSearchQuery: string;
  debouncedFilters: ArchiveProjectFilters;

  // Actions
  setSearchQuery: (query: string) => void;
  setLocalFilters: React.Dispatch<
    React.SetStateAction<SimplifiedArchiveFilters>
  >;
  setDebouncedFilters: React.Dispatch<
    React.SetStateAction<ArchiveProjectFilters>
  >;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

interface FilterProviderProps {
  children: React.ReactNode;
}

interface ArchiveProjectFiltersProps {
  filterOptions?: {
    financialYears: string[];
    contractors: string[];
    engineers: string[];
    locations: string[];
    progressStatuses: ProgressStatus[];
  } | null;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useArchiveFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error(
      "useArchiveFilters must be used within an ArchiveFilterProvider"
    );
  }
  return context;
};

// Enhanced Filter Provider with Debouncing
export function ArchiveFilterProvider({ children }: FilterProviderProps) {
  // Immediate states for UI responsiveness
  const [searchQuery, setSearchQuery] = useState("");
  const [localFilters, setLocalFilters] = useState<SimplifiedArchiveFilters>({
    financialYear: undefined,
    progressStatus: undefined,
    location: undefined,
    concernedEngineer: undefined,
    nameOfContractor: undefined,
  });

  // Final filters state for API calls
  const [debouncedFilters, setDebouncedFilters] =
    useState<ArchiveProjectFilters>({
      page: 1,
      limit: 7,
      sortBy: "createdAt",
      sortOrder: "desc",
    });

  // Debounce the search query and local filters
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // 500ms delay for search
  const debouncedLocalFilters = useDebounce(localFilters, 300); // 300ms delay for filters

  // Update final filters when debounced values change
  useEffect(() => {
    setDebouncedFilters((prev) => {
      // Map progressStatus string to ProgressStatus type if present
      let progressStatus: ProgressStatus | undefined = undefined;
      if (debouncedLocalFilters.progressStatus) {
        progressStatus = debouncedLocalFilters.progressStatus as ProgressStatus;
      }
      return {
        ...prev,
        search: debouncedSearchQuery.trim() || undefined,
        financialYear: debouncedLocalFilters.financialYear,
        progressStatus,
        location: debouncedLocalFilters.location,
        concernedEngineer: debouncedLocalFilters.concernedEngineer,
        nameOfContractor: debouncedLocalFilters.nameOfContractor,
        page: 1, // Reset to first page when filters change
      };
    });
  }, [debouncedSearchQuery, debouncedLocalFilters]);

  const clearFilters = () => {
    setSearchQuery("");
    setLocalFilters({
      financialYear: undefined,
      progressStatus: undefined,
      location: undefined,
      concernedEngineer: undefined,
      nameOfContractor: undefined,
    });
    setDebouncedFilters({
      page: 1,
      limit: 7,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  const hasActiveFilters =
    debouncedSearchQuery !== "" ||
    Object.values(debouncedLocalFilters).some(
      (value) => value !== undefined && value !== "" && value !== null
    );

  return (
    <FilterContext.Provider
      value={{
        // Immediate states
        searchQuery,
        localFilters,

        // Debounced states
        debouncedSearchQuery,
        debouncedFilters,

        // Actions
        setSearchQuery,
        setLocalFilters,
        setDebouncedFilters,
        clearFilters,
        hasActiveFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

// Updated Main Archive Filters Component - Simplified and Responsive
export function ArchiveProjectFiltersComponent({
  filterOptions,
}: ArchiveProjectFiltersProps) {
  const {
    searchQuery,
    localFilters,
    setSearchQuery,
    setLocalFilters,
    clearFilters,
    hasActiveFilters,
  } = useArchiveFilters();
  const { user } = useAuth();

  const updateFilter = (
    key: keyof SimplifiedArchiveFilters,
    value: string | undefined
  ) => {
    // Only update localFilters, as these are the only valid keys
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
    }));
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search archive projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchQuery("")}
            className="absolute right-1 top-1 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Desktop Filters - Horizontal Layout */}
        <div className="hidden lg:flex lg:flex-wrap lg:gap-4 lg:items-center">
          <Select
            value={localFilters.financialYear || "all"}
            onValueChange={(value) => updateFilter("financialYear", value)}
          >
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Financial Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {filterOptions?.financialYears?.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={localFilters.progressStatus || "all"}
            onValueChange={(value) => updateFilter("progressStatus", value)}
          >
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {filterOptions?.progressStatuses?.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={localFilters.location || "all"}
            onValueChange={(value) => updateFilter("location", value)}
          >
            <SelectTrigger className="w-[120px] h-9">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {filterOptions?.locations?.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {user?.role !== "JE" && (
            <Select
              value={localFilters.concernedEngineer || "all"}
              onValueChange={(value) =>
                updateFilter("concernedEngineer", value)
              }
            >
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Engineer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Engineers</SelectItem>
                {filterOptions?.engineers?.map((engineer) => (
                  <SelectItem key={engineer} value={engineer}>
                    {engineer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select
            value={localFilters.nameOfContractor || "all"}
            onValueChange={(value) => updateFilter("nameOfContractor", value)}
          >
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Contractor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Contractors</SelectItem>
              {filterOptions?.contractors?.map((contractor) => (
                <SelectItem key={contractor} value={contractor}>
                  {contractor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="h-9 px-3 text-gray-600 border-gray-300"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        {/* Mobile & Tablet Filters - Vertical Layout */}
        <div className="lg:hidden space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              value={localFilters.financialYear || "all"}
              onValueChange={(value) => updateFilter("financialYear", value)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Financial Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {filterOptions?.financialYears?.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={localFilters.progressStatus || "all"}
              onValueChange={(value) => updateFilter("progressStatus", value)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {filterOptions?.progressStatuses?.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={localFilters.location || "all"}
              onValueChange={(value) => updateFilter("location", value)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {filterOptions?.locations?.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={localFilters.concernedEngineer || "all"}
              onValueChange={(value) =>
                updateFilter("concernedEngineer", value)
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Engineer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Engineers</SelectItem>
                {filterOptions?.engineers?.map((engineer) => (
                  <SelectItem key={engineer} value={engineer}>
                    {engineer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={localFilters.nameOfContractor || "all"}
              onValueChange={(value) => updateFilter("nameOfContractor", value)}
            >
              <SelectTrigger className="h-9 sm:col-span-2">
                <SelectValue placeholder="Contractor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Contractors</SelectItem>
                {filterOptions?.contractors?.map((contractor) => (
                  <SelectItem key={contractor} value={contractor}>
                    {contractor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear Button for Mobile */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="w-full h-9 px-3 text-gray-600 border-gray-300"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
