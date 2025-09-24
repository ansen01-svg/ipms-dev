"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DbProject } from "@/types/projects.types";
import {
  BarChart,
  Building,
  Clock,
  FileText,
  MessageSquare,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DocumentsTab from "./tabs/documents";
import OverviewTab from "./tabs/overview";
import ProgressTab from "./tabs/progress";
import ProjectQueriesTab from "./tabs/queries";
import SubProjectsTab from "./tabs/sub-projects";
import TimelineTab from "./tabs/timeline";

// Interfaces
interface ProjectTabsProps {
  project: DbProject;
  userRole: string;
  activeTab: string;
}

interface TabConfig {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ProjectTabsProps {
  project: DbProject;
  userRole: string;
  activeTab: string;
}

const tabs: TabConfig[] = [
  { id: "overview", label: "Overview", icon: FileText },
  { id: "progress", label: "Progress", icon: BarChart },
  { id: "sub-projects", label: "Sub-Projects", icon: Building },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "timeline", label: "Timeline", icon: Clock },
  { id: "queries", label: "Queries", icon: MessageSquare },
];

export function ProjectTabs({ project, activeTab }: ProjectTabsProps) {
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
        return <OverviewTab project={project} />;
      case "progress":
        return <ProgressTab project={project} />;
      case "sub-projects":
        return <SubProjectsTab project={project} />;
      case "documents":
        return <DocumentsTab project={project} />;
      case "queries":
        return <ProjectQueriesTab project={project} isProject={true} />;
      case "timeline":
        return <TimelineTab project={project} />;
      default:
        return <OverviewTab project={project} />;
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
