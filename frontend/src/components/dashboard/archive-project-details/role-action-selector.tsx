import { DbArchiveProject } from "@/types/archive-projects.types";
import { User } from "@/types/user.types";
import ArchiveJEActions from "./role-actions/je-actions";
import ViewerActions from "./role-actions/viewer-actions";

interface ArchiveRoleActionSelectorProps {
  user: User;
  project: DbArchiveProject;
}

export function ArchiveRoleActionSelector({
  user,
  project,
}: ArchiveRoleActionSelectorProps) {
  return (
    <div className="space-y-4">
      {user.role === "JE" && <ArchiveJEActions project={project} />}
      {(user.role === "AEE" ||
        user.role === "CE" ||
        user.role === "MD" ||
        user.role === "EXECUTOR" ||
        user.role === "VIEWER" ||
        user.role === "ADMIN") && <ViewerActions />}
    </div>
  );
}
