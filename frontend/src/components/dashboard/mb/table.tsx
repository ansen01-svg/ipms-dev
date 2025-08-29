// frontend/src/components/dashboard/measurement-books/mb-table.tsx

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { MeasurementBook } from "@/types/mb.types";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Download,
  Edit,
  Eye,
  File,
  FileText,
  ImageIcon,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useMBFilters } from "./filters";
import { MBStatusBadge } from "./status-badge";

// Types for sorting
export interface MBSortConfig {
  key: keyof MeasurementBook | null;
  direction: "asc" | "desc";
}

// Props interfaces
interface MBTableProps {
  measurementBooks: MeasurementBook[];
  onViewMB: (mb: MeasurementBook) => void;
  onEditMB: (mb: MeasurementBook) => void;
  onDeleteMB: (mb: MeasurementBook) => void;
  isLoading?: boolean;
}

interface SortableTableHeadProps {
  children: React.ReactNode;
  sortKey: keyof MeasurementBook;
  sortConfig: MBSortConfig;
  onSort: (key: keyof MeasurementBook) => void;
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

// File icon component
function FileIcon({ fileType }: { fileType: string }) {
  const lowerType = fileType.toLowerCase();

  if (lowerType === "pdf") {
    return <FileText className="w-4 h-4 text-red-500" />;
  } else if (["jpg", "jpeg", "png"].includes(lowerType)) {
    return <ImageIcon className="w-4 h-4 text-blue-500" />;
  } else {
    return <File className="w-4 h-4 text-gray-500" />;
  }
}

// Main Table Component
export function MBTable({
  measurementBooks,
  onViewMB,
  onEditMB,
  onDeleteMB,
  isLoading = false,
}: MBTableProps) {
  const { searchQuery, filters, hasActiveFilters } = useMBFilters();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<MBSortConfig>({
    key: null,
    direction: "asc",
  });

  const ITEMS_PER_PAGE = 10;

  // Handle sorting
  const handleSort = (key: keyof MeasurementBook) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Filter, search, and sort measurement books
  const processedMBs = useMemo(() => {
    let result = [...measurementBooks];

    console.log(result);

    // Apply filters
    if (filters.status && filters.status !== "all") {
      result = result.filter((mb) => mb.status === filters.status);
    }
    if (filters.fileType && filters.fileType !== "all") {
      result = result.filter(
        (mb) => mb.uploadedFile.fileType === filters.fileType
      );
    }

    // Apply search
    if (searchQuery.trim()) {
      result = result.filter(
        (mb) =>
          mb.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mb.mbNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mb.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (mb.contractorName || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          mb.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mb.createdBy.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue: unknown = a[sortConfig.key as keyof MeasurementBook];
        let bValue: unknown = b[sortConfig.key as keyof MeasurementBook];

        // Handle nested objects
        if (sortConfig.key === "createdBy") {
          aValue = a.createdBy.name;
          bValue = b.createdBy.name;
        }

        // Handle undefined values
        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return 1;
        if (bValue === undefined) return -1;

        // Special handling for date sorting
        if (
          sortConfig.key === "createdAt" ||
          sortConfig.key === "measurementDate"
        ) {
          const aDate = new Date(aValue as string);
          const bDate = new Date(bValue as string);
          return sortConfig.direction === "asc"
            ? aDate.getTime() - bDate.getTime()
            : bDate.getTime() - aDate.getTime();
        }

        // Handle objects by converting to string
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
  }, [measurementBooks, searchQuery, filters, sortConfig]);

  // Pagination calculations
  const totalPages = Math.ceil(processedMBs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMBs = processedMBs.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
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

  return (
    <>
      {/* MB Table - Desktop */}
      <div className="hidden lg:block rounded-xl border border-gray-200">
        <div className="overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow className="h-16">
                <TableHead className="px-6 font-semibold text-gray-900 w-16">
                  #
                </TableHead>
                <SortableTableHead
                  sortKey="title"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  className="w-80 px-6"
                >
                  Title & MB Number
                </SortableTableHead>
                <SortableTableHead
                  sortKey="measurementDate"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  className="w-40 px-6"
                >
                  Measurement Date
                </SortableTableHead>
                <SortableTableHead
                  sortKey="contractorName"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  className="w-48 px-6"
                >
                  Contractor
                </SortableTableHead>
                <SortableTableHead
                  sortKey="status"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  className="w-32 px-6"
                >
                  Status
                </SortableTableHead>
                <TableHead className="w-32 px-6 font-semibold text-gray-900">
                  File
                </TableHead>
                <SortableTableHead
                  sortKey="createdAt"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  className="w-48 px-6"
                >
                  Created
                </SortableTableHead>
                <TableHead className="px-6 font-semibold text-gray-900 w-32">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMBs.length === 0 ? (
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
                paginatedMBs.map((mb, index) => {
                  console.log(mb.uploadedFile.fileName);
                  const fileUrl = `http://localhost:5000/${mb.uploadedFile.filePath}`;
                  return (
                    <TableRow key={mb._id} className="h-16 hover:bg-gray-50">
                      <TableCell className="px-6 font-medium">
                        {startIndex + index + 1}
                      </TableCell>
                      <TableCell className="w-80 px-6">
                        <div className="flex flex-col items-start justify-center gap-1">
                          <div className="font-medium text-gray-900 text-sm">
                            {mb.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {mb.mbNumber}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="w-40 px-6 text-sm">
                        {formatDate(mb.measurementDate)}
                      </TableCell>
                      <TableCell className="w-48 px-6 text-sm">
                        {mb.contractorName || "N/A"}
                      </TableCell>
                      <TableCell className="w-32 px-6">
                        <MBStatusBadge status={mb.status} />
                      </TableCell>
                      <TableCell className="w-32 px-6">
                        <div className="flex items-center space-x-2">
                          <FileIcon fileType={mb.uploadedFile.fileType} />
                          <div className="text-xs text-gray-500">
                            {mb.humanReadableFileSize}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="w-48 px-6">
                        <div className="flex flex-col gap-1">
                          <div className="text-sm text-gray-900">
                            {formatDate(mb.createdAt)}
                          </div>
                          <div className="text-xs text-gray-500">
                            by {mb.createdBy.name}
                          </div>
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
                            <DropdownMenuItem
                              onClick={() => window.open(fileUrl, "_blank")}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download File
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onEditMB(mb)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onDeleteMB(mb)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* MB Table - Mobile & Tablet */}
      <div className="lg:hidden space-y-4">
        {paginatedMBs.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-white rounded-lg border">
            {hasActiveFilters
              ? "No measurement books found matching your criteria."
              : "No measurement books available."}
          </div>
        ) : (
          paginatedMBs.map((mb) => (
            <div
              key={mb._id}
              className="bg-white rounded-lg border p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{mb.title}</div>
                  <div className="text-sm text-gray-500">{mb.mbNumber}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <MBStatusBadge status={mb.status} />
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
                      <DropdownMenuItem
                        onClick={() => window.open(mb.fileUrl, "_blank")}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download File
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEditMB(mb)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDeleteMB(mb)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Measurement Date:</span>
                  <div className="font-medium">
                    {formatDate(mb.measurementDate)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Contractor:</span>
                  <div className="font-medium">
                    {mb.contractorName || "N/A"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">File:</span>
                  <div className="flex items-center space-x-1">
                    <FileIcon fileType={mb.uploadedFile.fileType} />
                    <span className="font-medium">
                      {mb.humanReadableFileSize}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Created:</span>
                  <div className="font-medium">{formatDate(mb.createdAt)}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <p className="text-sm text-gray-700 text-center sm:text-left">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, processedMBs.length)} of{" "}
            {processedMBs.length} results
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
