// "use client";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   ArchiveProjectFilters,
//   ProgressStatus,
// } from "@/types/archive-projects.types";
// import { Calendar, Filter, Search, X } from "lucide-react";
// import { createContext, useContext, useState } from "react";

// // Types and Interfaces
// interface FilterContextType {
//   searchQuery: string;
//   filters: ArchiveProjectFilters;
//   setSearchQuery: (query: string) => void;
//   setFilters: React.Dispatch<React.SetStateAction<ArchiveProjectFilters>>;
//   clearFilters: () => void;
//   hasActiveFilters: boolean;
// }

// interface FilterProviderProps {
//   children: React.ReactNode;
// }

// interface ArchiveProjectFiltersProps {
//   filterOptions?: {
//     financialYears: string[];
//     contractors: string[];
//     engineers: string[];
//     locations: string[];
//     progressStatuses: ProgressStatus[];
//   } | null;
// }

// const FilterContext = createContext<FilterContextType | undefined>(undefined);

// export const useArchiveFilters = () => {
//   const context = useContext(FilterContext);
//   if (!context) {
//     throw new Error(
//       "useArchiveFilters must be used within an ArchiveFilterProvider"
//     );
//   }
//   return context;
// };

// // Filter Provider
// export function ArchiveFilterProvider({ children }: FilterProviderProps) {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filters, setFilters] = useState<ArchiveProjectFilters>({
//     page: 1,
//     limit: 7,
//     sortBy: "createdAt",
//     sortOrder: "desc",
//   });

//   const clearFilters = () => {
//     setFilters({
//       page: 1,
//       limit: 7,
//       sortBy: "createdAt",
//       sortOrder: "desc",
//     });
//     setSearchQuery("");
//   };

//   const hasActiveFilters =
//     searchQuery !== "" ||
//     filters.financialYear !== undefined ||
//     filters.concernedEngineer !== undefined ||
//     filters.nameOfContractor !== undefined ||
//     filters.location !== undefined ||
//     filters.progressStatus !== undefined ||
//     filters.minWorkValue !== undefined ||
//     filters.maxWorkValue !== undefined ||
//     filters.minAAAmount !== undefined ||
//     filters.maxAAAmount !== undefined ||
//     filters.minProgress !== undefined ||
//     filters.maxProgress !== undefined ||
//     filters.startAADate !== undefined ||
//     filters.endAADate !== undefined ||
//     filters.startFWODate !== undefined ||
//     filters.endFWODate !== undefined ||
//     filters.billNumber !== undefined ||
//     filters.AANumber !== undefined;

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

// // Main Archive Filters Component
// export function ArchiveProjectFiltersComponent({
//   filterOptions,
// }: ArchiveProjectFiltersProps) {
//   const {
//     searchQuery,
//     filters,
//     setSearchQuery,
//     setFilters,
//     clearFilters,
//     hasActiveFilters,
//   } = useArchiveFilters();

//   const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

//   const updateFilter = (
//     key: keyof ArchiveProjectFilters,
//     value: string | number | string[] | undefined
//   ) => {
//     setFilters((prev) => ({
//       ...prev,
//       [key]: value === "all" ? undefined : value,
//       page: 1, // Reset to first page when filters change
//     }));
//   };

//   return (
//     <div className="space-y-4">
//       {/* Mobile and Tablet Layout */}
//       <div className="lg:hidden space-y-3">
//         {/* Search Bar */}
//         <div className="relative w-full">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//           <Input
//             type="text"
//             placeholder="Search archive projects..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full"
//           />
//         </div>

//         {/* Basic Filters */}
//         <div className="space-y-3">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
//               <Filter className="w-4 h-4" />
//               <span>Filters:</span>
//             </div>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
//               className="text-teal-600 hover:text-teal-700"
//             >
//               {showAdvancedFilters ? "Less Filters" : "More Filters"}
//             </Button>
//           </div>

//           {/* Basic Filter Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             <Select
//               value={(filters.financialYear as string) || "all"}
//               onValueChange={(value) => updateFilter("financialYear", value)}
//             >
//               <SelectTrigger className="h-9">
//                 <SelectValue placeholder="Financial Year" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Years</SelectItem>
//                 {filterOptions?.financialYears?.map((year) => (
//                   <SelectItem key={year} value={year}>
//                     {year}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             <Select
//               value={(filters.progressStatus as string) || "all"}
//               onValueChange={(value) => updateFilter("progressStatus", value)}
//             >
//               <SelectTrigger className="h-9">
//                 <SelectValue placeholder="Progress Status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Status</SelectItem>
//                 {filterOptions?.progressStatuses?.map((status) => (
//                   <SelectItem key={status} value={status}>
//                     {status}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             <Select
//               value={(filters.concernedEngineer as string) || "all"}
//               onValueChange={(value) =>
//                 updateFilter("concernedEngineer", value)
//               }
//             >
//               <SelectTrigger className="h-9">
//                 <SelectValue placeholder="Engineer" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Engineers</SelectItem>
//                 {filterOptions?.engineers?.map((engineer) => (
//                   <SelectItem key={engineer} value={engineer}>
//                     {engineer}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             <Select
//               value={(filters.location as string) || "all"}
//               onValueChange={(value) => updateFilter("location", value)}
//             >
//               <SelectTrigger className="h-9">
//                 <SelectValue placeholder="Location" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Locations</SelectItem>
//                 {filterOptions?.locations?.map((location) => (
//                   <SelectItem key={location} value={location}>
//                     {location}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Advanced Filters */}
//           {showAdvancedFilters && (
//             <div className="space-y-3 pt-2 border-t border-gray-200">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 {/* Contractor Filter */}
//                 <Input
//                   placeholder="Contractor Name"
//                   value={filters.nameOfContractor || ""}
//                   onChange={(e) =>
//                     updateFilter("nameOfContractor", e.target.value)
//                   }
//                   className="h-9"
//                 />

//                 {/* Bill Number Filter */}
//                 <Input
//                   placeholder="Bill Number"
//                   value={filters.billNumber || ""}
//                   onChange={(e) => updateFilter("billNumber", e.target.value)}
//                   className="h-9"
//                 />

//                 {/* AA Number Filter */}
//                 <Input
//                   placeholder="A.A Number"
//                   value={filters.AANumber || ""}
//                   onChange={(e) => updateFilter("AANumber", e.target.value)}
//                   className="h-9"
//                 />
//               </div>

//               {/* Value Range Filters */}
//               <div className="space-y-3">
//                 <div className="text-sm font-medium text-gray-700">
//                   Work Value Range (₹)
//                 </div>
//                 <div className="grid grid-cols-2 gap-2">
//                   <Input
//                     type="number"
//                     placeholder="Min Value"
//                     value={filters.minWorkValue || ""}
//                     onChange={(e) =>
//                       updateFilter(
//                         "minWorkValue",
//                         e.target.value ? Number(e.target.value) : undefined
//                       )
//                     }
//                     className="h-9"
//                   />
//                   <Input
//                     type="number"
//                     placeholder="Max Value"
//                     value={filters.maxWorkValue || ""}
//                     onChange={(e) =>
//                       updateFilter(
//                         "maxWorkValue",
//                         e.target.value ? Number(e.target.value) : undefined
//                       )
//                     }
//                     className="h-9"
//                   />
//                 </div>
//               </div>

//               {/* Progress Range Filters */}
//               <div className="space-y-3">
//                 <div className="text-sm font-medium text-gray-700">
//                   Progress Range (%)
//                 </div>
//                 <div className="grid grid-cols-2 gap-2">
//                   <Input
//                     type="number"
//                     placeholder="Min %"
//                     min="0"
//                     max="100"
//                     value={filters.minProgress || ""}
//                     onChange={(e) =>
//                       updateFilter(
//                         "minProgress",
//                         e.target.value ? Number(e.target.value) : undefined
//                       )
//                     }
//                     className="h-9"
//                   />
//                   <Input
//                     type="number"
//                     placeholder="Max %"
//                     min="0"
//                     max="100"
//                     value={filters.maxProgress || ""}
//                     onChange={(e) =>
//                       updateFilter(
//                         "maxProgress",
//                         e.target.value ? Number(e.target.value) : undefined
//                       )
//                     }
//                     className="h-9"
//                   />
//                 </div>
//               </div>

//               {/* Date Range Filters */}
//               <div className="space-y-3">
//                 <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                   <Calendar className="w-4 h-4" />
//                   Date Filters
//                 </div>

//                 <div className="space-y-2">
//                   <div className="text-xs font-medium text-gray-600">
//                     A.A Date Range
//                   </div>
//                   <div className="grid grid-cols-2 gap-2">
//                     <Input
//                       type="date"
//                       value={filters.startAADate || ""}
//                       onChange={(e) =>
//                         updateFilter("startAADate", e.target.value)
//                       }
//                       className="h-9 text-sm"
//                     />
//                     <Input
//                       type="date"
//                       value={filters.endAADate || ""}
//                       onChange={(e) =>
//                         updateFilter("endAADate", e.target.value)
//                       }
//                       className="h-9 text-sm"
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <div className="text-xs font-medium text-gray-600">
//                     FWO Date Range
//                   </div>
//                   <div className="grid grid-cols-2 gap-2">
//                     <Input
//                       type="date"
//                       value={filters.startFWODate || ""}
//                       onChange={(e) =>
//                         updateFilter("startFWODate", e.target.value)
//                       }
//                       className="h-9 text-sm"
//                     />
//                     <Input
//                       type="date"
//                       value={filters.endFWODate || ""}
//                       onChange={(e) =>
//                         updateFilter("endFWODate", e.target.value)
//                       }
//                       className="h-9 text-sm"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Clear Button */}
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
//         <div className="space-y-4">
//           <div className="w-full flex items-center justify-between">
//             {/* Search Bar */}
//             <div className="relative w-full sm:max-w-xs">
//               <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//               <Input
//                 type="text"
//                 placeholder="Search archive projects..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full"
//               />
//             </div>

//             {/* Basic Filters */}
//             <div className="flex flex-wrap gap-3 items-center">
//               <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
//                 <Filter className="w-4 h-4" />
//                 <span>Filters:</span>
//               </div>

//               <Select
//                 value={(filters.financialYear as string) || "all"}
//                 onValueChange={(value) => updateFilter("financialYear", value)}
//               >
//                 <SelectTrigger className="w-[140px] h-9">
//                   <SelectValue placeholder="Financial Year" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Years</SelectItem>
//                   {filterOptions?.financialYears?.map((year) => (
//                     <SelectItem key={year} value={year}>
//                       {year}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>

//               <Select
//                 value={(filters.progressStatus as string) || "all"}
//                 onValueChange={(value) => updateFilter("progressStatus", value)}
//               >
//                 <SelectTrigger className="w-[140px] h-9">
//                   <SelectValue placeholder="Progress" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Status</SelectItem>
//                   {filterOptions?.progressStatuses?.map((status) => (
//                     <SelectItem key={status} value={status}>
//                       {status}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>

//               <Select
//                 value={(filters.location as string) || "all"}
//                 onValueChange={(value) => updateFilter("location", value)}
//               >
//                 <SelectTrigger className="w-[120px] h-9">
//                   <SelectValue placeholder="Location" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Locations</SelectItem>
//                   {filterOptions?.locations?.map((location) => (
//                     <SelectItem key={location} value={location}>
//                       {location}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>

//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
//                 className="h-9 px-3 text-teal-600 border-teal-300"
//               >
//                 <Filter className="w-4 h-4 mr-1" />
//                 {showAdvancedFilters ? "Less" : "More"}
//               </Button>

//               {hasActiveFilters && (
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={clearFilters}
//                   className="h-9 px-3 text-gray-600 border-gray-300"
//                 >
//                   <X className="w-4 h-4 mr-1" />
//                   Clear
//                 </Button>
//               )}
//             </div>
//           </div>

//           {/* Advanced Filters - Desktop Expanded View */}
//           {showAdvancedFilters && (
//             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//                 <Select
//                   value={(filters.concernedEngineer as string) || "all"}
//                   onValueChange={(value) =>
//                     updateFilter("concernedEngineer", value)
//                   }
//                 >
//                   <SelectTrigger className="h-9">
//                     <SelectValue placeholder="Engineer" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Engineers</SelectItem>
//                     {filterOptions?.engineers?.map((engineer) => (
//                       <SelectItem key={engineer} value={engineer}>
//                         {engineer}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//                 <Input
//                   placeholder="Contractor Name"
//                   value={filters.nameOfContractor || ""}
//                   onChange={(e) =>
//                     updateFilter("nameOfContractor", e.target.value)
//                   }
//                   className="h-9"
//                 />

//                 <Input
//                   placeholder="Bill Number"
//                   value={filters.billNumber || ""}
//                   onChange={(e) => updateFilter("billNumber", e.target.value)}
//                   className="h-9"
//                 />

//                 <Input
//                   placeholder="A.A Number"
//                   value={filters.AANumber || ""}
//                   onChange={(e) => updateFilter("AANumber", e.target.value)}
//                   className="h-9"
//                 />

//                 <Input
//                   type="number"
//                   placeholder="Min Work Value"
//                   value={filters.minWorkValue || ""}
//                   onChange={(e) =>
//                     updateFilter(
//                       "minWorkValue",
//                       e.target.value ? Number(e.target.value) : undefined
//                     )
//                   }
//                   className="h-9"
//                 />

//                 <Input
//                   type="number"
//                   placeholder="Max Work Value"
//                   value={filters.maxWorkValue || ""}
//                   onChange={(e) =>
//                     updateFilter(
//                       "maxWorkValue",
//                       e.target.value ? Number(e.target.value) : undefined
//                     )
//                   }
//                   className="h-9"
//                 />

//                 <Input
//                   type="number"
//                   placeholder="Min Progress %"
//                   min="0"
//                   max="100"
//                   value={filters.minProgress || ""}
//                   onChange={(e) =>
//                     updateFilter(
//                       "minProgress",
//                       e.target.value ? Number(e.target.value) : undefined
//                     )
//                   }
//                   className="h-9"
//                 />

//                 <Input
//                   type="number"
//                   placeholder="Max Progress %"
//                   min="0"
//                   max="100"
//                   value={filters.maxProgress || ""}
//                   onChange={(e) =>
//                     updateFilter(
//                       "maxProgress",
//                       e.target.value ? Number(e.target.value) : undefined
//                     )
//                   }
//                   className="h-9"
//                 />
//               </div>

//               {/* Date Range Filters - Desktop */}
//               <div className="mt-4 pt-4 border-t border-gray-300">
//                 <div className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
//                   <Calendar className="w-4 h-4" />
//                   Date Range Filters
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                   <div className="space-y-2">
//                     <div className="text-xs font-medium text-gray-600">
//                       A.A Start Date
//                     </div>
//                     <Input
//                       type="date"
//                       value={filters.startAADate || ""}
//                       onChange={(e) =>
//                         updateFilter("startAADate", e.target.value)
//                       }
//                       className="h-9 text-sm"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <div className="text-xs font-medium text-gray-600">
//                       A.A End Date
//                     </div>
//                     <Input
//                       type="date"
//                       value={filters.endAADate || ""}
//                       onChange={(e) =>
//                         updateFilter("endAADate", e.target.value)
//                       }
//                       className="h-9 text-sm"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <div className="text-xs font-medium text-gray-600">
//                       FWO Start Date
//                     </div>
//                     <Input
//                       type="date"
//                       value={filters.startFWODate || ""}
//                       onChange={(e) =>
//                         updateFilter("startFWODate", e.target.value)
//                       }
//                       className="h-9 text-sm"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <div className="text-xs font-medium text-gray-600">
//                       FWO End Date
//                     </div>
//                     <Input
//                       type="date"
//                       value={filters.endFWODate || ""}
//                       onChange={(e) =>
//                         updateFilter("endFWODate", e.target.value)
//                       }
//                       className="h-9 text-sm"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

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
import useDebounce from "@/hooks/useDebounce";
import {
  ArchiveProjectFilters,
  ProgressStatus,
} from "@/types/archive-projects.types";
import { Calendar, Filter, Search, X } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";

// Types and Interfaces
interface FilterContextType {
  // Immediate states (for UI binding)
  searchQuery: string;
  localFilters: Partial<ArchiveProjectFilters>;

  // Debounced states (for API calls)
  debouncedSearchQuery: string;
  debouncedFilters: ArchiveProjectFilters;

  // Actions
  setSearchQuery: (query: string) => void;
  setLocalFilters: React.Dispatch<
    React.SetStateAction<Partial<ArchiveProjectFilters>>
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
  const [localFilters, setLocalFilters] = useState<
    Partial<ArchiveProjectFilters>
  >({
    financialYear: undefined,
    concernedEngineer: undefined,
    nameOfContractor: undefined,
    location: undefined,
    progressStatus: undefined,
    minWorkValue: undefined,
    maxWorkValue: undefined,
    minAAAmount: undefined,
    maxAAAmount: undefined,
    minProgress: undefined,
    maxProgress: undefined,
    startAADate: undefined,
    endAADate: undefined,
    startFWODate: undefined,
    endFWODate: undefined,
    billNumber: undefined,
    AANumber: undefined,
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
    setDebouncedFilters((prev) => ({
      ...prev,
      search: debouncedSearchQuery.trim() || undefined,
      ...debouncedLocalFilters,
      page: 1, // Reset to first page when filters change
    }));
  }, [debouncedSearchQuery, debouncedLocalFilters]);

  const clearFilters = () => {
    setSearchQuery("");
    setLocalFilters({
      financialYear: undefined,
      concernedEngineer: undefined,
      nameOfContractor: undefined,
      location: undefined,
      progressStatus: undefined,
      minWorkValue: undefined,
      maxWorkValue: undefined,
      minAAAmount: undefined,
      maxAAAmount: undefined,
      minProgress: undefined,
      maxProgress: undefined,
      startAADate: undefined,
      endAADate: undefined,
      startFWODate: undefined,
      endFWODate: undefined,
      billNumber: undefined,
      AANumber: undefined,
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

// Updated Main Archive Filters Component
export function ArchiveProjectFiltersComponent({
  filterOptions,
}: ArchiveProjectFiltersProps) {
  const {
    searchQuery, // Immediate state for input binding
    localFilters, // Immediate state for filter binding
    setSearchQuery,
    setLocalFilters,
    setDebouncedFilters,
    clearFilters,
    hasActiveFilters,
  } = useArchiveFilters();

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const updateFilter = (
    key: keyof ArchiveProjectFilters,
    value: string | number | string[] | undefined
  ) => {
    if (
      key === "page" ||
      key === "limit" ||
      key === "sortBy" ||
      key === "sortOrder"
    ) {
      // Pagination and sorting should be immediate (no debounce)
      setDebouncedFilters((prev) => ({
        ...prev,
        [key]: value === "all" ? undefined : value,
      }));
    } else {
      // Other filters should be debounced
      setLocalFilters((prev) => ({
        ...prev,
        [key]: value === "all" ? undefined : value,
      }));
    }
  };

  return (
    <div className="space-y-4">
      {/* Mobile and Tablet Layout */}
      <div className="lg:hidden space-y-3">
        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search archive projects..."
            value={searchQuery} // Bind to immediate state
            onChange={(e) => setSearchQuery(e.target.value)} // Updates immediately
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

        {/* Basic Filters */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <Filter className="w-4 h-4" />
              <span>Filters:</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="text-teal-600 hover:text-teal-700"
            >
              {showAdvancedFilters ? "Less Filters" : "More Filters"}
            </Button>
          </div>

          {/* Basic Filter Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              value={(localFilters.financialYear as string) || "all"}
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
              value={(localFilters.progressStatus as string) || "all"}
              onValueChange={(value) => updateFilter("progressStatus", value)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Progress Status" />
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
              value={(localFilters.concernedEngineer as string) || "all"}
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
              value={(localFilters.location as string) || "all"}
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
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="space-y-3 pt-2 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Contractor Filter */}
                <Input
                  placeholder="Contractor Name"
                  value={localFilters.nameOfContractor || ""} // Bind to immediate state
                  onChange={(e) =>
                    updateFilter("nameOfContractor", e.target.value)
                  }
                  className="h-9"
                />

                {/* Bill Number Filter */}
                <Input
                  placeholder="Bill Number"
                  value={localFilters.billNumber || ""} // Bind to immediate state
                  onChange={(e) => updateFilter("billNumber", e.target.value)}
                  className="h-9"
                />

                {/* AA Number Filter */}
                <Input
                  placeholder="A.A Number"
                  value={localFilters.AANumber || ""} // Bind to immediate state
                  onChange={(e) => updateFilter("AANumber", e.target.value)}
                  className="h-9"
                />
              </div>

              {/* Value Range Filters */}
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-700">
                  Work Value Range (₹)
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min Value"
                    value={localFilters.minWorkValue || ""} // Bind to immediate state
                    onChange={(e) =>
                      updateFilter(
                        "minWorkValue",
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    className="h-9"
                  />
                  <Input
                    type="number"
                    placeholder="Max Value"
                    value={localFilters.maxWorkValue || ""} // Bind to immediate state
                    onChange={(e) =>
                      updateFilter(
                        "maxWorkValue",
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    className="h-9"
                  />
                </div>
              </div>

              {/* Progress Range Filters */}
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-700">
                  Progress Range (%)
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min %"
                    min="0"
                    max="100"
                    value={localFilters.minProgress || ""} // Bind to immediate state
                    onChange={(e) =>
                      updateFilter(
                        "minProgress",
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    className="h-9"
                  />
                  <Input
                    type="number"
                    placeholder="Max %"
                    min="0"
                    max="100"
                    value={localFilters.maxProgress || ""} // Bind to immediate state
                    onChange={(e) =>
                      updateFilter(
                        "maxProgress",
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    className="h-9"
                  />
                </div>
              </div>

              {/* Date Range Filters */}
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date Filters
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-600">
                    A.A Date Range
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      value={localFilters.startAADate || ""} // Bind to immediate state
                      onChange={(e) =>
                        updateFilter("startAADate", e.target.value)
                      }
                      className="h-9 text-sm"
                    />
                    <Input
                      type="date"
                      value={localFilters.endAADate || ""} // Bind to immediate state
                      onChange={(e) =>
                        updateFilter("endAADate", e.target.value)
                      }
                      className="h-9 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-600">
                    FWO Date Range
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      value={localFilters.startFWODate || ""} // Bind to immediate state
                      onChange={(e) =>
                        updateFilter("startFWODate", e.target.value)
                      }
                      className="h-9 text-sm"
                    />
                    <Input
                      type="date"
                      value={localFilters.endFWODate || ""} // Bind to immediate state
                      onChange={(e) =>
                        updateFilter("endFWODate", e.target.value)
                      }
                      className="h-9 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Clear Button */}
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
        <div className="space-y-4">
          <div className="w-full flex items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search archive projects..."
                value={searchQuery} // Bind to immediate state
                onChange={(e) => setSearchQuery(e.target.value)} // Updates immediately
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full"
              />
            </div>

            {/* Basic Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Filter className="w-4 h-4" />
                <span>Filters:</span>
              </div>

              <Select
                value={(localFilters.financialYear as string) || "all"}
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
                value={(localFilters.progressStatus as string) || "all"}
                onValueChange={(value) => updateFilter("progressStatus", value)}
              >
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="Progress" />
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
                value={(localFilters.location as string) || "all"}
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

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="h-9 px-3 text-teal-600 border-teal-300"
              >
                <Filter className="w-4 h-4 mr-1" />
                {showAdvancedFilters ? "Less" : "More"}
              </Button>

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

          {/* Advanced Filters - Desktop Expanded View */}
          {showAdvancedFilters && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <Select
                  value={(localFilters.concernedEngineer as string) || "all"}
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

                <Input
                  placeholder="Contractor Name"
                  value={localFilters.nameOfContractor || ""} // Bind to immediate state
                  onChange={(e) =>
                    updateFilter("nameOfContractor", e.target.value)
                  }
                  className="h-9"
                />

                <Input
                  placeholder="Bill Number"
                  value={localFilters.billNumber || ""} // Bind to immediate state
                  onChange={(e) => updateFilter("billNumber", e.target.value)}
                  className="h-9"
                />

                <Input
                  placeholder="A.A Number"
                  value={localFilters.AANumber || ""} // Bind to immediate state
                  onChange={(e) => updateFilter("AANumber", e.target.value)}
                  className="h-9"
                />

                <Input
                  type="number"
                  placeholder="Min Work Value"
                  value={localFilters.minWorkValue || ""} // Bind to immediate state
                  onChange={(e) =>
                    updateFilter(
                      "minWorkValue",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="h-9"
                />

                <Input
                  type="number"
                  placeholder="Max Work Value"
                  value={localFilters.maxWorkValue || ""} // Bind to immediate state
                  onChange={(e) =>
                    updateFilter(
                      "maxWorkValue",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="h-9"
                />

                <Input
                  type="number"
                  placeholder="Min Progress %"
                  min="0"
                  max="100"
                  value={localFilters.minProgress || ""} // Bind to immediate state
                  onChange={(e) =>
                    updateFilter(
                      "minProgress",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="h-9"
                />

                <Input
                  type="number"
                  placeholder="Max Progress %"
                  min="0"
                  max="100"
                  value={localFilters.maxProgress || ""} // Bind to immediate state
                  onChange={(e) =>
                    updateFilter(
                      "maxProgress",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="h-9"
                />
              </div>

              {/* Date Range Filters - Desktop */}
              <div className="mt-4 pt-4 border-t border-gray-300">
                <div className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date Range Filters
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-600">
                      A.A Start Date
                    </div>
                    <Input
                      type="date"
                      value={localFilters.startAADate || ""} // Bind to immediate state
                      onChange={(e) =>
                        updateFilter("startAADate", e.target.value)
                      }
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-600">
                      A.A End Date
                    </div>
                    <Input
                      type="date"
                      value={localFilters.endAADate || ""} // Bind to immediate state
                      onChange={(e) =>
                        updateFilter("endAADate", e.target.value)
                      }
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-600">
                      FWO Start Date
                    </div>
                    <Input
                      type="date"
                      value={localFilters.startFWODate || ""} // Bind to immediate state
                      onChange={(e) =>
                        updateFilter("startFWODate", e.target.value)
                      }
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-600">
                      FWO End Date
                    </div>
                    <Input
                      type="date"
                      value={localFilters.endFWODate || ""} // Bind to immediate state
                      onChange={(e) =>
                        updateFilter("endFWODate", e.target.value)
                      }
                      className="h-9 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
