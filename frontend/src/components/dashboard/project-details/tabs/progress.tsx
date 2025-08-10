import { Badge } from "@/components/ui/badge";
import { MOCK_PROJECT } from "@/utils/project-details/constants";

interface TabProps {
  project: typeof MOCK_PROJECT;
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
