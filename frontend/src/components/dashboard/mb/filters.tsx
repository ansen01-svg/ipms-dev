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
import { Search, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

// Types and Interfaces
interface FilterContextType {
  searchQuery: string;
  projectIdSearch: string;
  selectedCreator: string;
  selectedApprovalStatus: string;
  selectedFileType: string;
  filters: MBFilterConfig;
  setSearchQuery: (query: string) => void;
  setProjectIdSearch: (projectId: string) => void;
  setSelectedCreator: (creator: string) => void;
  setSelectedApprovalStatus: (status: string) => void;
  setSelectedFileType: (fileType: string) => void;
  setFilters: React.Dispatch<React.SetStateAction<MBFilterConfig>>;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

interface FilterProviderProps {
  children: React.ReactNode;
}

interface MBFiltersProps {
  measurementBooks?: MeasurementBook[];
  onProjectIdSearch?: (projectId: string) => void;
  isSearching?: boolean;
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
  const [projectIdSearch, setProjectIdSearch] = useState("");
  const [selectedCreator, setSelectedCreator] = useState("all");
  const [selectedApprovalStatus, setSelectedApprovalStatus] = useState("all");
  const [selectedFileType, setSelectedFileType] = useState("all");
  const [filters, setFilters] = useState<MBFilterConfig>(() => ({
    search: "",
    dateFrom: "",
    dateTo: "",
    hasRemarks: "all",
    isApproved: "all",
    fileType: "all",
  }));

  const clearFilters = useCallback(() => {
    setFilters({
      search: "",
      dateFrom: "",
      dateTo: "",
      hasRemarks: "all",
      isApproved: "all",
      fileType: "all",
    });
    setSearchQuery("");
    setProjectIdSearch("");
    setSelectedCreator("all");
    setSelectedApprovalStatus("all");
    setSelectedFileType("all");
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery !== "" ||
      projectIdSearch !== "" ||
      selectedCreator !== "all" ||
      selectedApprovalStatus !== "all" ||
      selectedFileType !== "all"
    );
  }, [
    searchQuery,
    projectIdSearch,
    selectedCreator,
    selectedApprovalStatus,
    selectedFileType,
  ]);

  return (
    <FilterContext.Provider
      value={{
        searchQuery,
        projectIdSearch,
        selectedCreator,
        selectedApprovalStatus,
        selectedFileType,
        filters,
        setSearchQuery,
        setProjectIdSearch,
        setSelectedCreator,
        setSelectedApprovalStatus,
        setSelectedFileType,
        setFilters,
        clearFilters,
        hasActiveFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

// Get unique creators from measurement books
const getCreators = (measurementBooks: MeasurementBook[]) => {
  const creators = Array.from(
    new Map(
      measurementBooks
        .filter((mb) => mb && mb.createdBy && mb.createdBy.name)
        .map((mb) => [
          mb.createdBy.userId,
          {
            id: mb.createdBy.userId,
            name: mb.createdBy.name,
          },
        ])
    ).values()
  ).sort((a, b) => a.name.localeCompare(b.name));

  return creators;
};

// Main Filters Component
export function MBFilters({
  measurementBooks = [],
  onProjectIdSearch,
  isSearching = false,
}: MBFiltersProps) {
  const {
    projectIdSearch,
    selectedCreator,
    selectedFileType,
    setProjectIdSearch,
    setSelectedCreator,
    setSelectedFileType,
    clearFilters,
    hasActiveFilters,
  } = useMBFilters();

  // Memoize creators to prevent recalculation on every render
  const creators = useMemo(
    () => getCreators(measurementBooks),
    [measurementBooks]
  );

  const handleProjectSearch = useCallback(() => {
    if (onProjectIdSearch && projectIdSearch.trim()) {
      onProjectIdSearch(projectIdSearch.trim());
    }
  }, [onProjectIdSearch, projectIdSearch]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleProjectSearch();
      }
    },
    [handleProjectSearch]
  );

  const handleClearAll = () => {
    clearFilters();
  };

  return (
    <div className="space-y-4">
      {/* Project Search */}
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="flex gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Enter Project ID to search..."
                value={projectIdSearch}
                onChange={(e) => setProjectIdSearch(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 pr-4 py-2"
              />
            </div>
            <Button
              onClick={handleProjectSearch}
              disabled={!projectIdSearch.trim() || isSearching}
              className="bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-sm hover:from-teal-700 hover:to-teal-800 whitespace-nowrap"
            >
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filters in Same Line */}
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <Select value={selectedCreator} onValueChange={setSelectedCreator}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="Created By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Creators</SelectItem>
              {creators.map((creator) => (
                <SelectItem key={creator.id} value={creator.id}>
                  {creator.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedFileType} onValueChange={setSelectedFileType}>
            <SelectTrigger className="w-[120px] h-9">
              <SelectValue placeholder="File Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="document">Document</SelectItem>
              <SelectItem value="image">Image</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="h-9 px-3 text-gray-600 border-gray-300"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
