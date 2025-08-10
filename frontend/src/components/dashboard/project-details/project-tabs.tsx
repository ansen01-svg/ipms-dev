"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Project } from "@/types/projects.types";
import {
  BarChart,
  Building,
  Camera,
  Clock,
  FileText,
  MessageSquare,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CommentsTab from "./tabs/comments";
import DocumentsTab from "./tabs/documents";
import OverviewTab from "./tabs/overview";
import PlaceholderTab from "./tabs/placeholder";
import ProgressTab from "./tabs/progress";
import SubProjectsTab from "./tabs/sub-projects";
import TimelineTab from "./tabs/timeline";

// Interfaces
interface ProjectTabsProps {
  project: Project;
  userRole: string;
  activeTab: string;
}

interface TabConfig {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ProjectTabsProps {
  project: Project;
  userRole: string;
  activeTab: string;
}

const tabs: TabConfig[] = [
  { id: "overview", label: "Overview", icon: FileText },
  { id: "progress", label: "Progress", icon: BarChart },
  { id: "sub-projects", label: "Sub-Projects", icon: Building },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "team", label: "Team", icon: Users },
  { id: "media", label: "Media", icon: Camera },
  { id: "timeline", label: "Timeline", icon: Clock },
  { id: "comments", label: "Comments", icon: MessageSquare },
];

const mockTimelineData = {
  approvalSteps: [
    {
      id: "1",
      title: "Initial Proposal Submission",
      approver: "Rajesh Kumar",
      role: "JE",
      status: "completed" as const,
      completedDate: "2025-01-15",
      comments: [
        {
          id: "c1",
          author: "Rajesh Kumar",
          role: "JE",
          content:
            "Project proposal submitted with all required documents including technical specifications, initial cost estimates, and site survey reports. All mandatory clearances attached.",
          timestamp: "15 Jan 25",
          type: "approval" as const,
        },
      ],
    },
    {
      id: "1.1",
      title: "Project Returned for Revision",
      approver: "System",
      role: "Return",
      status: "rejected" as const,
      completedDate: "2025-01-28",
      comments: [
        {
          id: "c1.1",
          author: "System",
          role: "Return",
          content:
            "Project returned to JE for technical specification revision as requested by AEE.",
          timestamp: "28 Jan 25",
          type: "rejection" as const,
        },
      ],
    },
    {
      id: "2",
      title: "AEE Technical Review",
      approver: "Priya Sharma",
      role: "AEE",
      status: "completed" as const,
      completedDate: "2025-02-08",
      comments: [
        {
          id: "c2",
          author: "Priya Sharma",
          role: "AEE",
          content:
            "Initial review shows technical specifications need revision. Cost estimates appear inflated for the scope of work. Please revise and resubmit.",
          timestamp: "28 Jan 25",
          type: "rejection" as const,
        },
        {
          id: "c3",
          author: "Rajesh Kumar",
          role: "JE",
          content:
            "Technical specifications revised based on AEE feedback. Cost breakdown updated with detailed vendor quotations. New timeline proposed.",
          timestamp: "5 Feb 25",
          type: "revision" as const,
        },
        {
          id: "c4",
          author: "Priya Sharma",
          role: "AEE",
          content:
            "Revised proposal approved. Technical specifications now meet standards. Cost estimates are reasonable and well-justified.",
          timestamp: "8 Feb 25",
          type: "approval" as const,
        },
      ],
    },
    {
      id: "3",
      title: "CE Administrative Review",
      approver: "Dr. Amit Patel",
      role: "CE",
      status: "in_progress" as const,
      isCurrentStep: true,
      comments: [
        {
          id: "c5",
          author: "Dr. Amit Patel",
          role: "CE",
          content:
            "Currently reviewing for environmental compliance and budget allocation. Need clarification on waste management procedures and safety protocols.",
          timestamp: "5 Aug 25",
          type: "query" as const,
        },
        {
          id: "c6",
          author: "Rajesh Kumar",
          role: "JE",
          content:
            "Additional waste management and safety protocol documents submitted as requested. Environmental impact assessment updated.",
          timestamp: "7 Aug 25",
          type: "revision" as const,
        },
      ],
    },
    {
      id: "4",
      title: "MD Final Approval",
      approver: "Mrs. Sunita Mehta",
      role: "MD",
      status: "pending" as const,
      comments: [],
    },
    {
      id: "5",
      title: "Project Execution Assignment",
      approver: "Contractor Assignment",
      role: "Executor",
      status: "pending" as const,
      comments: [],
    },
  ],
  currentApprovalLevel: "CE",
};

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
      case "comments":
        return <CommentsTab />;
      case "team":
        return <PlaceholderTab icon={Users} title="Team" />;
      case "media":
        return <PlaceholderTab icon={Camera} title="Media" />;
      case "timeline":
        return <TimelineTab project={mockTimelineData} />;
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
