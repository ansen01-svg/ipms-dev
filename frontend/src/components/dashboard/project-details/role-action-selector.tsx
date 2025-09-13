import { DbProject } from "@/types/projects.types";
import { User } from "@/types/user.types";
import { HigherAuthorityActions } from "./role-actions/higher-authority-actions";
import { JEActions } from "./role-actions/je-actions";
import { ViewerActions } from "./role-actions/viewer-actions";

interface RoleActionSelectorProps {
  user: User;
  project: DbProject;
  onProjectUpdate?: (updatedProject: DbProject) => void;
}

export function RoleActionSelector({
  user,
  project,
  onProjectUpdate,
}: RoleActionSelectorProps) {
  return (
    <div className="space-y-4">
      {user.role === "JE" && (
        <JEActions project={project} onProjectUpdate={onProjectUpdate} />
      )}
      {user.role === "AEE" && (
        <HigherAuthorityActions project={project} role={user.role} />
      )}
      {user.role === "CE" && (
        <HigherAuthorityActions project={project} role={user.role} />
      )}
      {user.role === "MD" && (
        <HigherAuthorityActions project={project} role={user.role} />
      )}
      {user.role === "VIEWER" && <ViewerActions />}
      {user.role === "ADMIN" && <ViewerActions />}
    </div>
  );
}
