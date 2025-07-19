import { Badge } from "@/components/ui/badge";

export default function StatusBadge({ status }: { status: string }) {
  const statusColor =
    status === "Ongoing"
      ? "bg-red-500"
      : status === "Done"
      ? "bg-green-500"
      : "bg-gray-500";

  return <Badge className={`${statusColor} text-white`}>{status}</Badge>;
}
