import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ProjectStatus } from "@/types/projects.types";

// Props interface
interface StatusBadgeProps {
  status: ProjectStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig: Record<
    | "Draft"
    | "Submitted to AEE"
    | "Rejected by AEE"
    | "Submitted to CE"
    | "Rejected by CE"
    | "Submitted to MD"
    | "Rejected by MD"
    | "Submitted to Executing Department"
    | "Rejected by Executing Department"
    | "Approved"
    | "Ongoing"
    | "Pending"
    | "Completed",
    { variant: "default"; className: string }
  > = {
    Draft: {
      variant: "default",
      className: "text-gray-600",
    },
    "Submitted to AEE": {
      variant: "default",
      className: "text-blue-600",
    },
    "Rejected by AEE": {
      variant: "default",
      className: "text-red-600",
    },
    "Submitted to CE": {
      variant: "default",
      className: "text-blue-600",
    },
    "Rejected by CE": {
      variant: "default",
      className: "text-red-600",
    },
    "Submitted to MD": {
      variant: "default",
      className: "text-blue-600",
    },
    "Rejected by MD": {
      variant: "default",
      className: "text-red-600",
    },
    "Submitted to Executing Department": {
      variant: "default",
      className: "text-blue-600",
    },
    "Rejected by Executing Department": {
      variant: "default",
      className: "text-red-600",
    },
    Completed: {
      variant: "default",
      className: "text-green-600",
    },
    Ongoing: {
      variant: "default",
      className: "text-blue-600",
    },
    Pending: {
      variant: "default",
      className: "text-yellow-600",
    },
    Approved: {
      variant: "default",
      className: "text-teal-600",
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] ?? {
    variant: "default",
    className: "text-gray-600",
  };

  return (
    <Badge
      variant={config.variant}
      className={cn(
        "bg-white border-white p-0 text-sm font-semibold",
        config.className
      )}
    >
      {status}
    </Badge>
  );
}
