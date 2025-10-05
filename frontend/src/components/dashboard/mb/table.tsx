"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DbArchiveProject } from "@/types/archive-projects.types";
import { DbMeasurementBook } from "@/types/mb.types";
import { DbProject } from "@/types/projects.types";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Download,
  Eye,
  FileText,
  MoreHorizontal,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useMBFilters } from "./filters";

export interface MBSortConfig {
  key: keyof DbMeasurementBook | "projectName" | null;
  direction: "asc" | "desc";
}

interface MBTableProps {
  measurementBooks: DbMeasurementBook[];
  onViewMB: (mb: DbMeasurementBook) => void;
  onDownloadMB?: (mb: DbMeasurementBook, format: "pdf" | "csv") => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
}

interface SortableTableHeadProps {
  children: React.ReactNode;
  sortKey: keyof DbMeasurementBook | "projectName";
  sortConfig: MBSortConfig;
  onSort: (key: keyof DbMeasurementBook | "projectName") => void;
  className?: string;
}

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
      <ArrowUp className="w-4 ml-1 text-gray-600" />
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

export function MBTable({
  measurementBooks,
  onViewMB,
  onDownloadMB,
  pagination,
  onPageChange,
  isLoading = false,
}: MBTableProps) {
  const { selectedCreator, selectedProjectType, hasActiveFilters } =
    useMBFilters();
  const [sortConfig, setSortConfig] = useState<MBSortConfig>({
    key: null,
    direction: "asc",
  });

  const handleSort = (key: keyof DbMeasurementBook | "projectName") => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const processedMBs = useMemo(() => {
    let result = [...measurementBooks];

    // Apply creator filter
    if (selectedCreator !== "all") {
      result = result.filter((mb) => mb.createdBy.userId === selectedCreator);
    }

    // Apply project type filter
    if (selectedProjectType !== "all") {
      result = result.filter((mb) => mb.projectType === selectedProjectType);
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue: unknown;
        let bValue: unknown;

        if (sortConfig.key === "projectName") {
          aValue =
            typeof a.project === "object"
              ? (a.project as DbProject).projectName ||
                (a.project as DbArchiveProject).nameOfWork ||
                ""
              : "";
          bValue =
            typeof b.project === "object"
              ? (b.project as DbProject).projectName ||
                (b.project as DbArchiveProject).nameOfWork ||
                ""
              : "";
        } else {
          aValue = a[sortConfig.key as keyof DbMeasurementBook];
          bValue = b[sortConfig.key as keyof DbMeasurementBook];
        }

        if (sortConfig.key === "createdBy") {
          aValue = a.createdBy.name;
          bValue = b.createdBy.name;
        }

        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return 1;
        if (bValue === undefined) return -1;

        if (sortConfig.key === "createdAt" || sortConfig.key === "updatedAt") {
          const aDate = new Date(aValue as string);
          const bDate = new Date(bValue as string);
          return sortConfig.direction === "asc"
            ? aDate.getTime() - bDate.getTime()
            : bDate.getTime() - aDate.getTime();
        }

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
  }, [measurementBooks, selectedCreator, selectedProjectType, sortConfig]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getProjectId = (project: DbProject | DbArchiveProject) => {
    if (typeof project === "object") {
      return project?.projectId || project?._id || "N/A";
    }
    return project || "N/A";
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 bg-gray-100 rounded animate-pulse"></div>
        ))}
      </div>
    );
  }

  const displayedMBs = pagination ? measurementBooks : processedMBs;

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block rounded-xl border border-gray-200">
        <div className="overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow className="h-16">
                <TableHead className="px-6 font-semibold text-gray-900 w-16">
                  #
                </TableHead>
                <SortableTableHead
                  sortKey="mbId"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  className="w-40 px-6"
                >
                  MB ID
                </SortableTableHead>

                <SortableTableHead
                  sortKey="mbNo"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  className="w-36 px-6"
                >
                  MB No.
                </SortableTableHead>
                <SortableTableHead
                  sortKey="nameOfWork"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  className="w-64 px-6"
                >
                  Name of Work
                </SortableTableHead>
                <TableHead className="px-6 font-semibold text-gray-900 w-56">
                  Project
                </TableHead>
                <SortableTableHead
                  sortKey="createdBy"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  className="w-40 px-6"
                >
                  Created By
                </SortableTableHead>
                <SortableTableHead
                  sortKey="createdAt"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  className="w-32 px-6"
                >
                  Date
                </SortableTableHead>
                <TableHead className="px-6 font-semibold text-gray-900 w-32">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedMBs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-gray-500"
                  >
                    {hasActiveFilters
                      ? "No measurement books found matching your criteria."
                      : "No measurement books available."}
                  </TableCell>
                </TableRow>
              ) : (
                displayedMBs.map((mb, index) => (
                  <TableRow key={mb._id} className="h-16 hover:bg-gray-50">
                    <TableCell className="px-6 font-medium">
                      {pagination
                        ? (pagination.currentPage - 1) * pagination.limit +
                          index +
                          1
                        : index + 1}
                    </TableCell>
                    <TableCell className="px-6">
                      <div className="font-medium text-teal-600">{mb.mbId}</div>
                    </TableCell>
                    <TableCell className="px-6">
                      <div className="font-medium text-gray-900">{mb.mbNo}</div>
                    </TableCell>
                    <TableCell className="px-6">
                      <div className="text-sm text-gray-900 line-clamp-2">
                        {mb.nameOfWork}
                      </div>
                    </TableCell>
                    <TableCell className="px-6">
                      <div className="flex flex-col gap-1">
                        <div className="text-xs font-medium text-gray-700">
                          {mb.projectType}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID:{" "}
                          {getProjectId(
                            mb.project as DbProject | DbArchiveProject
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6">
                      <div className="text-sm text-gray-900">
                        {mb.createdBy.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {mb.createdBy.role}
                      </div>
                    </TableCell>
                    <TableCell className="px-6">
                      <div className="text-sm text-gray-900">
                        {formatDate(mb.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="px-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onViewMB(mb)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {onDownloadMB && (
                            <>
                              <DropdownMenuItem
                                onClick={() => onDownloadMB(mb, "pdf")}
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Download as PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => onDownloadMB(mb, "csv")}
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                Download as CSV
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile Table */}
      <div className="lg:hidden space-y-4">
        {displayedMBs.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-white rounded-lg border">
            {hasActiveFilters
              ? "No measurement books found matching your criteria."
              : "No measurement books available."}
          </div>
        ) : (
          displayedMBs.map((mb) => (
            <div
              key={mb._id}
              className="bg-white rounded-lg border p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-teal-600">{mb.mbId}</div>
                  <div className="text-sm font-medium text-gray-900">
                    {mb.mbNo}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewMB(mb)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    {onDownloadMB && (
                      <>
                        <DropdownMenuItem
                          onClick={() => onDownloadMB(mb, "pdf")}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download as PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDownloadMB(mb, "csv")}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Download as CSV
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="text-sm text-gray-900">{mb.nameOfWork}</div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Project:</span>
                  <div className="font-medium mt-1">
                    {mb.projectType}
                    <div className="text-xs text-gray-500">
                      {getProjectId(mb.project as DbProject | DbArchiveProject)}
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Created:</span>
                  <div className="font-medium mt-1">{mb.createdBy.name}</div>
                  <div className="text-xs text-gray-500">
                    {formatDate(mb.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && onPageChange && (
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <p className="text-sm text-gray-700 text-center sm:text-left">
            Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
            {Math.min(
              pagination.currentPage * pagination.limit,
              pagination.totalCount
            )}{" "}
            of {pagination.totalCount} results
          </p>
          <Pagination className="flex items-center justify-center sm:justify-end">
            <PaginationContent className="flex-wrap">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    onPageChange(Math.max(pagination.currentPage - 1, 1))
                  }
                  className={
                    pagination.currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {Array.from(
                { length: Math.min(pagination.totalPages, 5) },
                (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (
                    pagination.currentPage >=
                    pagination.totalPages - 2
                  ) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.currentPage - 2 + i;
                  }
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => onPageChange(pageNum)}
                        isActive={pagination.currentPage === pageNum}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    onPageChange(
                      Math.min(
                        pagination.currentPage + 1,
                        pagination.totalPages
                      )
                    )
                  }
                  className={
                    pagination.currentPage === pagination.totalPages
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
