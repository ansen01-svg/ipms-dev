// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { getCurrentUser } from "@/lib/rbac-config.ts/auth";
// import { BarChart, Eye, MapPin } from "lucide-react";
// import Link from "next/link";
// import { redirect } from "next/navigation";

// export default async function ViewerDashboardPage() {
//   const user = await getCurrentUser();

//   if (!user) {
//     redirect("/login");
//   }

//   return (
//     <div className="space-y-6 mt-20">
//       {/* Welcome Section */}
//       <div className="bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg p-6 text-white">
//         <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
//         <p className="text-gray-100 text-lg">
//           Public Viewer Dashboard - {user.department}
//         </p>
//         <p className="text-gray-200 mt-2">
//           Transparent access to project information and progress
//         </p>
//       </div>

//       {/* Quick Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Total Projects
//             </CardTitle>
//             <Eye className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">127</div>
//             <p className="text-xs text-muted-foreground">All active projects</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">In Progress</CardTitle>
//             <BarChart className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">89</div>
//             <p className="text-xs text-muted-foreground">Currently ongoing</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Completed</CardTitle>
//             <BarChart className="h-4 w-4 text-green-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-green-600">38</div>
//             <p className="text-xs text-muted-foreground">
//               Successfully completed
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Districts Covered
//             </CardTitle>
//             <MapPin className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">12</div>
//             <p className="text-xs text-muted-foreground">Across the state</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Quick Actions */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Public Information</CardTitle>
//             <CardDescription>Transparent project tracking</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <Link href="/dashboard/viewer/projects">
//               <Button className="w-full justify-start" variant="outline">
//                 <Eye className="mr-2 h-4 w-4" />
//                 View All Projects
//               </Button>
//             </Link>
//             <Link href="/dashboard/viewer/district">
//               <Button className="w-full justify-start" variant="outline">
//                 <MapPin className="mr-2 h-4 w-4" />
//                 District-wise View
//               </Button>
//             </Link>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Recent Completions</CardTitle>
//             <CardDescription>Recently completed projects</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-3">
//               <div className="flex items-center space-x-3">
//                 <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                 <div className="flex-1">
//                   <p className="text-sm font-medium">Community Health Center</p>
//                   <p className="text-xs text-muted-foreground">
//                     Completed yesterday
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                 <div className="flex-1">
//                   <p className="text-sm font-medium">
//                     Village Road Construction
//                   </p>
//                   <p className="text-xs text-muted-foreground">
//                     Completed 3 days ago
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                 <div className="flex-1">
//                   <p className="text-sm font-medium">
//                     School Library Renovation
//                   </p>
//                   <p className="text-xs text-muted-foreground">
//                     Completed last week
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { Building, FileText, FolderOpen, Plus } from "lucide-react";
import Link from "next/link";

export default function JEDashboardPage() {
  const { user, loading } = useAuth();

  // Show loading state while user data is being fetched
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg p-6 animate-pulse">
          <div className="h-8 bg-gray-400 rounded w-1/3 mb-2"></div>
          <div className="h-5 bg-gray-400 rounded w-1/2"></div>
          <div className="h-4 bg-gray-400 rounded w-2/3 mt-2"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </CardHeader>
              <CardContent className="animate-pulse">
                <div className="h-8 bg-gray-300 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Handle case where user is not loaded (shouldn't happen with RouteGuard)
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Unable to load user data</p>
          <Button onClick={() => window.location.reload()}>Reload Page</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
        <p className="text-blue-100 text-lg">
          External viewer Dashboard -{" "}
          {user.department || user.department || "PWD"}
        </p>
        <p className="text-blue-200 mt-2">
          Ready to create and manage your construction projects
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Projects</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Active projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Draft Projects
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Pending submission</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">Total completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/dashboard/je/projects/create">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create New Project
              </Button>
            </Link>
            <Link href="/dashboard/projects">
              <Button className="w-full justify-start" variant="outline">
                <FolderOpen className="mr-2 h-4 w-4" />
                View My Projects
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest project updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    School Building Project approved
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Road Construction needs review
                  </p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Bridge Project submitted
                  </p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
