"use client";

import { useAuth } from "@/contexts/auth-context";
import { Clock, FilePlus2, FolderArchive } from "lucide-react";

export default function OperatorDashboard() {
  const { user } = useAuth();

  // Get current time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Format current date
  const getCurrentDate = () => {
    return new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const quickAccessCards = [
    {
      icon: FolderArchive,
      title: "Archived Projects",
      description: "Access archived project records",
      href: "/dashboard/archived-projects",
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: FilePlus2,
      title: "Create Archived Project",
      description: "Create a new archived project",
      href: "/dashboard/archived-projects/create",
      color: "bg-teal-50 text-teal-600",
    },
  ];

  return (
    <div className="space-y-6 mb-5">
      <div className="mx-auto">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl shadow-lg p-8 mb-8 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {getGreeting()}, {user?.name || "Operator"}!
              </h1>
              <p className="text-teal-50 text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {getCurrentDate()}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4">
              <p className="text-teal-50 text-sm uppercase tracking-wide mb-1">
                Role
              </p>
              <p className="text-2xl font-bold">{user?.role || "OPERATOR"}</p>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Welcome to Your Dashboard
          </h2>
          <p className="text-gray-600 leading-relaxed">
            As an Operator, you have access to project management tools,
            archived project records, and measurement book tracking. Use the
            quick access cards below to navigate to your frequently used
            sections.
          </p>
        </div>

        {/* Quick Access Cards */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Access
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickAccessCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <a
                  key={index}
                  href={card.href}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-100 hover:border-teal-200 group"
                >
                  <div
                    className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {card.title}
                  </h4>
                  <p className="text-gray-600 text-sm">{card.description}</p>
                </a>
              );
            })}
          </div>
        </div>

        {/* User Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Your Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 mb-1">Name</span>
              <span className="text-gray-900 font-medium">
                {user?.name || "N/A"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 mb-1">Email</span>
              <span className="text-gray-900 font-medium">
                {user?.email || "N/A"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 mb-1">Designation</span>
              <span className="text-gray-900 font-medium">
                {user?.designation || "N/A"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 mb-1">Department</span>
              <span className="text-gray-900 font-medium">
                {user?.departmentName || user?.department || "N/A"}
              </span>
            </div>
            {user?.officeLocation && (
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 mb-1">
                  Office Location
                </span>
                <span className="text-gray-900 font-medium">
                  {user.officeLocation}
                </span>
              </div>
            )}
            {user?.phoneNumber && (
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 mb-1">Phone Number</span>
                <span className="text-gray-900 font-medium">
                  {user.phoneNumber}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
