import { DbProject } from "@/types/projects.types";
import { User } from "@/types/user.types";
import { AEEActions } from "./role-actions/aee-actions";
import { CEActions } from "./role-actions/ce-actions";
import { ExecutorActions } from "./role-actions/executor-actions";
import { JEActions } from "./role-actions/je-actions";
import { MDActions } from "./role-actions/md-actions";
import { ViewerActions } from "./role-actions/viewer-actions";

interface RoleActionSelectorProps {
  user: User;
  project: DbProject;
}

export function RoleActionSelector({ user, project }: RoleActionSelectorProps) {
  return (
    <div className="space-y-4">
      {user.role === "JE" && <JEActions project={project} />}
      {user.role === "AEE" && <AEEActions project={project} />}
      {user.role === "CE" && <CEActions project={project} />}
      {user.role === "MD" && <MDActions project={project} />}
      {user.role === "EXECUTOR" && <ExecutorActions project={project} />}
      {user.role === "VIEWER" && <ViewerActions />}
      {user.role === "ADMIN" && <ViewerActions />}
    </div>
  );
}
