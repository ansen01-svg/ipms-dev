// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { getCurrentUser } from "@/lib/rbac-config.ts/auth";
// import { AlertTriangle, CheckCircle, Clock, Users } from "lucide-react";
// import Link from "next/link";

// export default async function AEEDashboardPage() {
//   const user = await getCurrentUser();

//   return (
//     <div className="space-y-6 mt-20">
//       {/* Welcome Section */}
//       <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
//         <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
//         <p className="text-green-100 text-lg">
//           Assistant Executive Engineer Dashboard - {user?.department}
//         </p>
//         <p className="text-green-200 mt-2">
//           Review and approve project submissions
//         </p>
//       </div>

//       {/* Quick Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Pending Review
//             </CardTitle>
//             <Clock className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">8</div>
//             <p className="text-xs text-muted-foreground">
//               Projects awaiting review
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Urgent Reviews
//             </CardTitle>
//             <AlertTriangle className="h-4 w-4 text-red-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-red-600">3</div>
//             <p className="text-xs text-muted-foreground">Over 7 days pending</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Approved Today
//             </CardTitle>
//             <CheckCircle className="h-4 w-4 text-green-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-green-600">5</div>
//             <p className="text-xs text-muted-foreground">Projects approved</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Team Members</CardTitle>
//             <Users className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">15</div>
//             <p className="text-xs text-muted-foreground">
//               JEs under supervision
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Quick Actions */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Review Queue</CardTitle>
//             <CardDescription>Projects pending your review</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <Link href="/dashboard/aee/projects">
//               <Button className="w-full justify-start" variant="outline">
//                 <Clock className="mr-2 h-4 w-4" />
//                 Review Pending Projects
//               </Button>
//             </Link>
//             <Link href="/dashboard/aee/team">
//               <Button className="w-full justify-start" variant="outline">
//                 <Users className="mr-2 h-4 w-4" />
//                 Manage Team
//               </Button>
//             </Link>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Priority Projects</CardTitle>
//             <CardDescription>
//               High priority items needing attention
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-3">
//               <div className="flex items-center space-x-3">
//                 <div className="w-2 h-2 bg-red-500 rounded-full"></div>
//                 <div className="flex-1">
//                   <p className="text-sm font-medium">
//                     Hospital Construction - 10 days pending
//                   </p>
//                   <p className="text-xs text-muted-foreground">High Priority</p>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
//                 <div className="flex-1">
//                   <p className="text-sm font-medium">
//                     School Renovation - 8 days pending
//                   </p>
//                   <p className="text-xs text-muted-foreground">
//                     Medium Priority
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
//                 <div className="flex-1">
//                   <p className="text-sm font-medium">
//                     Road Repair - 5 days pending
//                   </p>
//                   <p className="text-xs text-muted-foreground">
//                     Standard Priority
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
          Assistant Executive Engineer Dashboard -{" "}
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
