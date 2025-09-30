// src/components/dashboard/users/designation-badge.tsx
import { cn } from "@/lib/utils";

interface DesignationBadgeProps {
  designation: string;
  className?: string;
}

const getDesignationStyles = (designation: string) => {
  const styles = {
    ADMIN: {
      bg: "bg-purple-100",
      text: "text-purple-800",
      border: "border-purple-200",
    },
    MD: {
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-200",
    },
    CE: {
      bg: "bg-orange-100",
      text: "text-orange-800",
      border: "border-orange-200",
    },
    AEE: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      border: "border-blue-200",
    },
    JE: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-200",
    },
    VIEWER: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      border: "border-gray-200",
    },
  };

  return (
    styles[designation as keyof typeof styles] || {
      bg: "bg-gray-100",
      text: "text-gray-800",
      border: "border-gray-200",
    }
  );
};

export function DesignationBadge({
  designation,
  className,
}: DesignationBadgeProps) {
  const styles = getDesignationStyles(designation);

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        styles.bg,
        styles.text,
        styles.border,
        className
      )}
    >
      {designation}
    </span>
  );
}
