import { Plus } from "lucide-react";
import Link from "next/link";

export default async function UsersPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/admin/users/new"
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 active:bg-teal-800 group"
      >
        <Plus className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
        <span>New User</span>
      </Link>
    </div>
  );
}
