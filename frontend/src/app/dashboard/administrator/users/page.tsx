import { Plus } from "lucide-react";
import Link from "next/link";

// const getUsers = async () => {
//   try {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_PROD_API_URL}/users`,
//       {
//         method: "GET",
//       }
//     );
//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || "Failed to fetch users");
//     }

//     console.log("Fetched users:", data);
//     return data.users || [];
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     return [];
//   }
// };

export default async function UsersPage() {
  // getUsers();

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/administrator/users/new"
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 active:bg-teal-800 group"
      >
        <Plus className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
        <span>New User</span>
      </Link>
    </div>
  );
}
