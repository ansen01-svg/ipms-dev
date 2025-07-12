/**
 * Examples Home Page
 * File: app/examples/page.tsx
 *
 * This is the main landing page for all our Next.js learning examples.
 * It provides navigation to different demo pages and explains what
 * team members can learn from each example.
 */

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Server,
  Monitor,
  Code,
  BookOpen,
  ArrowRight,
  Lightbulb,
  Users,
} from "lucide-react";

export default function ExamplesHome(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-indigo-100 text-indigo-800">
            <BookOpen className="w-4 h-4 mr-2" />
            Learning Examples
          </Badge>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Next.js Demo Pages
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Welcome to our interactive learning examples! These demos show you
            different Next.js rendering strategies with real, working code.
          </p>
        </div>

        {/* Learning Goals */}
        <Card className="mb-12 border-2 border-indigo-200 bg-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-indigo-900">
              <Lightbulb className="w-6 h-6" />
              <span>{`What You'll Learn`}</span>
            </CardTitle>
            <CardDescription className="text-indigo-700 text-lg">
              Each demo teaches specific Next.js concepts with hands-on examples
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-indigo-900">
                Frontend Concepts:
              </h4>
              <ul className="space-y-2 text-indigo-800">
                <li>• Server vs Client Components</li>
                <li>• useState and useEffect patterns</li>
                <li>• TypeScript with React hooks</li>
                <li>• Responsive design with Tailwind CSS</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-indigo-900">
                Next.js Features:
              </h4>
              <ul className="space-y-2 text-indigo-800">
                <li>• Server-Side Rendering (SSR)</li>
                <li>• Client-Side Rendering (CSR)</li>
                <li>• Data fetching strategies</li>
                <li>• Next.js Image optimization</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Demo Pages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* SSR Demo Card */}
          <Card className="border-2 border-green-200 hover:border-green-300 transition-colors hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge className="bg-green-100 text-green-800">
                  <Server className="w-4 h-4 mr-2" />
                  Server Component
                </Badge>
                <div className="text-2xl">🖥️</div>
              </div>
              <CardTitle className="text-2xl text-green-900">
                SSR Demo
              </CardTitle>
              <CardDescription className="text-green-700 text-base">
                Server-Side Rendering - Fresh data on every request
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">
                  {`You'll See:`}
                </h4>
                <ul className="text-green-800 text-sm space-y-1">
                  <li>• Page renders on the server</li>
                  <li>• Fresh data with each page load</li>
                  <li>• No loading spinners needed</li>
                  <li>• Server timestamp that updates on refresh</li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">
                  Code Concepts:
                </h4>
                <ul className="text-green-800 text-sm space-y-1">
                  <li>• Async server components</li>
                  <li>• Direct data fetching with await</li>
                  <li>{`• No 'use client' directive`}</li>
                  <li>{`• cache: 'no-store' for fresh data`}</li>
                </ul>
              </div>

              <Link href="/examples/ssr-demo">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  View SSR Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* CSR Demo Card */}
          <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge className="bg-blue-100 text-blue-800">
                  <Monitor className="w-4 h-4 mr-2" />
                  Client Component
                </Badge>
                <div className="text-2xl">💻</div>
              </div>
              <CardTitle className="text-2xl text-blue-900">CSR Demo</CardTitle>
              <CardDescription className="text-blue-700 text-base">
                Client-Side Rendering - Interactive browser experiences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">
                  {`You'll See:`}
                </h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Loading states while data fetches</li>
                  <li>• Real-time search and filtering</li>
                  <li>• Interactive shopping cart</li>
                  <li>• Instant user feedback</li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Code Concepts:
                </h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• {`'use client' directive`}</li>
                  <li>• useState for managing state</li>
                  <li>• useEffect for data fetching</li>
                  <li>• Event handlers for interactions</li>
                </ul>
              </div>

              <Link href="/examples/csr-demo">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  View CSR Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Comparison Table */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-gray-900">
              Quick Comparison
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Understanding when to use each approach
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-4 font-semibold text-gray-900">
                      Feature
                    </th>
                    <th className="text-center p-4 font-semibold text-green-700">
                      SSR (Server)
                    </th>
                    <th className="text-center p-4 font-semibold text-blue-700">
                      CSR (Client)
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-medium text-gray-900">
                      Where it renders
                    </td>
                    <td className="p-4 text-center text-green-800">
                      🖥️ Server
                    </td>
                    <td className="p-4 text-center text-blue-800">
                      💻 Browser
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-medium text-gray-900">
                      Data freshness
                    </td>
                    <td className="p-4 text-center text-green-800">
                      Always fresh
                    </td>
                    <td className="p-4 text-center text-blue-800">
                      Fetched on load
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-medium text-gray-900">
                      Loading states
                    </td>
                    <td className="p-4 text-center text-green-800">
                      Not needed
                    </td>
                    <td className="p-4 text-center text-blue-800">Required</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-medium text-gray-900">
                      Interactivity
                    </td>
                    <td className="p-4 text-center text-green-800">Limited</td>
                    <td className="p-4 text-center text-blue-800">
                      Full interactive
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-4 font-medium text-gray-900">SEO</td>
                    <td className="p-4 text-center text-green-800">
                      Excellent
                    </td>
                    <td className="p-4 text-center text-blue-800">
                      Challenging
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-gray-900">Best for</td>
                    <td className="p-4 text-center text-green-800">
                      Content sites
                    </td>
                    <td className="p-4 text-center text-blue-800">Web apps</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* How to Study */}
        <Card className="border-2 border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-purple-900">
              <Code className="w-6 h-6" />
              <span>How to Study These Examples</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-purple-900 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  View the Demos
                </h4>
                <ul className="space-y-2 text-purple-800">
                  <li>• Click the buttons above to see each demo</li>
                  <li>• Try the interactive features in CSR demo</li>
                  <li>• Refresh the SSR demo to see fresh data</li>
                  <li>• Notice the differences in behavior</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-purple-900 flex items-center">
                  <Code className="w-5 h-5 mr-2" />
                  Study the Code
                </h4>
                <ul className="space-y-2 text-purple-800">
                  <li>• Open the demo files in VS Code</li>
                  <li>• Read all the detailed comments</li>
                  <li>• Compare SSR vs CSR implementations</li>
                  <li>• Try modifying the code yourself</li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">
                File Locations:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm font-mono text-purple-800">
                <div>📁 app/examples/ssr-demo/page.tsx</div>
                <div>📁 app/examples/csr-demo/page.tsx</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-white rounded-full shadow-sm border border-gray-200">
            <BookOpen className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700 font-medium">
              Happy Learning! 🚀
            </span>
          </div>

          <p className="text-sm text-gray-500 mt-4 max-w-2xl mx-auto">
            These examples are designed to help you understand Next.js rendering
            strategies. Take your time to explore both the user interface and
            the source code.
          </p>
        </div>
      </div>
    </div>
  );
}
