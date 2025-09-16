"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/auth-context";
import { DbProject } from "@/types/projects.types";
import {
  QUERY_CATEGORIES,
  QUERY_PRIORITIES,
  QUERY_STATUSES,
  QueryFilters,
  QueryStatistics,
  RaisedQuery,
} from "@/types/query.types";
import {
  formatDate,
  getCategoryColor,
  getDaysDifference,
  getProjectQueries,
  isQueryOverdue,
} from "@/utils/projects/queries";
import {
  AlertTriangle,
  ArrowUp,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  FileQuestion,
  Filter,
  MessageSquare,
  Search,
  User,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import UpdateQueryModal from "../update-query-modal";

interface ProjectQueriesTabProps {
  project: DbProject;
}

export default function ProjectQueriesTab({ project }: ProjectQueriesTabProps) {
  const [queries, setQueries] = useState<RaisedQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalQueries, setTotalQueries] = useState(0);
  const [statistics, setStatistics] = useState<QueryStatistics | null>(null);

  // Modal state
  const [selectedQuery, setSelectedQuery] = useState<RaisedQuery | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const { user } = useAuth();

  // Filter state with stable initial values
  const [filters, setFilters] = useState<
    QueryFilters & { page?: number; limit?: number }
  >(() => ({
    page: 1,
    limit: 10,
    status: undefined,
    priority: undefined,
    category: undefined,
    search: undefined,
    overdue: undefined,
  }));

  // Fetch queries with useCallback to prevent unnecessary re-renders
  const fetchQueries = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getProjectQueries(project._id as string, filters);

      setQueries(response.data.queries);
      setStatistics(response.data.statistics);
      setTotalPages(response.data.pagination.totalPages);
      setTotalQueries(response.data.pagination.totalItems);
      setCurrentPage(response.data.pagination.currentPage);
    } catch (error) {
      console.error("Error fetching queries:", error);
      toast.error("Failed to fetch queries");
    } finally {
      setLoading(false);
    }
  }, [project._id, filters]);

  useEffect(() => {
    fetchQueries();
  }, [fetchQueries]);

  // Handle filter changes with useCallback and proper state batching
  const handleFilterChange = useCallback(
    (key: string, value: string | boolean | undefined) => {
      setFilters((prev) => {
        const newFilters = {
          ...prev,
          [key]: value,
          page: 1, // Reset to first page when filters change
        };
        return newFilters;
      });
    },
    []
  );

  // Handle pagination with useCallback
  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  // Handle edit query with useCallback
  const handleEditQuery = useCallback((query: RaisedQuery) => {
    setSelectedQuery(query);
    setIsUpdateModalOpen(true);
  }, []);

  // Handle modal close and refresh with useCallback
  const handleModalClose = useCallback(() => {
    setIsUpdateModalOpen(false);
    setSelectedQuery(null);
  }, []);

  const handleQueryUpdated = useCallback(() => {
    fetchQueries(); // Refresh queries after update
    handleModalClose();
    toast.success("Query updated successfully");
  }, [fetchQueries, handleModalClose]);

  // Clear filters with useCallback
  const clearFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 10,
      status: undefined,
      priority: undefined,
      category: undefined,
      search: undefined,
      overdue: undefined,
    });
  }, []);

  if (loading && queries.length === 0) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Queries & Issues</h3>
          <div className="animate-pulse">
            <div className="h-6 w-24 bg-teal-200 rounded-full"></div>
          </div>
        </div>

        {/* Loading Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                  <div className="text-right">
                    <div className="w-16 h-8 bg-gray-200 rounded mb-2"></div>
                    <div className="w-20 h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="w-24 h-4 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading Content */}
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="relative mb-6">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-200 border-t-teal-600 mx-auto"></div>
                <div className="absolute inset-0 rounded-full border-4 border-teal-100"></div>
              </div>
              <p className="text-gray-600 font-medium">Loading queries...</p>
              <p className="text-gray-500 text-sm mt-1">
                Please wait while we fetch your data
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Queries & Issues</h3>
        <div className="flex gap-3">
          <Badge className="bg-teal-50 text-teal-700 border-teal-200 text-sm font-medium px-3 py-1">
            {totalQueries} Total Queries
          </Badge>
          {(statistics?.overdue ?? 0) > 0 && (
            <Badge className="bg-red-50 text-red-700 border-red-200 text-sm font-medium px-3 py-1">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {statistics?.overdue ?? 0} Overdue
            </Badge>
          )}
        </div>
      </div>

      {/* Query Statistics Overview */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Queries Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <FileQuestion className="h-5 w-5 text-teal-600" />
                <CardTitle className="text-sm">Total Queries</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600 mb-2">
                  {statistics.total}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div
                    className="bg-teal-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        (statistics.total / Math.max(statistics.total, 10)) *
                          100,
                        100
                      )}%`,
                    }}
                  />
                </div>
                <div className="text-xs text-gray-600">All time queries</div>
              </div>
            </CardContent>
          </Card>

          {/* Open/Active Queries Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-sm">Active Queries</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {(statistics.byStatus?.["Open"] || 0) +
                    (statistics.byStatus?.["In Progress"] || 0) +
                    (statistics.byStatus?.["Under Review"] || 0)}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        statistics.total > 0
                          ? Math.min(
                              (((statistics.byStatus?.["Open"] || 0) +
                                (statistics.byStatus?.["In Progress"] || 0) +
                                (statistics.byStatus?.["Under Review"] || 0)) /
                                statistics.total) *
                                100,
                              100
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <div className="text-xs text-gray-600">Pending resolution</div>
              </div>
            </CardContent>
          </Card>

          {/* Resolved Queries Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <CardTitle className="text-sm">Resolved Queries</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {(statistics.byStatus?.["Resolved"] || 0) +
                    (statistics.byStatus?.["Closed"] || 0)}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        statistics.total > 0
                          ? Math.min(
                              (((statistics.byStatus?.["Resolved"] || 0) +
                                (statistics.byStatus?.["Closed"] || 0)) /
                                statistics.total) *
                                100,
                              100
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <div className="text-xs text-gray-600">Completed queries</div>
              </div>
            </CardContent>
          </Card>

          {/* Overdue Queries Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <CardTitle className="text-sm">Overdue Queries</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {statistics.overdue || 0}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        statistics.total > 0
                          ? Math.min(
                              ((statistics.overdue || 0) / statistics.total) *
                                100,
                              100
                            )
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <div className="text-xs text-gray-600">Past due date</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-8 shadow-sm border-gray-200">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Filter className="h-5 w-5 text-teal-600" />
            </div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Filter Queries
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search queries..."
                value={filters.search || ""}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>

            {/* Status Filter */}
            <Select
              value={filters.status || "all"}
              onValueChange={(value) =>
                handleFilterChange(
                  "status",
                  value === "all" ? undefined : value
                )
              }
            >
              <SelectTrigger className="border-gray-300 focus:border-teal-500 focus:ring-teal-500">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {QUERY_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          status.value === "Open"
                            ? "bg-gray-400"
                            : status.value === "In Progress"
                            ? "bg-blue-500"
                            : status.value === "Under Review"
                            ? "bg-purple-500"
                            : status.value === "Resolved"
                            ? "bg-green-500"
                            : status.value === "Closed"
                            ? "bg-gray-500"
                            : "bg-red-500"
                        }`}
                      />
                      {status.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Priority Filter */}
            <Select
              value={filters.priority || "all"}
              onValueChange={(value) =>
                handleFilterChange(
                  "priority",
                  value === "all" ? undefined : value
                )
              }
            >
              <SelectTrigger className="border-gray-300 focus:border-teal-500 focus:ring-teal-500">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {QUERY_PRIORITIES.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          priority.value === "Low"
                            ? "bg-green-500"
                            : priority.value === "Medium"
                            ? "bg-yellow-500"
                            : priority.value === "High"
                            ? "bg-orange-500"
                            : "bg-red-500"
                        }`}
                      />
                      {priority.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select
              value={filters.category || "all"}
              onValueChange={(value) =>
                handleFilterChange(
                  "category",
                  value === "all" ? undefined : value
                )
              }
            >
              <SelectTrigger className="border-gray-300 focus:border-teal-500 focus:ring-teal-500">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {QUERY_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Overdue Filter */}
            <Select
              value={
                filters.overdue === undefined
                  ? "all"
                  : filters.overdue.toString()
              }
              onValueChange={(value) =>
                handleFilterChange(
                  "overdue",
                  value === "all" ? undefined : value === "true"
                )
              }
            >
              <SelectTrigger className="border-gray-300 focus:border-teal-500 focus:ring-teal-500">
                <SelectValue placeholder="Due Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Queries</SelectItem>
                <SelectItem value="true">Overdue Only</SelectItem>
                <SelectItem value="false">On Time</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button
              variant="outline"
              onClick={clearFilters}
              className="whitespace-nowrap border-gray-300 hover:bg-teal-50 hover:border-teal-500 hover:text-teal-700"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Queries List */}
      <div className="space-y-6">
        {queries.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
            <CardContent className="text-center py-12">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <FileQuestion className="h-8 w-8 text-gray-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                No Queries Found
              </h4>
              <p className="text-gray-600 max-w-md mx-auto mb-4">
                {Object.values(filters).some(
                  (v) => v !== undefined && v !== 1 && v !== 10
                )
                  ? "No queries match your current filters. Try adjusting the filters above to see more results."
                  : "No queries have been raised for this project yet. When queries are created, they will appear here."}
              </p>
              <div className="flex gap-3 justify-center">
                {Object.values(filters).some(
                  (v) => v !== undefined && v !== 1 && v !== 10
                ) && (
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="border-gray-300 hover:bg-teal-50 hover:border-teal-500 hover:text-teal-700"
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          queries.map((query) => {
            const queryResolver = user?.role === "JE";

            return (
              <Card
                key={`query-${query._id}-${query.queryId}`}
                className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-teal-500 bg-white"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-4">
                      {/* Header Row */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 flex-wrap mb-2">
                            <h4 className="font-bold text-gray-900 text-lg">
                              {query.queryTitle}
                            </h4>
                            {isQueryOverdue(
                              query.expectedResolutionDate,
                              query.status
                            ) && (
                              <Badge className="bg-red-100 text-red-800 border-red-300 text-xs font-medium">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Overdue
                              </Badge>
                            )}
                            {query.escalationLevel > 0 && (
                              <Badge className="bg-orange-100 text-orange-800 border-orange-300 text-xs font-medium">
                                <ArrowUp className="h-3 w-3 mr-1" />
                                Level {query.escalationLevel}
                              </Badge>
                            )}
                          </div>

                          {/* Query ID */}
                          <div className="text-sm text-gray-500 font-mono mb-3 bg-gray-50 inline-block px-2 py-1 rounded">
                            {query.queryId}
                          </div>
                        </div>

                        {/* Status Badges */}
                        <div className="flex flex-col gap-2 items-end">
                          <Badge
                            className={`text-xs font-medium px-3 py-1 ${
                              query.status === "Open"
                                ? "bg-gray-100 text-gray-800 border-gray-300"
                                : query.status === "In Progress"
                                ? "bg-blue-100 text-blue-800 border-blue-300"
                                : query.status === "Under Review"
                                ? "bg-purple-100 text-purple-800 border-purple-300"
                                : query.status === "Resolved"
                                ? "bg-green-100 text-green-800 border-green-300"
                                : query.status === "Closed"
                                ? "bg-gray-100 text-gray-600 border-gray-300"
                                : "bg-red-100 text-red-800 border-red-300"
                            }`}
                          >
                            {query.status}
                          </Badge>
                          <Badge
                            className={`text-xs font-medium px-3 py-1 ${
                              query.priority === "Low"
                                ? "bg-green-100 text-green-800 border-green-300"
                                : query.priority === "Medium"
                                ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                : query.priority === "High"
                                ? "bg-orange-100 text-orange-800 border-orange-300"
                                : "bg-red-100 text-red-800 border-red-300"
                            }`}
                          >
                            {query.priority}
                          </Badge>
                          <Badge
                            className={`text-xs font-medium px-3 py-1 ${getCategoryColor(
                              query.queryCategory
                            )}`}
                          >
                            {query.queryCategory}
                          </Badge>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border">
                        {query.queryDescription}
                      </div>

                      {/* Query Response (if exists) */}
                      {query.queryResponse && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-500 rounded-lg p-4">
                          <div className="flex items-center gap-2 text-sm font-semibold text-green-800 mb-2">
                            <CheckCircle className="h-4 w-4" />
                            Response:
                          </div>
                          <div className="text-green-700 text-sm leading-relaxed">
                            {query.queryResponse}
                          </div>
                        </div>
                      )}

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Raised By
                            </div>
                            <div className="text-sm font-semibold text-gray-900">
                              {query.raisedBy}
                            </div>
                          </div>
                        </div>

                        {query.assignedTo && (
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <User className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                Assigned To
                              </div>
                              <div className="text-sm font-semibold text-gray-900">
                                {query.assignedTo}
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Calendar className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Raised Date
                            </div>
                            <div className="text-sm font-semibold text-gray-900">
                              {formatDate(query.raisedDate)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              isQueryOverdue(
                                query.expectedResolutionDate,
                                query.status
                              )
                                ? "bg-red-100"
                                : "bg-orange-100"
                            }`}
                          >
                            <Clock
                              className={`h-4 w-4 ${
                                isQueryOverdue(
                                  query.expectedResolutionDate,
                                  query.status
                                )
                                  ? "text-red-600"
                                  : "text-orange-600"
                              }`}
                            />
                          </div>
                          <div>
                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Expected Resolution
                            </div>
                            <div
                              className={`text-sm font-semibold ${
                                isQueryOverdue(
                                  query.expectedResolutionDate,
                                  query.status
                                )
                                  ? "text-red-600"
                                  : "text-gray-900"
                              }`}
                            >
                              {formatDate(query.expectedResolutionDate)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Days info */}
                      <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          {query.daysSinceRaised ||
                            getDaysDifference(query.raisedDate)}{" "}
                          days since raised
                        </div>
                        <div
                          className={`flex items-center gap-1 ${
                            isQueryOverdue(
                              query.expectedResolutionDate,
                              query.status
                            )
                              ? "text-red-600 font-medium"
                              : ""
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              isQueryOverdue(
                                query.expectedResolutionDate,
                                query.status
                              )
                                ? "bg-red-400"
                                : "bg-green-400"
                            }`}
                          ></div>
                          {query.daysUntilDue !== undefined
                            ? query.daysUntilDue > 0
                              ? `${query.daysUntilDue} days until due`
                              : `${Math.abs(query.daysUntilDue)} days overdue`
                            : getDaysDifference(query.expectedResolutionDate) >
                              0
                            ? `${getDaysDifference(
                                query.expectedResolutionDate
                              )} days until due`
                            : `${Math.abs(
                                getDaysDifference(query.expectedResolutionDate)
                              )} days overdue`}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    {queryResolver && (
                      <div className="ml-6">
                        <Button
                          onClick={() => handleEditQuery(query)}
                          disabled={
                            query.status === "Resolved" ||
                            query.status === "Closed"
                          }
                          className="bg-teal-600 hover:bg-teal-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                          size="sm"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Update
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 font-medium">
                Showing {(currentPage - 1) * (filters.limit || 10) + 1} to{" "}
                {Math.min(currentPage * (filters.limit || 10), totalQueries)} of{" "}
                {totalQueries} queries
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="border-gray-300 hover:bg-teal-50 hover:border-teal-500 hover:text-teal-700"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={`page-${page}`}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-8 p-0 ${
                          currentPage === page
                            ? "bg-teal-600 hover:bg-teal-700 border-teal-600 text-white"
                            : "border-gray-300 hover:bg-teal-50 hover:border-teal-500 hover:text-teal-700"
                        }`}
                      >
                        {page}
                      </Button>
                    );
                  })}
                  {totalPages > 5 && (
                    <span className="text-gray-400 text-sm px-2">...</span>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="border-gray-300 hover:bg-teal-50 hover:border-teal-500 hover:text-teal-700"
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Update Query Modal */}
      {selectedQuery && (
        <UpdateQueryModal
          isOpen={isUpdateModalOpen}
          onClose={handleModalClose}
          query={selectedQuery}
          onUpdateSuccess={handleQueryUpdated}
        />
      )}
    </div>
  );
}
