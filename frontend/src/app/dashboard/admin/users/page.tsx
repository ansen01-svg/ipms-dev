"use client";

import {
  FiltersProvider,
  UserFilters,
} from "@/components/dashboard/users/users-filters";
import { UsersTable } from "@/components/dashboard/users/users-table";
import { fetchAllUsers, User } from "@/utils/users/fetch-users";
import { CircleCheckBig, ClockFading, Plus, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  console.log(refreshing);

  const loadUsers = async (showRefreshToast = false) => {
    try {
      if (showRefreshToast) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetchAllUsers({
        page: 1,
        limit: 1000, // Fetch all users for client-side filtering
      });

      setUsers(response.data);

      if (showRefreshToast) {
        toast.success("Users refreshed successfully");
      }
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to load users"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <FiltersProvider>
      <div className="space-y-6 py-6">
        {/* Header Section */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              Users Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and monitor all system users
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard/admin/users/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm shadow-sm hover:from-teal-700 hover:to-teal-800 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span>New User</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {users.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {users.filter((u) => !u.isFirstLogin).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CircleCheckBig className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Login</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {users.filter((u) => u.isFirstLogin).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <ClockFading className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <UserFilters />

        {/* Users Table */}
        <UsersTable users={users} onUserUpdate={() => loadUsers(true)} />
      </div>
    </FiltersProvider>
  );
}
