import { Badge } from "@/components/ui/badge";
import { DbArchiveProject } from "@/types/archive-projects.types";
import { Calendar, DollarSign, FileText, TrendingUp } from "lucide-react";

// Archive Timeline Tab
interface ArchiveTimelineTabProps {
  project: DbArchiveProject;
}

function ArchiveTimelineTab({ project }: ArchiveTimelineTabProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const timelineEvents = [
    {
      id: 1,
      title: "Administrative Approval",
      date: project.AADated,
      description: `AA Number: ${project.AANumber}`,
      type: "approval" as const,
    },
    {
      id: 2,
      title: "FWO Issued",
      date: project.FWODate,
      description: project.FWONumberAndDate,
      type: "order" as const,
    },
    {
      id: 3,
      title: "Project Started",
      date: project.createdAt,
      description: "Project execution commenced",
      type: "start" as const,
    },
    {
      id: 4,
      title: "Last Updated",
      date: project.updatedAt,
      description: `Progress: ${project.progress}% - ${project.progressStatus}`,
      type: "update" as const,
    },
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getEventIcon = (type: string) => {
    switch (type) {
      case "approval":
        return <FileText className="h-4 w-4 text-green-600" />;
      case "order":
        return <DollarSign className="h-4 w-4 text-blue-600" />;
      case "start":
        return <TrendingUp className="h-4 w-4 text-purple-600" />;
      case "update":
        return <Calendar className="h-4 w-4 text-orange-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "approval":
        return "border-green-200 bg-green-50";
      case "order":
        return "border-blue-200 bg-blue-50";
      case "start":
        return "border-purple-200 bg-purple-50";
      case "update":
        return "border-orange-200 bg-orange-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Project Timeline
        </h3>
        <Badge variant="outline" className="text-xs">
          {timelineEvents.length} Events
        </Badge>
      </div>

      <div className="space-y-4">
        {timelineEvents.map((event, index) => (
          <div key={event.id} className="relative">
            {/* Timeline connector */}
            {index < timelineEvents.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200" />
            )}

            <div
              className={`flex items-start gap-4 p-4 rounded-lg border ${getEventColor(
                event.type
              )}`}
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                {getEventIcon(event.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    {event.title}
                  </h4>
                  <span className="text-xs text-gray-500">
                    {formatDate(event.date)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{event.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="font-medium text-gray-900 mb-4">Timeline Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {formatDate(project.AADated)}
            </div>
            <div className="text-sm text-gray-500">AA Date</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {formatDate(project.FWODate)}
            </div>
            <div className="text-sm text-gray-500">FWO Date</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {formatDate(project.updatedAt)}
            </div>
            <div className="text-sm text-gray-500">Last Update</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArchiveTimelineTab;
