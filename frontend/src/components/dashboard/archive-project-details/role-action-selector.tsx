import { DbArchiveProject } from "@/types/archive-projects.types";
import { User } from "@/types/user.types";
import ArchiveJEActions from "./role-actions/je-actions";
import ViewerActions from "./role-actions/viewer-actions";

interface ArchiveRoleActionSelectorProps {
  user: User;
  project: DbArchiveProject;
  onProjectUpdate?: (updatedProject: DbArchiveProject) => void;
}

export function ArchiveRoleActionSelector({
  user,
  project,
  onProjectUpdate,
}: ArchiveRoleActionSelectorProps) {
  return (
    <div className="space-y-4">
      {user.role === "JE" && (
        <ArchiveJEActions project={project} onProjectUpdate={onProjectUpdate} />
      )}
      {(user.role === "AEE" ||
        user.role === "CE" ||
        user.role === "MD" ||
        user.role === "EXECUTOR" ||
        user.role === "VIEWER" ||
        user.role === "ADMIN") && <ViewerActions />}
    </div>
  );
}
