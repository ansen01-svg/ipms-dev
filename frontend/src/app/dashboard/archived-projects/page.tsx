import { ArchiveProjectsContainer } from "@/components/dashboard/archive-projects/projects-container";
// import { getCurrentUser } from "@/lib/rbac-config.ts/auth";
// import { redirect } from "next/navigation";

export default function ArchiveProjectsListPage() {
  // const user = await getCurrentUser();

  // if (!user) {
  //   redirect("/login");
  // }

  return (
    <div className="w-full mb-5 space-y-4 sm:space-y-6 bg-white p-4 sm:p-6 rounded-xl shadow">
      {/* <ArchiveProjectsContainer user={user} /> */}
      <ArchiveProjectsContainer />
    </div>
  );
}
