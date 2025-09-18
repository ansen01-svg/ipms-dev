"use client";

import { ProjectOverviewCards } from "@/components/dashboard/dashboard-page/cards/project-overview-card";
import { GaugeProgressChart } from "@/components/dashboard/dashboard-page/charts/progress-doughnut-chart";
import { ActionItemsWidget } from "@/components/dashboard/dashboard-page/widgets/action-items-widget";
import DistrictAnalyticsStackedBarChart from "@/components/dashboard/dashboard-page/widgets/district-analytics-widget";
import { RecentActivityWidget } from "@/components/dashboard/dashboard-page/widgets/recent-activity-widget";
import { WorkloadDistributionWidget } from "@/components/dashboard/dashboard-page/widgets/workload-distribution-widget";
// import { useDashboardKPIs } from "@/hooks/useDashboardData";
import React from "react";

const ExecutiveDashboard: React.FC = () => {
  // const { data } = useDashboardKPIs();

  // const progressData = {
  //   completed: data?.data?.projectOverview?.completed || 0,
  //   inProgress: data?.data?.projectOverview?.ongoing || 0,
  //   overdue: data?.data?.projectOverview?.overdue || 0,
  //   total: data?.data?.projectOverview?.totalProjects || 0,
  // };

  const progressData = {
    completed: 54,
    inProgress: 26,
    overdue: 14,
    total: 94,
  };

  return (
    <div className="space-y-6 mb-5">
      {/* Executive Overview Section */}
      <section>
        <ProjectOverviewCards />
      </section>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
        <DistrictAnalyticsStackedBarChart />
        <GaugeProgressChart data={progressData} />
      </div>

      {/* Charts and Analytics */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
          <WorkloadDistributionWidget />
        </div>
      </section>

      {/* Charts and Analytics */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RecentActivityWidget />
          <ActionItemsWidget />
        </div>
      </section>
    </div>
  );
};

export default ExecutiveDashboard;
