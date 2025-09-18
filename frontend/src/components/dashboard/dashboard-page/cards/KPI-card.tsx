import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import React from "react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  className?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  colorScheme?: "teal" | "blue" | "orange" | "green" | "red" | "purple";
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  className,
  valuePrefix = "",
  valueSuffix = "",
  colorScheme = "teal",
}) => {
  const getIconBackground = (
    scheme: "teal" | "blue" | "orange" | "green" | "red" | "purple"
  ) => {
    const backgrounds = {
      teal: "bg-teal-100",
      blue: "bg-blue-100",
      orange: "bg-orange-100",
      green: "bg-green-100",
      red: "bg-red-100",
      purple: "bg-purple-100",
    };
    return backgrounds[scheme] || backgrounds.teal;
  };

  const getIconColor = (
    scheme: "teal" | "blue" | "orange" | "green" | "red" | "purple"
  ) => {
    const colors = {
      teal: "text-teal-600",
      blue: "text-blue-600",
      orange: "text-orange-600",
      green: "text-green-600",
      red: "text-red-600",
      purple: "text-purple-600",
    };
    return colors[scheme] || colors.teal;
  };

  const getGradientBackground = (
    scheme: "teal" | "blue" | "orange" | "green" | "red" | "purple"
  ) => {
    const gradients = {
      teal: "bg-gradient-to-br from-teal-50 to-white",
      blue: "bg-gradient-to-br from-blue-100 to-white",
      orange: "bg-gradient-to-br from-orange-100 to-white",
      green: "bg-gradient-to-br from-green-100 to-white",
      red: "bg-gradient-to-br from-red-100 to-white",
      purple: "bg-gradient-to-br from-purple-100 to-white",
    };
    return gradients[scheme] || gradients.teal;
  };

  return (
    <Card
      className={cn(
        "border-0 shadow-sm rounded-xl p-4",
        getGradientBackground(colorScheme),
        className
      )}
    >
      <CardContent className="p-0">
        {/* Icon Section */}
        {Icon && (
          <div className="mb-4">
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                getIconBackground(colorScheme)
              )}
            >
              <Icon className={cn("h-6 w-6", getIconColor(colorScheme))} />
            </div>
          </div>
        )}

        {/* Title Section */}
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-600 leading-relaxed">
            {title}
          </p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>

        {/* Value Section */}
        <div className="text-3xl font-bold text-gray-900 leading-none">
          {valuePrefix}
          {typeof value === "number" ? value.toLocaleString() : value}
          {valueSuffix}
        </div>
      </CardContent>
    </Card>
  );
};
