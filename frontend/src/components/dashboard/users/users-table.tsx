// src/components/dashboard/users/users-table.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  User,
  downloadUsersCsv,
  generateUsersCsvContent,
} from "@/utils/users/fetch-users";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CheckCircle2,
  Download,
  Eye,
  UserIcon,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DesignationBadge } from "./designation-badge";
import { UserDetailModal } from "./user-details-modal";
import { useFilters } from "./users-filters";

export interface SortConfig {
  key: keyof User | null;
  direction: "asc" | "desc";
}

interface UsersTableProps {
  users: User[];
  onUserUpdate?: () => void;
}

interface SortableTableHeadProps {
  children: React.ReactNode;
  sortKey: keyof User;
  sortConfig: SortConfig;
  onSort: (key: keyof User) => void;
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

function UserAvatar({ user }: { user: User }) {
  const [imageError, setImageError] = useState(false);

  if (user.avatar && !imageError) {
    return (
      <Image
        src={user.avatar}
        alt={user.fullName}
        width={32}
        height={32}
        className="w-8 h-8 rounded-full object-cover"
        onError={() => setImageError(true)}
        unoptimized
      />
    );
  }

  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
      {user.fullName?.charAt(0).toUpperCase() || "U"}
    </div>
  );
}

export function UsersTable({ users }: UsersTableProps) {
  const { searchQuery, filters, hasActiveFilters } = useFilters();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "createdAt",
    direction: "desc",
  });
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const ITEMS_PER_PAGE = 10;

  // Process users with filters, search, and sort
  const processedUsers = useMemo(() => {
    let result = [...users];

    // Apply filters
    if (filters.designation && filters.designation !== "all") {
      result = result.filter(
        (user) => user.designation === filters.designation
      );
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          user.fullName?.toLowerCase().includes(query) ||
          user.username?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          user.phoneNumber?.includes(query) ||
          user.userId?.toLowerCase().includes(query) ||
          user.departmentName?.toLowerCase().includes(query) ||
          user.officeLocation?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof User];
        const bValue = b[sortConfig.key as keyof User];

        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return 1;
        if (bValue === undefined) return -1;

        // Handle date sorting
        if (
          sortConfig.key === "createdAt" ||
          sortConfig.key === "updatedAt" ||
          sortConfig.key === "lastPasswordChange"
        ) {
          const aDate = new Date(aValue as string);
          const bDate = new Date(bValue as string);
          return sortConfig.direction === "asc"
            ? aDate.getTime() - bDate.getTime()
            : bDate.getTime() - aDate.getTime();
        }

        // Handle boolean sorting
        if (typeof aValue === "boolean" && typeof bValue === "boolean") {
          return sortConfig.direction === "asc"
            ? (aValue ? 1 : 0) - (bValue ? 1 : 0)
            : (bValue ? 1 : 0) - (aValue ? 1 : 0);
        }

        // Handle string/number sorting
        const aComparable =
          typeof aValue === "string" ? aValue.toLowerCase() : aValue;
        const bComparable =
          typeof bValue === "string" ? bValue.toLowerCase() : bValue;

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
  }, [users, searchQuery, filters, sortConfig]);

  // Reset to first page when filters/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  // Clear selection when processed users change
  useEffect(() => {
    setSelectedRows(new Set());
  }, [processedUsers.length]);

  // Pagination
  const totalPages = Math.ceil(processedUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = processedUsers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleRowSelect = useCallback((userId: string, checked: boolean) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(userId);
      } else {
        newSet.delete(userId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedRows(new Set(paginatedUsers.map((user) => user._id)));
      } else {
        setSelectedRows(new Set());
      }
    },
    [paginatedUsers]
  );

  const handleSort = (key: keyof User) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const selectedUsers = useMemo(
    () => processedUsers.filter((user) => selectedRows.has(user._id)),
    [processedUsers, selectedRows]
  );

  const isAllSelected =
    paginatedUsers.length > 0 &&
    paginatedUsers.every((user) => selectedRows.has(user._id));
  const isPartiallySelected =
    paginatedUsers.some((user) => selectedRows.has(user._id)) && !isAllSelected;

  const handleExportCsv = useCallback(() => {
    if (selectedUsers.length === 0) return;

    const csvContent = generateUsersCsvContent(selectedUsers);
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    const filename = `users-export-${timestamp}.csv`;

    downloadUsersCsv(csvContent, filename);
  }, [selectedUsers]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      {/* Selection Summary and Export Controls */}
      {processedUsers.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 mb-4">
          <div className="flex flex-col space-y-3 sm:hidden">
            <div className="text-sm text-gray-700 text-center">
              {selectedRows.size > 0 ? (
                <span className="font-medium">
                  {selectedRows.size} of {processedUsers.length} users selected
                </span>
              ) : (
                <span>Select users to export data</span>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              {selectedRows.size > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRows(new Set())}
                  className="w-full text-gray-600 hover:text-gray-800"
                >
                  Clear Selection
                </Button>
              )}
              <Button
                onClick={handleExportCsv}
                disabled={selectedRows.size === 0}
                className={cn(
                  "flex items-center justify-center space-x-2 w-full",
                  selectedRows.size === 0
                    ? "bg-gradient-to-r from-teal-400 to-teal-500 text-white cursor-not-allowed"
                    : "bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-700 hover:to-teal-800"
                )}
              >
                <Download className="w-4 h-4" />
                <span>Export CSV ({selectedRows.size})</span>
              </Button>
            </div>
          </div>

          <div className="hidden sm:flex sm:flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="text-sm text-gray-700">
                {selectedRows.size > 0 ? (
                  <span className="font-medium">
                    {selectedRows.size} of {processedUsers.length} users
                    selected
                  </span>
                ) : (
                  <span>Select users to export data</span>
                )}
              </div>
              {selectedRows.size > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRows(new Set())}
                  className="text-gray-600 hover:text-gray-800 w-full sm:w-auto"
                >
                  Clear Selection
                </Button>
              )}
            </div>
            <Button
              onClick={handleExportCsv}
              disabled={selectedRows.size === 0}
              className={cn(
                "flex items-center justify-center space-x-2 w-full sm:w-auto",
                selectedRows.size === 0
                  ? "bg-gradient-to-r from-teal-400 to-teal-500 text-white cursor-not-allowed"
                  : "bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-700 hover:to-teal-800"
              )}
            >
              <Download className="w-4 h-4" />
              <span>Export CSV ({selectedRows.size})</span>
            </Button>
          </div>
        </div>
      )}

      {/* Users Table - Desktop */}
      <div className="hidden lg:block rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10">
              <TableRow className="h-16">
                <TableHead className="px-4 w-12">
                  <Checkbox
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el && "indeterminate" in el) {
                        (el as HTMLInputElement).indeterminate =
                          isPartiallySelected;
                      }
                    }}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead className="px-4 font-semibold text-gray-900 w-12">
                  #
                </TableHead>
                <SortableTableHead
                  sortKey="fullName"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  className="px-4 min-w-[200px]"
                >
                  Full Name
                </SortableTableHead>
                <SortableTableHead
                  sortKey="email"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  className="px-4 min-w-[200px]"
                >
                  Email
                </SortableTableHead>
                <SortableTableHead
                  sortKey="phoneNumber"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  className="px-4 min-w-[140px]"
                >
                  Phone
                </SortableTableHead>
                <SortableTableHead
                  sortKey="designation"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  className="px-4 min-w-[120px]"
                >
                  Designation
                </SortableTableHead>
                <SortableTableHead
                  sortKey="isFirstLogin"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  className="px-4 min-w-[120px]"
                >
                  Status
                </SortableTableHead>
                <SortableTableHead
                  sortKey="createdAt"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  className="px-4 min-w-[130px]"
                >
                  Created At
                </SortableTableHead>
                <TableHead className="px-4 font-semibold text-gray-900 w-24">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={11}
                    className="text-center py-12 text-gray-500"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <UserIcon className="w-12 h-12 text-gray-300" />
                      <div className="text-lg font-medium">No users found</div>
                      <div className="text-sm">
                        {hasActiveFilters
                          ? "Try adjusting your search or filters"
                          : "No users have been created yet"}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user, index) => (
                  <TableRow
                    key={user._id}
                    className={cn(
                      "h-16 hover:bg-gray-50 transition-colors",
                      selectedRows.has(user._id) && "bg-blue-50"
                    )}
                  >
                    <TableCell className="px-4">
                      <Checkbox
                        checked={selectedRows.has(user._id)}
                        onCheckedChange={(checked) =>
                          handleRowSelect(user._id, checked as boolean)
                        }
                        aria-label={`Select user ${index + 1}`}
                      />
                    </TableCell>
                    <TableCell className="px-4 font-medium text-gray-600 text-sm">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell className="px-4">
                      <div className="flex items-center space-x-3">
                        <UserAvatar user={user} />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.fullName || "N/A"}
                          </div>
                          <div className="text-xs text-gray-500">
                            @{user.username}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </TableCell>
                    <TableCell className="px-4">
                      <div className="text-sm text-gray-900">
                        {user.phoneNumber}
                      </div>
                    </TableCell>
                    <TableCell className="px-4">
                      <DesignationBadge designation={user.designation} />
                    </TableCell>

                    <TableCell className="px-4">
                      <div className="flex items-center">
                        {user.isFirstLogin ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <XCircle className="w-3 h-3 mr-1" />
                            Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Active
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4">
                      <div className="text-sm text-gray-900">
                        {formatDate(user.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="px-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewUser(user)}
                        className="text-teal-600 border-teal-600 hover:bg-teal-50 hover:text-teal-700"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Users Table - Mobile & Tablet */}
      <div className="lg:hidden rounded-lg border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <Table className="min-w-[1200px]">
            <TableHeader>
              <TableRow>
                <TableHead className="px-3 w-12">
                  <Checkbox
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el)
                        (el as HTMLInputElement).indeterminate =
                          isPartiallySelected;
                    }}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="px-3 font-semibold text-gray-900 min-w-[40px]">
                  #
                </TableHead>
                <TableHead className="px-3 font-semibold text-gray-900 min-w-[180px]">
                  Name
                </TableHead>
                <TableHead className="px-3 font-semibold text-gray-900 min-w-[180px]">
                  Email
                </TableHead>
                <TableHead className="px-3 font-semibold text-gray-900 min-w-[120px]">
                  Phone
                </TableHead>
                <TableHead className="px-3 font-semibold text-gray-900 min-w-[100px]">
                  Designation
                </TableHead>
                <TableHead className="px-3 font-semibold text-gray-900 min-w-[140px]">
                  Department
                </TableHead>
                <TableHead className="px-3 font-semibold text-gray-900 min-w-[100px]">
                  Status
                </TableHead>
                <TableHead className="px-3 font-semibold text-gray-900 min-w-[80px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-12 text-gray-500"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <UserIcon className="w-8 h-8 text-gray-300" />
                      <div className="text-sm font-medium">No users found</div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user, index) => (
                  <TableRow
                    key={user._id}
                    className={cn(
                      "hover:bg-gray-50",
                      selectedRows.has(user._id) && "bg-blue-50"
                    )}
                  >
                    <TableCell className="px-3">
                      <Checkbox
                        checked={selectedRows.has(user._id)}
                        onCheckedChange={(checked) =>
                          handleRowSelect(user._id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="px-3 text-sm">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell className="px-3">
                      <div className="text-xs font-medium">{user.fullName}</div>
                      <div className="text-xs text-gray-500">
                        @{user.username}
                      </div>
                    </TableCell>
                    <TableCell className="px-3 text-xs">{user.email}</TableCell>
                    <TableCell className="px-3 text-xs">
                      {user.phoneNumber}
                    </TableCell>
                    <TableCell className="px-3">
                      <DesignationBadge designation={user.designation} />
                    </TableCell>
                    <TableCell className="px-3 text-xs">
                      {user.departmentName}
                    </TableCell>
                    <TableCell className="px-3">
                      {user.isFirstLogin ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewUser(user)}
                        className="text-xs"
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
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
            {Math.min(startIndex + ITEMS_PER_PAGE, processedUsers.length)} of{" "}
            {processedUsers.length} results
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

      {/* User Detail Modal */}
      <UserDetailModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
      />
    </>
  );
}
