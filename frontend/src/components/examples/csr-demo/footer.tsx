import { Monitor } from "lucide-react";

export default function Footer() {
  return (
    <div className="mt-12 text-center">
      <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white rounded-full shadow-sm">
        <Monitor className="w-4 h-4 text-gray-600" />
        <span className="text-sm text-gray-600">
          Everything rendered in your browser
        </span>
      </div>
    </div>
  );
}
