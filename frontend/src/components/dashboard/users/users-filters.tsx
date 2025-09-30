// src/components/dashboard/users/user-filters.tsx
"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { USER_ROLES } from "@/lib/rbac-config/constants";
import { Search } from "lucide-react";
import { createContext, ReactNode, useContext, useState } from "react";

interface UserFilters {
  designation: string;
}

interface FiltersContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: UserFilters;
  setFilters: (filters: UserFilters) => void;
  hasActiveFilters: boolean;
}

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

export const useFilters = () => {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error("useFilters must be used within FiltersProvider");
  }
  return context;
};

interface FiltersProviderProps {
  children: ReactNode;
}

export function FiltersProvider({ children }: FiltersProviderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<UserFilters>({
    designation: "all",
  });

  const hasActiveFilters =
    searchQuery.trim() !== "" || filters.designation !== "all";

  return (
    <FiltersContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
        hasActiveFilters,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
}

export function UserFilters() {
  const { searchQuery, setSearchQuery, filters, setFilters } = useFilters();

  const handleFilterChange = (key: keyof UserFilters, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search users by name, email, phone, user ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-11"
        />
      </div>

      {/* Filters Row */}
      <div className="text-sm text-gray-600 font-medium mb-2">Filters:</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 max-w-xs">
        {/* Designation Filter */}
        <Select
          value={filters.designation}
          onValueChange={(value) => handleFilterChange("designation", value)}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="All Designations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Designations</SelectItem>
            {Object.values(USER_ROLES).map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
