/**
 * SSR (Server-Side Rendering) Demo Page
 * File: app/examples/ssr-demo/page.tsx
 *
 * ===========================================
 * WHAT IS SERVER-SIDE RENDERING (SSR)?
 * ===========================================
 * SSR means the page is rendered on the server for each request.
 * The server fetches data, builds the complete HTML, and sends it
 * to the browser. Users see content immediately.
 *
 * WHEN TO USE SSR:
 * ✅ Real-time data that changes frequently
 * ✅ Personalized content for each user
 * ✅ SEO-critical pages that need fresh content
 * ✅ User dashboards and profiles
 *
 * BENEFITS:
 * ✅ Always fresh, up-to-date content
 * ✅ Great SEO (search engines see full HTML)
 * ✅ Fast initial content display
 * ✅ Works without JavaScript
 *
 * DRAWBACKS:
 * ❌ Slower page loads (server processing time)
 * ❌ Higher server costs
 * ❌ More complex caching
 */

// NO 'use client' directive = SERVER COMPONENT

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Server, Clock, Users } from "lucide-react";
import Header from "@/components/examples/ssr-demo/header";

/**
 * Simple User interface for demo
 */
interface User {
  id: number;
  name: string;
  email: string;
  company: {
    name: string;
  };
}

/**
 * SSR Demo Component
 * This is an async server component that fetches data on each request
 */
export default async function SSRDemo() {
  /**
   * SERVER-SIDE DATA FETCHING
   * This code runs on the SERVER for every request
   * Users get fresh data each time they visit
   */

  // Generate timestamp to prove this runs on each request
  const serverTime = new Date().toLocaleString();

  let users: User[] = [];
  let error: string | null = null;

  try {
    // This fetch happens on the server
    const response = await fetch("https://jsonplaceholder.typicode.com/users", {
      cache: "no-store", // This ensures fresh data on each request
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    users = await response.json();
  } catch (fetchError) {
    error = fetchError instanceof Error ? fetchError.message : "Unknown error";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <Header />

        {/* Server Timestamp */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-900">
              <Clock className="w-5 h-5" />
              <span>Server Rendering Time</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-800 font-mono text-lg">
              Generated on server: {serverTime}
            </p>
            <p className="text-green-700 text-sm mt-2">
              This timestamp is generated fresh on the server for every page
              request. Refresh the page to see it update!
            </p>
          </CardContent>
        </Card>

        {/* How SSR Works */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">
              How This Page Works:
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800 space-y-2">
            <p>1. 🔄 You request this page from the server</p>
            <p>2. 🖥️ Server fetches fresh data from the API</p>
            <p>3. ⚡ Server renders complete HTML with data</p>
            <p>4. 📤 Server sends full HTML to your browser</p>
            <p>5. ✅ You see content immediately (no loading states!)</p>
          </CardContent>
        </Card>

        {/* Error Handling */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-800">
                <strong>Server Error:</strong> {error}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Users List */}
        {!error && users.length > 0 && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Live User Directory
              </h2>
              <p className="text-gray-600 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Fresh data fetched from server on each page load
              </p>
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.slice(0, 6).map((user) => (
                <Card
                  key={user.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    {/* User Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                      <span className="text-white font-bold">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                    </div>

                    {/* User Info */}
                    <h3 className="font-bold text-gray-900 mb-1">
                      {user.name}
                    </h3>

                    <p className="text-gray-600 text-sm mb-2">{user.email}</p>

                    <p className="text-gray-500 text-sm">{user.company.name}</p>

                    {/* User ID Badge */}
                    <Badge variant="outline" className="mt-3">
                      ID: {user.id}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Data Info */}
            <Card className="mt-8 border-gray-200">
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">
                  <strong>Data Info:</strong> Showing {users.slice(0, 6).length}{" "}
                  of {users.length} users. This data was fetched fresh from the
                  API when the server rendered this page.
                </p>
              </CardContent>
            </Card>
          </>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white rounded-full shadow-sm">
            <Server className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">
              Rendered fresh on the server for each request
            </span>
          </div>

          <p className="text-xs text-gray-500 mt-4 max-w-2xl mx-auto">
            This page demonstrates Server-Side Rendering. Every time you refresh
            or visit this page, the server fetches fresh data and renders the
            complete HTML before sending it to your browser. No loading states
            needed!
          </p>
        </div>
      </div>
    </div>
  );
}
