// frontend/src/components/dashboard/measurement-books/mb-status-badge.tsx

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MBStatus } from "@/types/mb.types";

interface MBStatusBadgeProps {
  status: MBStatus;
}

export function MBStatusBadge({ status }: MBStatusBadgeProps) {
  const statusConfig: Record<
    MBStatus,
    { variant: "default"; className: string }
  > = {
    Draft: {
      variant: "default",
      className: "text-gray-600 bg-gray-50 border-gray-200",
    },
    Submitted: {
      variant: "default",
      className: "text-blue-600 bg-blue-50 border-blue-200",
    },
    "Under Review": {
      variant: "default",
      className: "text-yellow-600 bg-yellow-50 border-yellow-200",
    },
    Approved: {
      variant: "default",
      className: "text-green-600 bg-green-50 border-green-200",
    },
    Rejected: {
      variant: "default",
      className: "text-red-600 bg-red-50 border-red-200",
    },
  };

  const config = statusConfig[status] ?? {
    variant: "default",
    className: "text-gray-600 bg-gray-50 border-gray-200",
  };

  return (
    <Badge
      variant={config.variant}
      className={cn("text-xs font-medium px-2 py-1", config.className)}
    >
      {status}
    </Badge>
  );
}
