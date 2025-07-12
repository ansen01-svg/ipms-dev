import { Badge } from "@/components/ui/badge";
import { Server } from "lucide-react";

export default function Header() {
  return (
    <div className="text-center mb-8">
      <Badge className="mb-4 bg-green-100 text-green-800">
        <Server className="w-4 h-4 mr-2" />
        Server-Side Rendered
      </Badge>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
        SSR Demo Page
      </h1>

      <p className="text-gray-600 max-w-2xl mx-auto">
        This page is rendered on the server for each request. The data is always
        fresh and ready when you load the page!
      </p>
    </div>
  );
}
