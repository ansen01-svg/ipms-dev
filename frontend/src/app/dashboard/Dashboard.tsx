"use client";
import { Badge } from "@/components/ui/badge";
import UpdateDropdown from "@/components/dashboards/admin/UpdateDropdown";
import TasksChart from "@/components/dashboards/admin/TasksChart";
import UsersBarChart from "@/components/dashboards/admin/UsersBarChart";
import ProjectsLineChart from "@/components/dashboards/admin/ProjectsLineChart";
import AssamDistrictMap from "@/components/dashboards/admin/AssamDistrictMap";
import DropdownCard from "@/components/dashboards/admin/DropdownCard";
import React, { useState } from "react";

const userData = [
  { id: 1, user: "Junior Engineer", active: "10" },
  { id: 2, user: "Assistant Executive Engineer", active: "5" },
  { id: 3, user: "Managing Director", active: "2" },
];
const projectData = [
  { id: 1, Pid: "#001", Pname: "Aditya", status: "Active" },
  { id: 2, Pid: "#002", Pname: "Sindoor", status: "Active" },
  { id: 3, Pid: "#003", Pname: "Birla", status: "Not Active" },
];
const taskData = [
  { id: 1, task: "Completed", total: "100" },
  { id: 2, task: "Ongoing", total: "50" },
];
const updateStats = [
  { label: "Daily updates from senior engineer", value: 62 },
  { label: "Daily updates from junior engineer", value: 7 },
  { label: "Daily updates from data entry personnel", value: 85 },
  { label: "Daily image uploads", value: 6 },
  { label: "Daily login", value: 9 },
  { label: "Weekly login summary", value: 15 },
  { label: "Monthly task summary", value: 24 },
  { label: "Annually submitted reports", value: 12 },
];

export default function Dashboard() {
  const [selectedUpdateType, setSelectedUpdateType] = useState("Daily");

  const filteredUpdateStats =
    selectedUpdateType === "All"
      ? updateStats
      : updateStats.filter((item) =>
          item.label.toLowerCase().includes(selectedUpdateType.toLowerCase())
        );
  return (
    <div className="container">
      <div className="p-6 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Left: Table */}
        <DropdownCard title="No. of users created by admin">
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            {/* <h5 className="text-center text-base font-bold">No. of users created by admin</h5> */}
            <table className="min-w-full text-sm text-left border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">S.No.</th>
                  <th className="px-4 py-2 border">Users</th>
                  <th className="px-4 py-2 border">No of active users</th>
                </tr>
              </thead>
              <tbody>
                {userData.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 border">
                    <td className="px-4 py-2 border">{user.id}</td>
                    <td className="px-4 py-2 border">{user.user}</td>
                    <td className="px-4 py-2 border">{user.active}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="bg-white rounded-lg shadow p-4">
              <h5 className="font-semibold mb-2 text-center">
                Chart: Active Users per Role
              </h5>
              <UsersBarChart data={userData} />
            </div>
          </div>
        </DropdownCard>

        <DropdownCard title="Total tasks:Ongoing/Completed">
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            {/* <h5 className="text-center text-base font-bold">Total tasks:Ongoing/Completed</h5> */}
            <table className="min-w-full text-sm text-left border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">S.No.</th>
                  <th className="px-4 py-2 border">Task</th>
                  <th className="px-4 py-2 border">Total</th>
                </tr>
              </thead>
              <tbody>
                {taskData.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50 border">
                    <td className="px-4 py-2 border">{task.id}</td>
                    <td className="px-4 py-2 border">{task.task}</td>
                    <td className="px-4 py-2 border">{task.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"> */}

            <div className="bg-white rounded-lg shadow p-4">
              <h5 className="font-semibold mb-2 text-center">
                Chart: Task Status Summary
              </h5>
              <TasksChart data={taskData} />
            </div>
          </div>
        </DropdownCard>

        <DropdownCard title="No. of projects created">
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            {/* <h5 className="text-center text-base font-bold">No. of projects created</h5> */}
            <table className="min-w-full text-sm text-left border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">S.No.</th>
                  <th className="px-4 py-2 border">Project id</th>
                  <th className="px-4 py-2 border">Project Name</th>
                  <th className="px-4 py-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {projectData.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50 border">
                    <td className="px-4 py-2 border">{project.id}</td>
                    <td className="px-4 py-2 border">{project.Pid}</td>
                    <td className="px-4 py-2 border">{project.Pname}</td>
                    <td className="px-4 py-2 border">
                      <Badge
                        className={`px-3 py-1 text-sm rounded ${
                          project.status === "Active"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {project.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="bg-white rounded-lg shadow p-4">
              <h5 className="font-semibold mb-2 text-center">
                Line Chart: Projects Created
              </h5>
              <ProjectsLineChart data={projectData} />
            </div>
          </div>
        </DropdownCard>

        {/* Right: Dropdown + Stats */}
        <DropdownCard title="Overall Updates">
          <div className="bg-white rounded-lg shadow p-4 space-y-4">
            <div>
              {/* <p className="font-semibold mb-1">Overall Updates</p> */}
              <UpdateDropdown
                selected={selectedUpdateType}
                onSelect={setSelectedUpdateType}
              />
            </div>

            <div className="space-y-3">
              {filteredUpdateStats.length > 0 ? (
                filteredUpdateStats.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center border rounded p-2"
                  >
                    <span className="text-xs font-medium text-gray-700">
                      {item.label}
                    </span>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-semibold text-sm">
                      {item.value}%
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center">
                  No updates found.
                </p>
              )}
            </div>
          </div>
        </DropdownCard>

        <DropdownCard title="Assam District-wise User Distribution">
          <AssamDistrictMap />
        </DropdownCard>
      </div>
    </div>
  );
}
