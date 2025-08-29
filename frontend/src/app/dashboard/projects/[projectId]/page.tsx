// import ProjectContainer from "@/components/dashboard/project-details/project-container";
// import { getCurrentUser } from "@/lib/rbac-config.ts/auth";
// import { User } from "@/types/user.types";

// interface ArchiveProjectDetailsPageProps {
//   params: { projectId: string };
//   searchParams: { tab?: string };
// }

// export default async function ArchiveProjectDetailsPage({
//   params,
//   searchParams,
// }: ArchiveProjectDetailsPageProps) {
//   const user = await getCurrentUser();

//   const activeTab = searchParams.tab || "overview";

//   return (
//     <div className="min-h-screen">
//       <div className="mx-auto mb-5">
//         <ProjectContainer
//           user={user as User}
//           activeTab={activeTab}
//           projectId={params.projectId}
//         />
//       </div>
//     </div>
//   );
// }

"use client";

import ProjectContainer from "@/components/dashboard/project-details/project-container";
import { useAuth } from "@/contexts/auth-context";
import { User } from "@/types/user.types";

interface ArchiveProjectDetailsPageProps {
  params: { projectId: string };
  searchParams: { tab?: string };
}

export default function ArchiveProjectDetailsPage({
  params,
  searchParams,
}: ArchiveProjectDetailsPageProps) {
  const { user } = useAuth();

  const activeTab = searchParams.tab || "overview";

  return (
    <div className="min-h-screen">
      <div className="mx-auto mb-5">
        <ProjectContainer
          user={user as User}
          activeTab={activeTab}
          projectId={params.projectId}
        />
      </div>
    </div>
  );
}
