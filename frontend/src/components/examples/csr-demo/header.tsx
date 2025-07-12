import { Badge } from "@/components/ui/badge";
import { Monitor } from "lucide-react";

export default function Header() {
  return (
    <div className="text-center mb-8">
      <Badge className="mb-4 bg-blue-100 text-blue-800">
        <Monitor className="w-4 h-4 mr-2" />
        Client-Side Rendered
      </Badge>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
        CSR Demo Store
      </h1>

      <p className="text-gray-600 max-w-2xl mx-auto">
        This page is rendered in your browser. Watch the loading state, then
        interact with the products!
      </p>
    </div>
  );
}
