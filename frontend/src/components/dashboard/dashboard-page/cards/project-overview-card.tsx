import { useDashboardKPIs } from "@/hooks/useDashboardData";
import {
  AlertTriangle,
  Archive,
  CheckCircle,
  Clock,
  DollarSign,
  FolderOpen,
  Target,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { KPICard } from "./KPI-card";

export const ProjectOverviewCards: React.FC = () => {
  const dashboardParams = useMemo(
    () => ({
      includeArchive: "true",
    }),
    []
  );

  const { data, isLoading } = useDashboardKPIs(dashboardParams);
  const [showArchive, setShowArchive] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-32 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const overview = data?.data?.projectOverview || {};
  const archiveOverview = data?.data?.archiveOverview || null;
  const hasArchiveData = Boolean(archiveOverview);

  const CurrentProjectCards = () => (
    <>
      <KPICard
        title="Total Projects"
        value={overview.totalProjects || 0}
        icon={FolderOpen}
        colorScheme="purple"
        subtitle="All active projects"
      />

      <KPICard
        title="Ongoing Projects"
        value={overview.ongoing || 0}
        icon={Clock}
        colorScheme="orange"
        subtitle="In progress"
      />

      <KPICard
        title="Completed"
        value={overview.completed || 0}
        icon={CheckCircle}
        colorScheme="red"
        subtitle="Successfully finished"
      />

      <KPICard
        title="Needs Attention"
        value={overview.overdue || 0}
        icon={AlertTriangle}
        colorScheme="green"
        subtitle="Overdue projects"
      />
    </>
  );

  const ArchiveProjectCards = () => (
    <>
      <KPICard
        title="Archive Projects"
        value={archiveOverview?.totalProjects || 0}
        icon={Archive}
        colorScheme="purple"
        subtitle="Historical projects"
      />

      <KPICard
        title="Archive Completed"
        value={archiveOverview?.completed || 0}
        icon={CheckCircle}
        colorScheme="green"
        subtitle="Successfully finished"
      />

      <KPICard
        title="Total Archive Value"
        value={`₹${((archiveOverview?.totalValue || 0) / 10000000).toFixed(
          1
        )}Cr`}
        icon={DollarSign}
        colorScheme="blue"
        subtitle="Total project value"
      />

      <KPICard
        title="Avg Progress"
        value={`${archiveOverview?.avgProgress || 0}%`}
        icon={Target}
        colorScheme="orange"
        subtitle={`Financial: ${archiveOverview?.avgFinancialProgress || 0}%`}
      />
    </>
  );

  // const CombinedView = () => (
  //   <>
  //     {/* Current Projects Row */}
  //     <div className="col-span-full">
  //       <h3 className="text-sm font-medium text-gray-600 mb-3">
  //         Current Projects
  //       </h3>
  //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  //         <KPICard
  //           title="Total Active"
  //           value={overview.totalProjects || 0}
  //           icon={FolderOpen}
  //           colorScheme="teal"
  //           subtitle="Current portfolio"
  //         />

  //         <KPICard
  //           title="Ongoing"
  //           value={overview.ongoing || 0}
  //           icon={Clock}
  //           colorScheme="blue"
  //           subtitle="In progress"
  //         />
  //       </div>
  //     </div>

  //     {/* Archive Projects Row */}
  //     <div className="col-span-full">
  //       <h3 className="text-sm font-medium text-gray-600 mb-3 mt-6">
  //         Historical Projects
  //       </h3>
  //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  //         <KPICard
  //           title="Archive Total"
  //           value={archiveOverview?.totalProjects || 0}
  //           icon={Archive}
  //           colorScheme="purple"
  //           subtitle="Historical projects"
  //         />

  //         <KPICard
  //           title="Archive Value"
  //           value={`₹${((archiveOverview?.totalValue || 0) / 10000000).toFixed(
  //             1
  //           )}Cr`}
  //           icon={DollarSign}
  //           colorScheme="blue"
  //           subtitle="Total archive value"
  //         />
  //       </div>
  //     </div>
  //   </>
  // );

  return (
    <div className="space-y-4">
      {/* Toggle Controls - only show if archive data exists */}
      {hasArchiveData && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <div className="flex gap-1 bg-blue-50 rounded-lg p-1">
            <button
              onClick={() => setShowArchive(false)}
              className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                !showArchive
                  ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-sm"
                  : ""
              }`}
            >
              Current Projects
            </button>
            <button
              onClick={() => setShowArchive(true)}
              className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                showArchive
                  ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-sm"
                  : ""
              }`}
            >
              Archive Projects
            </button>
          </div>

          {/* Summary Stats */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600 sm:ml-auto">
            <span>Active: {overview.totalProjects || 0}</span>
            {hasArchiveData && (
              <span>Archive: {archiveOverview.totalProjects || 0}</span>
            )}
          </div>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {hasArchiveData ? (
          showArchive ? (
            <ArchiveProjectCards />
          ) : (
            <CurrentProjectCards />
          )
        ) : (
          <CurrentProjectCards />
        )}
      </div>

      {/* Combined View Option - uncomment if you prefer this approach */}
      {/* {hasArchiveData && (
        <div className="mt-8">
          <CombinedView />
        </div>
      )} */}
    </div>
  );
};
