import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: "online" | "offline" | "loading" }) {
  if (status === "loading") {
    return (
      <Badge variant="secondary" className="text-xs">
        ...
      </Badge>
    );
  }

  return status === "online" ? (
    <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white text-xs">
      Online
    </Badge>
  ) : (
    <Badge variant="destructive" className="text-xs">
      Offline
    </Badge>
  );
}
