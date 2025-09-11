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
import { MeasurementBook } from "@/types/mb.types";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CheckCircle,
  Download,
  Eye,
  File,
  FileText,
  ImageIcon,
  MoreHorizontal,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useMBFilters } from "./filters";

// Types for sorting
export interface MBSortConfig {
  key: keyof MeasurementBook | "projectName" | "isApproved" | null;
  direction: "asc" | "desc";
}

// Props interfaces
interface MBTableProps {
  measurementBooks: MeasurementBook[];
  onViewMB: (mb: MeasurementBook) => void;
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
  sortKey: keyof MeasurementBook | "projectName" | "isApproved";
  sortConfig: MBSortConfig;
  onSort: (key: keyof MeasurementBook | "projectName" | "isApproved") => void;
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

  if (lowerType === "document") {
    return <FileText className="w-4 h-4 text-red-500" />;
  } else if (lowerType === "image") {
    return <ImageIcon className="w-4 h-4 text-blue-500" />;
  } else {
    return <File className="w-4 h-4 text-gray-500" />;
  }
}

// Approval Status Badge
function ApprovalBadge({ isApproved }: { isApproved: boolean }) {
  if (isApproved) {
    return (
      <div className="flex items-center space-x-1 text-green-600">
        <CheckCircle className="w-4 h-4" />
        <span className="text-xs font-medium">Approved</span>
      </div>
    );
  } else {
    return (
      <div className="flex items-center space-x-1 text-gray-500">
        <XCircle className="w-4 h-4" />
        <span className="text-xs font-medium">Pending</span>
      </div>
    );
  }
}

// Main Table Component
export function MBTable({
  measurementBooks,
  onViewMB,
  pagination,
  onPageChange,
  isLoading = false,
}: MBTableProps) {
  const {
    searchQuery,
    selectedCreator,
    selectedApprovalStatus,
    selectedFileType,
    hasActiveFilters,
  } = useMBFilters();
  const [sortConfig, setSortConfig] = useState<MBSortConfig>({
    key: null,
    direction: "asc",
  });

  // Handle sorting
  const handleSort = (
    key: keyof MeasurementBook | "projectName" | "isApproved"
  ) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Filter and sort measurement books (client-side filtering)
  const processedMBs = useMemo(() => {
    let result = [...measurementBooks];

    // Apply client-side search if present
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (mb) =>
          mb.description.toLowerCase().includes(query) ||
          (mb.remarks || "").toLowerCase().includes(query) ||
          (mb.project?.projectName || "").toLowerCase().includes(query) ||
          (mb.project?.workOrderNumber || "").toLowerCase().includes(query) ||
          mb.createdBy.name.toLowerCase().includes(query)
      );
    }

    // Apply creator filter
    if (selectedCreator !== "all") {
      result = result.filter((mb) => mb.createdBy.userId === selectedCreator);
    }

    // Apply approval status filter
    if (selectedApprovalStatus !== "all") {
      if (selectedApprovalStatus === "approved") {
        result = result.filter((mb) => mb.approvedBy);
      } else if (selectedApprovalStatus === "pending") {
        result = result.filter((mb) => !mb.approvedBy);
      }
    }

    // Apply file type filter
    if (selectedFileType !== "all") {
      result = result.filter(
        (mb) => mb.uploadedFile.fileType === selectedFileType
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue: unknown;
        let bValue: unknown;

        if (sortConfig.key === "projectName") {
          aValue = a.project?.projectName || "";
          bValue = b.project?.projectName || "";
        } else if (sortConfig.key === "isApproved") {
          aValue = !!a.approvedBy;
          bValue = !!b.approvedBy;
        } else {
          aValue = a[sortConfig.key as keyof MeasurementBook];
          bValue = b[sortConfig.key as keyof MeasurementBook];
        }

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
        if (sortConfig.key === "createdAt" || sortConfig.key === "updatedAt") {
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
  }, [
    measurementBooks,
    searchQuery,
    selectedCreator,
    selectedApprovalStatus,
    selectedFileType,
    sortConfig,
  ]);

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Handle file download
  const handleDownload = (mb: MeasurementBook) => {
    try {
      if (!mb || !mb.uploadedFile || !mb.uploadedFile.downloadURL) {
        console.error("Invalid file data for download");
        toast.error("File download URL not available");
        return;
      }

      const downloadUrl = mb.uploadedFile.downloadURL;
      const fileName =
        mb.uploadedFile.originalName || mb.uploadedFile.fileName || "download";

      // Create a temporary link element and trigger download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Downloading ${fileName}`);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    }
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
                  sortKey="projectName"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  className="w-64 px-6"
                >
                  Project
                </SortableTableHead>
                <SortableTableHead
                  sortKey="description"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  className="w-80 px-6"
                >
                  Description
                </SortableTableHead>
                {/* <TableHead className="px-6 font-semibold text-gray-900 w-32">
                  File
                </TableHead>
                <TableHead className="px-6 font-semibold text-gray-900 w-32">
                  Status
                </TableHead> */}
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
              {displayedMBs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-gray-500"
                  >
                    {hasActiveFilters
                      ? "No measurement books found matching your criteria."
                      : "No measurement books available."}
                  </TableCell>
                </TableRow>
              ) : (
                displayedMBs.map((mb, index) => {
                  console.log(mb);
                  return (
                    <TableRow key={mb._id} className="h-16 hover:bg-gray-50">
                      <TableCell className="px-6 font-medium">
                        {pagination
                          ? (pagination.currentPage - 1) * pagination.limit +
                            index +
                            1
                          : index + 1}
                      </TableCell>
                      <TableCell className="w-64 px-6">
                        <div className="flex flex-col items-start justify-center gap-1">
                          <div className="font-medium text-gray-900 text-sm">
                            {mb.project?._id || "No Project ID"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {mb.project?.projectName || "No Project Name"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="w-80 px-6">
                        <div className="text-sm text-gray-900 line-clamp-2">
                          {mb.description}
                        </div>
                        {mb.remarks && (
                          <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                            Remarks: {mb.remarks}
                          </div>
                        )}
                      </TableCell>
                      {/* <TableCell className="w-32 px-6">
                        <div className="flex items-center space-x-2">
                          <FileIcon fileType={mb.uploadedFile.fileType} />
                          <span className="text-xs text-gray-500">
                            {mb.humanReadableFileSize ||
                              `${(
                                mb.uploadedFile.fileSize /
                                (1024 * 1024)
                              ).toFixed(1)}MB`}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="w-32 px-6">
                        <ApprovalBadge isApproved={!!mb.approvedBy} />
                      </TableCell> */}
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
                              onClick={() => handleDownload(mb)}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download File
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
                  <div className="font-medium text-gray-900">
                    {mb.project?._id || "No Project ID"}
                  </div>
                  <div className="text-sm text-gray-500">{mb.description}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <ApprovalBadge isApproved={!!mb.approvedBy} />
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
                      <DropdownMenuItem onClick={() => handleDownload(mb)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download File
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="text-sm text-gray-900 line-clamp-3">
                {mb.description}
              </div>

              {mb.remarks && (
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  <strong>Remarks:</strong> {mb.remarks}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">File:</span>
                  <div className="flex items-center space-x-1 mt-1">
                    <FileIcon fileType={mb.uploadedFile.fileType} />
                    <span className="font-medium">
                      {mb.humanReadableFileSize ||
                        `${(mb.uploadedFile.fileSize / (1024 * 1024)).toFixed(
                          1
                        )}MB`}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Created:</span>
                  <div className="font-medium mt-1">
                    {formatDate(mb.createdAt)}
                  </div>
                  <div className="text-xs text-gray-500">
                    by {mb.createdBy.name}
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
                { length: pagination.totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => onPageChange(page)}
                    isActive={pagination.currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
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
