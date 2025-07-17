import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";

interface TabNavigationProps {
  activeTab: "details" | "financial" | "subProjects";
  setActiveTab: Dispatch<
    SetStateAction<"details" | "financial" | "subProjects">
  >;
  watchHasSubProjects: "yes" | "no";
}

export default function TabNavigation({
  activeTab,
  setActiveTab,
  watchHasSubProjects,
}: TabNavigationProps) {
  const TabButton = ({
    tab,
    label,
    isActive,
  }: {
    tab: "details" | "financial" | "subProjects";
    label: string;
    isActive: boolean;
  }) => (
    <Button
      type="button"
      variant={isActive ? "default" : "outline"}
      onClick={() => setActiveTab(tab)}
      className={`px-6 py-2 text-sm font-medium transition-colors ${
        isActive
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
      }`}
    >
      {label}
    </Button>
  );

  return (
    <div className="flex flex-wrap gap-2 bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
      <TabButton
        tab="details"
        label="Project Details"
        isActive={activeTab === "details"}
      />
      <TabButton
        tab="financial"
        label="Financial Details"
        isActive={activeTab === "financial"}
      />
      {watchHasSubProjects === "yes" && (
        <TabButton
          tab="subProjects"
          label="Sub-project Details"
          isActive={activeTab === "subProjects"}
        />
      )}
    </div>
  );
}
