import { Calendar } from "lucide-react";

export default function PageHeader() {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Project</h1>
          <p className="text-gray-600 mt-1">
            Initialize a new development project
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString("en-IN")}</span>
        </div>
      </div>
    </div>
  );
}
