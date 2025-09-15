"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DbArchiveProject } from "@/types/archive-projects.types";
import {
  BarChart,
  Clock,
  DollarSign,
  FileText,
  MapPin,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ArchiveContractorTab from "./tabs/contractor";
import ArchiveFinancialTab from "./tabs/financial";
import ArchiveOverviewTab from "./tabs/overview";
import PlaceholderTab from "./tabs/placeholder";
import ArchiveProgressTab from "./tabs/progress";
import ArchiveTimelineTab from "./tabs/timeline";

interface ArchiveProjectTabsProps {
  project: DbArchiveProject;
  userRole: string;
  activeTab: string;
}

interface TabConfig {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const tabs: TabConfig[] = [
  { id: "overview", label: "Overview", icon: FileText },
  { id: "progress", label: "Progress", icon: BarChart },
  { id: "financial", label: "Financial", icon: DollarSign },
  { id: "contractor", label: "Contractor", icon: Users },
  { id: "timeline", label: "Timeline", icon: Clock },
  { id: "location", label: "Location", icon: MapPin },
  { id: "metrics", label: "Metrics", icon: TrendingUp },
  { id: "queries", label: "Quaries", icon: TrendingUp },
];

export function ArchiveProjectTabs({
  project,
  activeTab,
}: ArchiveProjectTabsProps) {
  const [currentTab, setCurrentTab] = useState<string>(activeTab);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const activeTabIndex = tabs.findIndex((tab) => tab.id === currentTab);
    const activeTabElement = tabRefs.current[activeTabIndex];

    if (activeTabElement) {
      const { offsetLeft, offsetWidth } = activeTabElement;
      setIndicatorStyle({
        left: offsetLeft,
        width: offsetWidth,
      });
    }
  }, [currentTab]);

  const renderTabContent = () => {
    switch (currentTab) {
      case "overview":
        return <ArchiveOverviewTab project={project} />;
      case "progress":
        return <ArchiveProgressTab project={project} />;
      case "financial":
        return <ArchiveFinancialTab project={project} />;
      case "contractor":
        return <ArchiveContractorTab project={project} />;
      case "timeline":
        return <ArchiveTimelineTab project={project} />;
      case "location":
        return <PlaceholderTab icon={MapPin} title="Location Details" />;
      case "metrics":
        return <PlaceholderTab icon={TrendingUp} title="Project Metrics" />;
      case "quaries":
        return <PlaceholderTab icon={TrendingUp} title="Quaries" />;
      default:
        return <ArchiveOverviewTab project={project} />;
    }
  };

  return (
    <Card className="bg-white border border-gray-100 shadow-sm rounded-xl">
      {/* Tab Navigation */}
      <div className="border-b border-gray-100">
        <div className="px-6">
          <nav className="flex space-x-3 overflow-x-auto relative">
            {/* Sliding indicator */}
            <div
              className="absolute bottom-0 h-[3px] bg-teal-600 transition-all duration-700 ease-in-out"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
              }}
            />

            {tabs.map((tab, index) => {
              return (
                <button
                  key={tab.id}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`flex items-center gap-2 py-5 px-4 font-medium text-sm whitespace-nowrap transition-colors duration-500 ease-in-out ${
                    currentTab === tab.id
                      ? "text-teal-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <CardContent className="p-6">{renderTabContent()}</CardContent>
    </Card>
  );
}
