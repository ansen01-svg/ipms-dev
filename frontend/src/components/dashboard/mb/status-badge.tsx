import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ApprovalStatusBadgeProps {
  isApproved: boolean;
  hasRemarks?: boolean;
}

export function ApprovalStatusBadge({
  isApproved,
  hasRemarks = false,
}: ApprovalStatusBadgeProps) {
  if (isApproved) {
    return (
      <Badge
        variant="default"
        className={cn(
          "text-xs font-medium px-2 py-1",
          "text-green-700 bg-green-50 border-green-200"
        )}
      >
        Approved
      </Badge>
    );
  } else {
    return (
      <Badge
        variant="default"
        className={cn(
          "text-xs font-medium px-2 py-1",
          hasRemarks
            ? "text-yellow-700 bg-yellow-50 border-yellow-200"
            : "text-gray-600 bg-gray-50 border-gray-200"
        )}
      >
        {hasRemarks ? "Under Review" : "Pending"}
      </Badge>
    );
  }
}
