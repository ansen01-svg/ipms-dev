import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ProgressStatus } from "@/types/archive-projects.types";

// Props interface
interface ProgressStatusBadgeProps {
  status: ProgressStatus;
  progress?: number;
}

export function ProgressStatusBadge({
  status,
  progress,
}: ProgressStatusBadgeProps) {
  const statusConfig: Record<
    ProgressStatus,
    { variant: "default"; className: string; bgColor: string }
  > = {
    "Not Started": {
      variant: "default",
      className: "text-gray-600 bg-gray-100",
      bgColor: "bg-gray-100",
    },
    "Just Started": {
      variant: "default",
      className: "text-yellow-700 bg-yellow-100",
      bgColor: "bg-yellow-100",
    },
    "In Progress": {
      variant: "default",
      className: "text-blue-700 bg-blue-100",
      bgColor: "bg-blue-100",
    },
    "Halfway Complete": {
      variant: "default",
      className: "text-purple-700 bg-purple-100",
      bgColor: "bg-purple-100",
    },
    "Near Completion": {
      variant: "default",
      className: "text-orange-700 bg-orange-100",
      bgColor: "bg-orange-100",
    },
    Completed: {
      variant: "default",
      className: "text-green-700 bg-green-100",
      bgColor: "bg-green-100",
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center space-x-2">
      <Badge
        variant={config.variant}
        className={cn(
          "text-xs font-medium px-2 py-1 rounded-full border-0",
          config.className
        )}
      >
        {status}
      </Badge>
      {progress !== undefined && (
        <span className="text-xs text-gray-500 font-medium">{progress}%</span>
      )}
    </div>
  );
}
