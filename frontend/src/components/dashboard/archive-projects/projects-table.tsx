// import { Button } from "@/components/ui/button";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import { Progress } from "@/components/ui/progress";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { cn } from "@/lib/utils";
// import {
//   ArchiveProjectFilters,
//   ArchiveProjectsPaginationMeta,
//   DbArchiveProject,
// } from "@/types/archive-projects.types";
// import { ArrowDown, ArrowUp, ArrowUpDown, Eye, FileText } from "lucide-react";
// import { useArchiveFilters } from "./project-filters";
// import { ProgressStatusBadge } from "./status-badge";

// // Props interfaces
// interface ArchiveProjectsTableProps {
//   projects: DbArchiveProject[];
//   pagination?: ArchiveProjectsPaginationMeta | null;
//   loading?: boolean;
//   onViewProject?: (project: DbArchiveProject) => void;
// }

// interface SortableTableHeadProps {
//   children: React.ReactNode;
//   sortKey: keyof DbArchiveProject;
//   currentSort: { key?: keyof DbArchiveProject; direction?: "asc" | "desc" };
//   onSort: (key: keyof DbArchiveProject) => void;
//   className?: string;
// }

// // Sortable Table Header Component
// function SortableTableHead({
//   children,
//   sortKey,
//   currentSort,
//   onSort,
//   className = "",
// }: SortableTableHeadProps) {
//   const getSortIcon = () => {
//     if (currentSort.key !== sortKey) {
//       return <ArrowUpDown className="w-4 h-4 ml-1 text-gray-400" />;
//     }
//     return currentSort.direction === "asc" ? (
//       <ArrowUp className="w-4 h-4 ml-1 text-gray-600" />
//     ) : (
//       <ArrowDown className="w-4 h-4 ml-1 text-gray-600" />
//     );
//   };

//   return (
//     <TableHead
//       className={cn(
//         "font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 select-none",
//         className
//       )}
//       onClick={() => onSort(sortKey)}
//     >
//       <div className="flex items-center">
//         {children}
//         {getSortIcon()}
//       </div>
//     </TableHead>
//   );
// }

// // Main Archive Projects Table Component
// export function ArchiveProjectsTable({
//   projects,
//   pagination,
//   loading = false,
//   onViewProject,
// }: ArchiveProjectsTableProps) {
//   const { searchQuery, filters, setFilters } = useArchiveFilters();

//   // Handle sorting
//   const handleSort = (key: keyof DbArchiveProject) => {
//     const currentDirection = filters.sortBy === key ? filters.sortOrder : "asc";
//     const newDirection = currentDirection === "asc" ? "desc" : "asc";

//     setFilters((prev) => ({
//       ...prev,
//       sortBy: key,
//       sortOrder: newDirection,
//       page: 1, // Reset to first page on sort
//     }));
//   };

//   // Handle pagination
//   const handlePageChange = (page: number) => {
//     setFilters((prev) => ({
//       ...prev,
//       page,
//     }));
//   };

//   // Format currency to lakhs
//   const formatToLakhsWithSuffix = (amount: number) => {
//     return `${(amount / 100000).toFixed(1)}L`;
//   };

//   // Format date for display
//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   // Calculate financial progress percentage
//   const calculateFinancialProgress = (
//     billAmount: number,
//     workValue: number
//   ) => {
//     return workValue > 0 ? Math.round((billAmount / workValue) * 100) : 0;
//   };

//   return (
//     <>
//       {/* Archive Projects Table - Desktop */}
//       <div className="hidden lg:block rounded-xl border border-gray-200">
//         <div className="overflow-x-auto">
//           <Table className="min-w-[1800px]">
//             <TableHeader className="sticky top-0 bg-white z-10">
//               <TableRow className="h-16">
//                 <TableHead className="px-4 font-semibold text-gray-900 w-12">
//                   #
//                 </TableHead>
//                 <SortableTableHead
//                   sortKey="nameOfWork"
//                   currentSort={{
//                     key: filters.sortBy,
//                     direction: filters.sortOrder,
//                   }}
//                   onSort={handleSort}
//                   className="w-64 px-4"
//                 >
//                   Work Name
//                 </SortableTableHead>
//                 <SortableTableHead
//                   sortKey="financialYear"
//                   currentSort={{
//                     key: filters.sortBy,
//                     direction: filters.sortOrder,
//                   }}
//                   onSort={handleSort}
//                   className="w-20 px-4 whitespace-nowrap"
//                 >
//                   FY
//                 </SortableTableHead>
//                 <SortableTableHead
//                   sortKey="AANumber"
//                   currentSort={{
//                     key: filters.sortBy,
//                     direction: filters.sortOrder,
//                   }}
//                   onSort={handleSort}
//                   className="w-32 px-4 whitespace-nowrap"
//                 >
//                   A.A Number
//                 </SortableTableHead>
//                 <SortableTableHead
//                   sortKey="AAAmount"
//                   currentSort={{
//                     key: filters.sortBy,
//                     direction: filters.sortOrder,
//                   }}
//                   onSort={handleSort}
//                   className="w-28 px-4 whitespace-nowrap"
//                 >
//                   A.A Amount
//                 </SortableTableHead>
//                 <SortableTableHead
//                   sortKey="AADated"
//                   currentSort={{
//                     key: filters.sortBy,
//                     direction: filters.sortOrder,
//                   }}
//                   onSort={handleSort}
//                   className="w-28 px-4 whitespace-nowrap"
//                 >
//                   A.A Date
//                 </SortableTableHead>
//                 <SortableTableHead
//                   sortKey="nameOfContractor"
//                   currentSort={{
//                     key: filters.sortBy,
//                     direction: filters.sortOrder,
//                   }}
//                   onSort={handleSort}
//                   className="w-40 px-4"
//                 >
//                   Contractor
//                 </SortableTableHead>
//                 <SortableTableHead
//                   sortKey="workValue"
//                   currentSort={{
//                     key: filters.sortBy,
//                     direction: filters.sortOrder,
//                   }}
//                   onSort={handleSort}
//                   className="w-28 px-4 whitespace-nowrap"
//                 >
//                   Work Value
//                 </SortableTableHead>
//                 <SortableTableHead
//                   sortKey="FWODate"
//                   currentSort={{
//                     key: filters.sortBy,
//                     direction: filters.sortOrder,
//                   }}
//                   onSort={handleSort}
//                   className="w-28 px-4 whitespace-nowrap"
//                 >
//                   FWO Date
//                 </SortableTableHead>
//                 <SortableTableHead
//                   sortKey="progress"
//                   currentSort={{
//                     key: filters.sortBy,
//                     direction: filters.sortOrder,
//                   }}
//                   onSort={handleSort}
//                   className="w-24 px-4 whitespace-nowrap"
//                 >
//                   Progress
//                 </SortableTableHead>
//                 <SortableTableHead
//                   sortKey="billNumber"
//                   currentSort={{
//                     key: filters.sortBy,
//                     direction: filters.sortOrder,
//                   }}
//                   onSort={handleSort}
//                   className="w-32 px-4 whitespace-nowrap"
//                 >
//                   Bill Number
//                 </SortableTableHead>
//                 <SortableTableHead
//                   sortKey="billSubmittedAmount"
//                   currentSort={{
//                     key: filters.sortBy,
//                     direction: filters.sortOrder,
//                   }}
//                   onSort={handleSort}
//                   className="w-28 px-4 whitespace-nowrap"
//                 >
//                   Bill Amount
//                 </SortableTableHead>
//                 <SortableTableHead
//                   sortKey="location"
//                   currentSort={{
//                     key: filters.sortBy,
//                     direction: filters.sortOrder,
//                   }}
//                   onSort={handleSort}
//                   className="w-28 px-4"
//                 >
//                   Location
//                 </SortableTableHead>
//                 <SortableTableHead
//                   sortKey="concernedEngineer"
//                   currentSort={{
//                     key: filters.sortBy,
//                     direction: filters.sortOrder,
//                   }}
//                   onSort={handleSort}
//                   className="w-36 px-4"
//                 >
//                   Engineer
//                 </SortableTableHead>
//                 <TableHead className="px-4 font-semibold text-gray-900 w-24">
//                   Actions
//                 </TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {loading ? (
//                 // Loading skeleton
//                 Array.from({ length: 5 }).map((_, index) => (
//                   <TableRow key={index} className="h-16">
//                     {Array.from({ length: 15 }).map((_, cellIndex) => (
//                       <TableCell key={cellIndex} className="px-4">
//                         <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 ))
//               ) : projects.length === 0 ? (
//                 <TableRow>
//                   <TableCell
//                     colSpan={15}
//                     className="text-center py-12 text-gray-500"
//                   >
//                     <div className="flex flex-col items-center space-y-2">
//                       <FileText className="w-12 h-12 text-gray-300" />
//                       <div className="text-lg font-medium">
//                         No archive projects found
//                       </div>
//                       <div className="text-sm">
//                         {searchQuery ||
//                         Object.keys(filters).some(
//                           (k) =>
//                             filters[k as keyof ArchiveProjectFilters] !==
//                               undefined &&
//                             k !== "page" &&
//                             k !== "limit" &&
//                             k !== "sortBy" &&
//                             k !== "sortOrder"
//                         )
//                           ? "Try adjusting your search or filters"
//                           : "No archive projects have been created yet"}
//                       </div>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 projects.map((project, index) => (
//                   <TableRow
//                     key={project._id}
//                     className="h-16 hover:bg-gray-50 transition-colors"
//                   >
//                     <TableCell className="px-4 font-medium text-gray-600 text-sm">
//                       {pagination ? pagination.skip + index + 1 : index + 1}
//                     </TableCell>

//                     <TableCell className="px-4">
//                       <div className="text-sm text-gray-900 leading-tight line-clamp-2">
//                         {project.nameOfWork}
//                       </div>
//                     </TableCell>

//                     <TableCell className="px-4">
//                       <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
//                         {project.financialYear}
//                       </div>
//                     </TableCell>

//                     <TableCell className="px-4">
//                       <div className="text-sm text-gray-900 whitespace-nowrap">
//                         {project.AANumber}
//                       </div>
//                     </TableCell>

//                     <TableCell className="px-4">
//                       <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
//                         ₹{formatToLakhsWithSuffix(project.AAAmount)}
//                       </div>
//                     </TableCell>

//                     <TableCell className="px-4">
//                       <div className="text-sm text-gray-900 whitespace-nowrap">
//                         {formatDate(project.AADated)}
//                       </div>
//                     </TableCell>

//                     <TableCell className="px-4">
//                       <div className="text-sm text-gray-900">
//                         {project.nameOfContractor}
//                       </div>
//                     </TableCell>

//                     <TableCell className="px-4">
//                       <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
//                         ₹{formatToLakhsWithSuffix(project.workValue)}
//                       </div>
//                     </TableCell>

//                     <TableCell className="px-4">
//                       <div className="text-sm text-gray-900 whitespace-nowrap">
//                         {formatDate(project.FWODate)}
//                       </div>
//                     </TableCell>

//                     <TableCell className="px-4">
//                       <div className="space-y-1">
//                         <ProgressStatusBadge
//                           status={project.progressStatus}
//                           progress={project.progress}
//                         />
//                         <Progress
//                           value={project.progress}
//                           className="w-16 h-1.5 [&>div]:bg-teal-600"
//                         />
//                       </div>
//                     </TableCell>

//                     <TableCell className="px-4">
//                       <div className="text-sm text-gray-900 whitespace-nowrap">
//                         {project.billNumber}
//                       </div>
//                     </TableCell>

//                     <TableCell className="px-4">
//                       <div className="space-y-1">
//                         <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
//                           ₹
//                           {formatToLakhsWithSuffix(project.billSubmittedAmount)}
//                         </div>
//                         <div className="text-xs text-gray-500 whitespace-nowrap">
//                           {calculateFinancialProgress(
//                             project.billSubmittedAmount,
//                             project.workValue
//                           )}
//                           % paid
//                         </div>
//                       </div>
//                     </TableCell>

//                     <TableCell className="px-4">
//                       <div className="text-sm text-gray-900">
//                         {project.location}
//                       </div>
//                     </TableCell>

//                     <TableCell className="px-4">
//                       <div className="text-sm text-gray-900">
//                         {project.concernedEngineer}
//                       </div>
//                     </TableCell>

//                     <TableCell className="px-4">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => onViewProject?.(project)}
//                         className="text-teal-600 border-teal-600 hover:bg-teal-50 hover:text-teal-700"
//                       >
//                         <Eye className="w-4 h-4 mr-1" />
//                         View
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </div>
//       </div>

//       {/* Archive Projects Table - Mobile & Tablet */}
//       <div className="lg:hidden rounded-lg border border-gray-200 bg-white">
//         <div className="overflow-x-auto">
//           <Table className="min-w-[1600px]">
//             <TableHeader className="sticky top-0 bg-white z-10">
//               <TableRow className="h-14">
//                 <TableHead className="px-3 font-semibold text-gray-900 min-w-[40px]">
//                   #
//                 </TableHead>
//                 <TableHead className="px-3 font-semibold text-gray-900 min-w-[200px]">
//                   Work Name
//                 </TableHead>
//                 <TableHead className="px-3 font-semibold text-gray-900 min-w-[60px] whitespace-nowrap">
//                   FY
//                 </TableHead>
//                 <TableHead className="px-3 font-semibold text-gray-900 min-w-[100px] whitespace-nowrap">
//                   A.A Number
//                 </TableHead>
//                 <TableHead className="px-3 font-semibold text-gray-900 min-w-[90px] whitespace-nowrap">
//                   A.A Amount
//                 </TableHead>
//                 <TableHead className="px-3 font-semibold text-gray-900 min-w-[90px] whitespace-nowrap">
//                   A.A Date
//                 </TableHead>
//                 <TableHead className="px-3 font-semibold text-gray-900 min-w-[120px]">
//                   Contractor
//                 </TableHead>
//                 <TableHead className="px-3 font-semibold text-gray-900 min-w-[90px] whitespace-nowrap">
//                   Work Value
//                 </TableHead>
//                 <TableHead className="px-3 font-semibold text-gray-900 min-w-[90px] whitespace-nowrap">
//                   FWO Date
//                 </TableHead>
//                 <TableHead className="px-3 font-semibold text-gray-900 min-w-[80px] whitespace-nowrap">
//                   Progress
//                 </TableHead>
//                 <TableHead className="px-3 font-semibold text-gray-900 min-w-[100px] whitespace-nowrap">
//                   Bill Number
//                 </TableHead>
//                 <TableHead className="px-3 font-semibold text-gray-900 min-w-[90px] whitespace-nowrap">
//                   Bill Amount
//                 </TableHead>
//                 <TableHead className="px-3 font-semibold text-gray-900 min-w-[80px]">
//                   Location
//                 </TableHead>
//                 <TableHead className="px-3 font-semibold text-gray-900 min-w-[100px]">
//                   Engineer
//                 </TableHead>
//                 <TableHead className="px-3 font-semibold text-gray-900 min-w-[80px]">
//                   Actions
//                 </TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {loading ? (
//                 Array.from({ length: 3 }).map((_, index) => (
//                   <TableRow key={index} className="h-16">
//                     {Array.from({ length: 15 }).map((_, cellIndex) => (
//                       <TableCell key={cellIndex} className="px-3">
//                         <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 ))
//               ) : projects.length === 0 ? (
//                 <TableRow>
//                   <TableCell
//                     colSpan={15}
//                     className="text-center py-12 text-gray-500"
//                   >
//                     <div className="flex flex-col items-center space-y-2">
//                       <FileText className="w-8 h-8 text-gray-300" />
//                       <div className="text-sm font-medium">
//                         No archive projects found
//                       </div>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 projects.map((project, index) => (
//                   <TableRow key={project._id} className="h-16 hover:bg-gray-50">
//                     <TableCell className="px-3 font-medium text-gray-600 text-sm">
//                       {pagination ? pagination.skip + index + 1 : index + 1}
//                     </TableCell>

//                     <TableCell className="px-3">
//                       <div className="text-xs text-gray-900 leading-tight line-clamp-2">
//                         {project.nameOfWork}
//                       </div>
//                     </TableCell>

//                     <TableCell className="px-3 text-xs whitespace-nowrap">
//                       {project.financialYear}
//                     </TableCell>

//                     <TableCell className="px-3 text-xs whitespace-nowrap">
//                       {project.AANumber}
//                     </TableCell>

//                     <TableCell className="px-3 text-xs font-medium whitespace-nowrap">
//                       ₹{formatToLakhsWithSuffix(project.AAAmount)}
//                     </TableCell>

//                     <TableCell className="px-3 text-xs whitespace-nowrap">
//                       {formatDate(project.AADated)}
//                     </TableCell>

//                     <TableCell className="px-3 text-xs">
//                       {project.nameOfContractor}
//                     </TableCell>

//                     <TableCell className="px-3 text-xs font-medium whitespace-nowrap">
//                       ₹{formatToLakhsWithSuffix(project.workValue)}
//                     </TableCell>

//                     <TableCell className="px-3 text-xs whitespace-nowrap">
//                       {formatDate(project.FWODate)}
//                     </TableCell>

//                     <TableCell className="px-3">
//                       <div className="space-y-1">
//                         <ProgressStatusBadge status={project.progressStatus} />
//                         <div className="text-xs text-center font-medium whitespace-nowrap">
//                           {project.progress}%
//                         </div>
//                       </div>
//                     </TableCell>

//                     <TableCell className="px-3 text-xs whitespace-nowrap">
//                       {project.billNumber}
//                     </TableCell>

//                     <TableCell className="px-3">
//                       <div className="space-y-1">
//                         <div className="text-xs font-medium whitespace-nowrap">
//                           ₹
//                           {formatToLakhsWithSuffix(project.billSubmittedAmount)}
//                         </div>
//                         <div className="text-xs text-gray-500 whitespace-nowrap">
//                           {calculateFinancialProgress(
//                             project.billSubmittedAmount,
//                             project.workValue
//                           )}
//                           %
//                         </div>
//                       </div>
//                     </TableCell>

//                     <TableCell className="px-3 text-xs">
//                       {project.location}
//                     </TableCell>

//                     <TableCell className="px-3 text-xs">
//                       {project.concernedEngineer}
//                     </TableCell>

//                     <TableCell className="px-3">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => onViewProject?.(project)}
//                         className="text-teal-600 border-teal-200 hover:bg-teal-50 text-xs px-2 py-1"
//                       >
//                         <Eye className="w-3 h-3 mr-1" />
//                         View
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </div>
//       </div>

//       {/* Pagination */}
//       {pagination && pagination.totalPages > 1 && (
//         <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
//           <p className="text-sm text-gray-700 text-center sm:text-left">
//             Showing {pagination.skip + 1} to{" "}
//             {Math.min(
//               pagination.skip + pagination.limit,
//               pagination.totalDocuments
//             )}{" "}
//             of {pagination.totalDocuments} archive projects
//           </p>
//           <Pagination className="flex items-center justify-center sm:justify-end">
//             <PaginationContent className="flex-wrap">
//               <PaginationItem>
//                 <PaginationPrevious
//                   onClick={() =>
//                     handlePageChange(Math.max(pagination.currentPage - 1, 1))
//                   }
//                   className={
//                     !pagination.hasPrevPage
//                       ? "pointer-events-none opacity-50"
//                       : "cursor-pointer"
//                   }
//                 />
//               </PaginationItem>

//               {Array.from(
//                 { length: Math.min(pagination.totalPages, 7) },
//                 (_, i) => {
//                   let pageNum;
//                   if (pagination.totalPages <= 7) {
//                     pageNum = i + 1;
//                   } else if (pagination.currentPage <= 4) {
//                     pageNum = i + 1;
//                   } else if (
//                     pagination.currentPage >=
//                     pagination.totalPages - 3
//                   ) {
//                     pageNum = pagination.totalPages - 6 + i;
//                   } else {
//                     pageNum = pagination.currentPage - 3 + i;
//                   }

//                   return (
//                     <PaginationItem key={pageNum}>
//                       <PaginationLink
//                         onClick={() => handlePageChange(pageNum)}
//                         isActive={pagination.currentPage === pageNum}
//                         className="cursor-pointer"
//                       >
//                         {pageNum}
//                       </PaginationLink>
//                     </PaginationItem>
//                   );
//                 }
//               )}

//               <PaginationItem>
//                 <PaginationNext
//                   onClick={() =>
//                     handlePageChange(
//                       Math.min(
//                         pagination.currentPage + 1,
//                         pagination.totalPages
//                       )
//                     )
//                   }
//                   className={
//                     !pagination.hasNextPage
//                       ? "pointer-events-none opacity-50"
//                       : "cursor-pointer"
//                   }
//                 />
//               </PaginationItem>
//             </PaginationContent>
//           </Pagination>
//         </div>
//       )}
//     </>
//   );
// }

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
import {
  ArchiveProjectsPaginationMeta,
  DbArchiveProject,
} from "@/types/archive-projects.types";
import { ArrowDown, ArrowUp, ArrowUpDown, Eye, FileText } from "lucide-react";
import { useArchiveFilters } from "./project-filters";
import { ProgressStatusBadge } from "./status-badge";

// Props interfaces
interface ArchiveProjectsTableProps {
  projects: DbArchiveProject[];
  pagination?: ArchiveProjectsPaginationMeta | null;
  loading?: boolean;
  onViewProject?: (project: DbArchiveProject) => void;
}

interface SortableTableHeadProps {
  children: React.ReactNode;
  sortKey: keyof DbArchiveProject;
  currentSort: { key?: keyof DbArchiveProject; direction?: "asc" | "desc" };
  onSort: (key: keyof DbArchiveProject) => void;
  className?: string;
}

// Sortable Table Header Component
function SortableTableHead({
  children,
  sortKey,
  currentSort,
  onSort,
  className = "",
}: SortableTableHeadProps) {
  const getSortIcon = () => {
    if (currentSort.key !== sortKey) {
      return <ArrowUpDown className="w-4 h-4 ml-1 text-gray-400" />;
    }
    return currentSort.direction === "asc" ? (
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

// Main Archive Projects Table Component
export function ArchiveProjectsTable({
  projects,
  pagination,
  loading = false,
  onViewProject,
}: ArchiveProjectsTableProps) {
  // Use the debounced filter system
  const { debouncedFilters, setDebouncedFilters, hasActiveFilters } =
    useArchiveFilters();

  // Handle sorting (immediate, no debounce needed)
  const handleSort = (key: keyof DbArchiveProject) => {
    const currentDirection =
      debouncedFilters.sortBy === key ? debouncedFilters.sortOrder : "asc";
    const newDirection = currentDirection === "asc" ? "desc" : "asc";

    setDebouncedFilters((prev) => ({
      ...prev,
      sortBy: key,
      sortOrder: newDirection,
      page: 1, // Reset to first page on sort
    }));
  };

  // Handle pagination (immediate, no debounce needed)
  const handlePageChange = (page: number) => {
    setDebouncedFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  // Format currency to lakhs
  const formatToLakhsWithSuffix = (amount: number) => {
    return `${(amount / 100000).toFixed(1)}L`;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Calculate financial progress percentage
  const calculateFinancialProgress = (
    billAmount: number,
    workValue: number
  ) => {
    return workValue > 0 ? Math.round((billAmount / workValue) * 100) : 0;
  };

  return (
    <>
      {/* Archive Projects Table - Desktop */}
      <div className="hidden lg:block rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <Table className="min-w-[1800px]">
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow className="h-16">
                <TableHead className="px-4 font-semibold text-gray-900 w-12">
                  #
                </TableHead>
                <SortableTableHead
                  sortKey="nameOfWork"
                  currentSort={{
                    key: debouncedFilters.sortBy,
                    direction: debouncedFilters.sortOrder,
                  }}
                  onSort={handleSort}
                  className="w-64 px-4"
                >
                  Work Name
                </SortableTableHead>
                <SortableTableHead
                  sortKey="financialYear"
                  currentSort={{
                    key: debouncedFilters.sortBy,
                    direction: debouncedFilters.sortOrder,
                  }}
                  onSort={handleSort}
                  className="w-20 px-4 whitespace-nowrap"
                >
                  FY
                </SortableTableHead>
                <SortableTableHead
                  sortKey="AANumber"
                  currentSort={{
                    key: debouncedFilters.sortBy,
                    direction: debouncedFilters.sortOrder,
                  }}
                  onSort={handleSort}
                  className="w-32 px-4 whitespace-nowrap"
                >
                  A.A Number
                </SortableTableHead>
                <SortableTableHead
                  sortKey="AAAmount"
                  currentSort={{
                    key: debouncedFilters.sortBy,
                    direction: debouncedFilters.sortOrder,
                  }}
                  onSort={handleSort}
                  className="w-28 px-4 whitespace-nowrap"
                >
                  A.A Amount
                </SortableTableHead>
                <SortableTableHead
                  sortKey="AADated"
                  currentSort={{
                    key: debouncedFilters.sortBy,
                    direction: debouncedFilters.sortOrder,
                  }}
                  onSort={handleSort}
                  className="w-28 px-4 whitespace-nowrap"
                >
                  A.A Date
                </SortableTableHead>
                <SortableTableHead
                  sortKey="nameOfContractor"
                  currentSort={{
                    key: debouncedFilters.sortBy,
                    direction: debouncedFilters.sortOrder,
                  }}
                  onSort={handleSort}
                  className="w-40 px-4"
                >
                  Contractor
                </SortableTableHead>
                <SortableTableHead
                  sortKey="workValue"
                  currentSort={{
                    key: debouncedFilters.sortBy,
                    direction: debouncedFilters.sortOrder,
                  }}
                  onSort={handleSort}
                  className="w-28 px-4 whitespace-nowrap"
                >
                  Work Value
                </SortableTableHead>
                <SortableTableHead
                  sortKey="FWODate"
                  currentSort={{
                    key: debouncedFilters.sortBy,
                    direction: debouncedFilters.sortOrder,
                  }}
                  onSort={handleSort}
                  className="w-28 px-4 whitespace-nowrap"
                >
                  FWO Date
                </SortableTableHead>
                <SortableTableHead
                  sortKey="progress"
                  currentSort={{
                    key: debouncedFilters.sortBy,
                    direction: debouncedFilters.sortOrder,
                  }}
                  onSort={handleSort}
                  className="w-24 px-4 whitespace-nowrap"
                >
                  Progress
                </SortableTableHead>
                <SortableTableHead
                  sortKey="billNumber"
                  currentSort={{
                    key: debouncedFilters.sortBy,
                    direction: debouncedFilters.sortOrder,
                  }}
                  onSort={handleSort}
                  className="w-32 px-4 whitespace-nowrap"
                >
                  Bill Number
                </SortableTableHead>
                <SortableTableHead
                  sortKey="billSubmittedAmount"
                  currentSort={{
                    key: debouncedFilters.sortBy,
                    direction: debouncedFilters.sortOrder,
                  }}
                  onSort={handleSort}
                  className="w-28 px-4 whitespace-nowrap"
                >
                  Bill Amount
                </SortableTableHead>
                <SortableTableHead
                  sortKey="location"
                  currentSort={{
                    key: debouncedFilters.sortBy,
                    direction: debouncedFilters.sortOrder,
                  }}
                  onSort={handleSort}
                  className="w-28 px-4"
                >
                  Location
                </SortableTableHead>
                <SortableTableHead
                  sortKey="concernedEngineer"
                  currentSort={{
                    key: debouncedFilters.sortBy,
                    direction: debouncedFilters.sortOrder,
                  }}
                  onSort={handleSort}
                  className="w-36 px-4"
                >
                  Engineer
                </SortableTableHead>
                <TableHead className="px-4 font-semibold text-gray-900 w-24">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} className="h-16">
                    {Array.from({ length: 15 }).map((_, cellIndex) => (
                      <TableCell key={cellIndex} className="px-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : projects.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={15}
                    className="text-center py-12 text-gray-500"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <FileText className="w-12 h-12 text-gray-300" />
                      <div className="text-lg font-medium">
                        No archive projects found
                      </div>
                      <div className="text-sm">
                        {hasActiveFilters
                          ? "Try adjusting your search or filters"
                          : "No archive projects have been created yet"}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project, index) => (
                  <TableRow
                    key={project._id}
                    className="h-16 hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="px-4 font-medium text-gray-600 text-sm">
                      {pagination ? pagination.skip + index + 1 : index + 1}
                    </TableCell>

                    <TableCell className="px-4">
                      <div className="text-sm text-gray-900 leading-tight line-clamp-2">
                        {project.nameOfWork}
                      </div>
                    </TableCell>

                    <TableCell className="px-4">
                      <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
                        {project.financialYear}
                      </div>
                    </TableCell>

                    <TableCell className="px-4">
                      <div className="text-sm text-gray-900 whitespace-nowrap">
                        {project.AANumber}
                      </div>
                    </TableCell>

                    <TableCell className="px-4">
                      <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
                        ₹{formatToLakhsWithSuffix(project.AAAmount)}
                      </div>
                    </TableCell>

                    <TableCell className="px-4">
                      <div className="text-sm text-gray-900 whitespace-nowrap">
                        {formatDate(project.AADated)}
                      </div>
                    </TableCell>

                    <TableCell className="px-4">
                      <div className="text-sm text-gray-900">
                        {project.nameOfContractor}
                      </div>
                    </TableCell>

                    <TableCell className="px-4">
                      <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
                        ₹{formatToLakhsWithSuffix(project.workValue)}
                      </div>
                    </TableCell>

                    <TableCell className="px-4">
                      <div className="text-sm text-gray-900 whitespace-nowrap">
                        {formatDate(project.FWODate)}
                      </div>
                    </TableCell>

                    <TableCell className="px-4">
                      <div className="space-y-1">
                        <ProgressStatusBadge
                          status={project.progressStatus}
                          progress={project.progress}
                        />
                        <Progress
                          value={project.progress}
                          className="w-16 h-1.5 [&>div]:bg-teal-600"
                        />
                      </div>
                    </TableCell>

                    <TableCell className="px-4">
                      <div className="text-sm text-gray-900 whitespace-nowrap">
                        {project.billNumber}
                      </div>
                    </TableCell>

                    <TableCell className="px-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
                          ₹
                          {formatToLakhsWithSuffix(project.billSubmittedAmount)}
                        </div>
                        <div className="text-xs text-gray-500 whitespace-nowrap">
                          {calculateFinancialProgress(
                            project.billSubmittedAmount,
                            project.workValue
                          )}
                          % paid
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-4">
                      <div className="text-sm text-gray-900">
                        {project.location}
                      </div>
                    </TableCell>

                    <TableCell className="px-4">
                      <div className="text-sm text-gray-900">
                        {project.concernedEngineer}
                      </div>
                    </TableCell>

                    <TableCell className="px-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewProject?.(project)}
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

      {/* Archive Projects Table - Mobile & Tablet */}
      <div className="lg:hidden rounded-lg border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <Table className="min-w-[1600px]">
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow className="h-14">
                <TableHead className="px-3 font-semibold text-gray-900 min-w-[40px]">
                  #
                </TableHead>
                <TableHead className="px-3 font-semibold text-gray-900 min-w-[200px]">
                  Work Name
                </TableHead>
                <TableHead className="px-3 font-semibold text-gray-900 min-w-[60px] whitespace-nowrap">
                  FY
                </TableHead>
                <TableHead className="px-3 font-semibold text-gray-900 min-w-[100px] whitespace-nowrap">
                  A.A Number
                </TableHead>
                <TableHead className="px-3 font-semibold text-gray-900 min-w-[90px] whitespace-nowrap">
                  A.A Amount
                </TableHead>
                <TableHead className="px-3 font-semibold text-gray-900 min-w-[90px] whitespace-nowrap">
                  A.A Date
                </TableHead>
                <TableHead className="px-3 font-semibold text-gray-900 min-w-[120px]">
                  Contractor
                </TableHead>
                <TableHead className="px-3 font-semibold text-gray-900 min-w-[90px] whitespace-nowrap">
                  Work Value
                </TableHead>
                <TableHead className="px-3 font-semibold text-gray-900 min-w-[90px] whitespace-nowrap">
                  FWO Date
                </TableHead>
                <TableHead className="px-3 font-semibold text-gray-900 min-w-[80px] whitespace-nowrap">
                  Progress
                </TableHead>
                <TableHead className="px-3 font-semibold text-gray-900 min-w-[100px] whitespace-nowrap">
                  Bill Number
                </TableHead>
                <TableHead className="px-3 font-semibold text-gray-900 min-w-[90px] whitespace-nowrap">
                  Bill Amount
                </TableHead>
                <TableHead className="px-3 font-semibold text-gray-900 min-w-[80px]">
                  Location
                </TableHead>
                <TableHead className="px-3 font-semibold text-gray-900 min-w-[100px]">
                  Engineer
                </TableHead>
                <TableHead className="px-3 font-semibold text-gray-900 min-w-[80px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <TableRow key={index} className="h-16">
                    {Array.from({ length: 15 }).map((_, cellIndex) => (
                      <TableCell key={cellIndex} className="px-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : projects.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={15}
                    className="text-center py-12 text-gray-500"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <FileText className="w-8 h-8 text-gray-300" />
                      <div className="text-sm font-medium">
                        No archive projects found
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project, index) => (
                  <TableRow key={project._id} className="h-16 hover:bg-gray-50">
                    <TableCell className="px-3 font-medium text-gray-600 text-sm">
                      {pagination ? pagination.skip + index + 1 : index + 1}
                    </TableCell>

                    <TableCell className="px-3">
                      <div className="text-xs text-gray-900 leading-tight line-clamp-2">
                        {project.nameOfWork}
                      </div>
                    </TableCell>

                    <TableCell className="px-3 text-xs whitespace-nowrap">
                      {project.financialYear}
                    </TableCell>

                    <TableCell className="px-3 text-xs whitespace-nowrap">
                      {project.AANumber}
                    </TableCell>

                    <TableCell className="px-3 text-xs font-medium whitespace-nowrap">
                      ₹{formatToLakhsWithSuffix(project.AAAmount)}
                    </TableCell>

                    <TableCell className="px-3 text-xs whitespace-nowrap">
                      {formatDate(project.AADated)}
                    </TableCell>

                    <TableCell className="px-3 text-xs">
                      {project.nameOfContractor}
                    </TableCell>

                    <TableCell className="px-3 text-xs font-medium whitespace-nowrap">
                      ₹{formatToLakhsWithSuffix(project.workValue)}
                    </TableCell>

                    <TableCell className="px-3 text-xs whitespace-nowrap">
                      {formatDate(project.FWODate)}
                    </TableCell>

                    <TableCell className="px-3">
                      <div className="space-y-1">
                        <ProgressStatusBadge status={project.progressStatus} />
                        <div className="text-xs text-center font-medium whitespace-nowrap">
                          {project.progress}%
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-3 text-xs whitespace-nowrap">
                      {project.billNumber}
                    </TableCell>

                    <TableCell className="px-3">
                      <div className="space-y-1">
                        <div className="text-xs font-medium whitespace-nowrap">
                          ₹
                          {formatToLakhsWithSuffix(project.billSubmittedAmount)}
                        </div>
                        <div className="text-xs text-gray-500 whitespace-nowrap">
                          {calculateFinancialProgress(
                            project.billSubmittedAmount,
                            project.workValue
                          )}
                          %
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-3 text-xs">
                      {project.location}
                    </TableCell>

                    <TableCell className="px-3 text-xs">
                      {project.concernedEngineer}
                    </TableCell>

                    <TableCell className="px-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewProject?.(project)}
                        className="text-teal-600 border-teal-200 hover:bg-teal-50 text-xs px-2 py-1"
                      >
                        <Eye className="w-3 h-3 mr-1" />
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

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <p className="text-sm text-gray-700 text-center sm:text-left">
            Showing {pagination.skip + 1} to{" "}
            {Math.min(
              pagination.skip + pagination.limit,
              pagination.totalDocuments
            )}{" "}
            of {pagination.totalDocuments} archive projects
          </p>
          <Pagination className="flex items-center justify-center sm:justify-end">
            <PaginationContent className="flex-wrap">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    handlePageChange(Math.max(pagination.currentPage - 1, 1))
                  }
                  className={
                    !pagination.hasPrevPage
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {Array.from(
                { length: Math.min(pagination.totalPages, 7) },
                (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 7) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage <= 4) {
                    pageNum = i + 1;
                  } else if (
                    pagination.currentPage >=
                    pagination.totalPages - 3
                  ) {
                    pageNum = pagination.totalPages - 6 + i;
                  } else {
                    pageNum = pagination.currentPage - 3 + i;
                  }

                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNum)}
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
                    handlePageChange(
                      Math.min(
                        pagination.currentPage + 1,
                        pagination.totalPages
                      )
                    )
                  }
                  className={
                    !pagination.hasNextPage
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
