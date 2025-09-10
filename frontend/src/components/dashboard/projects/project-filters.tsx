// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { DbProject } from "@/types/projects.types";
// import { Search, X } from "lucide-react";
// import { createContext, useContext, useState } from "react";

// // Types and Interfaces
// interface FilterContextType {
//   searchQuery: string;
//   filters: FilterConfig;
//   setSearchQuery: (query: string) => void;
//   setFilters: React.Dispatch<React.SetStateAction<FilterConfig>>;
//   clearFilters: () => void;
//   hasActiveFilters: boolean;
// }

// interface FilterProviderProps {
//   children: React.ReactNode;
// }

// interface ProjectFiltersProps {
//   projects?: DbProject[];
// }

// // Filter config interface
// export interface FilterConfig {
//   status: string;
//   district: string;
// }

// const FilterContext = createContext<FilterContextType | undefined>(undefined);

// export const useFilters = () => {
//   const context = useContext(FilterContext);
//   if (!context) {
//     throw new Error("useFilters must be used within a FilterProvider");
//   }
//   return context;
// };

// // Filter Provider
// export function FilterProvider({ children }: FilterProviderProps) {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filters, setFilters] = useState<FilterConfig>({
//     status: "all",
//     district: "all",
//   });

//   const clearFilters = () => {
//     setFilters({
//       status: "all",
//       district: "all",
//     });
//     setSearchQuery("");
//   };

//   const hasActiveFilters =
//     Object.values(filters).some((filter) => filter !== "all") ||
//     searchQuery !== "";

//   return (
//     <FilterContext.Provider
//       value={{
//         searchQuery,
//         filters,
//         setSearchQuery,
//         setFilters,
//         clearFilters,
//         hasActiveFilters,
//       }}
//     >
//       {children}
//     </FilterContext.Provider>
//   );
// }

// // Get unique filter options from projects
// const getFilterOptions = (projects: DbProject[]) => {
//   return {
//     statuses: Array.from(
//       new Set(projects.map((p) => p.status).filter(Boolean))
//     ).sort(),
//     districts: Array.from(
//       new Set(projects.map((p) => p.district).filter(Boolean))
//     ).sort(),
//   };
// };

// // Main Filters Component
// export function ProjectFilters({ projects = [] }: ProjectFiltersProps) {
//   const {
//     searchQuery,
//     filters,
//     setSearchQuery,
//     setFilters,
//     clearFilters,
//     hasActiveFilters,
//   } = useFilters();

//   const filterOptions = getFilterOptions(projects);

//   return (
//     <div className="space-y-4">
//       {/* Mobile and Tablet Layout */}
//       <div className="lg:hidden space-y-3">
//         {/* Search Bar - Full width on mobile */}
//         <div className="relative w-full">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//           <Input
//             type="text"
//             placeholder="Search projects by name, ID, district, type, status, or department..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full"
//           />
//         </div>

//         {/* Filters Section */}
//         <div className="space-y-3">
//           <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
//             <span>Filters:</span>
//           </div>

//           {/* Filter Grid - 2x2 on tablet, 1 column on mobile */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             <Select
//               value={filters.status}
//               onValueChange={(value) =>
//                 setFilters((prev) => ({ ...prev, status: value }))
//               }
//             >
//               <SelectTrigger className="h-9">
//                 <SelectValue placeholder="All Status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Status</SelectItem>
//                 {filterOptions.statuses.map((status) => (
//                   <SelectItem key={status} value={status}>
//                     {status}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             <Select
//               value={filters.district}
//               onValueChange={(value) =>
//                 setFilters((prev) => ({ ...prev, district: value }))
//               }
//             >
//               <SelectTrigger className="h-9">
//                 <SelectValue placeholder="All Districts" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Districts</SelectItem>
//                 {filterOptions.districts.map((district) => (
//                   <SelectItem key={district} value={district}>
//                     {district}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Clear Button - Full width on mobile/tablet */}
//           {hasActiveFilters && (
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={clearFilters}
//               className="w-full h-9 px-3 text-gray-600 border-gray-300"
//             >
//               <X className="w-4 h-4 mr-1" />
//               Clear All Filters
//             </Button>
//           )}
//         </div>
//       </div>

//       {/* Desktop Layout */}
//       <div className="hidden lg:block">
//         <div className="w-full flex items-center justify-between">
//           {/* Search Bar */}
//           <div className="relative w-full sm:max-w-md">
//             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//             <Input
//               type="text"
//               placeholder="Search projects by name, ID, district, type..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full"
//             />
//           </div>

//           {/* Filters */}
//           <div className="flex flex-wrap gap-3 items-center">
//             <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
//               <span>Filters:</span>
//             </div>

//             <Select
//               value={filters.status}
//               onValueChange={(value) =>
//                 setFilters((prev) => ({ ...prev, status: value }))
//               }
//             >
//               <SelectTrigger className="w-[160px] h-9">
//                 <SelectValue placeholder="Status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Status</SelectItem>
//                 {filterOptions.statuses.map((status) => (
//                   <SelectItem key={status} value={status}>
//                     {status}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             <Select
//               value={filters.district}
//               onValueChange={(value) =>
//                 setFilters((prev) => ({ ...prev, district: value }))
//               }
//             >
//               <SelectTrigger className="w-[140px] h-9">
//                 <SelectValue placeholder="District" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Districts</SelectItem>
//                 {filterOptions.districts.map((district) => (
//                   <SelectItem key={district} value={district}>
//                     {district}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             {hasActiveFilters && (
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={clearFilters}
//                 className="h-9 px-3 text-gray-600 border-gray-300"
//               >
//                 <X className="w-4 h-4 mr-1" />
//                 Clear
//               </Button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DbProject } from "@/types/projects.types";
import { Search, X } from "lucide-react";
import { createContext, useContext, useState } from "react";

// Types and Interfaces
interface FilterContextType {
  searchQuery: string;
  filters: FilterConfig;
  setSearchQuery: (query: string) => void;
  setFilters: React.Dispatch<React.SetStateAction<FilterConfig>>;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

interface FilterProviderProps {
  children: React.ReactNode;
}

interface ProjectFiltersProps {
  projects?: DbProject[];
}

// Filter config interface - Updated with new filters
export interface FilterConfig {
  status: string;
  district: string;
  createdBy: string;
  sanctioningDepartment: string;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
};

// Filter Provider
export function FilterProvider({ children }: FilterProviderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterConfig>({
    status: "all",
    district: "all",
    createdBy: "all",
    sanctioningDepartment: "all",
  });

  const clearFilters = () => {
    setFilters({
      status: "all",
      district: "all",
      createdBy: "all",
      sanctioningDepartment: "all",
    });
    setSearchQuery("");
  };

  const hasActiveFilters =
    Object.values(filters).some((filter) => filter !== "all") ||
    searchQuery !== "";

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

// Get unique filter options from projects
const getFilterOptions = (projects: DbProject[]) => {
  return {
    statuses: Array.from(
      new Set(projects.map((p) => p.status).filter(Boolean))
    ).sort(),
    districts: Array.from(
      new Set(projects.map((p) => p.district).filter(Boolean))
    ).sort(),
    createdByOptions: Array.from(
      new Set(
        projects
          .map((p) =>
            typeof p.createdBy === "object" &&
            p.createdBy !== null &&
            "name" in p.createdBy
              ? (p.createdBy as { name: string }).name
              : undefined
          )
          .filter(Boolean)
      )
    ).sort(),
    sanctioningDepartments: Array.from(
      new Set(projects.map((p) => p.sanctioningDepartment).filter(Boolean))
    ).sort(),
  };
};

// Main Filters Component
export function ProjectFilters({ projects = [] }: ProjectFiltersProps) {
  const {
    searchQuery,
    filters,
    setSearchQuery,
    setFilters,
    clearFilters,
    hasActiveFilters,
  } = useFilters();

  const filterOptions = getFilterOptions(projects);

  return (
    <div className="space-y-4">
      {/* Search Bar - Full width on all screens */}
      <div className="w-full">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search projects by name, ID, district, type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full"
          />
        </div>
      </div>

      {/* Filters Section - Mobile and Tablet Layout */}
      <div className="lg:hidden space-y-3">
        <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
          <span>Filters:</span>
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
            value={filters.district}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, district: value }))
            }
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All Districts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Districts</SelectItem>
              {filterOptions.districts.map((district) => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.createdBy}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, createdBy: value }))
            }
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All JE" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All JE</SelectItem>
              {filterOptions.createdByOptions
                .filter((je): je is string => typeof je === "string")
                .map((je) => (
                  <SelectItem key={je} value={je}>
                    {je}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.sanctioningDepartment}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, sanctioningDepartment: value }))
            }
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All Sanctioning Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sanctioning Departments</SelectItem>
              {filterOptions.sanctioningDepartments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
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

      {/* Filters Section - Desktop Layout */}
      <div className="hidden lg:block">
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <span>Filters:</span>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger className="w-[160px] h-9">
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
              value={filters.district}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, district: value }))
              }
            >
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="District" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {filterOptions.districts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.createdBy}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, createdBy: value }))
              }
            >
              <SelectTrigger className="w-[120px] h-9">
                <SelectValue placeholder="JE" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All JE</SelectItem>
                {filterOptions.createdByOptions
                  .filter((je): je is string => typeof je === "string")
                  .map((je) => (
                    <SelectItem key={je} value={je}>
                      {je}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.sanctioningDepartment}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  sanctioningDepartment: value,
                }))
              }
            >
              <SelectTrigger className="w-[200px] h-9">
                <SelectValue placeholder="Sanctioning Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sanctioning Departments</SelectItem>
                {filterOptions.sanctioningDepartments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
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
          </div>
        </div>
      </div>
    </div>
  );
}
