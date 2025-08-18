import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DbProject } from "@/types/projects.types";
import { ArrowDown, ArrowUp, ArrowUpDown, Eye } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useFilters } from "./project-filters";
import { SortConfig } from "./projects-container";
import { StatusBadge } from "./status-badge";

// Props interfaces
interface ProjectsTableProps {
  projects: DbProject[];
  onViewProject: (project: DbProject) => void;
}

interface SortableTableHeadProps {
  children: React.ReactNode;
  sortKey: keyof DbProject;
  sortConfig: SortConfig;
  onSort: (key: keyof DbProject) => void;
  className?: string;
}

// Sortable Table Header Component
function SortableTableHead({
  children,
  sortKey,
  sortConfig,
  onSort,
  className = "",
}: SortableTableHeadProps) {
  const getSortIcon = () => {
    if (sortConfig.key !== sortKey) {
      return <ArrowUpDown className="w-4 h-4 ml-1 text-gray-400" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="w-4 h-4 ml-1 text-gray-600" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1 text-gray-600" />
    );
  };

  return (
    <TableHead
      className={cn(
        "font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 select-none",
        className
      )}
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center">
        {children}
        {getSortIcon()}
      </div>
    </TableHead>
  );
}

// Main Table Component
export function ProjectsTable({ projects, onViewProject }: ProjectsTableProps) {
  const { searchQuery, filters, hasActiveFilters } = useFilters();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });

  const ITEMS_PER_PAGE = 5;

  // Handle sorting
  const handleSort = (key: keyof DbProject) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Filter, search, and sort projects
  const processedProjects = useMemo(() => {
    let result = [...projects];

    // Apply filters
    if (filters.status && filters.status !== "all") {
      result = result.filter((project) => project.status === filters.status);
    }
    if (filters.district && filters.district !== "all") {
      result = result.filter(
        (project) => project.district === filters.district
      );
    }

    // Apply search
    if (searchQuery.trim()) {
      result = result.filter(
        (project) =>
          project.projectName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          project.projectId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.typeOfWork
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          project.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.executingDepartment
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          project.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof DbProject];
        const bValue = b[sortConfig.key as keyof DbProject];

        // Handle undefined values: undefined is considered greater (sorted last)
        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return 1;
        if (bValue === undefined) return -1;

        // Special handling for date sorting
        if (sortConfig.key === "createdAt") {
          const aDate = new Date(aValue as string);
          const bDate = new Date(bValue as string);
          return sortConfig.direction === "asc"
            ? aDate.getTime() - bDate.getTime()
            : bDate.getTime() - aDate.getTime();
        }

        // Handle objects (e.g., { high, medium, low }) by converting to string for comparison
        const aComparable =
          typeof aValue === "object" ? JSON.stringify(aValue) : aValue;
        const bComparable =
          typeof bValue === "object" ? JSON.stringify(bValue) : bValue;

        if (aComparable < bComparable) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aComparable > bComparable) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [projects, searchQuery, filters, sortConfig]);

  // Pagination calculations
  const totalPages = Math.ceil(processedProjects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProjects = processedProjects.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Format budget to lakhs with suffix
  const formatToLakhsWithSuffix = (budget: number) => {
    return `${budget / 100000}L`;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Reset to first page when filters/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  return (
    <>
      {/* Projects Table - Desktop */}
      <div className="hidden lg:block rounded-xl border border-gray-200">
        <div className="overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow className="h-20">
                <TableHead className="px-6 font-semibold text-gray-900 w-16">
                  #
                </TableHead>
                <SortableTableHead
                  sortKey="projectName"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  className="w-80 px-6"
                >
                  Project Name
                </SortableTableHead>
                <SortableTableHead
                  sortKey="createdAt"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  className="w-72 px-6"
                >
                  Created At
                </SortableTableHead>
                <SortableTableHead
                  sortKey="district"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  className="w-48 px-6"
                >
                  District
                </SortableTableHead>
                <SortableTableHead
                  sortKey="typeOfWork"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  className="w-52 px-6"
                >
                  Type
                </SortableTableHead>
                <SortableTableHead
                  sortKey="status"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  className="w-44 px-6"
                >
                  Status
                </SortableTableHead>
                <SortableTableHead
                  sortKey="progress"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  className="w-36 px-6"
                >
                  Progress
                </SortableTableHead>
                <SortableTableHead
                  sortKey="estimatedCost"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  className="w-44 px-6"
                >
                  Budget (₹L)
                </SortableTableHead>
                <SortableTableHead
                  sortKey="executingDepartment"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  className="w-64 px-6"
                >
                  Executing Dept
                </SortableTableHead>
                <TableHead className="px-6 font-semibold text-gray-900 w-32">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProjects.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="text-center py-8 text-gray-500"
                  >
                    {hasActiveFilters
                      ? "No projects found matching your criteria."
                      : "No projects available."}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedProjects.map((project, index) => {
                  return (
                    <TableRow
                      key={project.projectId}
                      className="h-20 hover:bg-gray-50"
                    >
                      <TableCell className="px-6 font-medium">
                        {startIndex + index + 1}
                      </TableCell>
                      <TableCell className="w-80 px-6">
                        <div className="flex flex-col items-start justify-center gap-2">
                          <div className="font-medium text-gray-900">
                            {project.projectName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {project.projectId}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="w-72 px-6">
                        <div className="flex flex-col gap-1">
                          <div className="text-sm text-gray-900 whitespace-nowrap">
                            {formatDate(project.createdAt)}
                          </div>
                          <div className="text-xs text-gray-500">
                            by {project.createdBy}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="w-48 px-6">
                        {project.district}
                      </TableCell>
                      <TableCell className="w-52 px-6">
                        {project.typeOfWork}
                      </TableCell>
                      <TableCell className="w-44 px-6">
                        <StatusBadge status={project.status} />
                      </TableCell>
                      <TableCell className="w-36 px-6">
                        <div className="flex items-center space-x-3">
                          <Progress
                            value={project.progress}
                            className="w-20 [&>div]:bg-teal-600"
                          />
                          <span className="text-sm font-medium min-w-[3rem]">
                            {project.progress}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="w-44 px-6">
                        ₹{formatToLakhsWithSuffix(project.estimatedCost)}
                      </TableCell>
                      <TableCell className="w-64 px-6">
                        {project.executingDepartment}
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewProject(project)}
                            className="text-teal-600 border-teal-600 hover:bg-teal-50 hover:text-teal-700"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Projects Table - Mobile & Tablet */}
      <div className="lg:hidden rounded-lg border border-gray-200 bg-white">
        <div className="overflow-x-auto overflow-y-auto">
          <Table className="min-w-[1400px]">
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow className="h-20">
                <TableHead className="px-6 font-semibold text-gray-900 min-w-[60px]">
                  #
                </TableHead>
                <TableHead className="px-6 font-semibold text-gray-900 min-w-[280px]">
                  Project Name
                </TableHead>
                <TableHead className="px-6 font-semibold text-gray-900 min-w-[140px]">
                  District
                </TableHead>
                <TableHead className="px-6 font-semibold text-gray-900 min-w-[160px]">
                  Type
                </TableHead>
                <TableHead className="px-6 font-semibold text-gray-900 min-w-[120px]">
                  Status
                </TableHead>
                <TableHead className="px-6 font-semibold text-gray-900 min-w-[140px]">
                  Progress
                </TableHead>
                <TableHead className="px-6 font-semibold text-gray-900 min-w-[120px]">
                  Budget (₹L)
                </TableHead>
                <TableHead className="px-6 font-semibold text-gray-900 min-w-[220px]">
                  Created At
                </TableHead>
                <TableHead className="px-6 font-semibold text-gray-900 min-w-[200px]">
                  Executing Dept
                </TableHead>
                <TableHead className="px-6 font-semibold text-gray-900 min-w-[140px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProjects.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="text-center py-8 text-gray-500"
                  >
                    {hasActiveFilters
                      ? "No projects found matching your criteria."
                      : "No projects available."}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedProjects.map((project, index) => {
                  return (
                    <TableRow
                      key={project.projectId}
                      className="h-20 hover:bg-gray-50"
                    >
                      <TableCell className="px-6 font-medium">
                        {startIndex + index + 1}
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="flex flex-col items-start justify-center gap-2">
                          <div className="font-medium text-gray-900 text-sm">
                            {project.projectName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {project.projectId}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 text-sm">
                        {project.district}
                      </TableCell>
                      <TableCell className="px-6 text-sm">
                        {project.typeOfWork}
                      </TableCell>
                      <TableCell className="px-6">
                        <StatusBadge status={project.status} />
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="flex flex-col space-y-2">
                          <Progress
                            value={project.progress}
                            className="w-20 [&>div]:bg-teal-600"
                          />
                          <span className="text-xs font-medium">
                            {project.progress}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 font-medium text-sm">
                        ₹{formatToLakhsWithSuffix(project.estimatedCost)}
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="flex flex-col gap-1">
                          <div className="text-xs font-medium text-gray-900 whitespace-nowrap">
                            {formatDate(project.createdAt)}
                          </div>
                          <div className="text-xs text-gray-500">
                            by {project.createdBy}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 text-sm">
                        {project.executingDepartment}
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="flex flex-col space-y-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewProject(project)}
                            className="text-blue-600 border-blue-200 hover:bg-blue-50 text-xs px-3 py-2"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <p className="text-sm text-gray-700 text-center sm:text-left">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, processedProjects.length)} of{" "}
            {processedProjects.length} results
          </p>
          <Pagination className="flex items-center justify-center sm:justify-end">
            <PaginationContent className="flex-wrap">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}
