// frontend/src/components/dashboard/measurement-books/mb-filters.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MBFilterConfig, MeasurementBook } from "@/types/mb.types";
import { Download, Search, X } from "lucide-react";
import { createContext, useContext, useState } from "react";

// Types and Interfaces
interface FilterContextType {
  searchQuery: string;
  filters: MBFilterConfig;
  setSearchQuery: (query: string) => void;
  setFilters: React.Dispatch<React.SetStateAction<MBFilterConfig>>;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

interface FilterProviderProps {
  children: React.ReactNode;
}

interface MBFiltersProps {
  measurementBooks?: MeasurementBook[];
  onExport?: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useMBFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useMBFilters must be used within a MBFilterProvider");
  }
  return context;
};

// Filter Provider
export function MBFilterProvider({ children }: FilterProviderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<MBFilterConfig>({
    status: "all",
    fileType: "all",
    dateRange: {},
  });

  const clearFilters = () => {
    setFilters({
      status: "all",
      fileType: "all",
      dateRange: {},
    });
    setSearchQuery("");
  };

  const hasActiveFilters =
    Object.values(filters).some((filter) =>
      typeof filter === "string"
        ? filter !== "all"
        : typeof filter === "object"
        ? Object.keys(filter).length > 0
        : false
    ) || searchQuery !== "";

  return (
    <FilterContext.Provider
      value={{
        searchQuery,
        filters,
        setSearchQuery,
        setFilters,
        clearFilters,
        hasActiveFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

// Get unique filter options from measurement books
const getFilterOptions = (measurementBooks: MeasurementBook[]) => {
  return {
    statuses: Array.from(
      new Set(measurementBooks.map((mb) => mb.status).filter(Boolean))
    ).sort(),
    fileTypes: Array.from(
      new Set(
        measurementBooks.map((mb) => mb.uploadedFile.fileType).filter(Boolean)
      )
    ).sort(),
  };
};

// Main Filters Component
export function MBFilters({ measurementBooks = [], onExport }: MBFiltersProps) {
  const {
    searchQuery,
    filters,
    setSearchQuery,
    setFilters,
    clearFilters,
    hasActiveFilters,
  } = useMBFilters();

  const filterOptions = getFilterOptions(measurementBooks);

  return (
    <div className="space-y-4">
      {/* Mobile and Tablet Layout */}
      <div className="lg:hidden space-y-3">
        {/* Search Bar - Full width on mobile */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search MBs by title, number, contractor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full"
          />
        </div>

        {/* Filters Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <span>Filters:</span>
            </div>
            {onExport && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                className="text-gray-600 border-gray-300"
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            )}
          </div>

          {/* Filter Grid - 2x2 on tablet, 1 column on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {filterOptions.statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.fileType}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, fileType: value }))
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="All File Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All File Types</SelectItem>
                {filterOptions.fileTypes.map((fileType) => (
                  <SelectItem key={fileType} value={fileType}>
                    {fileType.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear Button - Full width on mobile/tablet */}
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

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="w-full flex items-center justify-between">
          {/* Search Bar */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search MBs by title, number, contractor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full"
            />
          </div>

          {/* Filters and Export */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <span>Filters:</span>
            </div>

            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {filterOptions.statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.fileType}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, fileType: value }))
              }
            >
              <SelectTrigger className="w-[120px] h-9">
                <SelectValue placeholder="File Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {filterOptions.fileTypes.map((fileType) => (
                  <SelectItem key={fileType} value={fileType}>
                    {fileType.toUpperCase()}
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
                Clear
              </Button>
            )}

            {onExport && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                className="h-9 px-3 text-gray-600 border-gray-300"
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
