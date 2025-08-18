import { Badge } from "@/components/ui/badge";
import { DbProject } from "@/types/projects.types";

interface TabProps {
  project: DbProject;
}

export default function ProgressTab({ project }: TabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Project Progress
        </h3>
        <Badge className="bg-green-50 text-green-600 border-green-200 text-xs">
          {project.progress}% Complete
        </Badge>
      </div>
    </div>
  );
}
